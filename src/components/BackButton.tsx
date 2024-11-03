'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from "react-icons/io";

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        router.back(); 
    };

    return (
            <button onClick={handleBack} className='back-button'>
                <IoMdArrowRoundBack size={40} />
            </button>
    )
}

