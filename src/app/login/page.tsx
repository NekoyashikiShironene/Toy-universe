"use client";
import React from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


export default function login() {
    const {data: session} = useSession();

    if (session) {
        console.log("Bla");
        const router = useRouter();
        router.push("/");
    }

    return (
            <>
                <h1>You are not logged in</h1>
                <button type="submit" onClick={() => signIn("google", { callbackUrl: "/" })}>Sign in with Google</button>
            </>
    )
}