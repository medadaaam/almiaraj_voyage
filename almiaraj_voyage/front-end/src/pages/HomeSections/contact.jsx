// src/pages/Contact.jsx
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/Api/AuthApi";
import "./styles/contact.css";

export default function Contact() {
  const { user, clientProfile, getClientProfile } = useAuth();
  const [clientLoaded, setClientLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Charger le profil client (seulement si connecté)
  useEffect(() => {
    if (user) {
      const loadClient = async () => {
        await getClientProfile();
        setClientLoaded(true);
      };
      loadClient();
    } else {
      setClientLoaded(true); // Pour les guests, on considère comme chargé
    }
  }, [user]);

  // Remplir les champs avec les données du client (si connecté)
  useEffect(() => {
    if (user && clientLoaded && clientProfile?.client) {
      setFormData(prev => ({
        ...prev,
        nom: clientProfile.client.nomCl || "",
        prenom: clientProfile.client.prenomCl || "",
        email: clientProfile.client.email || "",
        telephone: clientProfile.client.numTelCl || "",
      }));
    } else if (user && clientLoaded) {
      const nameParts = user.name?.split(" ") || [];
      setFormData(prev => ({
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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // ✅ Utiliser AuthApi directement (pas besoin de auth)
      const response = await AuthApi.sendContactMessage({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        sujet: formData.sujet,
        message: formData.message,
        type: "contact",
      });

      if (response.data?.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
        });
        setFormData(prev => ({ ...prev, sujet: "", message: "" }));

        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.data?.message || "Une erreur s'est produite. Veuillez réessayer."
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer."
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
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      icon: <Phone className="contact-info-icon" />,
      title: "Téléphone",
      value: "05 35 65 79 79",
      color: "#10b981",
      bgColor: "#ecfdf5"
    },
    {
      icon: <MapPin className="contact-info-icon" />,
      title: "Adresse",
      value: "3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000",
      color: "#ef4444",
      bgColor: "#fef2f2"
    }
  ];

  return (
    <section className="contact-section">
      <div className="contact-container">

        {/* Header */}
        <div className="contact-header">
          <span className="contact-badge">Prenez contact</span>
          <h2 className="contact-title">Contactez-nous</h2>
          <p className="contact-subtitle">
            Nous sommes plus qu'heureux d'avoir de vos nouvelles
          </p>
        </div>

        {/* Content Grid */}
        <div className="contact-grid">

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">

              {/* Success/Error Message */}
              {submitStatus && (
                <div className={`submit-message ${submitStatus.type}`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              {/* Nom & Prénom */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prenom" className="form-label">
                    Prénom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Votre prénom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nom" className="form-label">
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Adresse email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone" className="form-label">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0612345678"
                  />
                </div>
              </div>

              {/* Sujet */}
              <div className="form-group">
                <label htmlFor="sujet" className="form-label">
                  Sujet <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="form-textarea"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-button" disabled={isSubmitting}>
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

          {/* Contact Info */}
          <div className="contact-info-wrapper">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-info-icon-wrapper" style={{ backgroundColor: info.bgColor }}>
                  <div style={{ color: info.color }}>{info.icon}</div>
                </div>
                <div>
                  <h3 className="contact-info-title">{info.title}</h3>
                  <p className="contact-info-value">{info.value}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.5!2d-5.008338!3d34.020882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b4c9a5b9c8f%3A0x3c8b3f2a8b5c9d8e!2s33%20Rue%20Assilah%2C%20F%C3%A8s%2030000!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: "20px" }}
                allowFullScreen
                loading="lazy"
                title="Al Miaraj Voyages - Fès"
                className="map-iframe"
              ></iframe>
              <div className="map-address">
                <MapPin className="w-4 h-4" />
                <span>3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
