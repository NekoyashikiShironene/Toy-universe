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
    
    const addProductToCart = () => {
        const isItemInCart = cartItems.find((cartItem) => cartItem.prod_id === product.prod_id)
        if (isItemInCart) {
          setCartItems(cartItems.map((cartItem) =>
              cartItem.prod_id === product.prod_id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            )
          );
        } else {
          setCartItems([...cartItems, {...product, quantity}]);
        }
    
        router.push('/cart');
      }

    return (
        <>

            <div className="item-quantity">
                <input type="number" value={quantity} min={1} max={product.remaining} onChange={(e) => setQuantity(Math.min(product.remaining, parseInt(e.target.value)))} />
            </div>
            <button className="add-to-cart" onClick={addProductToCart} disabled={product.remaining === 0}>Add to Cart</button>
            <Link href={"/payment?prod_id=" + product.prod_id}>
                <button type="submit" className="buy" disabled={product.remaining === 0}>
                    Buy now
                </button>
            </Link>
        </>

    )
}
