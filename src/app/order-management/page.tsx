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
import { redirect } from "next/navigation";
import StatusFilter from '@/components/OrderFilter';
import { unstable_cache } from 'next/cache';

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

type Props = {
    searchParams: { [key: string]: string | undefined }
}


const getOrder = unstable_cache(
    async (statusFilter: string | string[] | undefined) => { 
        const connection = await connectToDatabase();
        let orders;
        try {
            const [ results ] = await connection.query( `SELECT DISTINCT order.ord_id, status_id, shipping_address, date_time, order_item.cus_id, name, email, tel 
                                                        FROM \`order\` 
                                                        JOIN order_item ON \`order\`.ord_id = order_item.ord_id 
                                                        JOIN customer ON order_item.cus_id = customer.cus_id 
                                                        ${statusFilter ? 'WHERE status_id = ?' : ''}`, 
                                                        statusFilter ? [statusFilter] : []);
            orders = results as Order[];
            
        }   
        catch (e: unknown) {
            console.error(e);
        }
        
        return orders;
    },
    ["customer-order"],
    { revalidate: 3600 }
)


export default async function OrderManagement({ searchParams }: Props) {
    const user = (await useSession())?.user as UserSession;
    const statusFilter = searchParams.status_id;

    if (user?.role !== "emp")
        redirect("/");
    
    const orders = await getOrder(statusFilter);

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
                                    <span><b>Date:</b> {order.date_time.toString()}</span>
                                    
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