import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { 
    Calendar, Clock, MapPin, Globe, DollarSign, ArrowLeft, Edit, Trash2,
    Users, Plane, Luggage, CheckCircle, Info, Heart, Tag, Star,
    AlertCircle, Loader2, Home, Eye, FileText, Phone, Coffee
} from "lucide-react";

export default function VoyageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [voyage, setVoyage] = useState(null);
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
        fetchVoyageDetails();
    }, [id]);

    const fetchVoyageDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/voyages/${id}`);
            
            let voyageData = response.data.data || response.data;
            let serviceData = voyageData.service || voyageData;
            let voyageDetails = voyageData.voyage || voyageData;
            
            setVoyage({
                ...serviceData,
                ...voyageDetails,
                destination: voyageDetails.destination || voyageData.destination
            });
            
        } catch (err) {
            console.error('Error:', err);
            setError("Voyage non trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await axiosClient.delete(`/voyages/${id}`);
            alert("Voyage supprimé avec succès!");
            navigate('/admin/voyages');
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Calculer la durée du séjour
    const calculateDuration = () => {
        if (voyage?.dateDepartV && voyage?.dateRetourV) {
            const start = new Date(voyage.dateDepartV);
            const end = new Date(voyage.dateRetourV);
            const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        return voyage?.duree || 0;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const duration = calculateDuration();

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

    if (error || !voyage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Erreur</h2>
                    <p className="text-gray-500 mb-6">{error || "Voyage non trouvé"}</p>
                    <Link to="/admin/voyages" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
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
                        <Link to="/admin/voyages" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
                            <ArrowLeft size={20} />
                            Retour à la liste
                        </Link>
                        <div className="flex gap-3">
                            <Link
                                to={`/admin/editVoyage/${id}`}
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
            <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${voyage.image ? getImageUrl(voyage.image) : '/placeholder-voyage.jpg'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 text-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                            ✈️ Voyage organisé
                        </span>
                        {voyage.enVedette === 1 && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-white" />
                                Populaire
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{voyage.nomServ}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{voyage.destination?.pays || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{duration} jours / {duration - 1} nuits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5" />
                            <span>Départ: {formatDate(voyage.dateDepartV)}</span>
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
                            {/* Destination Info */}
                            {voyage.destination && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">📍 Destination</h2>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {voyage.destination.ville?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{voyage.destination.ville}</h3>
                                            <p className="text-gray-500">{voyage.destination.pays} - {voyage.destination.continente}</p>
                                        </div>
                                    </div>
                                    {voyage.destination.description && (
                                        <p className="text-gray-600">{voyage.destination.description}</p>
                                    )}
                                </div>
                            )}

                            {/* Dates du voyage */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📅 Dates du voyage</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-orange-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                                            <Plane className="w-5 h-5" />
                                            <span className="font-semibold">Départ</span>
                                        </div>
                                        <p className="text-lg font-medium">{formatDate(voyage.dateDepartV)}</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                                            <Plane className="w-5 h-5 rotate-180" />
                                            <span className="font-semibold">Retour</span>
                                        </div>
                                        <p className="text-lg font-medium">{formatDate(voyage.dateRetourV)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {voyage.description && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">📖 Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{voyage.description}</p>
                                </div>
                            )}

                            {/* Programme / Itinéraire */}
                            {voyage.programme && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">📋 Programme / Itinéraire</h2>
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <pre className="text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{voyage.programme}</pre>
                                    </div>
                                </div>
                            )}

                            {/* Villes à visiter */}
                            {voyage.selected_cities && voyage.selected_cities.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">🏙️ Villes à visiter</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {voyage.selected_cities.map((city, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                <MapPin size={12} />
                                                {city}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Informations administratives */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📊 Informations administratives</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Date de création</div>
                                        <div className="font-semibold text-gray-800">
                                            {voyage.created_at ? new Date(voyage.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Dernière modification</div>
                                        <div className="font-semibold text-gray-800">
                                            {voyage.updated_at ? new Date(voyage.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">ID du service</div>
                                        <div className="font-mono text-gray-800">{voyage.id}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">ID de destination</div>
                                        <div className="font-mono text-gray-800">{voyage.destination_id || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                {/* Prix */}
                                <div className="border-b pb-4 mb-4">
                                    {voyage.oldPrix && (
                                        <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                                            <Tag className="w-4 h-4" />
                                            Économisez {Math.round(((voyage.oldPrix - voyage.prix) / voyage.oldPrix) * 100)}%
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-2">
                                        {voyage.oldPrix && (
                                            <span className="text-lg text-gray-400 line-through">{voyage.oldPrix} MAD</span>
                                        )}
                                        <span className="text-3xl font-bold text-orange-500">{voyage.prix} MAD</span>
                                        <span className="text-gray-500">/pers</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Taxes incluses</p>
                                </div>

                                {/* Actions rapides */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700 mb-2">Actions rapides</h3>
                                    <Link
                                        to={`/admin/editVoyage/${id}`}
                                        className="w-full bg-green-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-green-600"
                                    >
                                        <Edit size={18} />
                                        Modifier le voyage
                                    </Link>
                                    <Link
                                        to={`/admin/voyages`}
                                        className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-gray-200"
                                    >
                                        <Eye size={18} />
                                        Voir tous les voyages
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
                                        <span className="text-gray-500">Nuits</span>
                                        <span className="font-medium text-gray-800">{duration - 1} nuits</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Prix par nuit</span>
                                        <span className="font-medium text-gray-800">{Math.round(voyage.prix / duration)} MAD</span>
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
                                    Admin Panel • Gestion des voyages
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}