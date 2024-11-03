"use server";

import connectToDatabase from "@/utils/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export async function cancelOrder(session_id: string) {
    const connection = await connectToDatabase();
    await connection.beginTransaction();
    try {
        const [orderResults] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM `order` \
                JOIN order_item ON `order`.ord_id = order_item.ord_id \
                WHERE `order`.session_id = ?",
            [session_id]
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
        await connection.commit();
        revalidatePath("/order");
    } catch (e: unknown) {
        await connection.rollback();
        throw e;
    }

    // try force expire session if session is not expired
    try {
        const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "");
        await stripe.checkout.sessions.expire(session_id);
    } catch (e: unknown) {
        // if session has already expired do nothing
        return;
    }
    
}