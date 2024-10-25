import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";


// checkout at http://localhost:3000/api/products
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');
    const category = req.nextUrl.searchParams.get('category');
    const brand = req.nextUrl.searchParams.get('brand');
    
    const connection = await connectToDatabase();

    const conditions = [];
    const values = [];

    if (category) {
        conditions.push("category = ?");
        values.push(category);
    }
    
    if (brand) {
        conditions.push("brand = ?");
        values.push(brand);
    }
    
    if (query) {
        conditions.push("prod_name LIKE ?");
        values.push(`%${query}%`);
    }

    let sql = "SELECT * FROM product";
    
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    const [results] = await connection.query(sql, values);
    connection.release();
    
    return NextResponse.json({ data: results });
}