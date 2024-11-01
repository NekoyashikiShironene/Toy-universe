import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";
import { TUserData, type TPromotion } from "@/types/coupon";
import { checkCondition } from "@/utils/couponChecker";

export async function POST(req: NextRequest) {
    const user = (await useSession())?.user as UserSession;

    if (!user)
        return NextResponse.json({ message: "Invalid Credential" }, { status: 401 });

    const formData = await req.formData();
    const code = formData.get("code");
    const userFormData = formData.get("userData") as string;
    const userData = JSON.parse(userFormData) as TUserData;

    const connection = await connectToDatabase();

    const [results] = await connection.query<TPromotion[]>("SELECT * FROM promotion WHERE code = ? \
        AND start_date <= CURRENT_TIMESTAMP \
        AND end_date >= CURRENT_TIMESTAMP", [code]);

    const result = results[0];

    if (!result)
        return NextResponse.json({ message: "Not Found" }, { status: 404 });

    const condition = result.promo_condition;
    const condition_match = checkCondition(userData, condition);

    if (!condition_match)
        return NextResponse.json({ message: "User does not meet the required conditions for this coupon" }, { status: 400 });

    return NextResponse.json({ promotion: results[0] });



}