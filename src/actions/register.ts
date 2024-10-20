"use server";

import { redirect } from "next/navigation";
import connectToDatabase from "@/utils/db";

export async function register(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const tel = formData.get('tel') as string;
    const address = formData.get('address') as string;

    return {
        message: "Registration failed"
    }


    // Now you can use these variables in your function
    console.log(username, password, name, email, tel, address);

    
    const connection = await connectToDatabase();

    try {
        const [ result ] = await connection.query("INSERT INTO customer (username, password, name, email, tel, address) \
                                                VALUES(?, ?, ?, ?, ?, ?)", [username, password, name, email, tel, address]);
        redirect("/login");
    } catch (e: unknown) {
        return {
            message: "Registration failed"
        }
    }

}

