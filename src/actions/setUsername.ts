"use server";

import { redirect } from "next/navigation";
import connectToDatabase from "@/utils/db";
import { revalidateTag } from "next/cache";

export async function setUsername(formData: FormData) {

    const id = formData.get('id') as string;
    const username = formData.get('username') as string;

    const connection = await connectToDatabase();

    try {
        await connection.query("UPDATE customer SET username = ? WHERE cus_id = ?", [username, id]);
        revalidateTag("user");
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Failed to set username"
        }
    }

    redirect("/");

}

