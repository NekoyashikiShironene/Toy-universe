"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '../../types/products';
import "../../styles/detail.css";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { UserSession } from '@/types/session';
import { useRouter } from 'next/navigation';

type Prop = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductDetailPage({ searchParams }: Prop) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const productIdParam = searchParams.prod_id as string; // ดึง prod_id จาก query params
  const prod_id = parseInt(productIdParam);

  const [product, setProduct] = useState<Product>({
    prod_id: 0,       
    prod_name: "",     
    category: "",   
    brand: "",         
    description: "",    
    price: 0,         
    remaining: 0      
});
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const getProductDetails = async (prod_id: number) => {
      try {
        const res = await fetch("api/product?prod_ids=" + prod_id);
        const data = (await res.json()).data;
        setProduct(data[0]);

      } catch (error) {
        console.error('Database connection failed:', error);
      }
    };
    getProductDetails(prod_id);
  }, [prod_id]);

  const handlePlus = () => {
    if (quantity < product.remaining) {
      setQuantity(quantity + 1);
    }
  }

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const addProductToCart = () => {
    const newProduct = {
      id: prod_id,
      quantity: quantity
    };
    const user = session?.user as UserSession;
    const prevCart = user.cart;

    const isItemInCart = prevCart.find((cartItem) => cartItem.id === prod_id)
    if (isItemInCart) {
      update({
        cart: prevCart.map((cartItem) =>
          cartItem.id === prod_id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      });
    } else {
      update({
        cart: [...prevCart, newProduct]
      });
    }

    router.push('/cart');
  }

  return (
    <div className="product-detail">
      <div className="image-container">
        <Image
          src={`/products/${prod_id}.jpg`}
          alt={product.prod_name}
          width={300}
          height={300}
          className="product-image"
        />
      </div>
      <div className="details">
        <h1 className="product-name">{product.prod_name}</h1>
        <p className="product-price">Price: <span className="price">{product.price} บาท</span></p>
        <p className="product-description">Detail: <br />{product.description}</p>
        <p className="stock">Remaining: {product.remaining} pieces</p>
        <div className="item-quantity">
          <button onClick={handleMinus}>-</button>
          <input type="number" value={quantity} min={1} max={product.remaining} onChange={(e) => setQuantity(Math.min(product.remaining, parseInt(e.target.value)))}/>
          <button onClick={handlePlus}>+</button>
        </div>
        <button className="add-to-cart" onClick={addProductToCart} disabled={product.remaining === 0}>Add to Cart</button>
        <Link href={"/payment?prod_id=" + product.prod_id}>
          <button type="submit" className="buy" disabled={product.remaining === 0}>
            Buy now
          </button>
        </Link>
      </div>
    </div>
  );
}

