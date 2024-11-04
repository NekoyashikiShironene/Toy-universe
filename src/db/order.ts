import { Order } from "@/types/order";
import { UserSession } from "@/types/session";
import connectToDatabase from "@/utils/db";
import { RowDataPacket } from "mysql2";
import { unstable_cache } from "next/cache";
import { type OptionalValue } from "@/types/db";

export const getUserOrder = unstable_cache(
    async (statusFilter: string | string[] | undefined, user: UserSession) => {
        const connection = await connectToDatabase();
        const [ results ] = await connection.query(`SELECT DISTINCT order.ord_id, status_id, shipping_address, order.session_id, 
            order.session_url, date_time, order_item.cus_id, name, email, tel 
            FROM \`order\`
            JOIN order_item ON order.ord_id = order_item.ord_id 
            JOIN customer ON order_item.cus_id = customer.cus_id 
            WHERE order_item.cus_id = ? 
            ${statusFilter ? 'AND status_id = ?' : ''}
            ORDER BY order.ord_id DESC`,
            statusFilter ? [user.id, statusFilter] : [user.id]
        );

        const orders = results as Order[];
        return orders;
    },
    ["userOrder"],
    { 
        revalidate: 3600, 
        tags: ["userOrder"]
    }
)

export const getAllOrder = unstable_cache(
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
    ["allOrder"],
    { 
        revalidate: 3600, 
        tags: ["allOrder"] 
    }
)


export const getOrderItems = async (order_id: OptionalValue) => {
    const connection = await connectToDatabase();
    const [orderedItems] = await connection.query<RowDataPacket[]>(
        `SELECT 
            order_item.quantity,
            product.prod_id,
            product.prod_name AS product_name,
            product.price,
            COALESCE(promotion.discount, 0) AS discount,
            (order_item.quantity * product.price * (1 - COALESCE(promotion.discount, 0))) AS item_total
         FROM order_item
         JOIN product ON order_item.prod_id = product.prod_id
         LEFT JOIN applying ON order_item.ord_id = applying.ord_id
         LEFT JOIN promotion ON applying.promo_id = promotion.promo_id
         WHERE order_item.ord_id = ?`,
        [order_id]
    );

    return orderedItems;
}


export const verifyUserOrder = async (order_id: OptionalValue, user_id: OptionalValue, status_id: OptionalValue) => {
    const connection = await connectToDatabase();
    const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM order_item \
        JOIN `order` ON `order`.ord_id = order_item.ord_id \
        WHERE order_item.ord_id = ? AND order_item.cus_id = ? AND `order`.status_id = ?",
        [order_id, user_id, status_id]
    );

    return results;
}
