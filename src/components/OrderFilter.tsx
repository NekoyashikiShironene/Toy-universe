'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderStatus } from '@/utils/statusId';

export default function StatusFilter({ selectedStatus }: { selectedStatus: string}) {
    const router = useRouter();
    const [status, setStatus] = useState(selectedStatus);

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus);

        const url = new URL(window.location.href);
        const searchParams = url.searchParams;

        if (newStatus) {
            searchParams.set("status_id", newStatus);
        } 
        else {
            searchParams.delete("status_id");
        }

        router.push(`${url.pathname}?${searchParams.toString()}`);
    };

    return (
        <div className="status-filter">
            <label>Filter by Status: </label>
            <select id="status" value={status} onChange={handleStatusChange}>
                <option value="">All</option>
                <option value={0}>Pending Payment</option>
                <option value={1}>Payment Completed</option>  
                <option value={2}>Shipped</option>                       
                <option value={3}>Completed</option>
                <option value={4}>Cancelled</option>
            </select>
        </div>
    );
};

