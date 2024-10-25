"use client";

import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import '../../styles/register.css';
import Image from 'next/image';
import { register } from '@/actions/register';

type InputError = {
    value: boolean,
    message: string 
}

export default function Register() {
    const { data: session } = useSession();
    const router = useRouter();

    console.log(session);
    if (session)
        router.push("/");

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userError, setUserError] = useState<InputError>({value: false, message: ""});
    const [emailError, setEmailError] = useState<InputError>({value: false, message: ""});
    const [passwordError, setPasswordError] = useState<InputError>({value: false, message: ""});

    const [state, formAction] = useFormState(register, null);

    useEffect(() => {
        const validateUsername = async () => {
            const username_input = document.getElementById("username") as HTMLInputElement;
            const username = username_input.value;

            if (username_input.value) {
                const res = await fetch('api/validate?username=' + username);
                const existed = (await res.json()).value;
                
                
                if (username_input.validity.patternMismatch) {
                    setUserError({value: true, message: 'Must start with a letter and be 6 to 20 characters long, containing only letters, digits, or underscores.'});
                    username_input.style.borderColor = 'rgb(247, 60, 60)';                  
                }
                
                else if (existed && username_input.value) {
                    username_input.style.borderColor = 'rgb(247, 60, 60)'; // red
                    setUserError({value: true, message: 'Username already exists'});
                }
                else {
                    username_input.style.borderColor = 'rgb(14, 204, 14)'; // green
                    setUserError({value: false, message: ''});
                }
            }
            else {
                username_input.style.borderColor = 'black';
                setUserError({value: false, message: ''});
            }
        }
        validateUsername();
    }, [username]);

    useEffect(() => {
        const validateEmail = async () => {
            const email_input = document.getElementById("email") as HTMLInputElement;
            const email = email_input.value;
            
            if (email) {
                const res = await fetch('api/validate?email=' + email);
                const existed = (await res.json()).value;
                
                if (!email_input.validity.valid) {
                    setEmailError({value: true, message: "Invalid email format. Must contain a username, '@', domain, and top-level domain."});
                    email_input.style.borderColor = 'rgb(247, 60, 60)';    
                }

                else if (existed && email_input.value) {
                    email_input.style.borderColor = 'rgb(247, 60, 60)';
                    setEmailError({value: true, message: 'Email already exists'});
                }
                else {
                    email_input.style.borderColor = 'rgb(14, 204, 14)';
                    setEmailError({value: false, message: ''});
                }
            }
            else {
                email_input.style.borderColor = 'black';
                setEmailError({value: false, message: ''});
            }
        }
        validateEmail();
    }, [email]);

    useEffect(() => {
        const validatePassword = async () => {
            const password_input = document.getElementById("password") as HTMLInputElement;
            const password = password_input.value;
            
            if (password) {
                
                if (!password_input.validity.valid) {
                    setPasswordError({value: true, message: 'Minimum eight characters, at least one letter and one number'});
                    password_input.style.borderColor = 'rgb(247, 60, 60)';    
                }
                else {
                    password_input.style.borderColor = 'rgb(14, 204, 14)';
                    setPasswordError({value: false, message: ''});
                }
            }
            else {
                setPasswordError({value: false, message: ''});
                password_input.style.borderColor = 'black';
            }
        }
        validatePassword();
    }, [password]);


    return (
        <div className="register-form">

            <h1>Register</h1>
            <form action={formAction}>

                <p className='error-message' style={{ color: "red" }}>{state?.message}</p>
                <div className="form-input">
                    <input type="text" id="username" name="username" placeholder=" " pattern='^[A-Za-z][A-Za-z0-9_]{5,19}$' required onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => setUsername(e.target.value)} />
                    <label htmlFor="username">Username*</label>
                </div>
                {userError.value && <p className='error-message' id='user_error' style={{ color: "red" }}>{userError.message}</p>}
                <div className="form-input">
                    <input type="password" placeholder=" " id="password" name="password" pattern='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$' required onBlur={(e) => setPassword(e.target.value)}/>
                    <label htmlFor="password">Password*</label>
                </div>
                {passwordError.value && <p className='error-message' style={{ color: "red" }}>{passwordError.message}</p>}
                <div className="form-input">
                    <input type="text" id="name" name="name" placeholder=" " required />
                    <label htmlFor="name">Name*</label>
                </div>
                <div className="form-input">
                    <input type="email" placeholder=" " id="email" name="email" pattern='^[^\s@]+@[^\s@]+\.[^\s@]+' required onBlur={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">Email*</label>
                </div>
                {emailError.value && <p className='error-message' style={{ color: "red" }}>{emailError.message}</p>}
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