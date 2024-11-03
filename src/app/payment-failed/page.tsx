import { ContentContainer } from "@/components/Containers"
import { ImCross } from "react-icons/im";
import "../../styles/payment-result.css";
import Link from "next/link";
import connectToDatabase from "@/utils/db";
import { RowDataPacket } from "mysql2/promise";
import { notFound } from "next/navigation";
import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function FailurePage({ searchParams }: Prop) {
    const user = (await useSession())?.user as UserSession;
    const { order_id } = searchParams;
    const connection = await connectToDatabase();

    // check whether order id is from user and order payment is successful
    const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM order_item \
        JOIN `order` ON `order`.ord_id = order_item.ord_id \
        WHERE order_item.ord_id = ? AND order_item.cus_id = ? AND `order`.status_id = 0",
        [order_id, user.id]
    );

    if (!results[0])
        notFound();


    return (
        <ContentContainer>
            <div className="success-container">
                <div className="success-card">
                    <div className="success-icon">
                        <ImCross size={64} color="red" />
                    </div>

                    <h1 className="success-title">
                        Payment Failed!
                    </h1>

                    <p className="success-message">
                        There&apos;s something wrong.. Pleast try again later.
                    </p>


                    <div className="button-container">
                        <Link href="/" className="secondary-button">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </ContentContainer>
    )
}
