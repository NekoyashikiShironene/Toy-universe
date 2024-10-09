import React from 'react';
import "../../styles/cart.css";
import connectToDatabase from '@/utils/db';
import Image from 'next/image';
import { Product } from '../../types/products';
import { CartTable } from '@/components/CartTable';
 
//SELECT product.prod_name, product.price , cart.quantity FROM `cart` JOIN product ON cart.prod_id = product.prod_id WHERE cart.cus_id = 1;

const testDatabaseConnection = async () => {
  try {
    const connection = await connectToDatabase();
    console.log('Database connection successful!');
    const [results, fields] = await connection.query("SELECT product.prod_id,product.prod_name, product.price , cart.quantity FROM `cart` JOIN product ON cart.prod_id = product.prod_id WHERE cart.cus_id = 1");
    console.log(results, fields);
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
    <>
      <CartTable products={result} />
    </>
  )
}
