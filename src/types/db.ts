import { RowDataPacket } from "mysql2/promise";
import { type Address } from "./address";

export type OptionalValue = number | string;

export type ICustomer = RowDataPacket & {
    cus_id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    tel?: string,
    address?: string,
    address_json: Address
}

export type IUser = RowDataPacket & {
    id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    tel?: string,
    role?: string
}

export type OrderItemQuery = RowDataPacket & {
    item_id: number,
    ord_id: number,
    cus_id: number,
    prod_id: number,
    quantity: number
}
