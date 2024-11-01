import React from 'react'
import { ContentContainer } from '@/components/Containers';
import { ProductCards } from '@/components/ProductCard';
import  ProductFilter  from '@/components/ProductFilter';

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: Prop) {
    const query = searchParams.query ?? "" as string;
    const category = searchParams.category ?? [] as string[];
    const brand = searchParams.brand ?? [] as string[];
    const maxPrice = searchParams.maxPrice as string;

    const url = new URL(`${process.env.NEXT_PUBLIC_URL}/api/products`);

    if (query) {
        url.searchParams.set("query", query);
    }

    // Set multiple category values if present
    if (category.length > 0) {
        if (typeof category === "string")
            url.searchParams.append("category", category);
        else
            category.forEach(cat => url.searchParams.append("category", cat));
    }

    // Set multiple brand values if present
    if (brand.length > 0) {
        if (typeof brand === "string")
            url.searchParams.append("brand", brand);
        else
            brand.forEach(br => url.searchParams.append("brand", br));
    }

    // Add maxPrice if it exists
    if (maxPrice) {
        url.searchParams.set("maxPrice", maxPrice);
    }


        const res = await fetch(url.toString(), { cache: "no-store" });
        


        const products = await res.json();

    
    

    return (
        // $_GET["query"]
        <>  
            <ProductFilter category={category} brand={brand} maxPrice={maxPrice} />
            <ProductCards products={products.data} />
        </>
    )
}