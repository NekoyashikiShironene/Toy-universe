import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";

export async function GET(req: NextRequest) {
    const ord_id = req.nextUrl.searchParams.get('ord_id');

    const connection = await connectToDatabase();
    
    const [results] = await connection.query("SELECT item_id, product.prod_id, product.prod_name, order_item.quantity FROM order_item \
                                                JOIN product ON order_item.prod_id = product.prod_id \
                                                WHERE ord_id = ?", [ord_id]);
    
    return NextResponse.json({ data: results });
}