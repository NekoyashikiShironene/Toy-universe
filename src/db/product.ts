import connectToDatabase from "@/utils/db";
import { ResultSetHeader } from "mysql2/promise";

import { type OptionalValue } from "@/types/db";

export const addProduct = async (
    prod_name: string, 
    category: string, 
    brand: string, 
    description: string, 
    price: number, 
    stock: number
    ) => {
    const connection = await connectToDatabase();
    const [ result ] = await connection.query<ResultSetHeader>(
        "INSERT INTO product (prod_name, category, brand, description, price, remaining) \
        VALUES(?, ?, ?, ?, ?, ?)", 
        [prod_name, category, brand, description, price, stock]
    );
    return result;
}

export const updateProduct = async (
    prod_name: string, 
    category: string, 
    brand: string, 
    description: string, 
    price: number, 
    remaining: number,
    prod_id: OptionalValue
    ) => {
        const connection = await connectToDatabase();
        await connection.query(
            "UPDATE product \
            SET prod_name = ?, category = ?, brand = ?, description = ?, price = ?, remaining = ? \
            WHERE prod_id = ?" 
            , [prod_name, category, brand, description, price, remaining, prod_id]
        );
    
}