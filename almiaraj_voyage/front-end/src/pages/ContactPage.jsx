import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, MessageCircle } from "lucide-react";
import "./contactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitStatus({
        type: 'success',
        message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitting(false);

      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="contact-info-icon" />,
      title: "Adresse email",
      value: "almiarajvoyage.fes@gmail.com",
      details: "Nous répondons sous 24h",
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      icon: <Phone className="contact-info-icon" />,
      title: "Téléphone",
      value: "05 35 65 79 79",
      details: "Lun-Ven, 9h-13h 15h-19h",
      color: "#10b981",
      bgColor: "#ecfdf5"
    },
    {
      icon: <MapPin className="contact-info-icon" />,
      title: "Adresse",
      value: "3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000",
      details: "Maroc",
      color: "#ef4444",
      bgColor: "#fef2f2"
    }
  ];

  const faqs = [
    {
      question: "Quels sont les délais de réponse ?",
      answer: "Nous répondons à tous les messages dans un délai maximum de 24h ouvrées."
    },
    {
      question: "Puis-je modifier ma réservation ?",
      answer: "Oui, vous pouvez modifier votre réservation jusqu'à 7 jours avant le départ."
    },
    {
      question: "Proposez-vous des paiements en ligne sécurisés ?",
      answer: "Oui, nous acceptons les paiements par carte bancaire via notre plateforme sécurisée."
    }
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
                <div className="contact-info-icon-wrapper" style={{ backgroundColor: info.bgColor }}>
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
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{submitStatus.message}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom complet <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
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
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+212 6 00 00 00 00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet <span className="required">*</span></label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message <span className="required">*</span></label>
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

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
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
                  <span>3ème Étage, ATLAS, BUREAUX ALMADINA 3, N°33 Rue Assilah, Fès 30000</span>
                </div>
              </div>

              {/* Hours */}
              <div className="contact-hours">
                <div className="hours-header">
                  <Clock className="hours-icon" />
                  <h3>Horaires d'ouverture</h3>
                </div>
                <ul className="hours-list">
                  <li><span>Lundi - Vendredi</span><span>9:00 - 13:00 & 15:00 - 18:00</span></li>
                  <li><span>Samedi</span><span>9:00 - 13:00</span></li>
                  <li><span>Dimanche</span><span>Fermé</span></li>
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
