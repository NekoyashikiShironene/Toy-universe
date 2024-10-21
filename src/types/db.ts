import { RowDataPacket } from "mysql2/promise";

export interface ICustomer extends RowDataPacket {
    cus_id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    tel?: string,
    address?: string,
}

export interface IUser extends RowDataPacket {
    id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    role?: string
}

