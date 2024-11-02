import { UserSession } from "@/types/session";
import useSession from "@/utils/auth";
import { NextResponse } from "next/server";

import connectToDatabase from "@/utils/db";
import { ICustomer } from "@/types/db";

export async function GET() {
    const user = (await useSession())?.user as UserSession;

    if (!user)
        return NextResponse.json({message: "Please Login"}, { status: 401 })

    const connection = await connectToDatabase();
    const [results] = await connection.query<ICustomer[]>("SELECT * FROM customer WHERE cus_id = ?", [user.id]);
    const result = results[0];
    
    return NextResponse.json({data: result})
}