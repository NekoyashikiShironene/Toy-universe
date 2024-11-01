"use client";
import { Product, TCartItem } from "@/types/products";
import { UserSession } from "@/types/session";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

type TCustomerContext = {
    cartItems: TCartItem[],
    setCartItems: React.Dispatch<React.SetStateAction<TCartItem[]>>,
    totalPrice: number,
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>
}

const CustomerContext = createContext<TCustomerContext | undefined>(undefined);

export default function CustomerProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status, update } = useSession();
    const cartItemsSession = (session?.user as UserSession)?.cart;
    
    const [cartItems, setCartItems] = useState<TCartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        async function fetchProducts() {
          if (!cartItemsSession?.length || status !== 'authenticated' || cartItems.length)
            return;
    
          const cartItemIds = cartItemsSession.map(item => item.id.toString()).join(",");
          const res = await fetch("api/product?prod_ids=" + cartItemIds);
          const datas = (await res.json()).data ?? [];
    
          setCartItems(datas.map((data: Product) => {
            const quantity = cartItemsSession.find(item => item.id === data.prod_id)?.quantity
            return {
              ...data,
              checked: false,
              quantity
            }
          }));
        }
        fetchProducts();
    
      }, [cartItems.length, cartItemsSession, setCartItems, status]);

    useEffect(() => {
        const totalPrice = cartItems.reduce((sum, item) =>
            sum + (item.checked ? item.price * item.quantity : 0)
            , 0);
        setTotalPrice(totalPrice);
    }, [cartItems, setTotalPrice]);

    

    return (
        <CustomerContext.Provider
            value={{
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice
            }}
        >
            {children}
        </CustomerContext.Provider>
    )
}

export function useCustomer() {
    const context = useContext(CustomerContext);
    if (!context)
        throw new Error("useCustomer must be used within a CustomerProvider");

    return context;
}