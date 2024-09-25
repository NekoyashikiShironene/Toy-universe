import styles from "./styles/search_bar.module.css";
import { FaSearch } from "react-icons/fa";

export default function Search() {
    // redirect to /product?query=
    return (
        <form action="/products" className={styles.searchbar}>
            <input name="query" className={styles.bar} placeholder="หาอะไร พ่อหนุ่ม" />
            <button type="submit" className={styles.btn}><FaSearch /></button>
        </form>
            
    )
}