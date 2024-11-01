import fs from "node:fs/promises";

export async function uploadFile(file: File, filename: string, filepath: string, fileextension: string = "jpg", filetype: string = "image") {
    const defaultName = file.name.split(".")[0];

    if (!file.type.includes(filetype))
        return {message: `The file is not ${filetype}.`};

    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // /users, /products
    const fullpath = `./public${filepath}/${filename ?? defaultName}.${fileextension}`;
    await fs.writeFile(fullpath, buffer);
    
    return {message: "File Uploaded Successfully"};
}