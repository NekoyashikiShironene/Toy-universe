import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";


// checkout at http://localhost:3000/api/product
// http://localhost:3000/api/product?prod_id=1001

export async function GET(req: NextRequest) {
    const prodIds = req.nextUrl.searchParams.get('prod_ids');
    
    if (!prodIds) {
        return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
    }

    const prodIdArray = prodIds.split(',').map(id => id.trim());

    const connection = await connectToDatabase();
    const placeholders = prodIdArray.map(() => '?').join(',');

    const [results] = await connection.query(
        `SELECT * FROM product WHERE prod_id IN (${placeholders})`,
        prodIdArray
    );


    return NextResponse.json({ data: results });
}

export async function DELETE(req: NextRequest) {
    const prod_id = req.nextUrl.searchParams.get('prod_id');

    if (!prod_id){
        return NextResponse.json({ error: 'No product ID provided' }, { status: 400 });
    }

    const connection = await connectToDatabase();

    const [results] = await connection.query("DELETE FROM product WHERE prod_id = ?", [ prod_id ]);

    return NextResponse.json({ data: results });
}

