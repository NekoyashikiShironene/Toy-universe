'use client';
import React from 'react';
import { useState } from 'react';
import type { Product } from '@/types/products';
import Image from 'next/image';

export default function EditProductForm() {
    const [ product, setProduct ] = useState<Product>();

    function searchProduct() {
        const xhttp = new XMLHttpRequest();
        const prod_id = (document.getElementById("prod_id") as HTMLInputElement).value;
        let url = `${process.env.NEXT_PUBLIC_URL}/api/product?prod_ids=${prod_id}`;

        xhttp.onreadystatechange = async function() {
            if (xhttp.readyState === 4 && xhttp.status === 200){
                const res = await JSON.parse(xhttp.responseText);
                const product = res.data[0];
                
                setProduct(product);
            }
        }

        xhttp.open("GET", url);
        xhttp.send();
    }

    return (
        <>
            <div className='edit-product-container'>
                <h1>Edit Product Form</h1>

                <div className='product-input'>
                    <label>Product ID:</label>
                    <input type='text' id='prod_id' name='prod_id' onBlur={() => searchProduct()}/>
                </div>

                {product && (
                    <div className='product-detail'>
                        <h2>Product Details:</h2>
                        
                        <Image src={`/products/${product.prod_id}.jpg`} width={150} height={150} alt={''} />
                        
                        <div className='product-detail-input'>
                            <b>Name:</b> 
                            <input type='text' value={product.prod_name} />
                        </div>

                        <div className='product-detail-input'>
                            <b>Category:</b> 
                            <textarea value={product.category} />
                        </div>

                        <div className='product-detail-input'>
                            <b>Brand:</b> 
                            <textarea value={product.brand} />
                        </div>

                        <div className='product-detail-input'>
                            <b>Price:</b> 
                            <input type='number' value={product.price} />
                        </div>

                        <div className='product-detail-input'>
                            <b>Description:</b> 
                            <textarea value={product.description} />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}