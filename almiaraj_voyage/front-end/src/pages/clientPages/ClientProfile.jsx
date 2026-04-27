// src/pages/ClientProfile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Edit2, Save, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClientProfile() {
    const { getClientProfile, clientProfile, user, updateClientProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nomCl: '',
        prenomCl: '',
        email: '',
        numTelCl: '',
        natCl: '',
        cin: '',
        passport: ''
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            await getClientProfile();
            setLoading(false);
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        console.log("ClientProfile data:", clientProfile);

        if (clientProfile && clientProfile.client) {
            setFormData({
                nomCl: clientProfile.client.nomCl || '',
                prenomCl: clientProfile.client.prenomCl || '',
                email: clientProfile.client.email || user?.email || '',
                numTelCl: clientProfile.client.numTelCl || '',
                natCl: clientProfile.client.natCl || 'maroc',
                cin: clientProfile.client.cin || '',
                passport: clientProfile.client.passport || ''
            });
        } else if (user) {
            setFormData({
                nomCl: user.name?.split(' ')[0] || '',
                prenomCl: user.name?.split(' ')[1] || '',
                email: user.email || '',
                numTelCl: '',
                natCl: 'maroc',
                cin: '',
                passport: ''
            });
        }
    }, [clientProfile, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await updateClientProfile(formData);
            if (response && response.success) {
                setIsEditing(false);
                // Rafraîchir le profil
                await getClientProfile();
            } else {
                setError("Erreur lors de la mise à jour");
            }
        } catch (err) {
            console.error("Update error:", err);
            setError(err.response?.data?.message || "Une erreur s'est produite");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 size={40} className="animate-spin text-orange-500" />
                <p className="ml-3 text-gray-500">Chargement du profil...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2f6f85] to-[#1e4a5f] rounded-2xl p-8 text-white mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
                        <p className="opacity-90">Gérez vos informations personnelles</p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                        >
                            <Edit2 size={16} />
                            Modifier
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                Enregistrer
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setError("");
                                }}
                                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition"
                            >
                                <X size={16} />
                                Annuler
                            </button>
                        </div>
                    )}
                </div>
                {error && (
                    <div className="mt-4 bg-red-500/20 text-red-200 px-4 py-2 rounded-lg">
                        {error}
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <User size={20} className="text-[#fb923c]" />
                        Informations personnelles
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom <span className="text-red-500">*</span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="nomCl"
                                    value={formData.nomCl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fb923c] focus:border-[#fb923c]"
                                    required
                                />
                            ) : (
                                <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg">
                                    {formData.nomCl || "Non renseigné"}
                                </p>
                            )}
                        </div>

                        {/* Prénom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom <span className="text-red-500">*</span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="prenomCl"
                                    value={formData.prenomCl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fb923c] focus:border-[#fb923c]"
                                    required
                                />
                            ) : (
                                <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg">
                                    {formData.prenomCl || "Non renseigné"}
                                </p>
                            )}
                        </div>

                        {/* Email (non modifiable) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                {formData.email}
                            </p>
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="numTelCl"
                                    value={formData.numTelCl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fb923c] focus:border-[#fb923c]"
                                    placeholder="0612345678"
                                />
                            ) : (
                                <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    {formData.numTelCl || "Non renseigné"}
                                </p>
                            )}
                        </div>

                        {/* Nationalité */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nationalité
                            </label>
                            {isEditing ? (
                                <select
                                    name="natCl"
                                    value={formData.natCl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fb923c] focus:border-[#fb923c]"
                                >
                                    <option value="maroc">Maroc 🇲🇦</option>
                                    <option value="france">France 🇫🇷</option>
                                    <option value="espagne">Espagne 🇪🇸</option>
                                    <option value="italie">Italie 🇮🇹</option>
                                    <option value="tunisie">Tunisie 🇹🇳</option>
                                    <option value="algerie">Algérie 🇩🇿</option>
                                    <option value="autres">Autres</option>
                                </select>
                            ) : (
                                <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    {formData.natCl === 'maroc' ? 'Maroc 🇲🇦' :
                                     formData.natCl === 'france' ? 'France 🇫🇷' :
                                     formData.natCl === 'espagne' ? 'Espagne 🇪🇸' :
                                     formData.natCl === 'italie' ? 'Italie 🇮🇹' :
                                     formData.natCl === 'tunisie' ? 'Tunisie 🇹🇳' :
                                     formData.natCl === 'algerie' ? 'Algérie 🇩🇿' :
                                     formData.natCl || "Non renseigné"}
                                </p>
                            )}
                        </div>

                        {/* CIN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CIN
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fb923c] focus:border-[#fb923c]"
                                    placeholder="AA123456"
                                />
                            ) : (
                                <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg flex items-center gap-2">
                                    <CreditCard size={16} className="text-gray-400" />
                                    {formData.cin || "Non renseigné"}
                                </p>
                            )}
                        </div>

                        {/* Passport */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Passeport
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="passport"
                                    value={formData.passport}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#fb923c] focus:border-[#fb923c]"
                                    placeholder="AB1234567"
                                />
                            ) : (
                                <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg flex items-center gap-2">
                                    <Shield size={16} className="text-gray-400" />
                                    {formData.passport || "Non renseigné"}
                                </p>
                            )}
                        </div>

                        {/* Date d'inscription (non modifiable) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Membre depuis
                            </label>
                            <p className="text-gray-800 py-2 bg-gray-50 px-4 rounded-lg flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                {clientProfile?.client?.dateInscription
                                    ? new Date(clientProfile.client.dateInscription).toLocaleDateString('fr-FR')
                                    : "Non renseigné"}
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
