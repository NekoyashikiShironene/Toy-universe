"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, brands } from "@/utils/array";


import "../styles/productFilter.css";
import { ProductParams } from "@/types/searchParams";

export default function ProductFilter({ params }: { params: ProductParams }) {
    const router = useRouter();
    const newParams = { ...params };
    const { maxPrice, category, brand } = newParams;

    const [maxPriceState, setMaxPriceState] = useState<number>(Number(maxPrice) || 20000);

    const redirect = (name: string, value: string, checked: boolean) => {
        const url = new URL(`${process.env.NEXT_PUBLIC_URL}/products`);
        if (typeof category === "string")
            url.searchParams.append("category", category);
        else
            category?.forEach(category => url.searchParams.append("category", category));

        if (typeof brand === "string")
            url.searchParams.append("brand", brand);
        else
            brand?.forEach(brand => url.searchParams.append("brand", brand));

        if (maxPrice)
            url.searchParams.set("maxPrice", maxPrice.toString());


        if (checked) {
            if (name === "maxPrice")
                url.searchParams.set(name, value);
            else
                url.searchParams.append(name, value);
        }
        else
            url.searchParams.delete(name, value);

        router.push(url.toString());
    }

    return (
        <>
            <div className="filter">

                <div className="product-filter">

                    <div className="product-filter-categorie">
                        {

                            categories.map((item: string) => (
                                <>
                                    <div className="each-filter-content">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => redirect("category", item, e.currentTarget.checked)}
                                            checked={category?.includes(item)}
                                        />
                                        <label>{item}</label>
                                    </div>
                                </>

                            ))
                        }
                    </div>

                    <div className="product-filter-brands">
                        {

                            brands.map((item: string) => (
                                <>
                                    <div className="each-filter-content">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => redirect("brand", item, e.currentTarget.checked)}
                                            checked={brand?.includes(item)}
                                        />
                                        <label>{item}</label>
                                    </div>
                                </>

                            ))
                        }
                    </div>

                    <label htmlFor="">filter by price</label>
                    <input
                        type="checkbox"
                        name="maxPrice"
                        id="maxPrice"
                        onChange={(e) => redirect("maxPrice", "25000", e.currentTarget.checked)}
                    />

                    {
                        maxPrice && (
                            <>
                                <input
                                    type="range"
                                    min={1000}
                                    max={25000}
                                    step={1000}
                                    value={maxPriceState}
                                    onMouseUp={e => redirect("maxPrice", e.currentTarget.value.toString(), true)}
                                    onChange={e => setMaxPriceState(Number(e.currentTarget.value))}
                                />
                                <label className="filter-price"> {maxPriceState} ฿</label>
                            </>
                        )
                    }

                </div>
            </div>
        </>
    );
}