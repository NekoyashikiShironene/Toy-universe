"use client"
import React from 'react';
import Image from 'next/image';
import { Product } from '../types/products';
import { ScreenContainer, ContentContainer } from './Containers';
import { useState, useEffect } from "react";
import "../styles/cart.css";


function Item({ item, checkedItems, handleItemcheck, index }: 
  { 
    item: Product, 
    checkedItems: boolean[], 
    handleItemcheck: (i: number) => void, 
    index: number 
  }) {
  return (
    <div className="cart-item" onClick={() => { }}>
      <input className='item-checkbox' type="checkbox" checked={checkedItems[index]} onChange={() => handleItemcheck(index)} />
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
            <button>-</button>
            <p className="">{item.quantity}</p>
            <button>+</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export function CartItems({ products }: { products: Product[] }) {

  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkedItems, setCheckItems] = useState<boolean[]>(Array(products.length).fill(false));
  const [totalprice, setTotalPrice] = useState<number>(0);

  const handleSelectAll = () => {

    setSelectAll(!selectAll);
    setCheckItems(Array(products.length).fill(!selectAll));
  };

  const handleItemcheck = (index: number) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index]
    setCheckItems(updatedCheckedItems);
  }

  //  const totalPrice: number = products.reduce((acc: number, item: any) => {
  //    return acc + item.price * item.quantity;

  //  }, 0);


  useEffect(() => {
    updateTotalPrice();
  }, [checkedItems]);

  const updateTotalPrice = () => {
    let total = 0;
    products.forEach((item: Product, index: number) => {
      if (checkedItems[index]) {
        total += item.price * item.quantity;
      }
    });
    setTotalPrice(total);
  };

  return (
    <>
        <div className="cart-page">
          <div className="cart-container">
            <div className="cart-item-list"></div>

            <input className='select-all-box' id='select-all' type="checkbox" checked={selectAll} onChange={handleSelectAll} />

            {
              products.map((item: Product, index: number) => (
                <>
                  <Item key={index} item={item} checkedItems={checkedItems} handleItemcheck={handleItemcheck} index={index} />
                  <Item key={index} item={item} checkedItems={checkedItems} handleItemcheck={handleItemcheck} index={index} />
                  <Item key={index} item={item} checkedItems={checkedItems} handleItemcheck={handleItemcheck} index={index} />
                  <Item key={index} item={item} checkedItems={checkedItems} handleItemcheck={handleItemcheck} index={index} />
                </>
                
              ))

            }
          </div>
          <div className="cart-item-summary">

            <button className="checkout-btn">
              <p>{"3 items " + totalprice + " ฿"}</p>
              <p>Proceed to payment</p>
            </button>
          </div>
        </div>
    </>
  )
}









