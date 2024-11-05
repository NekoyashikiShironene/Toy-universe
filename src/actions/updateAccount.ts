"use server";

import { redirect } from "next/navigation";
import connectToDatabase from "@/utils/db";
import NextCrypto from "next-crypto";
import { revalidateTag } from "next/cache";


export async function updateAccount(formData: FormData) {

    const id = formData.get('id') as string;
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const tel = formData.get('tel') as string;
    const address = formData.get('address') as string;
    
    const connection = await connectToDatabase();

    try {
        await connection.query("UPDATE customer SET username = ?, name = ?, email = ?, tel = ?, address = ? WHERE cus_id = ?", [username, name, email, tel, address, id]);
        revalidateTag("user");
        return {
            message: "Update user account successful"
        }
    } 
    catch (e: unknown) {
        console.error(e);
        return {
            message: "Update user account failed"
        }
    }

    redirect("/profile");

}

export async function changePassword(prevState: unknown, formData: FormData) {

    const id = formData.get('id') as string;
    const pwd1 = formData.get('password1') as string;
    const pwd2 = formData.get('password2') as string;

    if (pwd1 !== pwd2) {
        return {
            message: "password isn't match"
        }
    }

    const key = process.env.CRYPTO_SECRET as string;
    const crypto = new NextCrypto(key);
    const encryptedPassword = await crypto.encrypt(pwd1);
    
    const connection = await connectToDatabase();

    try {
        await connection.query("UPDATE customer SET password = ? WHERE cus_id = ?", [encryptedPassword, id]);
        await connection.query("UPDATE employee SET password = ? WHERE emp_id = ?", [encryptedPassword, id]);
        return {
            message: "Update user password successful",
            success: true
        }

    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Update user password failed",
            success: false
        }
    }

    redirect("/profile");

}

