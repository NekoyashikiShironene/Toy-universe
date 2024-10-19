import "../styles/search_bar.css";
import { FaSearch } from "react-icons/fa";

export default function Search({ type }: { type: "desktop" | "mobile" }) {
    // redirect to /product?query=
    return (
        <form action="/products" className={type + "-searchbar"}>
            <input name="query" className={type + "-bar"} placeholder="หาอะไร พ่อหนุ่ม" />
            <button type="submit" className={type + "-search-btn"}><FaSearch color="#181823" /></button>
            
        </form>
            
    )
}