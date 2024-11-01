'use client';

import "../../styles/payment.css"
import { useEffect, useState } from 'react'
import Image from 'next/image';
import { ContentContainer } from "@/components/Containers";
import { TCartItem } from "@/types/products";
import { useRouter } from "next/navigation";

import { useCustomer } from "@/contexts/CustomerContext";
import { json } from "stream/consumers";
//import Form from 'next/form'

export default function PaymentPage() {
   const router = useRouter();
   const { cartItems, totalPrice, newUser } = useCustomer();
   const selectedCartItems = cartItems.filter(item => item.checked);

   const [existedAddress, setExistedAddress] = useState<string>('');
   const [address, setAddress] = useState<string>('');

   const [statusMessage, setStatusMessage] = useState<string>("");

   if (!cartItems.length)
      router.push("/cart")
      
   useEffect(() => {
      async function fetchAddress() {
         const res = await fetch("/api/product?prod_ids=" + [].join(","));
         const data = (await res.json()).data;
      
      }

   }, []);

   const handleSubmitCoupon = async (code: string) => {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("userData", JSON.stringify({
         newUser,
         selectedItems: selectedCartItems
      }))

      const res = await fetch("api/validate/coupon", {
         method: "POST",
         body: formData
      });

      switch (res.status) {
         case 404:
            setStatusMessage("Coupon Code Not Found");
            return;
         case 400:
            setStatusMessage("User does not meet the required conditions for this coupon");
            return;
      }

      const data = (await res.json()).promotion;
      setStatusMessage(`Ok Jaaa Here you go!! Discount ${Math.round(data.discount * 100)}%`);

   }


   const [showAddressForm, setshowAddressForm] = useState<boolean>(false);

   return (
      <ContentContainer>
         <div className='payment-container'>
            <h1>การสั่งซื้อ</h1>

            <div className='pay select-address'>
               <h3>Shipping Address</h3>
               <input type="radio" name="address" id="address" onChange={() => setshowAddressForm(false)} checked={!showAddressForm} /> Use existing address <br />
               {!showAddressForm && <p>contacts[0].name contacts[0].phone contacts[0].address</p>}
               <input type="radio" name="address" id="address" onChange={() => setshowAddressForm(true)} /> Use new address <br />
               {
                  showAddressForm && (
                     <div className=''>
                        <textarea name="" id="" onChange={e => setAddress(e.target.value)} />
                     </div>
                  )
               }

            </div>

            {
               selectedCartItems.map((item: TCartItem) => (
                  <div className='pay product' key={item.prod_id}>
                     <Image
                        src={`/products/${item.prod_id}.jpg`}
                        alt='blabla'
                        width={100}
                        height={100}
                        className="item-image"
                     />

                     <div>
                        <p>{item.prod_name}</p>
                        <p>{`Price: ${item.price} ฿`}</p>
                     </div>
                  </div>
               ))
            }

            <form onSubmit={e => {e.preventDefault(); handleSubmitCoupon(e.target[0].value)}}>
               <h2>Coupon Discount</h2>
               <input type='text' id='coupon' name='coupon' />
               <button type='submit'>Apply</button>
               <p className="status">{statusMessage}</p>
            </form>

            <div className="pay totalPrice">Total: {totalPrice} บาท</div>
         </div>

         <button>ชำระเงิน</button>
      </ContentContainer>
   )
}
