import { NextRequest, NextResponse } from "next/server";
import useSession from "@/utils/auth";

export async function GET(req: NextRequest, res: NextResponse) {
    const session = await useSession();

    if (!session)
        return NextResponse.json({error: "Error"}, {status: 401})

    return NextResponse.json({...session})
}