import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";


// checkout at http://localhost:3000/api/products
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');
    const category = req.nextUrl.searchParams.getAll('category');
    const brand = req.nextUrl.searchParams.getAll('brand');
    const maxPrice = req.nextUrl.searchParams.get('maxPrice'); // Use get() for a single value

    const connection = await connectToDatabase();

    const conditions = [];
    const values = [];

    if (category && category.length > 0) {
        conditions.push(`category IN (${category.map(() => '?').join(', ')})`);
        values.push(...category);
    }

    if (brand && brand.length > 0) {
        conditions.push(`brand IN (${brand.map(() => '?').join(', ')})`);
        values.push(...brand);
    }

    if (query) {
        conditions.push("prod_name LIKE ?");
        values.push(`%${query}%`);
    }

    if (maxPrice) {
        conditions.push("price <= ?");
        values.push(maxPrice);
    }

    let sql = "SELECT * FROM product";
    
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    try {
        const [results] = await connection.query(sql, values);
        return NextResponse.json({ data: results });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}