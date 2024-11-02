import { Address } from '@/types/address';

export type Order = {
    ord_id: string,
    status_id: number,
    shipping_address: Address,
    date_time: Date,
    cus_id: string,
    name: string,
    email: string,
    tel: string,
    session_id: string,
    session_url: string
}

export type OrderItem = {
    item_id: number,
    prod_id: string,
    prod_name: string,
    quantity: number
}