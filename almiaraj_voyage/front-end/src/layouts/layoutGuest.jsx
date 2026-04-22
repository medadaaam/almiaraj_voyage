import { Outlet, Link } from "react-router-dom";
import { Plane, Compass, Star } from "lucide-react";
import "./layoutGuest.css";

export default function LayoutGuest() {
  return (
    <div className="auth-split">
      {/* LEFT SIDE - Image with overlay */}
      <div className="auth-split-left">
        <div className="auth-split-left-content">
          {/* Logo in left side */}
          {/* <div className="auth-split-logo">
            <Link to="/">
              <img src="./images/logo.png" alt="Al Miaraj Voyages" />
            </Link>
          </div> */}
          <div className="auth-split-icons">
            <Plane className="auth-split-icon" />
            <Compass className="auth-split-icon" />
            <Star className="auth-split-icon" />
          </div>
          <h1 className="auth-split-title">Explorez le monde avec nous</h1>
          <p className="auth-split-subtitle">
            Voyages, Hajj & Omra, expériences inoubliables
          </p>
          <div className="auth-split-features">
            <span>✈️ Vols</span>
            <span>🏨 Hôtels</span>
            <span>🕋 Hajj & Omra</span>
            <span>🗺️ Circuits</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="auth-split-right">
        <div className="auth-split-form-container">
          {/* Pas de logo ici */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
