import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { 
    Calendar, Clock, Bed, ArrowLeft, Edit, Trash2, DollarSign, FileText,
    Users, Plane, Hotel, Bus, Coffee, CheckCircle, Heart, Star, Tag,
    AlertCircle, Loader2, Home, Eye, Phone, Mail, Shield, Info
} from "lucide-react";

export default function HajjOmraDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${imagePath}`;
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/hajj-omras/${id}`);
            
            let itemData = response.data.data || response.data;
            let serviceData = itemData.service || itemData;
            let detailsData = itemData.hajj_omra || itemData;
            
            setItem({
                ...serviceData,
                ...detailsData,
            });
            
        } catch (err) {
            console.error('Error:', err);
            setError("Service non trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await axiosClient.delete(`/hajj-omras/${id}`);
            alert("Service supprimé avec succès!");
            navigate('/admin/hajj-omras');
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price);
    };

    const getDiscountPercent = (oldPrice, price) => {
        if (oldPrice && oldPrice > price) {
            return Math.round(((oldPrice - price) / oldPrice) * 100);
        }
        return 0;
    };

    const discount = getDiscountPercent(item?.oldPrix, item?.prix);
    const isHajj = item?.type === "hajj";
    const starRating = Math.floor(item?.rating || 0);

    // Calculate duration
    let duration = item?.duree || 0;
    if (item?.dateDepartHO && item?.dateRetourHO && !duration) {
        const start = new Date(item.dateDepartHO);
        const end = new Date(item.dateRetourHO);
        duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Erreur</h2>
                    <p className="text-gray-500 mb-6">{error || "Service non trouvé"}</p>
                    <Link to="/admin/hajj-omras" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                        <ArrowLeft size={18} />
                        Retour à la liste
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Navigation */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/admin/hajj-omras" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
                            <ArrowLeft size={20} />
                            Retour à la liste
                        </Link>
                        <div className="flex gap-3">
                            <Link
                                to={`/admin/editHajj-omra/${id}`}
                                className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                <Edit size={18} />
                                Modifier
                            </Link>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    <Trash2 size={18} />
                                    Supprimer
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={18} />}
                                        {deleting ? "Suppression..." : "Confirmer"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${item.image ? getImageUrl(item.image) : '/placeholder-hajj.jpg'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 text-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-full ${isHajj ? 'bg-green-600' : 'bg-blue-600'}`}>
                            {isHajj ? '🕋 Hajj' : '🕌 Omra'}
                        </span>
                        {discount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                -{discount}%
                            </span>
                        )}
                        {item.enVedette === 1 && (
                            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-white" />
                                Populaire
                            </span>
                        )}
                        <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-white" />
                            {item.rating || 0} / 5
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{item.nomServ}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>Départ: {formatDate(item.dateDepartHO)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>Retour: {formatDate(item.dateRetourHO)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{duration} jours</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Left */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            {item.description && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">📖 Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                </div>
                            )}

                            {/* Hébergement & Transport */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">🏨 Hébergement & Transport</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-gray-600 py-2 border-b border-gray-100">
                                        <Hotel className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <div className="text-xs text-gray-400">Hébergement</div>
                                            <div className="font-medium">{item.hotel || "Non spécifié"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 py-2 border-b border-gray-100">
                                        <Bus className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <div className="text-xs text-gray-400">Transport</div>
                                            <div className="font-medium">{item.transport || "Non spécifié"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 py-2 border-b border-gray-100">
                                        <Coffee className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <div className="text-xs text-gray-400">Repas</div>
                                            <div className="font-medium">{item.meals || "Non spécifié"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 py-2 border-b border-gray-100">
                                        <Bed className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <div className="text-xs text-gray-400">Type de chambre</div>
                                            <div className="font-medium">{item.typeChambre || "Non spécifié"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formule et Détails */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📋 Détails du forfait</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Formule</div>
                                        <div className="font-semibold text-gray-800">{item.formule || "Standard"}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Type de chambre</div>
                                        <div className="font-semibold text-gray-800">{item.typeChambre || "Non spécifié"}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Durée</div>
                                        <div className="font-semibold text-gray-800">{duration} jours</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Prix par personne</div>
                                        <div className="font-semibold text-orange-500">{formatPrice(item.prix)} DH</div>
                                    </div>
                                </div>
                            </div>

                            {/* Services Inclus */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">✅ Services inclus</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Vols internationaux</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Visa inclus</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Hébergement</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Transport sur place</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Repas inclus</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Guide francophone</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Assistance 24/7</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Transferts aéroport</span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations administratives */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📊 Informations administratives</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Date de création</div>
                                        <div className="font-semibold text-gray-800">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Dernière modification</div>
                                        <div className="font-semibold text-gray-800">
                                            {item.updated_at ? new Date(item.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">ID du service</div>
                                        <div className="font-mono text-gray-800">{item.id}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Type</div>
                                        <div className="font-semibold text-gray-800 capitalize">{item.type || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                {/* Prix */}
                                <div className="border-b pb-4 mb-4">
                                    {discount > 0 && (
                                        <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                                            <Tag className="w-4 h-4" />
                                            Économisez {discount}%
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-2">
                                        {item.oldPrix && (
                                            <span className="text-lg text-gray-400 line-through">{formatPrice(item.oldPrix)} DH</span>
                                        )}
                                        <span className="text-3xl font-bold text-orange-500">{formatPrice(item.prix)} DH</span>
                                        <span className="text-gray-500">/pers</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Taxes incluses</p>
                                </div>

                                {/* Note */}
                                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Note attribuée</span>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < starRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-orange-500">{item.rating || 0} / 5</div>
                                    <div className="text-xs text-gray-400 mt-1">Basé sur les avis clients</div>
                                </div>

                                {/* Actions rapides */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700 mb-2">Actions rapides</h3>
                                    <Link
                                        to={`/admin/editHajj-omra/${id}`}
                                        className="w-full bg-green-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-green-600"
                                    >
                                        <Edit size={18} />
                                        Modifier le forfait
                                    </Link>
                                    <Link
                                        to={`/admin/hajj-omras`}
                                        className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-gray-200"
                                    >
                                        <Eye size={18} />
                                        Voir tous les forfaits
                                    </Link>
                                    <Link
                                        to="/admin"
                                        className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-orange-600"
                                    >
                                        <Home size={18} />
                                        Tableau de bord
                                    </Link>
                                </div>

                                {/* Statistiques rapides */}
                                <div className="mt-6 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Durée</span>
                                        <span className="font-medium text-gray-800">{duration} jours</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Type de chambre</span>
                                        <span className="font-medium text-gray-800">{item.typeChambre || "Non spécifié"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Formule</span>
                                        <span className="font-medium text-gray-800">{item.formule || "Standard"}</span>
                                    </div>
                                </div>

                                {/* Badge de statut */}
                                <div className="mt-6 p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Statut</span>
                                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                            <CheckCircle size={14} />
                                            Actif
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Admin Panel • Gestion Hajj & Omra
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}