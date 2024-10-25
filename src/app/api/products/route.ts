import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";


// checkout at http://localhost:3000/api/products
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');
    const category = req.nextUrl.searchParams.get('category');
    const brand = req.nextUrl.searchParams.get('brand');
    
    const connection = await connectToDatabase();

    let results, fields;
    if (category){
        [results, fields] = await connection.query("SELECT * FROM product WHERE category = ?", [category]);
    }
    else if (brand){
        [results, fields] = await connection.query("SELECT * FROM product WHERE brand = ?", [brand]);
    }
    else {
        [results, fields] = await connection.query("SELECT * FROM product");
    }
    
    connection.release();
    
    
    return NextResponse.json({data: results});
}