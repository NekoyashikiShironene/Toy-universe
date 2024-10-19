"use client";

import { useState } from "react";
import Link from "next/link";
import Search from "./SearchBar";
import MobileMenu from "./MobileMenu";
import "../styles/mobile_menu.css";
import { LoginButton, LogoutButton } from "./SignButton";

import { FaShoppingCart } from "react-icons/fa";
import { useSession } from "next-auth/react";

const categories = ['Construction', 'Doll', 'Model', 'Board Game'];
const brands = ['LEGO', 'Mattel', 'American Girl', 'Disney', 'LOL Surprise', 'Hasbro', 'Bandai', 'Revell', 'Tamiya', 'Metal Earth', 'KOSMOS', 'Days of Wonder', 'Z-Man Games'];

export default function Navbar() {
    const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);
    const { data: session } = useSession();

    if (typeof window !== undefined) {
        let prevScrollpos = window.scrollY;
        window.onscroll = function () {
            const currentScrollPos = window.scrollY;
            if (prevScrollpos > currentScrollPos) {
               document.querySelector("nav")?.classList.remove("invisible");
            } else {
                document.querySelector("nav")?.classList.add("invisible");
            }
            prevScrollpos = currentScrollPos;
        }

    }

    
    return (
        <>
            <nav className="visible">
                <div>
                    <div className="burger" onClick={() => setIsBurgerOpen(true)}>
                        <div className="layer1"></div>
                        <div className="layer2"></div>
                        <div className="layer3"></div>
                    </div>

                    <div className="logo-search">
                        <h1 className="logo">Toy Universe</h1>
                        <Search type="desktop" />
                    </div>

                    <div className="right-menu">
                        <Link href="/" className="desktop-menu">
                            Home
                        </Link>
                        <Link href="/products" className="desktop-menu">
                            Products
                        </Link>
                        <div className="nav-dropdown">
                            <button className="nav-dropdown-btn">Categories</button>
                            <div className="nav-dropdown-content">
                                <div className="menu-category">
                                    <h2>Categories</h2>
                                    <ul>
                                        {
                                            categories.map(item => (
                                                <li key={item} className="nav-dropdown-link">
                                                    <Link href={"/products?category=" + item} >
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="nav-dropdown">
                            <button className="nav-dropdown-btn">Brands</button>

                            <div className="nav-dropdown-content">
                                <div className="menu-brand">
                                    <h2>Brands</h2>
                                    <ul>
                                        {
                                            brands.map((item, index) => (
                                                <li key={index} className="nav-dropdown-link">
                                                    <Link href={"/products?brand=" + item}>
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {
                            session?.user ? (
                                <>
                                    <Link href="/cart" className="cart">
                                        <FaShoppingCart size={35} color={'#C0EEF2'} />
                                    </Link>
                                    Profile
                                    <LogoutButton />
                                </>
                            ) : (
                                <LoginButton />
                            )


                        }
                    </div>

                </div>

            </nav>

            <MobileMenu open={isBurgerOpen} setOpen={setIsBurgerOpen} />
        </>
    )
}
