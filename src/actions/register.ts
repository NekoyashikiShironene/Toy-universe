"use server";

import { redirect } from "next/navigation";
import connectToDatabase from "@/utils/db";
import NextCrypto from 'next-crypto';

export async function register(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const tel = formData.get('tel') as string;
    const address = formData.get('address') as string;


    const key = process.env.CRYPTO_SECRET as string;

    const crypto = new NextCrypto(key);
    const encryptedPassword = await crypto.encrypt(password);
    
    const connection = await connectToDatabase();

    try {
        await connection.query("INSERT INTO customer (username, password, name, email, tel, address) \
                                                VALUES(?, ?, ?, ?, ?, ?)", [username, encryptedPassword, name, email, tel, address]);
    } catch (e: unknown) {
        console.error(e);
        return {
            message: "Registration failed"
        }
    } finally {
        connection.release();
    }

    redirect("/login");

}

