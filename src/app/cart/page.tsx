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


export default function CartPage() {
  const { data: session, status, update } = useSession();
  const cartItemsSession = (session?.user as UserSession)?.cart;

  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [totalprice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      if (!cartItemsSession || status !== 'authenticated' || cartItems.length)
        return;

      const cartItemIds = cartItemsSession.map(item => item.id.toString()).join(",");
      const res = await fetch("api/product?prod_ids=" + cartItemIds);
      const datas = (await res.json()).data;

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

  }, [cartItemsSession, status]);

  const handleCheckAll = (checked: boolean) => {
    const totalPrice = cartItems.reduce((itemA, itemB) => itemA + itemB.price * itemB.quantity, 0)
    setTotalPrice(checked ? totalPrice : 0);
    setCartItems(cartItems.map(item => ({ ...item, checked })));
  }

  const handleCheck = (cartItem: TCartItem, checked: boolean) => {
    if (checked) {
      setTotalPrice(prev => prev + cartItem.price * cartItem.quantity);
    } else {
      setTotalPrice(prev => prev - cartItem.price * cartItem.quantity);
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
    update({cart: newCartItems});
    setCartItems(cartItems.filter(item => item.prod_id !== cartItem.prod_id));
    setTotalPrice(prev => prev - cartItem.price * cartItem.quantity);
  }

  const handleCheckout = () => {
    const url = new URL(process.env.NEXT_PUBLIC_URL + "/payment");

    const checkedCartItems = cartItems.filter(item => item.checked);
    const cartItemIds = checkedCartItems.map(item => item.prod_id.toString()).join(",");
    const cartItemQuantities = checkedCartItems.map(item => item.quantity.toString()).join(",");

    url.searchParams.append("item_ids", encodeURIComponent(cartItemIds));
    url.searchParams.append("item_quantities", encodeURIComponent(cartItemQuantities));

    router.push(url.toString());
  }

  const handleUpdateQuantity = (cartItem: TCartItem, quantity: number) => {
    if (quantity < 1)
      return;
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
      <h1>Shopping Cart</h1>
      <div className="cart-page"></div>
      <div className="cart-container">
        <div className="cart-item-list"></div>

        <input className='select-all-box' id='select-all' type="checkbox" onChange={e => handleCheckAll(e.target.checked)} />
        {
          cartItems.map((item: TCartItem, index: number) => (
            <CartItem key={index} item={item} handleCheck={handleCheck} handleRemove={handleRemove} handleUpdateQuantity={handleUpdateQuantity} />
          ))

        }
      </div>

      <div className="cart-item-summary">
        <h3 className="text-summary">{`${cartItems.filter(item => item.checked).length} items (${totalprice} ฿)`}</h3>
        <p className="text-summary">Shipping, taxes, and discounts will be calculated at checkout</p>
        <div className="btn-container">
          <button className="continue-shopping-btn">Continue Shopping</button>
          <button className="checkout-btn" onClick={() => handleCheckout()}>Checkout</button>
        </div>

      </div>
    </ContentContainer >
  )
}
