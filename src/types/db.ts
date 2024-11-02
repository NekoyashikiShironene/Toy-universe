import { RowDataPacket } from "mysql2/promise";
import { type Address } from "./address";

export interface ICustomer extends RowDataPacket {
    cus_id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    tel?: string,
    address?: string,
    address_json: Address
}

export interface IUser extends RowDataPacket {
    id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    tel?: string,
    role?: string
}

