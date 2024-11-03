"use client";

import { cancelOrder } from "@/actions/orderManager";
import { useRouter } from "next/navigation";

export default function OrderManager({ orderStatus, session_id, session_url }:
  {
    orderStatus: number,
    session_id: string,
    session_url: string
  }) {

    const router = useRouter();

    const handleCancelOrder = async (session_id: string) => {
      const cannel = confirm("Cancel this order?");

      if (!cannel)
        return;

      await cancelOrder(session_id);
    }
    if (orderStatus)
      return;

    return (
      <>
        <button onClick={() => router.push(session_url)}>
          Pay
        </button>
        <button onClick={() => handleCancelOrder(session_id)}>
          Cancel
        </button>
      </>
    )

}


