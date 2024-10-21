"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '../../types/products';
import "../../styles/detail.css";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { UserSession } from '@/types/session';

type Prop = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductDetailPage({ searchParams }: Prop) {
  const { data: session, update } = useSession();

  const { prod_id } = searchParams; // ดึง prod_id จาก query params
  const [ product, setProduct ] = useState<Product | undefined>();
  const [ quantity, setQuantity ] = useState<number>(1);
  
  useEffect(() => {
    const getProductDetails = async (prod_id: string) => {
      try {
        const res = await fetch("api/product?prod_id=" + prod_id);
        const data = (await res.json()).data;
        setProduct(data[0]);
        
      } catch (error) {
        console.error('Database connection failed:', error);
      }
    };
    getProductDetails(prod_id as string);
  }, [prod_id]);

  const handlePlus = () => {
    if (!product){
      return;
    }

    if (quantity < product?.quantity){
      setQuantity(quantity + 1);
    }
  }

  const handleMinus = () => {
    if (quantity > 1){
      setQuantity(quantity - 1);
    }
  }

  const addProductToCart = () => {
      const newProduct = {
        prod_id: prod_id,
        quantity: quantity
      };
      const user = session?.user as UserSession;
      update({cart: [...(user?.cart), newProduct]});
      
  }

  return (
    <div className="product-detail">
      <div className="image-container">
        <Image
          src={`/products/${prod_id}.jpg`}
          alt={product?.prod_name ?? ""}
          width={300}
          height={300}
          className="product-image"
        />
      </div>
      <div className="details">
        <h1 className="product-name">{product?.prod_name}</h1>
        <p className="product-price">ราคา: <span className="price">{product?.price} บาท</span></p>
        <p className="product-description">รายละเอียดสินค้า: <br />{product?.description}</p>
        <p className="stock">จำนวนสินค้าในคลัง: {product?.quantity} ชิ้น</p>
        <div className="item-quantity">
          <button onClick={handleMinus}>-</button>
          <input type="number" value={quantity} min={1} max={product?.quantity} readOnly/>
          <button onClick={handlePlus}>+</button>
        </div>
        <button className="add-to-cart" onClick={addProductToCart}>เพิ่มลงในตะกร้า</button>
        <Link href={"/payment?prod_id=" + product?.prod_id}>
          <button type="submit" className="buy">
            สั่งซื้อ
          </button>
        </Link>
      </div>
    </div>
  );
}

