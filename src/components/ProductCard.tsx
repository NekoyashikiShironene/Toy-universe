import Image from "next/image";
import type { Product } from "@/types/products";
import "../styles/productCard.css";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
    return (
        <div key={product.prod_id} className='product'>
            <Link href={`/product?prod_id=${product.prod_id}`}>
                <Image src={"/products/" + product.prod_id + ".jpg"}
                    alt={product.prod_name}
                    width={300}
                    height={300}
                />
                <p className="prod-name">{product.prod_name}</p>
                <p className="prod-price">{product.price} บาท</p>
            </Link>
        </div>
    )
}

export function ProductCards({ products }: { products: Product[] }) {
    return (
        <div className="products">
            {
                products.map((item : Product) =>  (
                    <ProductCard product={item} key={item.prod_id} />
                ))
            }
        </div>
    )
}
