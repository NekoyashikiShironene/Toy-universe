"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="cart-item">
      <input 
        className='item-checkbox' 
        type="checkbox" 
        checked={item.checked}
        onChange={(e) => handleCheck(item, e.target.checked)} 
        disabled={!item.availability}
      />
      <Link href={`/detail?prod_id=${item.prod_id}`}>
        <Image
          src={`/products/${item.prod_id}.jpg`}
          alt={item.prod_name}
          width={100}
          height={100}
          className="item-image"
        />
      </Link>
      <div className="item-info">
        <h2 className="item-name">{item.prod_name}</h2>
        <div className="item-price-manager">
          <span className="item-price">{item.price + "฿"}</span>
          <input 
            type='number' 
            value={item.quantity} 
            max={item.remaining} 
            onChange={(e) => handleUpdateQuantity(item, parseInt(e.target.value))} 
            className="item-quantity" 
            disabled={!item.availability} 
          />
        </div>
        {!item.availability && <p style={{color: "red"}}>Sorry, this item is out of stock</p>}
        <span className='delete-item' onClick={() => handleRemove(item)}>Remove</span>
        
      </div>
    </div>
  )
}



