import React from 'react'
import { ContentContainer } from '@/components/Containers';
import { ProductCards } from '@/components/ProductCard';
import  ProductFilter  from '@/components/ProductFilter';

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: Prop) {
    const query = searchParams.query as string | undefined;
    const category = searchParams.category as string | undefined;
    const brand = searchParams.brand as string | undefined;

    const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/products`);

    if (query)
        url.searchParams.set("query", query);

    if (category)
        url.searchParams.set("category", category);

    if (brand)
        url.searchParams.set("brand", brand);

    const res = await fetch(url.toString(), {cache: "no-store"});
    const products = await res.json();
    
    return (
        // $_GET["query"]
        <>  
            <ProductFilter/>
            <ProductCards products={products.data} />
        </>
    )
}