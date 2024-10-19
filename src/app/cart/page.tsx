import React from 'react';
import "../../styles/cart.css";
import connectToDatabase from '@/utils/db';
import Image from 'next/image';
import { Product } from '../../types/products';
import { CartItems } from '@/components/CartItems';
import { ContentContainer } from '@/components/Containers';
 
//SELECT product.prod_name, product.price , cart.quantity FROM `cart` JOIN product ON cart.prod_id = product.prod_id WHERE cart.cus_id = 1;

const testDatabaseConnection = async () => {
  try {
    const connection = await connectToDatabase();
    const [results, fields] = await connection.query("SELECT product.prod_id,product.prod_name, product.price , cart.quantity FROM `cart` JOIN product ON cart.prod_id = product.prod_id WHERE cart.cus_id = 1");
    await connection.end();
    
    return results;


  } catch (error) {
    console.error('Database connection failed:', error);
  }
};


export default async function page() {

  const result = await testDatabaseConnection() as Product[];

  // const totalPrice: number = result.reduce((acc: number, item: any) => {
  //   return acc + item.price * item.quantity;
  // }, 0);


  return (
    <ContentContainer>
      <h1>Shopping Cart</h1>
      <CartItems products={result}/>
    </ContentContainer>
  )
}
