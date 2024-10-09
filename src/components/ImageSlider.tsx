"use client";
import { useState, useEffect } from "react";
import React from 'react'
import Image from 'next/image'
import '../styles/ImageSlider.css'


const Img = [
   {
      src: '/ads1.jpg'
   },
   {
      src: '/ads2.jpg'
   }
]

export default function ImageSlider() {
   const [currentIndex, setCurrentIndex] = useState<number>(0);

   const prevSlide = (): void => {
      setCurrentIndex(
         (prevIndex) => (prevIndex - 1 + Img.length) % Img.length
      );
   };

   const nextSlide = (): void => {
      setCurrentIndex(
         (prevIndex) => (prevIndex + 1) % Img.length
      );
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         nextSlide();
      }, 4000);

      return () => clearTimeout(timer);
   }, [currentIndex]);

   useEffect(() => {
      nextSlide();
   }, []);

   return (
      <>

         <div className='ads'>
            <div className="prev" onClick={prevSlide}>&lt;</div>

               <Image
                  className='img'
                  src={Img[currentIndex].src}
                  width={800}
                  height={500}
                  alt="ads"
               />
            <div className="next" onClick={nextSlide}>&gt;</div>
         </div>
      </>
   )
}