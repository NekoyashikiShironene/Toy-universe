import { ContentContainer } from "@/components/Containers"
import { FaCheckCircle } from "react-icons/fa";
import "../../styles/payment-result.css";
import Link from "next/link";

import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";
import connectToDatabase from "@/utils/db";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2/promise";


type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SuccessfullPage({ searchParams }: Prop) {
    const user = (await useSession())?.user as UserSession;
    const { order_id } = searchParams;

    const connection = await connectToDatabase();

    // check whether order id is from user and order payment is successful
    const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM order_item \
        JOIN `order` ON `order`.ord_id = order_item.ord_id \
        WHERE order_item.ord_id = ? AND order_item.cus_id = ? AND `order`.status_id = 1",
        [order_id, user.id]
    );

    if (!results[0])
        redirect("/");

    // get total amount
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

    const total_amount = orderedItems.reduce((prev, current) =>
        prev + current.item_total,
        0);

    return (
        <ContentContainer>
            <div className="success-container">
                <div className="success-card">
                    <div className="success-icon">
                        <FaCheckCircle size={64} color="green" />
                    </div>

                    <h1 className="success-title">
                        Payment Successful!
                    </h1>

                    <p className="success-message">
                        Thank you for your payment. Your transaction has been completed successfully.
                    </p>

                    <div className="transaction-details">
                        <div className="transaction-row">
                            <span className="label">Order ID:</span>
                            <span className="value">{order_id}</span>
                        </div>
                        <div className="transaction-row">
                            <span className="label">Amount Paid:</span>
                            <span className="value">{Math.round(total_amount)}</span>
                        </div>
                    </div>

                    <div className="button-container">
                        <Link href="/order" className="primary-button">
                            View Order
                        </Link>
                        <Link href="/" className="secondary-button">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </ContentContainer>
    )
}
