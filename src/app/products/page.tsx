import React from 'react'
import { ProductCards } from '@/components/ProductCard';
import  ProductFilter  from '@/components/ProductFilter';
import Pagination from '@/components/Pagination';

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: Prop) {
    const query = searchParams.query as string;
    const category = searchParams.category as string[] ?? [];
    const brand = searchParams.brand as string[] ?? [];
    const maxPrice = searchParams.maxPrice as string;
    const page = searchParams.page as string;

    const params = {
        query,
        category,
        brand,
        maxPrice: parseInt(maxPrice) || undefined,
        page: parseInt(page) || undefined
    }

    
    const per_page = 25;
    const url = new URL("/api/products", process.env.NEXT_PUBLIC_URL);

    if (query)
        url.searchParams.set("query", query);

    if (category.length > 0) {
        if (typeof category === "string")
            url.searchParams.append("category", category);
        else
            category.forEach(cat => url.searchParams.append("category", cat));
    }

    if (brand.length > 0) {
        if (typeof brand === "string")
            url.searchParams.append("brand", brand);
        else
            brand.forEach(br => url.searchParams.append("brand", br));
    }

    if (maxPrice)
        url.searchParams.set("maxPrice", maxPrice);
 
    url.searchParams.set("page", page ?? "1");
    
    url.searchParams.set("per_page", per_page.toString());
    const res = await fetch(url.toString());
    const products = (await res.json());
    const total_count = products.count;

    return (
        <>  
            <ProductFilter params={params} />
            <ProductCards products={products.data} />
            <Pagination params={params} per_page={per_page} total_count={total_count} />
        </>
    )
}