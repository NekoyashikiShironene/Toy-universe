"use client";
import { Product, TCartItem } from "@/types/products";
import { UserSession } from "@/types/session";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

type TCustomerContext = {
    cartItems: TCartItem[],
    setCartItems: React.Dispatch<React.SetStateAction<TCartItem[]>>,
    totalPrice: number,
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>,
    newUser: boolean
}

const CustomerContext = createContext<TCustomerContext | undefined>(undefined);

export default function CustomerProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const cartItemsSession = (session?.user as UserSession)?.cart;

    const [newUser, setNewuser] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<TCartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        async function fetchProducts() {
          if (!cartItemsSession?.length || status !== 'authenticated')
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

        async function fetchNewUser() {
            if (status !== 'authenticated')
                return;
            const res = await fetch("api/validate/new-user");
            const data = (await res.json()).data;
            if (data)
                setNewuser(true);
        }
        fetchProducts();
        fetchNewUser();
      }, [status]);

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
                setTotalPrice,
                newUser
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