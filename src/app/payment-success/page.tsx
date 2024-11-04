import { ContentContainer } from "@/components/Containers"
import { FaCheckCircle } from "react-icons/fa";
import "../../styles/payment-result.css";
import Link from "next/link";

import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";
import { notFound } from "next/navigation";
import { getOrderItems, verifyUserOrder } from "@/db/order";


type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SuccessfullPage({ searchParams }: Prop) {
    const user = (await useSession())?.user as UserSession;
    const { order_id } = searchParams;


    // check whether order id is from user and order payment is successful
    const results = await verifyUserOrder(Number(order_id), user.id, 1);

    if (!results[0])
        notFound();

    // get total amount
    const orderedItems = await getOrderItems(Number(order_id));
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
