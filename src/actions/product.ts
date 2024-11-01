"use server";
import connectToDatabase from "@/utils/db";
import { uploadFile } from "@/utils/uploadFile";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
    const prod_name = formData.get('prod_name') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const stock = parseInt(formData.get('stock') as string);
    const image = formData.get("product-pic") as File;
    
    const connection = await connectToDatabase();

    try {
        const [ results ] = await connection.query("INSERT INTO product (prod_name, category, brand, description, price, remaining) \
                                                VALUES(?, ?, ?, ?, ?, ?)", [prod_name, category, brand, description, price, stock]);

        if (image) {
            await uploadFile(image, results.insertId, "/products");
        }
        
        
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Add Product failed"
        }
    }

    redirect("/products"); 
}

export async function updateProduct(formData: FormData) {
    const prod_id = formData.get('prod_id') as string;
    const prod_name = formData.get('prod_name') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const remaining = parseInt(formData.get('remaining') as string);
    const image = formData.get("product-pic") as File;
    
    const connection = await connectToDatabase();

    try {
       await connection.query("UPDATE product SET prod_name = ?, category = ?, brand = ?, description = ?, price = ?, remaining = ?\
                                    WHERE prod_id = ?" , [prod_name, category, brand, description, price, remaining, prod_id]);
        if (image) {
            await uploadFile(image, prod_id, "/products");
        }
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Update Product failed"
        }
    }
}