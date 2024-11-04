"use server";
import { addProduct } from "@/db/product";
import { uploadFile } from "@/utils/uploadFile";
import { updateProduct } from "@/db/product";
import { revalidatePath } from "next/cache";

export async function addProductAction(prevState: unknown, formData: FormData) {
    const prod_name = formData.get('prod_name') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const image = formData.get("product-pic") as File;
    
    if (stock < 0) {
        return {
            message: "Add Product Failed, stock can't be negative",
            success: false
        }
    }
    else if (price < 0) {
        return {
            message: "Add Product Failed, price can't be negative",
            success: false
        }
    }


    try {
        const result = await addProduct(prod_name, category, brand, description, price, stock);

        if (image) {
            await uploadFile(image, result.insertId.toString(), "/products");
        }

        revalidatePath("/products");
        revalidatePath("/detail");
        
        return {
            message: "Add Product Successful",
            success: true
        }    
        
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Add Product Failed",
            success: false
        }
    } 
}

export async function updateProductAction(prevState: unknown, formData: FormData) {
    const prod_id = formData.get('prod_id') as string;
    const prod_name = formData.get('prod_name') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const remaining = parseInt(formData.get('remaining') as string);
    const image = formData.get("product-pic") as File;
    
    if (remaining < 0) {
        return {
            message: "Add Product Failed, stock can't be negative",
            success: false
        }
    }
    else if (price < 0) {
        return {
            message: "Add Product Failed, price can't be negative",
            success: false
        }
    }

    try {
        await updateProduct(prod_name, category, brand, description, price, remaining, prod_id);
        if (image) {
            await uploadFile(image, prod_id, "/products");
        }

        revalidatePath("/products");
        revalidatePath("/detail");
        return {
            message: "Update Product Successful",
            success: true
        }
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Update Product failed",
            success: false
        }
    }
}