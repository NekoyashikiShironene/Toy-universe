import { NextRequest, NextResponse } from "next/server";
import { ICustomer } from "@/types/db";
import connectToDatabase from "@/utils/db";
import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";

export async function GET(req: NextRequest) {
    const user = (await useSession())?.user as UserSession;

    if (!user)
        return NextResponse.json({message: "Invalid Credential"}, {status: 401})

    const id = user.id;
    const connection = await connectToDatabase();
    const [results] = await connection.query<ICustomer[]>("SELECT * FROM customer \
                                                            WHERE cus_id NOT IN \
                                                            (SELECT cus_id FROM order_item) \
                                                            AND cus_id = ?", [id]);
    const result = results[0] ?? {};                                             
    return NextResponse.json({data: result});

}