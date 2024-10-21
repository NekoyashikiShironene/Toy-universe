import React from 'react';
import "../../styles/cart.css";
import connectToDatabase from '@/utils/db';
import { Product } from '../../types/products';
import { CartItems } from '@/components/CartItems';
import { ContentContainer } from '@/components/Containers';

//SELECT product.prod_name, product.price , cart.quantity FROM `cart` JOIN product ON cart.prod_id = product.prod_id WHERE cart.cus_id = 1;

const testDatabaseConnection = async () => {
  try {
    const connection = await connectToDatabase();
    const [results] = await connection.query("SELECT product.prod_id,product.prod_name, product.price , cart.quantity FROM `cart` JOIN product ON cart.prod_id = product.prod_id WHERE cart.cus_id = 200001");
    await connection.end();

    return results;


  } catch (error) {
    console.error('Database connection failed:', error);
  }
};


export default async function page() {
  const result = await testDatabaseConnection() as Product[];


  return (
    <ContentContainer>
      <h1>Shopping Cart</h1>
      <div className="cart-page">
        <CartItems products={result} />

        <div className="cart-item-summary">
          <h3 className="text-summary">{`3 items (1200 ฿)`}</h3>
          <p className="text-summary">Shipping, taxes, and discounts will be calculated at checkout</p>
          <div className="btn-container">
            <button className="continue-shopping-btn">Continue Shopping</button>
            <button className="checkout-btn">Checkout</button>
          </div>

        </div>
      </div>
    </ContentContainer>
  )
}
