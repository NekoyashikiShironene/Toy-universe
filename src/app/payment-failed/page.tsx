import { ContentContainer } from "@/components/Containers"
import { ImCross } from "react-icons/im";
import "../../styles/payment-result.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import useSession from "@/utils/auth";
import { UserSession } from "@/types/session";
import { verifyUserOrder } from "@/db/order";

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function FailurePage({ searchParams }: Prop) {
    const user = (await useSession())?.user as UserSession;
    const { order_id } = searchParams;

    // check whether order id is from user and order payment is failure
    const results = await verifyUserOrder(Number(order_id), user.id, 0);

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
