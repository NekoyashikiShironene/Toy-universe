import React from 'react';
import connectToDatabase from "@/utils/db";
import { ContentContainer } from '@/components/Containers';
import '@/styles/order.css';
import type { Order } from '@/types/order';
import { orderStatus } from '@/utils/statusId';
import { UserSession } from '@/types/session';
import { redirect } from "next/navigation";
import useSession from '@/utils/auth';
import { formatAddress } from '@/utils/address';
import OrderItem from '@/components/OrderItem';
import OrderManager from '@/components/OrderManager';
import StatusFilter from '@/components/OrderFilter';

import { unstable_cache } from 'next/cache';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

const getOrder = unstable_cache(
    async (statusFilter: string | string[] | undefined, user: UserSession) => {
        const connection = await connectToDatabase();
        const [ results ] = await connection.query(`SELECT DISTINCT order.ord_id, status_id, shipping_address, order.session_id, 
            order.session_url, date_time, order_item.cus_id, name, email, tel 
            FROM \`order\`
            JOIN order_item ON order.ord_id = order_item.ord_id 
            JOIN customer ON order_item.cus_id = customer.cus_id 
            WHERE order_item.cus_id = ? 
            ${statusFilter ? 'AND status_id = ?' : ''}
            ORDER BY order.ord_id DESC`,
            statusFilter ? [user.id, statusFilter] : [user.id]
        );

        const orders = results as Order[];
        return orders;
    },
    ["my-order"],
    { revalidate: 3600 }
)

export default async function Order({ searchParams }: Props) {
    const user = (await useSession())?.user as UserSession;
    const statusFilter = searchParams.status_id;

    if (!user)
        redirect("/login");
    
    const orders = await getOrder(statusFilter, user);
    
    return (
        <ContentContainer>
            <StatusFilter selectedStatus={statusFilter || ''} />
            <div className='order-list'>
            {
                orders?.map(order => (
                    <div key={order.ord_id} className='order-container'>
                        <div className='order-header'>
                            <span><b>Order ID:</b> {order.ord_id}</span>
                            <span><b>Status:</b> {orderStatus[order.status_id]}</span>
                            <span><b>Date:</b> {order.date_time.toString()}</span>
                        </div>

                        <div className='order-row'>
                            <span><b>Customer ID:</b> {order.cus_id}</span>
                            <span><b>Customer:</b> {order.name}</span>
                            <span><b>Shipping Address:</b> {formatAddress(order.shipping_address)}</span>
                            <span><b>Email:</b> {order.email}</span>
                            <span><b>Tel.:</b> {order.tel}</span>
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