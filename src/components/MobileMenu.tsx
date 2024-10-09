import Link from "next/link";
import { useState } from "react";

import "../styles/mobile_menu.css";

const categories = ['Construction', 'Doll', 'Model', 'Board Game'];
const brands = ['LEGO', 'Mattel', 'American Girl', 'Disney', 'LOL Surprise', 'Hasbro', 'Bandai', 'Revell', 'Tamiya', 'Metal Earth', 'KOSMOS', 'Days of Wonder', 'Z-Man Games'];


type Props = {
    open: boolean, 
    setOpen: (x: boolean) => void
};

export default function MobileMenu({ open, setOpen }: Props) {
    const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    const [isBrandOpen, setIsBrandOpen] = useState<boolean>(false);


    const closeElements = document.querySelectorAll(".click-to-close");
    closeElements.forEach(element => {
        element.addEventListener('click', () => setOpen(false));
    });

    return (
        <>
            <div className={"close-space click-to-close" + (open ?  " visible" : "")}></div>
            <div className={"menu" + (open ?  " visible" : "")}>
                <button className="close-btn click-to-close">
                    &times;
                </button>

                <ul className="menu2">
                    <li>
                        <h2><Link href="/" className="click-to-close">Home</Link></h2>
                    </li>
                    <li>
                        <h2 onClick={() => setIsCategoryOpen(!isCategoryOpen)}>Category</h2>
                        <ul>
                            {
                                isCategoryOpen &&
                                    categories.map((item, index) => (
                                        <li key={index}>
                                            <Link href={"/products?category=" + item} className="sublink click-to-close">
                                                {item}
                                            </Link>
                                        </li>
                                    ))
                            }

                        </ul>
                    </li>
                    <li>
                        <h2 onClick={() => setIsBrandOpen(!isBrandOpen)}>Brand</h2>
                        <ul>
                            {   
                                isBrandOpen &&
                                brands.map((item, index) => (
                                    <li key={index}>
                                        <Link href={"/products?brand=" + item} className="sublink click-to-close">
                                            {item}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </li>
                    <li>
                        <h2><Link href="/myaccount">My account</Link></h2>
                    </li>
                    
                </ul>
            </div>
        </>
    )
}
