import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";


export async function GET(req: NextRequest) {
    const username = req.nextUrl.searchParams.get('username');
    const email = req.nextUrl.searchParams.get('email');
    
    const connection = await connectToDatabase();

    let results: any[] = [], fields: any;
    if (username) {
        [results, fields] = await connection.query("SELECT username FROM customer WHERE username = ?", [username]);
        
    }
    else if (email){
        [results, fields] = await connection.query("SELECT email FROM customer WHERE email = ?", [email]);
        
    }
    
    await connection.end();

    const valid = (results.length !== 0);
    
    return NextResponse.json({valid});
}