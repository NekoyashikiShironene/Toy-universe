import Image from "next/image";
import type { Product } from "@/types/products";
import "../styles/product_card.css";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
    return (
        <div key={product.prod_id} className="product-card">
            <Link href={`/detail?prod_id=${product.prod_id}`}>
                <Image src={"/products/" + product.prod_id + ".jpg"}
                    alt={product.prod_name}
                    width={300}
                    height={300}
                    className="product-img"
                />
                <p className="product-card-name">{product.prod_name}</p>
                <p className="product-card-price">{product.price} บาท</p>
            </Link>
        </div>
    )
}

export function ProductCards({ products }: { products: Product[] }) {
    return (
        <div className="product-cards">
            {
                products.map((item : Product) =>  (
                    <ProductCard product={item} key={item.prod_id} />
                ))
            }
        </div>
    )
}
