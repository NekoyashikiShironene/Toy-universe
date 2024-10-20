'use client';
import "../../styles/payment.css"
import { useEffect, useState } from 'react'
import Image from 'next/image';
import { ContentContainer } from "@/components/Containers";
//import Form from 'next/form'


type Prop = {
   searchParams: { [key: string]: string | string[] | undefined }
}

export default function PaymentPage({ searchParams }: Prop) {
   const { prod_id } = searchParams; // ดึง prod_id จาก query params
   const [product, setProduct] = useState<any>();

   useEffect(() => {
      async function fetchProduct() {
         const res = await fetch("/api/product?prod_id=" + prod_id);
         const data = (await res.json()).data[0];
         setProduct(data);
      }
      fetchProduct();
   }, []);


   // const contacts = [
   //    {
   //       name: "สมชาย ใจดี",
   //       phone: "081-234-5678",
   //       address: "123 หมู่ 5 ตำบลในเมือง อำเภอเมือง จังหวัดกรุงเทพฯ 10200"
   //    },
   //    {
   //       name: "มานะ พยายาม",
   //       phone: "082-345-6789",
   //       address: "456 ซอยสุขสันต์ ถนนสุขใจ ตำบลบางรัก อำเภอเมือง จังหวัดชลบุรี 20130"
   //    },
   //    {
   //       name: "สายลม แสงแดด",
   //       phone: "083-456-7890",
   //       address: "789 หมู่บ้านสวนสวย ตำบลน้ำหวาน อำเภอหาดใหญ่ จังหวัดสงขลา 90110"
   //    }
   // ];

   const [contacts, setContacts] = useState([

      {
         name: "สมชาย ใจดี",
         phone: "081-234-5678",
         address: "123 หมู่ 5 ตำบลในเมือง อำเภอเมือง จังหวัดกรุงเทพฯ 10200"
      },
      {
         name: "มานะ พยายาม",
         phone: "082-345-6789",
         address: "456 ซอยสุขสันต์ ถนนสุขใจ ตำบลบางรัก อำเภอเมือง จังหวัดชลบุรี 20130"
      },
      {
         name: "สายลม แสงแดด",
         phone: "083-456-7890",
         address: "789 หมู่บ้านสวนสวย ตำบลน้ำหวาน อำเภอหาดใหญ่ จังหวัดสงขลา 90110"
      }
   ]);

   const payment = ['QR Code', 'โอนธนาคาร'];



   const [showPopup, setshowPopup] = useState<boolean>(false);
   const [handleDropdownPayment, sethandleDropdownPayment] = useState(false);
   const [selectedPayment, setselectedPayment] = useState<string>();
   const [selectedAddress, setselectedAddress] = useState(0);
   const [tempSelectedAddress, setTempSelectedAddress] = useState(selectedAddress);
   const [showAddressForm, setshowAddressForm] = useState<boolean>(false);

   const [newAddress, setNewAddress] = useState({
      name: '',
      phone: '',
      houseNumber: '',
      soi: '',
      district: '',
      province: '',
      postalCode: ''
   });

   const handlePopup = () => {
      setshowPopup(!showPopup);
   }

   const handleDropdown = () => {
      sethandleDropdownPayment(!handleDropdownPayment);
   }

   const handleSelectPayment = (payment: string) => {
      setselectedPayment(payment);
      sethandleDropdownPayment(!handleDropdownPayment);
   }

   const handleSelectAddress = (i: number) => {
      setselectedAddress(i);
      setshowPopup(!showPopup);
   }

   const handleAddAddressForm = () => {
      setshowAddressForm(!showAddressForm);
      setshowPopup(!showPopup);
   }

   const handleChangeNewAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewAddress(prevState => ({
         ...prevState,
         [name]: value
      }));
   };

   const handleAddAddress = () => {
      setContacts(prevContacts => [
         ...prevContacts,
         {
            name: newAddress.name,
            phone: newAddress.phone,
            address: `${newAddress.houseNumber} ${newAddress.soi} ${newAddress.district} ${newAddress.province} ${newAddress.postalCode}`
         }
      ]);


      setNewAddress({
         name: '',
         phone: '',
         houseNumber: '',
         soi: '',
         district: '',
         province: '',
         postalCode: ''
      });

      setshowAddressForm(!showAddressForm);
      setshowPopup(!showPopup);

   }


   return (
      <ContentContainer>
         <div className='payment-container'>
            <h1 >การสั่งซื้อ</h1>


            <div className='pay select-address'>ที่อยู่จัดส่ง
               <p>{contacts[selectedAddress].name} {contacts[selectedAddress].phone} {contacts[selectedAddress].address}</p>
               <button className='payment-button change-address' onClick={handlePopup}>เปลี่ยน</button>
            </div>

            {showPopup && (


               <div className='popup-background' >
                  <div className='popup-address'>
                     <div>ที่อยู่</div>

                     {
                        contacts.map((con, index) => (
                           <div key={index} className='address' >
                              <input type="radio" name="address" onChange={() => setTempSelectedAddress(index)} checked={index == tempSelectedAddress} />
                              <div className="address-info">
                                 <div>ชื่อ:{con.name}</div>
                                 <div>เบอร์:{con.phone}</div>
                                 <div>ที่อยู่:{con.address}</div>
                              </div>
                           </div>


                        ))

                     }

                     <button className='payment-button add-address' onClick={handleAddAddressForm}>เพิ่มที่อยู่</button>

                     <div className='popup-control-but'>
                        <button className='payment-button cancel' onClick={handlePopup}>ยกเลิก</button>
                        <button className='payment-button confirm' onClick={() => handleSelectAddress(tempSelectedAddress)}>ยืนยัน</button>
                     </div>
                  </div>

               </div>
            )}

            {
               showAddressForm && (
                  <div className='popup-background'>
                     <div className='popup-add-address'>

                        <div className='popup-add-address-head'>เพิ่มที่อยู่</div>
                        <input type="text" name="name" placeholder="ชื่อ" required onChange={handleChangeNewAddress} />
                        <input type="tel" name="phone" placeholder="เบอร์" required onChange={handleChangeNewAddress} />
                        <input type="text" name="houseNumber" placeholder="บ้านเลขที่" required onChange={handleChangeNewAddress} />
                        <input type="text" name="soi" placeholder="ซอย" required onChange={handleChangeNewAddress} />
                        <input type="text" name="district" placeholder="ตำบล" required onChange={handleChangeNewAddress} />
                        <input type="text" name="province" placeholder="จังหวัด" required onChange={handleChangeNewAddress} />
                        <input type="number" name="postalCode" placeholder="รหัสไปรษณีย์" required onChange={handleChangeNewAddress} />


                        <div className='popup-control-but'>
                           <button className='payment-button cancel' onClick={handleAddAddressForm}>ยกเลิก</button>
                           <button className='payment-button confirm' type='submit' onClick={handleAddAddress}>เพิ่ม</button>
                        </div>



                     </div>
                  </div>
               )
            }


            {
               product && (
                  <div className='pay product'>

                     <Image
                        src={`/products/${prod_id}.jpg`}
                        alt='blabla'
                        width={100}
                        height={100}
                        className="item-image"
                     />

                     <div>
                        <div>{product.prod_name}</div>
                        <div>{`Price: ${product.price} ฿`}</div>

                     </div>


                  </div>
               )
            }


            <div className='dropdown-payment-select' onClick={handleDropdown}>
               <div>ช่องทางชำระเงิน</div>
               <div className="selected-payment">{selectedPayment}</div>

            </div>
            {
               handleDropdownPayment && (

                  payment.map((i, index) => (
                     <div className='dropdown-payment' key={index} onClick={() => handleSelectPayment(i)}>{i}</div>
                  ))
               )
            }

            <div className="pay totalPrice">Total: 000 บาท</div>

         </div>
      </ContentContainer>
   )
}
