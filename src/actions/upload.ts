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


