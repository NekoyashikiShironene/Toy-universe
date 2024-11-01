import React from 'react';
import { ContentContainer } from '@/components/Containers';
import { addProduct } from '@/actions/product'; 
import PreviewImage from '@/components/PreviewImage';
import '../../styles/edit-product.css'
import EditProductForm from '@/components/EditProductForm';
import useSession from '@/utils/auth';
import { UserSession } from '@/types/session';

export default async function EditProduct() {
    const user = (await useSession())?.user as UserSession;
    
    return (
        <>
        {(user?.role === 'emp')?
            <ContentContainer>
            
            <div className='add-product-container'>
                    <h1>Add Product Form</h1>
                    <form action={addProduct} className='add-product-form'>
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
                            <input type='text' name='brand' required />
                        </div>

                        <div className='product-input'>
                            <label>Description:</label>
                            <input type='text' name='description' required />
                        </div>

                        <div className='product-input'>
                            <label>Price:</label>
                            <input type='text' name='price' required />
                        </div>

                        <div className='product-input'>
                            <label>Stock:</label>
                            <input type='number' name='stock' required />
                        </div>

                        <PreviewImage/>

                        <button type='submit' className='submit-button'>Submit</button>
                    </form>
                </div>

                <EditProductForm />

            </ContentContainer>
        : 
            <div className='error-message'>
                <h2>You don't have permission for this page.</h2>
            </div>
        }
        </>
    )
}
