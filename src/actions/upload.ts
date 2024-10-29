"use server";

import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
    const filename = formData.get("filename");
    const filepath = formData.get("filepath");
    const image = formData.get("image") as File;

    const defaultName = image.name.split(".")[0];

    if (!image.type.includes("image"))
        return {message: "The file is not an image."};

    
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // /users, /products
    const fullpath = `./public${filepath}/${filename ?? defaultName}.jpg`;
    await fs.writeFile(fullpath, buffer);
    
    return {message: "File Uploaded Successfully"};
}