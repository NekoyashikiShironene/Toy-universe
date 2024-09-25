import React from 'react'

type Prop = {
    searchParams: { [key: string]: string | string[] | undefined }
}


export default function productsPage({ searchParams }: Prop) {
    const query = searchParams.query;
    const category = searchParams.category;
    console.log(searchParams);
    
    return (
        // $_GET["query"]
        <div>{ category }</div>
    )
}