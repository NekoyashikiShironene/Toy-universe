import Link from "next/link";
import { useState, useEffect } from "react";
import "../styles/mobile_menu.css";
import { LoginButton, LogoutButton } from "./SignButton";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";


const categories = ['Construction', 'Doll', 'Model', 'Board Game'];
const brands = ['LEGO', 'Mattel', 'American Girl', 'Disney', 'LOL Surprise', 'Hasbro', 'Bandai', 'Revell', 'Tamiya', 'Metal Earth', 'KOSMOS', 'Days of Wonder', 'Z-Man Games'];

type Props = {
    open: boolean, 
    setOpen: (x: boolean) => void
};

export default function MobileMenu({ open, setOpen }: Props) {
    const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    const [isBrandOpen, setIsBrandOpen] = useState<boolean>(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const closeElements = document.querySelectorAll(".click-to-close");
        closeElements.forEach(element => {
            const closeMenu = () => setOpen(false);
            element.addEventListener('click', closeMenu);
            return () => {
                element.removeEventListener('click', closeMenu);
            };
        });
    }, [setOpen]);

    return (
        <>
            <div className={"close-space click-to-close" + (open ? " visible" : "")}></div>
            <div className={"menu" + (open ? " visible" : "")}>
                <button className="close-btn click-to-close">
                    &times;
                </button>

                <ul className="menu2">
                    <li>
                        <h2><Link href="/" className="click-to-close">Home</Link></h2>
                    </li>
                    <li>
                        <h2 onClick={() => setIsCategoryOpen(!isCategoryOpen)}>Category</h2>
                        {isCategoryOpen && (
                            <ul>
                                {categories.map((item, index) => (
                                    <li key={index}>
                                        <Link href={`/products?category=${item}`} className="sublink click-to-close">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <li>
                        <h2 onClick={() => setIsBrandOpen(!isBrandOpen)}>Brand</h2>
                        {isBrandOpen && (
                            <ul>
                                {brands.map((item, index) => (
                                    <li key={index}>
                                        <Link href={`/products?brand=${item}`} className="sublink click-to-close">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    
                    {status === "authenticated" && (
                        <li>
                            <Link href="/cart" className="cart-icon">
                                <h2>Cart</h2>
                            </Link>
                        </li>
                    )}
                    
                    { session?.user?.role === "emp" &&
                        <li>
                            <Link href="/order-management" className="">
                                <h2>Orders</h2>
                            </Link>
                        </li>
                    }

                    { session?.user?.role === "emp" &&
                        <li>
                            <Link href="/edit-product" className="">
                                <h2>Edit Product</h2>
                            </Link>
                        </li>
                    }

                    { session?.user?.role === "cus" &&
                        <li>
                            <Link href="/order">
                                <h2>My Orders</h2>
                            </Link>
                        </li>
                    }  

                    <li>
                        <h2><Link href="/profile">My Account</Link></h2>
                    </li>

                    

                    {status === "authenticated" ? 
                        <li>
                            <Link href="/" onClick={() => signOut()} className='logout-button'><h2>Logout</h2></Link>
                        </li>
                        
                    : 
                        <li>
                            <Link href="/login" className='login-button'><h2>Login</h2></Link>
                        </li>
                    }

                </ul>
            </div>
        </>
    );
}
