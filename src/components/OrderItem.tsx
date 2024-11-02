'use client';
import React from 'react';
import type { Order } from '@/types/order';
import { useState, useEffect } from 'react';
import type { OrderItem } from '@/types/order';

export default function OrderItem({orderId}: {orderId: string}) {
    const [ showItem, setShowItem ] = useState(false);
    const [ items, setItems] = useState<OrderItem[]>([]);
    
    const getOrderItem = async () => {
        const res = await fetch(`/api/order/orderitem?ord_id=${orderId}`);
        
        if (res.ok) {
            const data = (await res.json()).data;
            setItems(data);
        } 
        else {
            console.error("Failed to fetch order items.");
        }
    }

    useEffect(() => {
        if (showItem) {
            getOrderItem();
        }
    }, [showItem]);

    return (
        <>
            <div className='order-item-container'>
                <button onClick={() => setShowItem(!showItem)} className='show-button'>{showItem ? "Hide" : "Show"} Order Items</button>

                {showItem &&
                    <>
                        <h3>Order Items</h3>
                            <div className='order-item-header'>
                                <span>Product ID</span>
                                <span>Product Name</span>
                                <span>Quantity</span>
                            </div>
                            {items.map(item => (
                                <div className='order-item-list'>
                                    <span>{item.prod_id}</span>
                                    <span>{item.prod_name}</span>
                                    <span>{item.quantity}</span>
                                </div>
                            ))}
                    </>
                }
            </div>
        </>
    )
}