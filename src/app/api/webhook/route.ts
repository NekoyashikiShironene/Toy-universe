import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDatabase from "@/utils/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";



export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature') ?? "";
    const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "");
    const endpointSecret = process.env.STRIPE_ENPOINT_SECRET ?? "";
    const rawBody = await req.text();
    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    }
    catch (err: unknown) {
        return NextResponse.json({ message: `Webhook Error: ${err}` }, { status: 400 });
    }

    const connection = await connectToDatabase();

    await connection.beginTransaction();
    try {
        if (event.type === 'checkout.session.completed') {
            console.log('PaymentIntent was successful!');

            const paymentIntent = event.data.object;
            await connection.query<ResultSetHeader>(
                "UPDATE `order` SET status_id = 1 WHERE session_id = ?",
                [paymentIntent.id]
            );

            
        } else if (event.type === 'checkout.session.expired') { 
            console.log('Payment session was expired!');

            const paymentIntent = event.data.object;
            const [orderResults] = await connection.query<RowDataPacket[]>(
                "SELECT * FROM `order` \
                JOIN order_item ON `order`.ord_id = order_item.ord_id \
                WHERE `order`.session_id = ?",
                [paymentIntent.id]
            );
            
            const order_id = orderResults[0].ord_id;

            await connection.query<ResultSetHeader>(
                "DELETE FROM applying WHERE ord_id = ?",
                [order_id]
            )
            await connection.query<ResultSetHeader>(
                "DELETE FROM order_item WHERE ord_id = ?",
                [order_id]
            )
            await connection.query<ResultSetHeader>(
                "DELETE FROM `order` WHERE ord_id = ?",
                [order_id]
            )

            // return product to stock
            orderResults.forEach(async (product) => {
                await connection.query("UPDATE product SET remaining = remaining + ? \
                    WHERE prod_id = ?",
                    [product.quantity, product.prod_id]
                );
            });
           
        } else {
            console.log(`Unhandled event type ${event.type}`);
        }

        await connection.commit();
    } catch (e: unknown) {
        await connection.rollback();
        throw e;
    }


    return NextResponse.json({ received: true });
}