"use client";

import { Product } from '@/types/products';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useCustomer } from '@/contexts/CustomerContext';

export default function ProductOrderControls({ product }: { product: Product }) {
    const { cartItems, setCartItems } = useCustomer();
    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(1);
    
    const addProductToCart = (checked: boolean) => {
        const isItemInCart = cartItems.find((cartItem) => cartItem.prod_id === product.prod_id)
        if (isItemInCart) {
          setCartItems(cartItems.map((cartItem) =>
              cartItem.prod_id === product.prod_id
                ? { ...cartItem, quantity: cartItem.quantity + quantity, checked }
                : cartItem
            )
          );
        } else {
          setCartItems([...cartItems, {...product, quantity, checked}]);
        }

        if (checked)
          router.push('/payment');
        else
          router.push('/cart');
      }

    return (
        <>

            <div className="item-quantity">
                <input type="number" value={quantity} min={1} max={product.remaining} onChange={(e) => setQuantity(Math.min(product.remaining, parseInt(e.target.value)))} />
            </div>
            
            <button 
              className="add-to-cart" 
              onClick={() => addProductToCart(false)} 
              disabled={product.remaining === 0}
            >
              Add to Cart
            </button>

            <button 
              className="buy" 
              disabled={product.remaining === 0}
              onClick={() => addProductToCart(true)}
            >
                Buy now
            </button>

        </>

    )
}
