'use client';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import type { Product } from '@/types/products';
import Image from 'next/image';
import '@/styles/edit-product.css'
import PreviewImage from './PreviewImage';
import { updateProductAction } from '@/actions/product';
import { useFormState } from 'react-dom';
import { categories, brands } from '@/utils/array';

export default function EditProductForm() {
    const [product, setProduct] = useState<Product | null>(null);
    const [name, setName] = useState<string>();
    const [defaultCategory, setCategory] = useState<string>();
    const [defaultBrand, setBrand] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [description, setDescription] = useState<string>();
    const [remaining, setRemaining] = useState<number>();

    const [state, formAction] = useFormState(updateProductAction, null);
    const [showImage, setShowImage] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<boolean>(false);

    const updateRef = useRef<HTMLParagraphElement | null>(null);

    function searchProduct() {
        const xhttp = new XMLHttpRequest();
        const prod_id = (document.getElementById("prod_id") as HTMLInputElement).value;
        const url = `${process.env.NEXT_PUBLIC_URL}/api/product?prod_ids=${prod_id}`;

        // reset form state message
        if (state)
            state.message = "";

        // do nothing if value is null
        if (!prod_id) {
            setProduct(null); 
            return;
        }
           

        xhttp.onreadystatechange = async function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                const res = await JSON.parse(xhttp.responseText);
                const productData = res.data[0];
                if (productData) {
                    setProduct(productData);
                    setSearchValue(false);
                } else {
                    setProduct(null);
                    setSearchValue(true);
                }
            }
        }

        xhttp.open("GET", url, true);
        xhttp.send();
    }

    useEffect(() => {
        setName(product?.prod_name);
        setCategory(product?.category);
        setBrand(product?.brand);
        setPrice(product?.price);
        setDescription(product?.description);
        setRemaining(product?.remaining);
    }, [product]);


    useEffect(() => {
        if (state?.success) {
            updateRef.current!.className = "update-success";
        }
        else {
            updateRef.current!.className = "update-error";
        }

        setShowImage(false);
        setProduct(null);
    }, [state]);

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
                    <input type='text' id='prod_id' name='prod_id' onBlur={() => searchProduct()} />
                </div>

                <p id='update-result-message' ref={updateRef}>{state?.message}</p>
                {product && (
                    <div className='product-detail'>
                        <h2>Product Details:</h2>
                        <form action={formAction} className='update-product-form'>
                            <input type='hidden' name='prod_id' value={product.prod_id} />

                            <div className='editform-img'>
                                <Image src={`/products/${product.prod_id}.jpg`} width={150} height={150} alt={''} />
                            </div>

                            <div className='product-input'>
                                <label>Name:</label>
                                <input type='text' name='prod_name' defaultValue={name} />
                            </div>

                            <div className='product-input'>
                                <label>Category:</label>
                                <p>{defaultCategory}</p>
                                <select name='category' defaultValue={defaultCategory}>
                                    {categories.map(category => (
                                        <option key={category} value={category} selected={defaultCategory === category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='product-input'>
                                <label>Brand:</label>
                                <p>{defaultBrand}</p>
                                <select name='brand' defaultValue={defaultBrand}>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand} selected={defaultBrand === brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='product-input'>
                                <label>Price:</label>
                                <input type='number' name='price' defaultValue={price} />
                            </div>

                            <div className='product-input'>
                                <label>Description:</label>
                                <textarea name='description' defaultValue={description} />
                            </div>

                            <div className='product-input'>
                                <label>Remaining:</label>
                                <input type='number' name='remaining' defaultValue={remaining} />
                            </div>

                            <PreviewImage showImage={showImage} setShowImage={setShowImage} />

                            <div className='button-container'>
                                <button type='submit' className='submit-button'>Submit</button>
                                <button onClick={() => deleteProduct(product.prod_id)} className='delete-button'>Delete</button>
                            </div>

                        </form>


                    </div>
                )}
                
                { searchValue && <h3 className='search-error-message'>Product not found</h3>}
                        
                    
                
            </div>
        </>
    )
}