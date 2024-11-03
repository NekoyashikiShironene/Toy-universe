"use server";
import { uploadFile } from "@/utils/uploadFile";

export async function uploadProfilePicture(formData: FormData) {
    const filename = formData.get("filename") as string | null;
    const image = formData.get("image") as File;

    if (!(filename && image))
        return { message: "Invalid formData" }
    
    const result = await uploadFile(image, filename, "/users");
    return result;
}


