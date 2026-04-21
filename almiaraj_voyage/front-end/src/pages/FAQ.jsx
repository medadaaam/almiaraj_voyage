import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./faq.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Proposez-vous des réductions pour les groupes ?",
      answer: "Oui, nous proposons des offres spéciales pour les groupes et les familles. Contactez-nous et nous vous fournirons toutes les offres de réduction disponibles."
    },
    {
      question: "Comment puis-je vous contacter ?",
      answer: "Nous sommes toujours disponibles pour vos demandes. Vous pouvez nous contacter via la page de contact, par email ou sur nos réseaux sociaux."
    },
    {
      question: "Quelles sont les options de paiement acceptées ?",
      answer: "Nous acceptons les paiements en ligne (carte bancaire, PayPal) et les virements bancaires. Consultez notre page de réservation pour tous les détails."
    },
    {
      question: "Puis-je annuler ou modifier ma réservation ?",
      answer: "Oui, vous pouvez annuler ou modifier votre réservation jusqu'à 7 jours avant le départ. Des frais d'annulation peuvent s'appliquer selon les conditions."
    },
    {
      question: "Proposez-vous des voyages sur mesure ?",
      answer: "Absolument ! Nous créons des voyages entièrement personnalisés selon vos envies, votre budget et vos contraintes. Contactez-nous pour discuter de votre projet."
    },
    {
      question: "Les vols et hébergements sont-ils inclus ?",
      answer: "Oui, nos forfaits incluent généralement les vols, l'hébergement et les transferts. Vous pouvez également choisir des options à la carte."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        {/* Header */}
        <div className="faq-header">
          <span className="faq-badge">Foire aux questions</span>
          <h2 className="faq-title">
            Nous répondons à vos questions
          </h2>
          <p className="faq-subtitle">
            Tout ce que vous devez savoir avant de partir à l'aventure
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <ChevronDown className={`faq-icon ${openIndex === index ? "rotated" : ""}`} />
              </button>
              <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Link */}
        <div className="faq-footer">
          <p>
            Vous n'avez pas trouvé votre réponse ?
            <a href="#contact"> Contactez-nous directement</a>
          </p>
        </div>

      </div>
    </section>
  );
}
