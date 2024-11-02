import Stripe from "stripe";
import { redirect } from "next/navigation";

export default function OrderManager({ orderStatus, session_id, session_url }:
  {
    orderStatus: number,
    session_id: string,
    session_url: string
  }) {

  const handleCancelOrder = async (formData: FormData) => {
    "use server";
    const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "");
    await stripe.checkout.sessions.expire(session_id);
  }

  const handlePay = async (formData: FormData) => {
    "use server";
    redirect(session_url);
  }

  return (
    <>
      {
        !orderStatus &&
        <>
        <form action={handlePay}>
          <button type="submit">
            Pay
          </button>
        </form>
        <form action={handleCancelOrder}>
          <button type="submit">
            Cancel
          </button>
        </form>
        </>
      }

    </>

  )
}


