import { ContentContainer } from "@/components/Containers"
import { ImCross } from "react-icons/im";
import "../../styles/payment-result.css";
import Link from "next/link";

export default function FailurePage() {
    
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
                        There's something wrong.. Pleast try again later.
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
