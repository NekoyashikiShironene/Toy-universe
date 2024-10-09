import React from 'react'
import Image from 'next/image';
import type { Product } from '@/types/products';
import { ProductCards } from '@/components/ProductCard';

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}



export default async function productsPage({ searchParams }: Prop) {
    const query = searchParams.query as string;
    const category = searchParams.category as string;
    const brand = searchParams.brand as string;

    
    const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/products`);

    if (query)
        url.searchParams.set("query", query);

    if (category)
        url.searchParams.set("category", category);

    if (brand)
        url.searchParams.set("brand", brand);

    const res = await fetch(url.toString());
    const products = await res.json();
    
    return (
        // $_GET["query"]
        <>
            <ProductCards products={products.data} />
        </>
    )
}