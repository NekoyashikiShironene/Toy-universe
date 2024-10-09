import React from 'react';
import Image from 'next/image';
import { Product } from '../../types/products';
import connectToDatabase from '@/utils/db';
import "../../styles/detail.css";

const getProductDetails = async (prod_id: string) => {
  try {
    const connection = await connectToDatabase();
    const [results] = await connection.query(
      "SELECT * FROM product WHERE prod_id = ?",
      [prod_id]
    );
    await connection.end();

    return results[0]; // คืนค่าผลลัพธ์แรก
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

type Prop = {
  searchParams: { [key: string]: string | string[] | undefined }
}

// /product?prod_id=1002
// /product/1002
export default async function ProductDetailPage({ searchParams }: Prop) {
  const { prod_id } = searchParams; // ดึง prod_id จาก query params

  // ตรวจสอบว่ามี prod_id หรือไม่
  if (!prod_id) {
    return <div>Loading...</div>; // แสดงข้อความระหว่างรอข้อมูล
  }

  const product: Product = await getProductDetails(prod_id as string);

  return (
    <div className="product-detail">
  <div className="image-container">
    <Image
      src={`/products/${product.prod_id}.jpg`}
      alt={product.prod_name}
      width={300}
      height={300}
      className="product-image"
    />
  </div>
  <div className="details">
    <h1 className="product-name">{product.prod_name}</h1>
    <p className="product-price">ราคา: <span className="price">{product.price} บาท</span></p>
    <p className="product-description">รายละเอียดสินค้า: <br />{product.description}</p>
    <p className="stock">จำนวนสินค้าในคลัง: {product.quantity} ชิ้น</p>
    <button className="add-to-cart">เพิ่มลงในตะกร้า</button>
  </div>
</div>
  );
}
