// src/pages/PrivacyPolicy.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Eye,
  Database,
  Lock,
  Cookie,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  Globe,
  Users,
  CreditCard,
  Clock,
  AlertCircle,
  ArrowLeft,
  Printer,
  Download,
  Share2,
} from "lucide-react";
import "./privacyPolicy.css";

export default function PrivacyPolicy() {
  const [lastUpdated] = useState("15 Avril 2026");
  const [printMode, setPrintMode] = useState(false);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  const sections = [
    {
      id: "collecte",
      icon: <Database size={22} />,
      title: "1. Collecte des informations",
      content: `Nous collectons les informations que vous nous fournissez directement, notamment :
        • Informations d'identification : nom, prénom, date de naissance
        • Coordonnées : adresse email, numéro de téléphone, adresse postale
        • Documents d'identité : CIN, passeport (pour les voyages internationaux)
        • Informations de paiement : détails de carte bancaire (cryptées)
        • Préférences de voyage : destinations, hébergements, services souhaités
        • Historique de réservation : vos réservations passées et futures`
    },
    {
      id: "utilisation",
      icon: <Eye size={22} />,
      title: "2. Utilisation des informations",
      content: `Vos informations sont utilisées pour :
        • Traiter vos réservations de voyages, billets d'avion et hébergements
        • Personnaliser votre expérience sur notre plateforme
        • Vous envoyer des confirmations et mises à jour de réservation
        • Répondre à vos questions et demandes de support
        • Vous informer des offres spéciales et promotions (avec votre consentement)
        • Améliorer nos services et la sécurité de notre plateforme`
    },
    {
      id: "partage",
      icon: <Users size={22} />,
      title: "3. Partage des informations",
      content: `Nous partageons vos informations uniquement dans les cas suivants :
        • Avec les prestataires de services (compagnies aériennes, hôtels, agences partenaires)
        • Pour respecter nos obligations légales et réglementaires
        • Pour protéger nos droits et notre propriété
        • Avec votre consentement explicite
        Nous ne vendons jamais vos données personnelles à des tiers.`
    },
    {
      id: "securite",
      icon: <Lock size={22} />,
      title: "4. Sécurité des données",
      content: `Nous mettons en œuvre des mesures de sécurité avancées :
        • Cryptage SSL/TLS pour toutes les transmissions de données
        • Stockage sécurisé des informations sensibles
        • Authentification à deux facteurs pour l'accès administrateur
        • Surveillance continue des accès non autorisés
        • Sauvegardes régulières et chiffrées`
    },
    {
      id: "cookies",
      icon: <Cookie size={22} />,
      title: "5. Cookies et technologies similaires",
      content: `Notre site utilise des cookies pour :
        • Mémoriser vos préférences de navigation
        • Analyser le trafic et améliorer nos services
        • Proposer des offres personnalisées
        • Faciliter les processus de réservation
        Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.`
    },
    {
      id: "droits",
      icon: <Shield size={22} />,
      title: "6. Vos droits",
      content: `Conformément à la loi 09-08 sur la protection des données personnelles, vous disposez des droits suivants :
        • Droit d'accès : consulter vos données personnelles
        • Droit de rectification : modifier vos informations inexactes
        • Droit à l'effacement : demander la suppression de vos données
        • Droit d'opposition : refuser le traitement de vos données
        • Droit à la portabilité : recevoir vos données dans un format structuré`
    },
    {
      id: "conservation",
      icon: <Clock size={22} />,
      title: "7. Conservation des données",
      content: `Nous conservons vos données personnelles pendant la durée nécessaire :
        • Données de compte : jusqu'à suppression de votre compte
        • Historique de réservation : 5 ans (obligation légale)
        • Données de paiement : durée de traitement de la transaction
        • Communications : 3 ans à compter du dernier contact
        • Cookies : jusqu'à 13 mois maximum`
    },
    {
      id: "modifications",
      icon: <FileText size={22} />,
      title: "8. Modifications de la politique",
      content: `Nous nous réservons le droit de modifier cette politique de confidentialité. Toute modification sera publiée sur cette page avec une mise à jour de la date. Nous vous encourageons à consulter régulièrement cette page pour rester informé.`
    },
    {
      id: "contact",
      icon: <Mail size={22} />,
      title: "9. Nous contacter",
      content: `Pour toute question concernant cette politique ou vos données personnelles, vous pouvez nous contacter :
        • Par email : almiarajvoyages.fes@gmail.com
        • Par téléphone : +212 5 35 65 79 79
        • Par courrier : 3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000`
    }
  ];

  return (
    <div className="privacy-page">
      {/* Hero Section */}
      <div className="privacy-hero">
        <div className="privacy-hero-overlay"></div>
        <div className="privacy-hero-content">
          <div className="privacy-hero-icon">
            <Shield size={48} />
          </div>
          <h1 className="privacy-hero-title">Politique de Confidentialité</h1>
          <p className="privacy-hero-subtitle">
            La protection de vos données personnelles est notre priorité
          </p>
          <div className="privacy-hero-badge">
            <CheckCircle size={16} />
            Dernière mise à jour : {lastUpdated}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="privacy-actions">
        <div className="privacy-actions-container">
          <Link to="/" className="privacy-back-btn">
            <ArrowLeft size={18} />
            Retour à l'accueil
          </Link>
          <div className="privacy-actions-buttons">
            <button onClick={handlePrint} className="privacy-print-btn">
              <Printer size={18} />
              Imprimer
            </button>
            <button className="privacy-share-btn">
              <Share2 size={18} />
              Partager
            </button>
            <button className="privacy-download-btn">
              <Download size={18} />
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="privacy-container">
        <div className="privacy-grid">
          {/* Sidebar Navigation */}
          <aside className="privacy-sidebar">
            <div className="privacy-sidebar-sticky">
              <h3 className="privacy-sidebar-title">Sommaire</h3>
              <ul className="privacy-sidebar-nav">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="privacy-sidebar-link">
                      <span className="privacy-sidebar-icon">{section.icon}</span>
                      <span>{section.title.replace(/^\d+\.\s/, '')}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="privacy-sidebar-info">
                <Lock size={20} />
                <p>Vos données sont en sécurité</p>
                <span>Cryptage SSL 256 bits</span>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="privacy-content">
            {/* Introduction */}
            <div className="privacy-intro">
              <p>
                Chez <strong>Al Miaraj Voyages</strong>, nous nous engageons à protéger
                votre vie privée et vos données personnelles. Cette politique explique
                comment nous collectons, utilisons, partageons et protégeons vos
                informations lorsque vous utilisez nos services de réservation de voyages,
                billets d'avion, hôtels et circuits.
              </p>
              <p>
                En utilisant notre site web et nos services, vous acceptez les pratiques
                décrites dans cette politique de confidentialité.
              </p>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="privacy-section">
                <div className="privacy-section-header">
                  <div className="privacy-section-icon">
                    {section.icon}
                  </div>
                  <h2 className="privacy-section-title">{section.title}</h2>
                </div>
                <div className="privacy-section-content">
                  {section.content.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && (
                      <p key={idx} className="privacy-text">
                        {paragraph.trim().startsWith('•') ? (
                          <span className="privacy-list-item">
                            <ChevronRight size={14} className="privacy-list-icon" />
                            {paragraph.trim().substring(1)}
                          </span>
                        ) : paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* Legal Notice */}
            <div className="privacy-legal">
              <div className="privacy-legal-header">
                <AlertCircle size={24} />
                <h3>Avis légal</h3>
              </div>
              <p>
                Conformément à la loi marocaine n°09-08 relative à la protection
                des personnes physiques à l'égard du traitement des données à
                caractère personnel, nous nous engageons à respecter vos droits.
              </p>
              <p>
                Al Miaraj Voyages est enregistré auprès de la CNDP sous le numéro
                de déclaration : <strong>AV-2024-001234</strong>
              </p>
            </div>

            {/* Consent */}
            <div className="privacy-consent">
              <div className="privacy-consent-checkbox">
                <input type="checkbox" id="consent" defaultChecked disabled />
                <label htmlFor="consent">
                  J'accepte la politique de confidentialité d'Al Miaraj Voyages
                </label>
              </div>
              <p className="privacy-consent-text">
                En continuant à utiliser notre site, vous confirmez avoir lu et
                accepté notre politique de confidentialité.
              </p>
            </div>
          </main>
        </div>

        {/* Footer Info */}
        <div className="privacy-footer">
          <div className="privacy-footer-grid">
            <div className="privacy-footer-item">
              <Shield size={20} />
              <div>
                <h4>Protection des données</h4>
                <p>Conforme à la loi 09-08</p>
              </div>
            </div>
            <div className="privacy-footer-item">
              <Lock size={20} />
              <div>
                <h4>Cryptage SSL</h4>
                <p>Sécurité des transactions</p>
              </div>
            </div>
            <div className="privacy-footer-item">
              <Cookie size={20} />
              <div>
                <h4>Cookies</h4>
                <p>Paramètres personnalisables</p>
              </div>
            </div>
            <div className="privacy-footer-item">
              <Mail size={20} />
              <div>
                <h4>Contact DPO</h4>
                <p>almiarajvoyages.fes@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
