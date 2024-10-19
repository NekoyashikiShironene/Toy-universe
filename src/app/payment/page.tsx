'use client';
import "../../styles/payment.css"
import {useState} from 'react'
import Image from 'next/image';
import { ContentContainer } from "@/components/Containers";

export default function page(){

   const contacts = [
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
    ];
    
    const payment = ['QR Code','โอนธนาคาร'];
    


   const [showPopup,setshowPopup] = useState<boolean>(false);
   const [handleDropdownPayment,sethandleDropdownPayment] = useState(false);

   const handlePopup = () =>{
      setshowPopup(!showPopup);
   }

   const handleDropdown = () =>{
      sethandleDropdownPayment(!handleDropdownPayment);
   }

   return(
      <ContentContainer>
         <div className='payment-container'>
            <h1 >การสั่งซื้อ</h1>


            <div className='pay select-address'>ที่อยู่จัดส่ง
               <p>ข้อมูล blabla 098-xx ดาวอังคาร</p>
               <button className='change-address' onClick={handlePopup}>เปลี่ยน</button>
            </div>

               {showPopup && (

                  
                  <div className='popup-background' >
                     <div className='popup-address'>
                        <div>ที่อยู่</div>
                        
                        {
                           contacts.map((con,index) => (
                              <div key={index} className='address'>
                                 <div>ชื่อ:{con.name}</div>
                                 <div>เบอร์:{con.phone}</div>
                                 <div>ที่อยู่:{con.address}</div>
                              </div>


                           ))

                        }

                        <button className='add-address'>เพิ่มที่อยู่</button>

                        <div className='popup-control-but'>
                           <button className='cancel' onClick={handlePopup}>ยกเลิก</button>
                           <button className='confirm'>ยืนยัน</button>
                        </div>
                     </div>

                  </div>
               )}


            <div className='pay product'>
            
               <Image
                    src={`/products/1001.jpg`}
                    alt='blabla'
                    width={100}
                    height={100}
                    className="item-image"
                  />

               <div>
                  <div>Something</div>
                  <div>Price:xxxx</div>
                  
               </div>


            </div>

            <div className='pay xxx' onClick={handleDropdown}>
               ช่องทางชำระเงิน
               {/* <label htmlFor="">ช่องทางชำระเงิน</label>
               <select id="payment">
                  <option value="qr">QR Code</option>
                  <option value="mobile-banking">โอนธนาคาร</option>
               </select> */}
            </div>
               {
                  handleDropdownPayment && (

                     payment.map((i,index) => (
                        <div className='pay' key={index}>{i}</div>

                     ))
                  )
               }

         </div>
      </ContentContainer>
   )
}