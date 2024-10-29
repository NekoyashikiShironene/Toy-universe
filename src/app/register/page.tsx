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
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [tel, setTel] = useState<string>('');
    const [userError, setUserError] = useState<InputError>({value: false, message: ""});
    const [emailError, setEmailError] = useState<InputError>({value: false, message: ""});
    const [passwordError, setPasswordError] = useState<InputError>({value: false, message: ""});
    
    const [state, formAction] = useFormState(register, null);

    useEffect(() => {
        const validateUsername = async () => {
            const username_input = document.getElementById("username") as HTMLInputElement;
            const username = username_input.value;

            if (username_input.value) {
                const res = await fetch('api/validate/isexisted?username=' + username);
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
                const res = await fetch('api/validate/isexisted?email=' + email);
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

    useEffect(() => {
        const validateName = async () => {
            const name_input = document.getElementById("name") as HTMLInputElement;
            const name = name_input.value;
            
            if (name) {
                if (!name_input.validity.valid) {
                    name_input.style.borderColor = 'rgb(247, 60, 60)';    
                }
                else {
                    name_input.style.borderColor = 'rgb(14, 204, 14)';
                }
            }
            else {
                name_input.style.borderColor = 'black';
            }
        }
        validateName();
    }, [name]);

    useEffect(() => {
        const validateName = async () => {
            const name_input = document.getElementById("name") as HTMLInputElement;
            const name = name_input.value;
            
            if (name) {
                if (!name_input.validity.valid) {
                    name_input.style.borderColor = 'rgb(247, 60, 60)';    
                }
                else {
                    name_input.style.borderColor = 'rgb(14, 204, 14)';
                }
            }
            else {
                name_input.style.borderColor = 'black';
            }
        }
        validateName();
    }, [name]);

    useEffect(() => {
        const validateAddress = async () => {
            const address_input = document.getElementById("address") as HTMLInputElement;
            const address = address_input.value;
            
            if (address) {
                if (!address_input.validity.valid) {
                    address_input.style.borderColor = 'rgb(247, 60, 60)';    
                }
                else {
                    address_input.style.borderColor = 'rgb(14, 204, 14)';
                }
            }
            else {
                address_input.style.borderColor = 'black';
            }
        }
        validateAddress();
    }, [address]);

    useEffect(() => {
        const validateTel = async () => {
            const tel_input = document.getElementById("tel") as HTMLInputElement;
            const tel = tel_input.value;
            
            if (tel) {
                if (!tel_input.validity.valid) {
                    tel_input.style.borderColor = 'rgb(247, 60, 60)';    
                }
                else {
                    tel_input.style.borderColor = 'rgb(14, 204, 14)';
                }
            }
            else {
                tel_input.style.borderColor = 'black';
            }
        }
        validateTel();
    }, [tel]);


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
                    <input type="text" id="name" name="name" placeholder=" " pattern='[A-Za-zก-ฮ]{1,}\s[A-Za-zก-ฮ]{1,}' required onBlur={(e) => setName(e.target.value)} />
                    <label htmlFor="name">Name*</label>
                </div>
                <div className="form-input">
                    <input type="email" placeholder=" " id="email" name="email" pattern='^[^\s@]+@[^\s@]+\.[^\s@]+' required onBlur={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">Email*</label>
                </div>
                {emailError.value && <p className='error-message' style={{ color: "red" }}>{emailError.message}</p>}
                <div className="form-input">
                    <input type="text" placeholder=" " id="address" name="address" pattern="[A-Za-zก-๙0-9'\.\-\s\,]*" required onBlur={(e) => setAddress(e.target.value)} />
                    <label htmlFor="address">Address*</label>
                </div>
                <div className="form-input">
                    <input type="text" placeholder=" " pattern='0[^0][0-9]{8,13}' id="tel" name="tel" required onBlur={(e) => setTel(e.target.value)} />
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