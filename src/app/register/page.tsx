"use client";

import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import '../../styles/register.css';
import Image from 'next/image';
import { register } from '@/actions/register';

export default function Register() {
    const { data: session } = useSession();
    const router = useRouter();

    console.log(session);
    if (session) 
        router.push("/");

    const [ username, setUsername ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ userError, setUserError ] = useState<boolean>(false);
    const [ emailError, setEmailError ] = useState<boolean>(false);

    const [state, formAction] = useFormState(register, null);

    const validateUsername = async (username: string) => {
        if (username) {
            const res = await fetch('api/validate?username=' + username);
            const valid = (await res.json()).valid;

            const username_input = document.getElementById("username") as HTMLInputElement;

            if (!username_input)
                return;

            if (valid && username_input.value) {
                username_input.style.borderColor = 'rgb(247, 60, 60)'; // red
                setUserError(true);
            }
            else {
                username_input.style.borderColor = 'rgb(14, 204, 14)'; // green
                setUserError(false);
            }
        }
    }

    const validateEmail = async (email: string) => {
        if (email) {
            const res = await fetch('api/validate?email=' + email);
            const valid = (await res.json()).valid;

            const email_input = document.getElementById("email") as HTMLInputElement;

            if (!email_input)
                return;

            if (valid && email_input.value) {
                email_input.style.borderColor = 'rgb(247, 60, 60)'; 
                setEmailError(true);
            }
            else {
                email_input.style.borderColor = 'rgb(14, 204, 14)';
                setEmailError(false);
            }
        }
    }

    useEffect(() => {
        if (!username)
            return;
        async function checkInput(){
            await validateUsername(username);
        }

        checkInput();
    }, [username]);

    useEffect(() => {
        if (!email)
            return;
        async function checkInput(){
            await validateEmail(email);
        }

        checkInput();
    }, [email]);
    

    return (
            <div className="register-form">
                
                <h1>Register</h1>
                <form action={formAction}>
                    
                    <p className='error-message' style={{color: "red"}}>{ state?.message }</p>
                    <div className="form-input">
                        <input type="text" id="username" name="username" placeholder=" " required onBlur={(e) => setUsername(e.target.value)}/>
                        <label htmlFor="username">Username*</label>
                    </div>
                    {userError && <p className='error-message' style={{color: "red"}}>Username already exists</p> }
                    <div className="form-input">
                        <input type="password" placeholder=" " id="password" name="password" required /> 
                        <label htmlFor="password">Password*</label>
                    </div>
                    <div className="form-input">
                        <input type="text" id="name" name="name" placeholder=" " required />
                        <label htmlFor="name">Name*</label>
                    </div>
                    <div className="form-input">
                        <input type="email" placeholder=" " id="email" name="email" required onBlur={(e) => setEmail(e.target.value)}/> 
                        <label htmlFor="email">Email*</label>
                        
                    </div>
                    {emailError && <p className='error-message' style={{color: "red"}}>Email already exists</p>}
                    <div className="form-input">
                        <input type="text" placeholder=" " id="address" name="address" required /> 
                        <label htmlFor="address">Address*</label>
                    </div>
                    <div className="form-input">
                        <input type="text" placeholder=" " id="tel" name="tel" required /> 
                        <label htmlFor="tel">Tel.*</label>
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