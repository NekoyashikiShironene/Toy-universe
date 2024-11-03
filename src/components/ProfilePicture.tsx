"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function ProfilePicture({ src, alt, width, height }: 
    { 
        src: string, 
        alt?: string, 
        width: number, 
        height: number
    }) {
    const [imgSrc, setImgSrc] = useState<string>(`${src}?v=${Date.now()}`);
    
    return (
        <Image
            src={imgSrc ?? ""}
            alt={alt ?? ""}
            width={width}
            height={height}
            className="profile-picture"
            onError={() => setImgSrc(`/users/default/default.jpg?v=${Date.now()}`)}
        />
    );
}

