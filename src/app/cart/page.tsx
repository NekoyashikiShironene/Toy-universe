"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import "../../styles/cart.css";
import { CartItem } from '@/components/CartItems';
import type { TCartItem } from '@/types/products';
import { ContentContainer } from '@/components/Containers';
import { Product } from '@/types/products';
import { UserSession } from '@/types/session';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function CartPage() {
  const { data: session, status, update } = useSession();
  const cartItemsSession = (session?.user as UserSession)?.cart;

  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [totalprice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      if (!cartItemsSession?.length || status !== 'authenticated' || cartItems.length)
        return;

      const cartItemIds = cartItemsSession.map(item => item.id.toString()).join(",");
      const res = await fetch("api/product?prod_ids=" + cartItemIds);
      const datas = (await res.json()).data ?? [];

      setCartItems(datas.map((data: Product) => {
        const quantity = cartItemsSession.find(item => item.id === data.prod_id)?.quantity

        return {
          ...data,
          checked: false,
          quantity
        }
      }));
    }
    fetchProducts();

  }, [cartItems.length, cartItemsSession, status]);

  useEffect(() => {
    const totalPrice = cartItems.reduce((sum, item) =>
      sum + (item.checked ? item.price * item.quantity : 0)
      , 0);
    setTotalPrice(totalPrice);
  }, [cartItems]);

  const handleCheckAll = (checked: boolean) => {
    setCartItems(cartItems.map(item => ({ ...item, checked })));
  }

  const handleCheck = (cartItem: TCartItem, checked: boolean) => {
    if (!checked) {
      const selectAllBox = document.getElementById("select-all") as HTMLInputElement;
      selectAllBox.checked = false;
    }

    setCartItems(cartItems.map(item =>
    (
      cartItem.prod_id === item.prod_id
        ? { ...item, checked }
        : { ...item }
    )
    ));
  }

  const handleRemove = (cartItem: TCartItem) => {
    const newCartItems = cartItemsSession.filter(item => item.id !== cartItem.prod_id);
    update({ cart: newCartItems });
    setCartItems(cartItems.filter(item => item.prod_id !== cartItem.prod_id));
  }

  const handleCheckout = () => {
    const url = new URL(process.env.NEXT_PUBLIC_URL + "/payment");
    const checkedCartItems = cartItems.filter(item => item.checked);

    if (!checkedCartItems.length)
      return;
    
    const cartItemIds = checkedCartItems.map(item => item.prod_id.toString()).join(",");
    const cartItemQuantities = checkedCartItems.map(item => item.quantity.toString()).join(",");

    url.searchParams.append("item_ids", encodeURIComponent(cartItemIds));
    url.searchParams.append("item_quantities", encodeURIComponent(cartItemQuantities));

    router.push(url.toString());
  }

  const handleUpdateQuantity = (cartItem: TCartItem, quantity: number) => {
    if (quantity < 1){
      handleRemove(cartItem);
      return;
    }

      
    update({
      cart: cartItemsSession.map(item =>
        cartItem.prod_id === item.id
          ? { ...item, quantity }
          : item
      )
    });

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
          <input className='select-all-box' id='select-all' type="checkbox" onChange={e => handleCheckAll(e.target.checked)} />
          <span>Select All</span>
          {
            cartItems.map((item: TCartItem, index: number) => (
              <CartItem key={index} item={item} handleCheck={handleCheck} handleRemove={handleRemove} handleUpdateQuantity={handleUpdateQuantity} />
            ))

          }
        </div>
        
        <div className="cart-item-summary">
          <p className="text-total-price">{`${cartItems.filter(item => item.checked).length} items (${totalprice} ฿)`}</p>
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
