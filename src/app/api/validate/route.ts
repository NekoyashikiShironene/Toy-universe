import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";

import type { ICustomer } from "@/types/db";

export async function GET(req: NextRequest) {
    const username = req.nextUrl.searchParams.get('username');
    const email = req.nextUrl.searchParams.get('email');

    const connection = await connectToDatabase();

    let results: ICustomer[] = [];
    if (username)
        [results] = await connection.query<ICustomer[]>("SELECT username FROM customer WHERE username = ?", [username]);

    else if (email)
        [results] = await connection.query<ICustomer[]>("SELECT email FROM customer WHERE email = ?", [email]);



    await connection.end();

    const valid = (results.length !== 0);

    return NextResponse.json({ valid });
}