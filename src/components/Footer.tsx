import React from 'react';
import '../styles/footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 Toy Universe Shop. All rights reserved.</p>
                <ul className="footer-links">
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
            </div>
        </footer>
    );
}
