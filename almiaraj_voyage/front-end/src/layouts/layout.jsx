import { NavLink, Outlet } from "react-router-dom";
import "./layout.css"

export default function Layout() {
    return (
        <>
            <header>
                <div>
                    <a href="/"><img src="./images/logo.png" alt="logo" /></a>
                </div>
                <div>
                    <nav>
                        <ul>
                            <li><NavLink to="/" className="aa">Home</NavLink></li>
                            <li><NavLink to="/services" className="aa">Services</NavLink></li>
                            <li><NavLink to="/about" className="aa">A propos</NavLink></li>
                            <li><NavLink to="/contact" className="aa">contact</NavLink></li>
                            <li>
                                <select className="lang-select">
                                    <option value="ar">العربية</option>
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <nav>
                        <ul>
                            <li><NavLink to="/register" className="aa">S'inscrire</NavLink></li>
                            <li><NavLink to="/login" className="aa">Se connecter</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}