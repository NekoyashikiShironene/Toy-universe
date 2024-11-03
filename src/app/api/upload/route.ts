import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const filename = formData.get("filename");
    const filepath = formData.get("filepath");
    const image = formData.get("image") as File;

    const defaultName = image.name.split(".")[0];

    if (!image.type.includes("image"))
        return NextResponse.json({message: "The file is not an image."}, {status: 500});

    
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // /users, /products
    await fs.writeFile(`./public${filepath}/${filename ?? defaultName}.jpg`, buffer);

    return NextResponse.json({message: "File Uploaded Successfully"})
}