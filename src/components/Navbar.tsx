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

    return (
        <>
            <nav>
                <div>
                    <div className="burger" onClick={() => { setIsBurgerOpen(true) }}>
                        <div className="layer1"></div>
                        <div className="layer2"></div>
                        <div className="layer3"></div>
                    </div>

                    <div className="logo-search">
                        <h1>Toy Universe</h1>
                        <Search type="desktop" />
                    </div>

                    <div className="right-menu">
                        <Link href="/" className="desktop-menu">
                            Home
                        </Link>
                        <Link href="/products" className="desktop-menu">
                            Products
                        </Link>
                        <div className="dropdown">
                            <button className="dropdown-btn">Categories</button>
                            <div className="dropdown-content">
                                <div className="menu-category">
                                    <h2>Categories</h2>
                                    <ul>
                                        {
                                            categories.map(item => (
                                                <li key={item}>
                                                    <Link href={"/products?category=" + item} className="">
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="dropdown">
                            <button className="dropdown-btn">Brands</button>

                            <div className="dropdown-content">
                                <div className="menu-brand">
                                    <h2>Brands</h2>
                                    <ul>
                                        {
                                            brands.map((item, index) => (
                                                <li key={index}>
                                                    <Link href={"/products?brand=" + item} className="">
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
