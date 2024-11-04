"use client";

import React from "react";
import Image from 'next/image';
import { useState } from 'react';
import '@/styles/preview-image.css';

export default function PreviewImage({showImage, setShowImage}: 
    {
        showImage: boolean, 
        setShowImage: React.Dispatch<React.SetStateAction<boolean>>
    }) {
    const [image, setImage] = useState<string | null>(null);

    const showPreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files)
            return;
        
        const file = e.target.files[0];
        setShowImage(true);
        
        if (file) {
            setImage(URL.createObjectURL(file));
        }
        else {
            setImage(null);
        }
        
    }

    return (
        <>
            <div className='product-input'>
                <label>Picture:</label>
                <input type='file' name='product-pic' id='product-pic' onChange={showPreviewImage} />
            </div>
            
            { (showImage && image) && <Image src={image} className='preview-image' alt={''} width={150} height={150}/>}
        </> 
    )
        
}
