import { RowDataPacket } from "mysql2/promise";

export interface ICustomer extends RowDataPacket {
    cus_id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    tel?: string,
    address?: string,
    gender?: number
}