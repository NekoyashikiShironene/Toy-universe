'use client';
import React, { useEffect, useState } from 'react';
import { ContentContainer } from '@/components/Containers';
import { addProductAction } from '@/actions/product'; 
import PreviewImage from '@/components/PreviewImage';
import '../../styles/edit-product.css'
import EditProductForm from '@/components/EditProductForm';
import { useFormState } from "react-dom";


export default function EditProduct() {
    const [state, formAction] = useFormState(addProductAction, null);
    const [showImage, setShowImage] = useState<boolean>(true);

    useEffect(() => {
        const addMessage = document.getElementById('add-result-message');
        
        // clear text fields
        if (state?.success) {
            document.querySelectorAll(".product-input input")
                .forEach(
                    input => (input as HTMLInputElement).value = ""
                );
                
            addMessage!.className = "add-success";
            setShowImage(false);
        }
        else {
            addMessage!.className = "add-error";
        }
            
    }, [state])
    
    return (
            <ContentContainer>
            
            <div className='add-product-container'>
                    <h1>Add Product Form</h1>
                    <form action={formAction} className='add-product-form'>
                        <div className='product-input'>
                            <label>Product name:</label>
                            <input type='text' name='prod_name' pattern='^[A-Za-z0-9\s]{3,50}$' required />
                        </div>

                        <div className='product-input'>
                            <label>Category:</label>
                            <input type='text' name='category' pattern='^[A-Za-z\s]{3,30}$' required />
                        </div>

                        <div className='product-input'>
                            <label>Brand:</label>
                            <input type='text' name='brand' pattern='^[A-Za-z\s]{3,30}$' required />
                        </div>

                        <div className='product-input'>
                            <label>Description:</label>
                            <input type='text' name='description' pattern='^[A-Za-z\s]{3,100}$' required />
                        </div>

                        <div className='product-input'>
                            <label>Price:</label>
                            <input type='number' name='price' min={0} required />
                        </div>

                        <div className='product-input'>
                            <label>Stock:</label>
                            <input type='number' min={0} name='stock' required />
                        </div>

                        <PreviewImage showImage={showImage} setShowImage={setShowImage} />

                        <button type='submit' className='submit-button'>Submit</button>
                        
                        <p id='add-result-message'>{state?.message}</p>
                    </form>
                </div>

                <EditProductForm />

            </ContentContainer>
      
    )
}
