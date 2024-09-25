import Link from "next/link";
import { useState } from "react";

import styles from "./styles/mobile_menu.module.css";

const categories = ['Construction', 'Doll', 'Model', 'Board Game'];
const brands = ['LEGO', 'Mattel', 'American Girl', 'Disney', 'LOL Surprise', 'Hasbro', 'Bandai', 'Revell', 'Tamiya', 'Metal Earth', 'KOSMOS', 'Days of Wonder', 'Z-Man Games'];


export default function MobileMenu() {
    const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    const [isBrandOpen, setIsBrandOpen] = useState<boolean>(false);

    return (
        <div className={styles.menu}>
            <ul className={styles.menu2}>
                <li>
                    <h2><Link href="/" className={styles.link}>Home</Link></h2>
                </li>
                <li>
                    <h2 onClick={() => setIsCategoryOpen(!isCategoryOpen)}>Category</h2>
                    <ul className={styles.ul}>
                        {
                            isCategoryOpen &&
                                categories.map((item, index) => (
                                    <li key={index}>
                                        <Link href={"/products?category=" + item} className={styles.link}>
                                            {item}
                                        </Link>
                                    </li>
                                ))
                        }

                    </ul>
                </li>
                <li>
                    <h2 onClick={() => setIsBrandOpen(!isBrandOpen)}>Brand</h2>
                    <ul className={styles.ul}>
                        {   
                            isBrandOpen &&
                            brands.map((item, index) => (
                                <li key={index}>
                                    <Link className={styles.link} href={"/products?brand=" + item}>
                                        {item}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </li>
                <li>
                    <h2><Link className={styles.link} href="/myaccount">My account</Link></h2>
                </li>
                
            </ul>
        </div>
    )
}
