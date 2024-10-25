import ImageSlider from "@/components/ImageSlider";
import Search from "@/components/SearchBar";
//import { ScreenContainer } from "@/components/Containers";
import "../styles/home.css";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/products";
import "../styles/product_card.css";


export default async function Home() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products?brand=LEGO`);
  const data = (await res.json()).data;
  // const product = data[1];
  

  return (
    <>
      <Search type="mobile" />
      <ImageSlider/>
      

      <div className="show-product-home">
        <Link href={`/products?brand=LEGO`}>
          <div className="topic-product">LEGO</div>
        </Link>
        
        <div className="product-cards">
          {
            data.map((product:Product) => (
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

            ))
          }
        </div>
      </div>
    </>

    
  );
}
