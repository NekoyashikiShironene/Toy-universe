import React from 'react';
import connectToDatabase from "@/utils/db";
import { ContentContainer } from '@/components/Containers';
import '@/styles/order-management.css';
import type { Order } from '@/types/order';
import type { Address } from '@/types/address';
import { orderStatus } from '@/utils/statusId';
import OrderStatusDropdown from '@/components/OrderStatusDropdown';
import OrderItem from '@/components/OrderItem';
import useSession from '@/utils/auth';
import { UserSession } from '@/types/session';
import {redirect} from "next/navigation";

const formatAddress = (address: Address): string => {
    
    return [
        address.house_number,
        address.street,
        address.subdistrict,
        address.district,
        address.province,
        address.postal_code,
        address.country
    ].filter(Boolean).join(' ');
}

export default async function OrderManagement() {
    const user = (await useSession())?.user as UserSession;

    if (user.role !== "emp")
        redirect("/");
    
    const connection = await connectToDatabase();
    let orders;
    try {
        const [ results ] = await connection.query("SELECT DISTINCT order.ord_id, status_id, shipping_address, date_time, order_item.cus_id, name, email, tel \
                                                    FROM `order` JOIN order_item ON `order`.ord_id = order_item.ord_id \
                                                    JOIN customer ON order_item.cus_id = customer.cus_id");
        orders = results as Order[];
    }   
    catch (e: unknown) {
        console.error(e);
    }

    return (
        <ContentContainer>
            { user.role === 'emp' ?
                <div className='order-list'>
                    {
                        orders?.map(order => (
                            <div key={order.ord_id} className='order-container'>
                                <div className='order-row'>
                                    <span>Order ID: {order.ord_id}</span>
                                    <span>Date: {order.date_time.toLocaleDateString()}</span>
                                    <span>Customer ID: {order.cus_id}</span>
                                </div>

                                <div className='order-row'>
                                    <span>Customer: {order.name}</span>
                                    <span>Shipping Address: {formatAddress(order.shipping_address)}</span>
                                </div>

                                <div className='order-row'>
                                    <span>Email: {order.email}</span>
                                    <span>Tel.: {order.tel}</span>
                                </div>
                                
                                <OrderItem orderId={order.ord_id} />
                                <OrderStatusDropdown order={order} />
                            </div>
                        ))
                    }
                </div>
                : 
                <h1>You don't have permission for this page.</h1>
        }
        </ContentContainer>
    )
}