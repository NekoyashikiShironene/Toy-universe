'use client';
import React from 'react';
import type { Order } from '@/types/order';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderStatusDropdown({ order }: { order: Order }) {
    const [ status, setStatus ] = useState(order.status_id);

    const router = useRouter();

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(parseInt(event.target.value));
    }

    const updateStatus = async () => {
        try {
            const res = await fetch('/api/order/updatestatus', {
                method: 'POST',
                body: JSON.stringify({ ord_id: order.ord_id, status_id: status }),
            });
            
            if (res.ok) {
                alert("Status updated successfully");
                router.refresh();
            } 
            else {
                alert("Failed to update status");
            }

        } catch (error) {
            console.error("Failed to update status");
        }
    }

    return (
        <>
            <select value={status} onChange={handleStatusChange}>
                <option value={0}>Pending Payment</option>
                <option value={1}>Payment Completed</option>  
                <option value={2}>Shipped</option>                       
                <option value={3}>Completed</option>
                <option value={4}>Cancelled</option>
            </select>

            <button onClick={updateStatus} className='confirm-button'>Confirm</button>
       </>
    )
}