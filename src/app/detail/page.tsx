import React from 'react';
import Image from 'next/image';
import "../../styles/detail.css";
import ProductOrderControls from '@/components/ProductOrderControls';
import { ContentContainer } from '@/components/Containers';

type Prop = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductDetailPage({ searchParams }: Prop) {
  const productId = searchParams.prod_id as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/product?prod_ids=${productId}`);
  const data = (await res.json()).data;
  const product = data[0];

  return (
    <ContentContainer>
      <div className="product-detail">
        <div className="image-container">
          <Image
            src={`/products/${productId}.jpg`}
            alt={product.prod_name}
            width={300}
            height={300}
            className="product-image"
          />
        </div>
        <div className="details">
          <h1 className="product-name">{product.prod_name}</h1>
          <p className="product-price">Price: <span className="price">{product.price} ฿</span></p>
          <p className="product-description">Detail: <br />{product.description}</p>
          <p className="stock">Remaining: {product.remaining} pieces</p>
          <ProductOrderControls product={product} />
        </div>
      </div>
    </ContentContainer>
  );
}

