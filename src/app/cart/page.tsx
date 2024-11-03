"use client";

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import "../../styles/cart.css";
import { CartItem } from '@/components/CartItems';
import type { TCartItem } from '@/types/products';
import { ContentContainer } from '@/components/Containers';
import { Product } from '@/types/products';
import { UserSession } from '@/types/session';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import CustomerProvider, { useCustomer } from '@/contexts/CustomerContext';


export default function CartPage() {
  const { update } = useSession();

  const { cartItems, setCartItems, totalPrice } = useCustomer();

  const router = useRouter();


  useEffect(() => {
    update({
      cart: cartItems.map(item => ({ id: item.prod_id, quantity: item.quantity }))
    });
  }, []);

  const handleCheckAll = (checked: boolean) => {
    setCartItems(cartItems.map(item => ({ ...item, checked })));
    
  }

  const handleCheck = (cartItem: TCartItem, checked: boolean) => {
    setCartItems(cartItems.map(item =>
    (
      cartItem.prod_id === item.prod_id
        ? { ...item, checked }
        : { ...item }
    )
    ));
  }
  
  const handleRemove = (cartItem: TCartItem) => {
    setCartItems(cartItems.filter(item => item.prod_id !== cartItem.prod_id));
  }

  const handleCheckout = () => {
    router.push("/payment");
  }

  const handleUpdateQuantity = (cartItem: TCartItem, quantity: number) => {
    if (quantity < 1) {
      handleRemove(cartItem);
      return;
    }

    setCartItems(cartItems.map(item =>
      cartItem.prod_id === item.prod_id
        ? { ...item, quantity }
        : item
    )
    );
  };


  return (
    <ContentContainer>
      <div className="cart-bg">
        <h1>Shopping Cart</h1>
        <div className="cart-container">
          <input 
            className='select-all-box' 
            id='select-all' 
            type="checkbox" 
            onChange={e => handleCheckAll(e.target.checked)} 
            checked={cartItems.every(item => item.checked) && Boolean(cartItems.length)} 
          />
          <span>Select All</span>
          {
            cartItems.map((item: TCartItem, index: number) => (
              <CartItem key={index} item={item} handleCheck={handleCheck} handleRemove={handleRemove} handleUpdateQuantity={handleUpdateQuantity} />
            ))

          }
        </div>

        <div className="cart-item-summary">
          <p className="text-total-price">{`${cartItems.filter(item => item.checked).length} items (${totalPrice} ฿)`}</p>
          <p className="text-summary">Shipping, taxes, and discounts will be calculated at checkout</p>
          <div className="btn-container">
            <Link className="continue-shopping-btn" href="/products">Continue Shopping</Link>
            <button className="checkout-btn" onClick={() => handleCheckout()}>Checkout</button>
          </div>

        </div>

      </div >
    </ContentContainer >

  )
}
