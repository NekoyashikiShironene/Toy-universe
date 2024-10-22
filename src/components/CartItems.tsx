"use client"
import React from 'react';
import Image from 'next/image';
import type { TCartItem } from '../types/products';
import "../styles/cart.css";

export function CartItem({ item, handleCheck, handleRemove, handleUpdateQuantity }:
  { 
    item: TCartItem,
    handleCheck: (cartItem: TCartItem, checked: boolean) => void,
    handleRemove: (cartItem: TCartItem) => void
    handleUpdateQuantity: (CartItem: TCartItem, quantity: number) => void
  }
)

 {
  return (
    <div className="cart-item" onClick={() => { }}>
      <input className='item-checkbox' type="checkbox" checked={item.checked} onChange={(e) => handleCheck(item, e.target.checked)} />
      <Image
        src={`/products/${item.prod_id}.jpg`}
        alt={item.prod_name}
        width={100}
        height={100}
        className="item-image"
      />
      <div className="item-info">
        <p className="item-name">{item.prod_name}</p>
        <div className="item-price">
          <p className="">{item.price + ""}</p>
          <div className="item-quantity">
            <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</button>
            <input type='number' value={item.quantity} min='1' max='' />
            <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</button>
          </div>
          <p className='delete-item' onClick={() => handleRemove(item)}>ลบ</p>
        </div>
      </div>
    </div>
  )
}



