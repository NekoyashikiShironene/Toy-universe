import React from 'react';
import connectToDatabase from "@/utils/db";
import { ContentContainer } from '@/components/Containers';
import '@/styles/order.css';
import type { Order } from '@/types/order';
import type { Address } from '@/types/address';
import { orderStatus } from '@/utils/statusId';
import OrderStatusDropdown from '@/components/OrderStatusDropdown';
import { UserSession } from '@/types/session';
import { redirect } from "next/navigation";
import useSession from '@/utils/auth';
import { formatAddress } from '@/utils/address';
import OrderItem from '@/components/OrderItem';
import OrderManager from '@/components/OrderManager';

export default async function Order() {
    const user = (await useSession())?.user as UserSession;

    if (!user)
        redirect("/login");
    
    const connection = await connectToDatabase();

    const [ results ] = await connection.query(
        "SELECT DISTINCT status_id, `order`.ord_id, status_id, shipping_address, `order`.session_id, `order`.session_url, \
        date_time, order_item.cus_id, name, email, tel \
        FROM `order` JOIN order_item ON `order`.ord_id = order_item.ord_id \
        JOIN customer ON order_item.cus_id = customer.cus_id WHERE order_item.cus_id = ? \
        ORDER BY order.ord_id DESC", 
        [user.id]
    );

    const orders = results as Order[];

    console.log(results);
    
    return (
        <ContentContainer>

            <div className='order-item-container'>
            
                {
                    orders?.map(order => (
                        <div key={order.ord_id} className='order-container'>
                            <div className='order-row'>
                                <span>Order ID: {order.ord_id}</span>
                                <span>Status: {orderStatus[order.status_id]}</span>
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
                            <OrderManager orderStatus={order.status_id} session_id={order.session_id} session_url={order.session_url} />
                        </div>
                    ))
                }
            </div>

        </ContentContainer>
    )
}