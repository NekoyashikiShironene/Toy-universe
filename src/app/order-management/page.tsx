import React from 'react';
import { ContentContainer } from '@/components/Containers';
import '@/styles/order-management.css';
import { formatAddress } from '@/utils/address';
import { orderStatus } from '@/utils/statusId';
import OrderStatusDropdown from '@/components/OrderStatusDropdown';
import TimeDisplay from '@/components/LocaleDateTime';
import OrderItem from '@/components/OrderItem';
import useSession from '@/utils/auth';
import { UserSession } from '@/types/session';
import { redirect } from "next/navigation";
import StatusFilter from '@/components/OrderFilter';

import { getAllOrder } from '@/db/order';


type Props = {
    searchParams: { [key: string]: string | undefined }
}


export default async function OrderManagement({ searchParams }: Props) {
    const user = (await useSession())?.user as UserSession;
    const statusFilter = searchParams.status_id;

    if (user?.role !== "emp")
        redirect("/");
    
    const orders = await getAllOrder(statusFilter);

    return (
        <ContentContainer>
            { user.role === 'emp' ?
                <>
                <StatusFilter selectedStatus={statusFilter || ''} />
                <div className='order-list'>
                    {
                        orders?.map(order => (
                            <div key={order.ord_id} className='order-container'>
                                <div className='order-header'>
                                    <span><b>Order ID:</b> {order.ord_id}</span>
                                    <span><b>Date:</b> <TimeDisplay utcTime={order.date_time.toString()} mode="dt" /></span>
                                    
                                    <span><b>Status:</b> {orderStatus[order.status_id]}</span>
                                </div>

                                <div className='order-row'>
                                    <span><b>Customer ID:</b> {order.cus_id}</span>
                                    <span><b>Customer:</b> {order.name}</span>
                                    <span><b>Shipping Address:</b> {formatAddress(order.shipping_address)}</span>
                                    <span><b>Email:</b> {order.email}</span>
                                    <span><b>Tel.:</b> {order.tel}</span>
                                </div>

                                <OrderItem orderId={order.ord_id} />
                                <OrderStatusDropdown order={order} />
                            </div>
                        ))
                    }
                    </div>
                </>
                : 
                <h1>You don&apos;t have permission for this page.</h1>
            
        }
        </ContentContainer>
    )
}