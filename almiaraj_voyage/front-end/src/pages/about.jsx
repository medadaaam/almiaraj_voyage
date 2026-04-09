import "./about.css";

export default function About() {
    return (
        <div className="about-container">

            <h1>À propos de notre agence</h1>

            <p>
                Bienvenue chez <strong>AL MIARAJ VOYAGES</strong>, votre partenaire de confiance pour tous vos voyages.
                Nous vous proposons des services variés : réservation d’hôtels, organisation de voyages,
                billetterie et Omra & Hajj.
            </p>

            <div className="about-section">
                <h2>Notre mission</h2>
                <p>
                    Offrir à nos clients des expériences de voyage uniques, au meilleur prix,
                    avec un service de qualité et un accompagnement personnalisé.
                </p>
            </div>

            <div className="about-section">
                <h2>Pourquoi nous choisir ?</h2>
                <ul>
                    <li>✔️ Service rapide et fiable</li>
                    <li>✔️ Prix compétitifs</li>
                    <li>✔️ Support client 24/7</li>
                    <li>✔️ Large choix de destinations</li>
                </ul>
            </div>

            <div className="about-section">
                <h2>Nos services</h2>
                <ul>
                    <li>✈️ Réservation de billets</li>
                    <li>🏨 Réservation d’hôtels</li>
                    <li>🕋 Organisation Hajj & Omra</li>
                    <li>🌍 Voyages organisés</li>
                </ul>
            </div>

        </div>
    );
}