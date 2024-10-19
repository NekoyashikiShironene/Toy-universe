"use client";

import React from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import '../../styles/register.css'
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
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
    }
    

    return (
            <div className="register-form">
                <h1>Register</h1>
                <form onSubmit={e => signInWithCredentials(e)}>
                    <p style={{color: "red"}}>This username has already existed</p>
                    <div className="form-input">
                        <input type="text" pattern="admin" id="username" placeholder=" " required style={{backgroundColor: "red"}} />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-input">
                        <input type="password" placeholder=" " id="password" required /> 
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="form-input">
                        <input type="email" placeholder=" " id="email" required /> 
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-input">
                        <input type="text" placeholder=" " id="address" required /> 
                        <label htmlFor="address">Address</label>
                    </div>
                    <div className="form-input">
                        <input type="text" placeholder=" " id="tel" required /> 
                        <label htmlFor="tel">Tel.</label>
                    </div>
                    <button type="submit">Submit</button> <br />
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
            </div>
    )
}