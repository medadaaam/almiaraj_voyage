// src/pages/services/HajjOmraDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Shield,
  CheckCircle,
  Download,
  Send,
  MessageCircle,
  Building,
  Info,
  AlertCircle,
  Loader2,
  User,
  IdCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/Api/AuthApi";

export default function HajjOmraDetailsRes() {
  const { id } = useParams();
  const { user, getClientProfile, clientProfile, getHajjOmraDetails,sendContactMessage } =
    useAuth();
  const [hajjOmra, setHajjOmra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clientLoaded, setClientLoaded] = useState(false);

  // Formulaire de contact
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cin: "",
    passport: "",
    nombre_personnes: 2,
    message: "",
  });

  // Charger les données du Hajj/Omra
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getHajjOmraDetails(id);
      setHajjOmra(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Charger le profil client
  useEffect(() => {
    const loadClient = async () => {
      await getClientProfile();
      setClientLoaded(true);
    };
    loadClient();
  }, []);

  // Remplir les champs avec les données du client (une fois chargées)
  useEffect(() => {
    if (clientLoaded && clientProfile?.client) {
      setFormData((prev) => ({
        ...prev,
        nom: clientProfile.client.nomCl || "",
        prenom: clientProfile.client.prenomCl || "",
        email: clientProfile.client.email || user?.email || "",
        telephone: clientProfile.client.numTelCl || "",
        cin: clientProfile.client.cin || "",
        passport: clientProfile.client.passport || "",
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

  // HajjOmraDetails.jsx - handleSubmit modifié
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await sendContactMessage({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        message: formData.message,
        nombre_personnes: formData.nombre_personnes,
        service_id: id,
        type: "hajj_omra", // ✅
      });

      if (response?.success) {
        setFormSubmitted(true);
      } else {
        alert(
          response?.message || "Une erreur s'est produite. Veuillez réessayer.",
        );
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert(
        error.response?.data?.message ||
          "Une erreur s'est produite. Veuillez réessayer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || !clientLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="ml-3 text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!hajjOmra) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Offre non trouvée</h2>
        <Link to="/services/hajj-omra" className="text-orange-500">
          Retour aux offres
        </Link>
      </div>
    );
  }

  const service = hajjOmra.service;
  const isHajj =
    hajjOmra.type === "Hajj" || hajjOmra.title?.toLowerCase().includes("hajj");

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Back button */}
      <Link
        to="/services/hajj-omra"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
      >
        <ArrowLeft size={20} /> Retour aux offres
      </Link>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 text-white mb-8">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{isHajj ? "🕋" : "🕌"}</span>
              <span className="text-sm opacity-80">
                {isHajj ? "Hajj" : "Omra"}
              </span>
              {service?.enVedette === 1 && (
                <span className="bg-yellow-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={12} className="fill-white" /> Populaire
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {service?.nomServ}
            </h1>
            <p className="text-white/80 max-w-2xl">{service?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80 mb-1">À partir de</div>
            <div className="text-3xl font-bold">{service?.prix} DH</div>
            <div className="text-sm opacity-80">/personne</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="opacity-70" />
            <div>
              <div className="text-xs opacity-70">Départ</div>
              <div className="text-sm font-medium">
                {formatDate(hajjOmra.dateDepartHO)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={18} className="opacity-70" />
            <div>
              <div className="text-xs opacity-70">Retour</div>
              <div className="text-sm font-medium">
                {formatDate(hajjOmra.dateRetourHO)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} className="opacity-70" />
            <div>
              <div className="text-xs opacity-70">Durée</div>
              <div className="text-sm font-medium">{hajjOmra.duree} jours</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users size={18} className="opacity-70" />
            <div>
              <div className="text-xs opacity-70">Chambre</div>
              <div className="text-sm font-medium">{hajjOmra.typeChambre}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info importante */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">
              Information importante
            </h3>
            <p className="text-sm text-amber-700">
              Pour toute réservation de Hajj ou Omra, veuillez nous contacter
              directement. Nos spécialistes vous accompagneront dans toutes les
              étapes de votre pèlerinage.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Téléphone */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center border hover:shadow-lg transition">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone size={24} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Appelez-nous</h3>
          <p className="text-gray-500 text-sm mb-3">
            Du lundi au samedi, 9h-18h
          </p>
          <a
            href="tel:+212535657979"
            className="text-green-600 font-semibold hover:underline"
          >
            +212 5 35 65 79 79
          </a>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center border hover:shadow-lg transition">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={24} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
          <p className="text-gray-500 text-sm mb-3">Réponse rapide 24h/24</p>
          <a
            href="https://wa.me/212649981986"
            className="text-green-600 font-semibold hover:underline"
          >
            06 49 98 19 86
          </a>
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center border hover:shadow-lg transition">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Email</h3>
          <p className="text-gray-500 text-sm mb-3">Réponse sous 24h</p>
          <a
            href="mailto:hajj@alamiray.com"
            className="text-blue-600 font-semibold hover:underline"
          >
            almiarajvoyage.fes@gmail.com
          </a>
        </div>
      </div>

      {/* Formulaire de demande d'informations */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send size={20} />
            Demander un devis personnalisé
          </h2>
        </div>

        {formSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Demande envoyée !</h3>
            <p className="text-gray-600 mb-4">
              Nos spécialistes Hajj & Omra vous contacteront dans les plus brefs
              délais.
            </p>
            <Link
              to="/services/hajj-omra"
              className="text-orange-500 hover:underline"
            >
              Retour aux offres
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Informations personnelles - DISABLED */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <User size={18} />
                Vos informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN
                  </label>
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passeport
                  </label>
                  <input
                    type="text"
                    name="passport"
                    value={formData.passport}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Détails de la demande - MODIFIABLES */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <Send size={18} />
                Détails de votre demande
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de personnes
                  </label>
                  <input
                    type="number"
                    name="nombre_personnes"
                    value={formData.nombre_personnes}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message / Questions
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Précisez vos besoins, dates souhaitées, nombre de personnes, etc..."
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-600">
              <CheckCircle size={16} className="inline text-green-500 mr-2" />
              Un conseiller dédié vous répondra sous 24h
              <br />
              <CheckCircle size={16} className="inline text-green-500 mr-2" />
              Devis gratuit et sans engagement
              <br />
              <CheckCircle size={16} className="inline text-green-500 mr-2" />
              Accompagnement personnalisé
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin inline mr-2" size={18} />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={18} className="inline mr-2" />
                  Envoyer ma demande
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Besoin d'une assistance immédiate ?
          <a
            href="tel:+212535657979"
            className="text-orange-500 font-semibold ml-1"
          >
            Appelez-nous maintenant
          </a>
        </p>
      </div>
    </div>
  );
}
