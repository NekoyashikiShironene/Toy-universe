import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";

import type { IUser } from "@/types/db";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    const attribute = req.nextUrl.searchParams.get('attr') || "";

    const connection = await connectToDatabase();

    let results: IUser[] = [];
    if (id)
        [results] = await connection.query<IUser[]>("SELECT username, password, name, email, tel FROM customer WHERE cus_id = ? \
                                                        UNION SELECT username, password, name, email, tel FROM employee WHERE emp_id = ?", [id, id]);


    const user = (results[0] as IUser)
    const value = user ? !user[attribute] : true;

    return NextResponse.json({ value });
}