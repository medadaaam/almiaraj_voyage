import { NavLink, Outlet } from "react-router-dom";
import "./layout.css"

export default function Layout(){
    return (
        <>
        <header>
            <div>
                <a href="/"><img style={{height:"150px"}} src="./images/logo.png" alt="logo" /></a>
            </div>
            <div>
            <nav>
                <ul>
                    <li><NavLink to="/" className="aa">Home</NavLink></li>
                    <li><NavLink to="/services" className="aa">Services</NavLink></li>
                    <li><NavLink to="/about" className="aa">A propos</NavLink></li>
                    <li><NavLink to="/contact" className="aa">contact</NavLink></li>
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