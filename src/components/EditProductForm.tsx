'use client';
import React from 'react';
import { useState } from 'react';
import type { Product } from '@/types/products';
import Image from 'next/image';
import '@/styles/edit-product.css'
import PreviewImage from './PreviewImage';
import { updateProduct } from '@/actions/product';

export default function EditProductForm() {
    const [ product, setProduct ] = useState<Product>();

    function searchProduct() {
        const xhttp = new XMLHttpRequest();
        const prod_id = (document.getElementById("prod_id") as HTMLInputElement).value;
        const url = `${process.env.NEXT_PUBLIC_URL}/api/product?prod_ids=${prod_id}`;

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

    const deleteProduct = async (prod_id: number) => {
        const res = await fetch(`api/product?prod_id=${prod_id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert('Deleted successfully');
            window.location.reload(); 
        } 
        else {
            alert('Failed to delete');
        }
        
    }

    return (
        <>
            <div className='edit-product-container'>
                <h1>Edit Product Form</h1>

                <div className='product-search'>
                    <label>Product ID:</label>
                    <input type='text' id='prod_id' name='prod_id' onBlur={() => searchProduct()}/>
                </div>

                {product && (
                    <div className='product-detail'>
                        <h2>Product Details:</h2>
                        <form action={updateProduct} className='update-product-form'>
                            <input type='hidden' name='prod_id' value={product.prod_id} />

                            <div className='editform-img'>
                                <Image  src={`/products/${product.prod_id}.jpg`} width={150} height={150} alt={''} />
                            </div>    
                            
                            <div className='product-input'>
                                <b>Name:</b> 
                                <input type='text' name='prod_name' defaultValue={product.prod_name} />
                            </div>

                            <div className='product-input'>
                                <b>Category:</b> 
                                <input type='text' name='category' defaultValue={product.category} />
                            </div>

                            <div className='product-input'>
                                <b>Brand:</b> 
                                <input type='text' name='brand' defaultValue={product.brand} />
                            </div>

                            <div className='product-input'>
                                <b>Price:</b> 
                                <input type='number' name='price' defaultValue={product.price} />
                            </div>

                            <div className='product-input'>
                                <b>Description:</b> 
                                <textarea name='description' defaultValue={product.description} />
                            </div>

                            <div className='product-input'>
                                <b>Remaining:</b> 
                                <input type='number' name='remaining' defaultValue={product.remaining} />
                            </div>

                            <PreviewImage />

                            <div className='button-container'>
                                <button type='submit' className='submit-button'>Submit</button>
                                <button onClick={() => deleteProduct(product.prod_id)} className='delete-button'>Delete</button>
                            </div>

                        </form>
                    </div>
                )}
            </div>
        </>
    )
}