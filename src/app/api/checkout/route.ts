import { NextRequest, NextResponse } from "next/server";
import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";
import { type TCartItem } from "@/types/products";
import Stripe from "stripe";
import connectToDatabase from "@/utils/db";
import { ResultSetHeader } from "mysql2/promise";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    const api_key = process.env.STRIPE_API_KEY;
    const user = (await useSession())?.user as UserSession;

    if (!api_key)
        return NextResponse.json({ message: "Unexpected Error" }, { status: 500 });

    const { products, promotion, address } = await req.json();
    const line_items = products.map((product: TCartItem) => {
        return {
            price_data: {
                currency: "thb",
                product_data: {
                    name: product.prod_name,
                },
                unit_amount: Math.round(product.price * 100 * (1 - promotion.discount)),
            },
            quantity: product.quantity,
            
        }
    });

    const connection = await connectToDatabase();
    let order_id: number;

    try {
        await connection.beginTransaction();

        // create new order
        const [insertOrderResult] = await connection.query<ResultSetHeader>(
            "INSERT INTO `order` (status_id, shipping_address) VALUES (?, ?)",
            [0, JSON.stringify(address)]
        );

        // store order item using order id 
        order_id = insertOrderResult.insertId;
        const order_items = products.map((product: TCartItem) => [order_id, user.id, product.prod_id, product.quantity]);
        await connection.query<ResultSetHeader>(
            "INSERT INTO order_item(ord_id, cus_id, prod_id, quantity) VALUES ?",
            [order_items]
        );

        // update stock
        products.forEach(async (product: TCartItem) => {
            await connection.query("UPDATE product SET remaining = remaining - ? \
                WHERE prod_id = ? AND remaining >= ?",
                [product.quantity, product.prod_id, product.quantity]
            );
        });

        // apply promotion
        if (promotion?.promo_id)
            await connection.query<ResultSetHeader>(
                "INSERT INTO applying(ord_id, promo_id) VALUE (?, ?)",
                [order_id, promotion.promo_id]
            );

        await connection.commit();
        revalidatePath("/detail");
        revalidatePath("/order");
    } catch (e: unknown) {
        await connection.rollback();
        throw e;
    }

    

    const stripe = new Stripe(api_key);
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?order_id=${order_id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment-failed?order_id=${order_id}`,
    });

    // update session_id to order
    await connection.query<ResultSetHeader>(
        "UPDATE `order` SET session_id = ?, session_url = ? WHERE ord_id = ?", 
        [session.id, session.url, order_id]
    );
    return NextResponse.json({ session });
}