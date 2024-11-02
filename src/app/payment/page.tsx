'use client';

import "../../styles/payment.css"
import { useEffect, useState } from 'react'
import Image from 'next/image';
import { ContentContainer } from "@/components/Containers";
import { TCartItem } from "@/types/products";
import { useRouter } from "next/navigation";

import { useCustomer } from "@/contexts/CustomerContext";
import { type Address } from "@/types/address";
import { formatAddress } from "@/utils/address";

export default function PaymentPage() {
   const router = useRouter();
   const { cartItems, totalPrice, newUser } = useCustomer();
   const selectedCartItems = cartItems.filter(item => item.checked);

   const [existedAddress, setExistedAddress] = useState<Address | undefined>();
   const [address, setAddress] = useState<Address | undefined>();

   const [statusMessage, setStatusMessage] = useState<string>("");

   if (!cartItems.length)
      router.push("/cart")

   useEffect(() => {
      async function fetchAddress() {
         const res = await fetch("api/user");
         const data = (await res.json()).data.address_json as Address;
         console.log(data)
         setExistedAddress(data);
      }
      fetchAddress()
   }, []);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAddress((prevAddress) => ({
          ...prevAddress,
          [name]: value || null
      } as Address));
  };
  

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

   const handlePlaceOrder = async () => {
      const bodyData = {
         
      }
   }


   const [showAddressForm, setshowAddressForm] = useState<boolean>(false);

   return (
      <ContentContainer>
         <div className='payment-container'>
            <h1>การสั่งซื้อ</h1>

            <div className='pay select-address'>
               <h3>Shipping Address</h3>
               <input type="radio" name="address" id="address" onChange={() => setshowAddressForm(false)} checked={!showAddressForm} /> Use existing address <br />
               {!showAddressForm && <p>{formatAddress(existedAddress)}</p>}
               <input type="radio" name="address" id="address" onChange={() => setshowAddressForm(true)} /> Use new address <br />
               {
                  showAddressForm && (
                     <form>
                        <div>
                           <label>House Number:
                              <input
                                 type="text"
                                 name="house_number"
                                 value={address?.house_number || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                        <div>
                           <label>Street:
                              <input
                                 type="text"
                                 name="street"
                                 value={address?.street || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                        <div>
                           <label>Subdistrict:
                              <input
                                 type="text"
                                 name="subdistrict"
                                 value={address?.subdistrict || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                        <div>
                           <label>District:
                              <input
                                 type="text"
                                 name="district"
                                 value={address?.district || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                        <div>
                           <label>Province:
                              <input
                                 type="text"
                                 name="province"
                                 value={address?.province || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                        <div>
                           <label>Postal Code:
                              <input
                                 type="text"
                                 name="postal_code"
                                 value={address?.postal_code || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                        <div>
                           <label>Country:
                              <input
                                 type="text"
                                 name="country"
                                 value={address?.country || ''}
                                 onChange={handleChange}
                              />
                           </label>
                        </div>
                     </form>
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

            <form onSubmit={e => { e.preventDefault(); handleSubmitCoupon(e.target[0].value) }}>
               <h2>Coupon Discount</h2>
               <input type='text' id='coupon' name='coupon' />
               <button type='submit'>Apply</button>
               <p className="status">{statusMessage}</p>
            </form>

            <div className="pay totalPrice">Total: {totalPrice} บาท</div>
         </div>

         <button onClick={() => handlePlaceOrder()}>ชำระเงิน</button>
      </ContentContainer>
   )
}
