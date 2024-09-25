"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Search from "./SearchBar";
import MobileMenu from "./MobileMenu";

import styles from "./styles/mobile_menu.module.css";

import { FaBeer } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

// ['LEGO', 'Mattel', 'American Girl', 'Disney', 'LOL Surprise', 'Hasbro', 'Bandai', 'Revell', 'Tamiya', 'Metal Earth', 'KOSMOS', 'Days of Wonder', 'Z-Man Games']

/* <li>Construction</li>
                <li>Doll</li>
                <li>Model</li>
                <li>Board Game</li> */

export default function Navbar() {
    const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);

    return (
        <>
            <nav>
                <div>
                    <div onClick={() => { setIsBurgerOpen(!isBurgerOpen) }}>
                            <div className={isBurgerOpen ? styles.layer1close : styles.layer1}></div>
                            <div className={isBurgerOpen ? styles.layer2close : styles.layer2}></div>
                            <div className={isBurgerOpen ? styles.layer3close : styles.layer3}></div>
                    </div>

                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={500}
                        height={500}
                        className="logo"
                    />
                    

                    <div>
                        <Link href="/">
                            <FaShoppingCart size={35} color={'black'}/>
                        </Link>
                    </div>

                </div>


                <Search />

            </nav>
            {
                isBurgerOpen && <MobileMenu />
            }
        </>
    )
}
