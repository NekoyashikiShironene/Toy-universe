import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";


// checkout at http://localhost:3000/api/product
// http://localhost:3000/api/product?prod_id=1001

export async function GET(req: NextRequest) {
    const prod_id = req.nextUrl.searchParams.get('prod_id');
    
    const connection = await connectToDatabase();

    
    const [ results ] = await connection.query("SELECT * FROM product WHERE prod_id = ?", [prod_id]);
    
    
    await connection.end();
    
    
    return NextResponse.json({data: results});
}