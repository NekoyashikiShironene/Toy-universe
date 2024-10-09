"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";

import "../styles/button.css";

export function LoginButton() {
    return (
        <Link href="/login" className="login-btn">Login</Link>
    )
}

export function LogoutButton() {
    return (
        <Link href="/" onClick={() => signOut()} className="logout-btn">Logout</Link>
    )
}