// src/pages/TermsConditions.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Scale,
  CreditCard,
  Plane,
  Hotel,
  Users,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Printer,
  Download,
  Share2,
  Award,
  Heart,
  Globe,
  Settings,
  HelpCircle,
  DollarSign,
  RefreshCw,
  XCircle,
  ClipboardList,
} from "lucide-react";
import "./termsConditions.css";

export default function TermsConditions() {
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
      id: "acceptation",
      icon: <CheckCircle size={22} />,
      title: "1. Acceptation des conditions",
      content: `En utilisant le site web d'Al Miaraj Voyages (www.almiarajvoyages.ma) et nos services, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.

      Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page.`
    },
    {
      id: "services",
      icon: <Plane size={22} />,
      title: "2. Services proposés",
      content: `Al Miaraj Voyages propose les services suivants :
        • Réservation de billets d'avion nationaux et internationaux
        • Organisation de voyages et circuits touristiques
        • Réservation d'hébergements hôteliers
        • Organisation de pèlerinages (Hajj et Omra)
        • Assurance voyage
        • Services de transport et transferts aéroportuaires
        • Assistance et support client 24h/24`
    },
    {
      id: "reservation",
      icon: <Calendar size={22} />,
      title: "3. Réservation et confirmation",
      content: `Toute réservation effectuée via notre site web ou par téléphone est engagée après confirmation écrite (email, SMS ou message WhatsApp).

      • Les disponibilités sont indiquées en temps réel mais peuvent varier
      • Une réservation est confirmée uniquement après réception du paiement
      • Vous recevrez un numéro de réservation à conserver
      • Vérifiez attentivement toutes les informations de votre réservation`
    },
    {
      id: "prix",
      icon: <DollarSign size={22} />,
      title: "4. Prix et paiement",
      content: `Les prix affichés sont en Dirhams Marocains (MAD), toutes taxes comprises (TVA 20%), sauf mention contraire.

      • Les prix sont garantis au moment de la réservation
      • Les suppléments éventuels sont clairement indiqués
      • Paiements acceptés : Carte bancaire, Virement, Espèce (agence)
      • Le paiement intégral est requis pour la confirmation
      • En cas de non-paiement, la réservation sera automatiquement annulée`
    },
    {
      id: "annulation",
      icon: <XCircle size={22} />,
      title: "5. Annulation et modification",
      content: `Les conditions d'annulation varient selon le type de service :

      Billets d'avion :
      • Selon les conditions tarifaires de la compagnie
      • Certains billets sont non remboursables

      Hôtels :
      • Annulation gratuite jusqu'à 72h avant l'arrivée
      • Au-delà, 1 nuit facturée

      Voyages organisés :
      • Jusqu'à 30 jours avant : remboursement 100% (frais dossier: 500 DH)
      • Entre 15 et 29 jours : remboursement 50%
      • Moins de 15 jours : aucun remboursement

      Hajj & Omra :
      • Conditions spécifiques selon les packages`
    },
    {
      id: "responsabilite",
      icon: <Shield size={22} />,
      title: "6. Responsabilité",
      content: `Al Miaraj Voyages agit en tant qu'intermédiaire entre vous et les prestataires (compagnies aériennes, hôtels, etc.).

      • Nous ne sommes pas responsables des retards, annulations ou changements effectués par les prestataires
      • Nous ne sommes pas responsables des pertes, vols ou dommages causés pendant le voyage
      • Notre responsabilité est limitée au montant payé pour la prestation concernée
      • Une assurance voyage est fortement recommandée`
    },
    {
      id: "documents",
      icon: <ClipboardList size={22} />,
      title: "7. Documents de voyage",
      content: `Vous êtes seul responsable de la validité de vos documents de voyage :

      • Passeport valide (6 mois minimum après date de retour)
      • Visa si requis par le pays de destination
      • Carte d'identité pour les vols domestiques
      • Certificats de vaccination si exigés

      Aucun remboursement ne sera effectué en cas de refus d'embarquement dû à des documents incomplets.`
    },
    {
      id: "comportement",
      icon: <Users size={22} />,
      title: "8. Comportement du client",
      content: `Vous vous engagez à :
        • Fournir des informations exactes lors de la réservation
        • Respecter les règles des prestataires (compagnies, hôtels, etc.)
        • Vous comporter de manière appropriée pendant le voyage
        • Respecter les lois et coutumes locales

      Tout comportement inapproprié peut entraîner l'annulation immédiate du voyage sans remboursement.`
    },
    {
      id: "force-majeure",
      icon: <AlertCircle size={22} />,
      title: "9. Force majeure",
      content: `Sont considérés comme cas de force majeure : catastrophes naturelles, guerres, épidémies (COVID-19), grèves, décisions gouvernementales, fermetures d'espaces aériens.

      En cas de force majeure, Al Miaraj Voyages s'engage à :
        • Proposer un report de la prestation
        • Proposer un avoir valable 12 mois
        • Rembourser selon les conditions des prestataires`
    },
    {
      id: "reclamations",
      icon: <HelpCircle size={22} />,
      title: "10. Réclamations",
      content: `Toute réclamation doit être adressée par écrit à : contact@almiarajvoyages.ma

      • Délai de réponse : 48h ouvrées
      • Délai de traitement : 14 jours maximum
      • En cas de litige, une médiation sera proposée
      • Compétence exclusive : Tribunal de Commerce de Fès`
    },
    {
      id: "propriete",
      icon: <Scale size={22} />,
      title: "11. Propriété intellectuelle",
      content: `L'ensemble du contenu du site (textes, images, logos, vidéos) est la propriété exclusive d'Al Miaraj Voyages.

      • Toute reproduction est interdite sans autorisation
      • Les marques commerciales et logos sont protégés
      • Les photos des destinations sont utilisées avec autorisation`
    },
    {
      id: "modifications",
      icon: <RefreshCw size={22} />,
      title: "12. Modifications des conditions",
      content: `Al Miaraj Voyages se réserve le droit de modifier ces conditions à tout moment.

      • Les modifications sont publiées sur cette page
      • Date de dernière mise à jour : 15 Avril 2026
      • Les conditions en vigueur sont celles au moment de la réservation
      • Nous vous encourageons à consulter régulièrement cette page`
    },
    {
      id: "contact",
      icon: <Mail size={22} />,
      title: "13. Nous contacter",
      content: `Pour toute question concernant ces conditions :

      • Email : legal@almiarajvoyages.ma
      • Téléphone : +212 5 35 65 79 79
      • WhatsApp : 06 49 98 19 86
      • Adresse : 3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000
      • Horaires : Lundi - Vendredi 9h-13h & 15h-18h, Samedi 9h-13h`
    }
  ];

  return (
    <div className="terms-page">
      {/* Hero Section */}
      <div className="terms-hero">
        <div className="terms-hero-overlay"></div>
        <div className="terms-hero-content">
          <div className="terms-hero-icon">
            <FileText size={48} />
          </div>
          <h1 className="terms-hero-title">Conditions Générales d'Utilisation</h1>
          <p className="terms-hero-subtitle">
            Lisez attentivement nos conditions avant d'utiliser nos services
          </p>
          <div className="terms-hero-badge">
            <CheckCircle size={16} />
            Dernière mise à jour : {lastUpdated}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="terms-actions">
        <div className="terms-actions-container">
          <Link to="/" className="terms-back-btn">
            <ArrowLeft size={18} />
            Retour à l'accueil
          </Link>
          <div className="terms-actions-buttons">
            <button onClick={handlePrint} className="terms-print-btn">
              <Printer size={18} />
              Imprimer
            </button>
            <button className="terms-share-btn">
              <Share2 size={18} />
              Partager
            </button>
            <button className="terms-download-btn">
              <Download size={18} />
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="terms-container">
        <div className="terms-grid">
          {/* Sidebar Navigation */}
          <aside className="terms-sidebar">
            <div className="terms-sidebar-sticky">
              <h3 className="terms-sidebar-title">Sommaire</h3>
              <ul className="terms-sidebar-nav">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="terms-sidebar-link">
                      <span className="terms-sidebar-icon">{section.icon}</span>
                      <span>{section.title.replace(/^\d+\.\s/, '')}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="terms-sidebar-info">
                <div className="terms-sidebar-info-badge">
                  <Award size={20} />
                  <span>Agrément N°</span>
                </div>
                <p className="terms-sidebar-info-number">AG-2024-001234</p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="terms-content">
            {/* Introduction */}
            <div className="terms-intro">
              <div className="terms-intro-header">
                <BookOpen size={24} />
                <h2>Introduction</h2>
              </div>
              <p>
                Bienvenue sur <strong>Al Miaraj Voyages</strong>. Les présentes conditions
                générales d'utilisation régissent l'accès et l'utilisation de notre site
                web et de nos services de réservation de voyages.
              </p>
              <p>
                En effectuant une réservation avec nous, vous reconnaissez avoir lu,
                compris et accepté l'intégralité de ces conditions.
              </p>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="terms-section">
                <div className="terms-section-header">
                  <div className="terms-section-icon">
                    {section.icon}
                  </div>
                  <h2 className="terms-section-title">{section.title}</h2>
                </div>
                <div className="terms-section-content">
                  {section.content.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && (
                      <p key={idx} className="terms-text">
                        {paragraph.trim().startsWith('•') ? (
                          <span className="terms-list-item">
                            <CheckCircle size={14} className="terms-list-icon" />
                            {paragraph.trim().substring(1)}
                          </span>
                        ) : paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* Important Notice */}
            <div className="terms-important">
              <div className="terms-important-header">
                <AlertCircle size={24} />
                <h3>Avis important</h3>
              </div>
              <div className="terms-important-grid">
                <div className="terms-important-item">
                  <h4>Assurance recommandée</h4>
                  <p>Nous vous recommandons vivement de souscrire une assurance voyage couvrant l'annulation, la maladie et le rapatriement.</p>
                </div>
                <div className="terms-important-item">
                  <h4>Vérification des visas</h4>
                  <p>Vous êtes seul responsable de la vérification des conditions d'entrée dans le pays de destination.</p>
                </div>
                <div className="terms-important-item">
                  <h4>Santé et vaccinations</h4>
                  <p>Renseignez-vous sur les vaccinations obligatoires et recommandées pour votre destination.</p>
                </div>
              </div>
            </div>

            {/* Acceptance */}
            <div className="terms-acceptance">
              <div className="terms-acceptance-header">
                <CheckCircle size={24} className="terms-acceptance-icon" />
                <h3>Acceptation des conditions</h3>
              </div>
              <div className="terms-acceptance-checkbox">
                <input type="checkbox" id="acceptTerms" defaultChecked disabled />
                <label htmlFor="acceptTerms">
                  J'accepte les conditions générales d'utilisation d'Al Miaraj Voyages
                </label>
              </div>
              <p className="terms-acceptance-text">
                En cochant cette case, vous confirmez avoir lu et accepté l'intégralité
                des conditions générales d'utilisation.
              </p>
            </div>
          </main>
        </div>

        {/* Footer Info */}
        <div className="terms-footer">
          <div className="terms-footer-grid">
            <div className="terms-footer-item">
              <Shield size={20} />
              <div>
                <h4>Protection du consommateur</h4>
                <p>Conforme à la loi 31-08</p>
              </div>
            </div>
            <div className="terms-footer-item">
              <Heart size={20} />
              <div>
                <h4>Service client</h4>
                <p>7j/7 - Assistance dédiée</p>
              </div>
            </div>
            <div className="terms-footer-item">
              <Globe size={20} />
              <div>
                <h4>Voyages responsables</h4>
                <p>Engagement éthique</p>
              </div>
            </div>
            <div className="terms-footer-item">
              <Phone size={20} />
              <div>
                <h4>Urgence 24h/24</h4>
                <p>+212 6 49 98 19 86</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
