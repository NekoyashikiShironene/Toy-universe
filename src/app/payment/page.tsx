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
   const [showAddressForm, setshowAddressForm] = useState<boolean>(false);
   const [promotion, setPromotion] = useState<{promo_id?: number, discount: number}>({promo_id: undefined, discount: 0});

   if (!cartItems.length)
      router.push("/cart")

   useEffect(() => {
      async function fetchAddress() {
         const res = await fetch("api/user");
         const data = (await res.json()).data.address_json as Address;
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
      if (!code) {
         setStatusMessage("");
         setPromotion({...promotion, discount: 0});
         return;
      }
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
            setPromotion({...promotion, discount: 0});
            return;
         case 400:
            setStatusMessage("User does not meet the required conditions for this coupon");
            setPromotion({...promotion, discount: 0});
            return;
      }

      const data = (await res.json()).promotion;
      setPromotion({promo_id: data.promo_id, discount: data.discount});
      setStatusMessage(`Alright! Here’s your ${Math.round(data.discount * 100)}% discount 🎉 Enjoy shopping!`);
   }

   const handlePlaceOrder = async () => {
      const bodyData = {
         promotion,
         address: showAddressForm ? address : existedAddress, 
         products: selectedCartItems
      }

      const res = await fetch("api/checkout", {
         method: "POST",
         body: JSON.stringify(bodyData)
      });

      if (!res.ok)
         return;

      const session = (await res.json())?.session;
      router.push(session.url);
   }


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

            <form onSubmit={e => { e.preventDefault(); handleSubmitCoupon((e.target as HTMLFormElement).coupon.value) }}>
               <h2>Coupon Discount</h2>
               <input type='text' id='coupon' name='coupon' />
               <button type='submit'>Apply</button>
               <p className="status">{statusMessage}</p>
            </form>

            <div className="pay totalPrice">
               Total: {promotion.discount ? (
                  <>
                     <s className="originalPrice">{totalPrice}</s> {totalPrice - (totalPrice * promotion.discount)}
                  </>
               ) : (
                  totalPrice
               )} ฿
            </div>

         </div>

         <button onClick={() => handlePlaceOrder()}>ชำระเงิน</button>
      </ContentContainer>
   )
}
