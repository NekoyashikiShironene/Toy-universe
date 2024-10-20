"use client";
import React from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import '../../styles/login.css'
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();

    console.log(session);
    if (session) 
        router.push("/");

    const signInWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const usernameElement = document?.getElementById("username") as HTMLInputElement;
        const passwordElement = document?.getElementById("password") as HTMLInputElement;

        const username = usernameElement.value;
        const password = passwordElement.value;

        const result = await signIn("credentials", {
            username, 
            password, 
            redirect: false
        });

        if (result?.error)
            alert("Incorrect usename or password");
        else
            router.push("/");
    }
    

    return (
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={e => signInWithCredentials(e)}>
                    <div className="form-input">
                        <input type="text" id="username" placeholder=" " required />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-input">
                        <input type="password" placeholder=" " id="password" required /> 
                        <label htmlFor="password">Password</label>
                    </div>
                    <button type="submit">Login</button> <br />
                </form>

                <p>Or login with</p>
                <button type="submit" onClick={() => signIn("google", { callbackUrl: "/" })}>
                    <Image 
                        src='/logos/google.png'
                        alt="Google logo"
                        width={30}
                        height={30}
                    />
                </button>
                <p>Don&apos;t have an account? <Link href="/register">Sign up</Link></p>
            </div>
    )
}