"use server";
import connectToDatabase from "@/utils/db";
import { uploadFile } from "@/utils/uploadFile";
import { redirect } from "next/navigation";

export async function uploadProfilePicture(formData: FormData) {
    const filename = formData.get("filename") as string | null;
    const image = formData.get("image") as File;

    if (!(filename && image))
        return { message: "Invalid formData" }
    
    const result = await uploadFile(image, filename, "/user");
    return result;
}

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
            const result = await uploadFile(image, results.insertId, "/products");
        }
        
        
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Add Product failed"
        }
    }

    redirect("/products"); 
}
