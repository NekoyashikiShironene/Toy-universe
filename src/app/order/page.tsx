import React from 'react';
import { ContentContainer } from '@/components/Containers';
import type { Order } from '@/types/order';
import { orderStatus } from '@/utils/statusId';
import { UserSession } from '@/types/session';
import useSession from '@/utils/auth';
import { formatAddress } from '@/utils/address';
import OrderItem from '@/components/OrderItem';
import OrderManager from '@/components/OrderManager';
import StatusFilter from '@/components/OrderFilter';
import TimeDisplay from '@/components/LocaleDateTime';
import { getUserOrder } from '@/db/order';

import '@/styles/order.css';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}


export default async function Order({ searchParams }: Props) {
    const user = (await useSession())?.user as UserSession;
    const statusFilter = searchParams.status_id as string;
    const orders = await getUserOrder(statusFilter, user);

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
                            <span><b>Date:</b> <TimeDisplay utcTime={order.date_time.toString()} mode="dt" /> </span>
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