"use client";
import React from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import '../../styles/login.css'
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLParagraphElement>(null);

    if (session) 
        router.push("/");

    const signInWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const result = await signIn("credentials", {
            username, 
            password, 
            redirect: false
        });

        if (result?.error){
            errorRef.current!.innerHTML = 'Incorrect username or password';
        }
        else
            router.push("/");
    }
    

    return (
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={e => signInWithCredentials(e)}>
                    <div className="form-input">
                        <input type="text" id="username" placeholder=" " ref={usernameRef} required />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-input">
                        <input type="password" placeholder=" " id="password" ref={passwordRef} required /> 
                        <label htmlFor="password">Password</label>
                    </div>
                    <button type="submit">Login</button> <br />
                </form>
                <p className='error-message' ref={errorRef}></p>

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