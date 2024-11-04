import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/utils/db";
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
    const { ord_id, status_id } = await req.json();
    
    const connection = await connectToDatabase();

    const [results] = await connection.query("UPDATE `order` SET status_id = ? WHERE ord_id = ?", [status_id, ord_id]);
    revalidateTag("useOrder");
    revalidateTag("allOrder");
    
    return NextResponse.json({ data: results });
}