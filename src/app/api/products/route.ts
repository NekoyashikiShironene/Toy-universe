import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import { RowDataPacket } from "mysql2";


// checkout at http://localhost:3000/api/products
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');
    const category = req.nextUrl.searchParams.getAll('category');
    const brand = req.nextUrl.searchParams.getAll('brand');
    const maxPrice = req.nextUrl.searchParams.get('maxPrice');
    const page = req.nextUrl.searchParams.get('page');
    const per_page = req.nextUrl.searchParams.get('per_page');

    const connection = await connectToDatabase();

    const conditions = [];
    const values = [];

    let limit_offet;

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

    console.log(page, per_page)
    if (page && per_page) {
        limit_offet = " LIMIT ? OFFSET ?";
        values.push(Number(per_page));
        values.push(Number(per_page) * (Number(page) - 1));
    } 

    let sql = "SELECT * FROM product";
    let count_sql = "SELECT COUNT(*) as count FROM product";

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
        count_sql += " WHERE " + conditions.join(" AND ");
    }

    sql += (limit_offet ?? "");

    try {
        const [results] = await connection.query<RowDataPacket[]>(sql, values);
        const [count_results] = await connection.query<RowDataPacket[]>(count_sql, values);

        const count = count_results[0];

        return NextResponse.json({ data: results, count: count.count });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Failed to fetch products', }, { status: 500 });
    }
}