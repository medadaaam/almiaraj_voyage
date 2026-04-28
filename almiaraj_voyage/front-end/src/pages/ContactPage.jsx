// src/pages/ContactPage.jsx
import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/Api/AuthApi";
import "./contactPage.css";

export default function ContactPage() {
  const { user, clientProfile, getClientProfile } =
    useAuth();
  const [clientLoaded, setClientLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Charger le profil client (si connecté)
  useEffect(() => {
    if (user) {
      const loadClient = async () => {
        await getClientProfile();
        setClientLoaded(true);
      };
      loadClient();
    } else {
      setClientLoaded(true);
    }
  }, [user]);

  // Remplir les champs avec les données du client (si connecté)
  useEffect(() => {
    if (user && clientLoaded && clientProfile?.client) {
      setFormData((prev) => ({
        ...prev,
        nom: clientProfile.client.nomCl || "",
        prenom: clientProfile.client.prenomCl || "",
        email: clientProfile.client.email || "",
        telephone: clientProfile.client.numTelCl || "",
      }));
    } else if (user && clientLoaded) {
      const nameParts = user.name?.split(" ") || [];
      setFormData((prev) => ({
        ...prev,
        nom: nameParts[0] || "",
        prenom: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [clientProfile, clientLoaded, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log("FINAL DATA:", {
  ...formData,
  type: "contact",
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log(formData);

    try {
const response = await AuthApi.sendContactMessage({
  ...formData,
  type: "contact",
});
      console.log(formData);
      console.log("Response reçue:", response); // Pour debug

      // ✅ CORRECTION ICI
      if (response?.data?.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData((prev) => ({ ...prev, sujet: "", message: "" }));
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({
          type: "error",
          message:
            response?.data?.message ||
            "Une erreur s'est produite. Veuillez réessayer.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Une erreur s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="contact-info-icon" />,
      title: "Adresse email",
      value: "almiarajvoyage.fes@gmail.com",
      details: "Nous répondons sous 24h",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      icon: <Phone className="contact-info-icon" />,
      title: "Téléphone",
      value: "05 35 65 79 79",
      details: "Lun-Ven, 9h-13h 15h-19h",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      icon: <MapPin className="contact-info-icon" />,
      title: "Adresse",
      value:
        "3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000",
      details: "Maroc",
      color: "#ef4444",
      bgColor: "#fef2f2",
    },
  ];

  const faqs = [
    {
      question: "Quels sont les délais de réponse ?",
      answer:
        "Nous répondons à tous les messages dans un délai maximum de 24h ouvrées.",
    },
    {
      question: "Puis-je modifier ma réservation ?",
      answer:
        "Oui, vous pouvez modifier votre réservation jusqu'à 7 jours avant le départ.",
    },
    {
      question: "Proposez-vous des paiements en ligne sécurisés ?",
      answer:
        "Oui, nous acceptons les paiements par carte bancaire via notre plateforme sécurisée.",
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Contactez-nous</h1>
          <p className="contact-hero-subtitle">
            Nous sommes à votre écoute pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div
                  className="contact-info-icon-wrapper"
                  style={{ backgroundColor: info.bgColor }}
                >
                  <div style={{ color: info.color }}>{info.icon}</div>
                </div>
                <div>
                  <h3 className="contact-info-title">{info.title}</h3>
                  <p className="contact-info-value">{info.value}</p>
                  <p className="contact-info-details">{info.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-grid">
            {/* Form */}
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h2>Envoyez-nous un message</h2>
                <p>Nous vous répondrons dans les plus brefs délais</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                {submitStatus && (
                  <div className={`submit-message ${submitStatus.type}`}>
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Prénom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Nom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+212 6 00 00 00 00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Sujet <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="form-textarea"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Hours */}
            <div className="contact-info-wrapper">
              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.5!2d-5.008338!3d34.020882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b4c9a5b9c8f%3A0x3c8b3f2a8b5c9d8e!2s33%20Rue%20Assilah%2C%20F%C3%A8s%2030000!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma"
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: "20px" }}
                  allowFullScreen
                  loading="lazy"
                  title="Al Miaraj Voyages - Fès"
                ></iframe>
                <div className="map-address">
                  <MapPin className="w-4 h-4" />
                  <span>
                    3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès
                    30000
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="contact-hours">
                <div className="hours-header">
                  <Clock className="hours-icon" />
                  <h3>Horaires d'ouverture</h3>
                </div>
                <ul className="hours-list">
                  <li>
                    <span>Lundi - Vendredi</span>
                    <span>9:00 - 13:00 & 15:00 - 18:00</span>
                  </li>
                  <li>
                    <span>Samedi</span>
                    <span>9:00 - 13:00</span>
                  </li>
                  <li>
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </li>
                </ul>
              </div>

              {/* FAQ Quick */}
              <div className="contact-faq">
                <h3>Questions fréquentes</h3>
                <ul className="faq-list">
                  {faqs.map((faq, index) => (
                    <li key={index}>
                      <strong>{faq.question}</strong>
                      <p>{faq.answer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
