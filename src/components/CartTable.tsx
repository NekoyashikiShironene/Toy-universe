"use client"
import React from 'react';
import "../styles/cart.css";

import Image from 'next/image';
import { Product } from '../types/products';
import { useState } from "react";


export function CartTable({ products }: { products: Product[] }) {

   const [selectAll, setSelectAll] = useState<boolean>(false);
   

   const handleSelectAll = () => {

      setSelectAll(!selectAll);

   };

//   const totalPrice: number = result.reduce((acc: number, item: any) => {
//     return acc + item.price * item.quantity;
     
//   }, 0);


  return (
    <>
    <div>Cart</div>
    <table>
      <tr>
        <th><input id='select-all' type="checkbox" /></th>
        <th>สินค้า</th>
        <th>ราคาต่อชิ้น</th>
        <th>จำนวน</th>
        <th>ราคารวม</th>
      </tr>
      
       {products.map((item: Product, index: number) => (
        
        <tr key={index}>
          <td><input type="checkbox" onChange={handleSelectAll}/></td>
          <td >
          <div className='product-col'>
          <Image
                  src={`/products/${item.prod_id}.jpg`}
                  alt={item.prod_name} 
                  width={100} 
                  height={100} 
          />
          {item.prod_name}
          </div>
          </td>
          <td>{item.price}</td>
          <td>{item.quantity}</td>
          <td>{item.quantity * item.price}</td>
        </tr>
      ))} 
      <tr>Total Price: blabla</tr>
    </table>
    </>
  )
}









// export default  function cart({ product }: { product: Product[] }) {
//    return(
//       <>
//          {product.map((item:Product) => (

//             <cartTable product={item} key={}/>
//          ))}
         
//       </>

//    )

// }
