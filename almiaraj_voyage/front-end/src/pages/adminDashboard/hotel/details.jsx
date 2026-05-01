import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { 
    Calendar, Clock, MapPin, Globe, Star, ArrowLeft, Edit, Trash2, 
    Wifi, Coffee, Car, Dumbbell, Utensils, Sparkles, Users, Phone,
    CheckCircle, Heart, Bath, Wind, Tv, ShieldCheck, ParkingCircle,
    AlertCircle, Loader2, CreditCard, Home, Building, Eye
} from "lucide-react";

export default function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
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
        fetchHotelDetails();
    }, [id]);

    const fetchHotelDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/hotels/${id}`);
            
            let hotelData = response.data.data || response.data;
            let serviceData = hotelData.service || hotelData;
            let hotelDetails = hotelData.hotel || hotelData;
            
            // Parse amenities if it's a string
            let amenitiesArray = [];
            if (hotelDetails.amenities) {
                if (typeof hotelDetails.amenities === 'string') {
                    try {
                        amenitiesArray = JSON.parse(hotelDetails.amenities);
                    } catch (e) {
                        amenitiesArray = hotelDetails.amenities.split(',');
                    }
                } else if (Array.isArray(hotelDetails.amenities)) {
                    amenitiesArray = hotelDetails.amenities;
                }
            }
            
            setHotel({
                ...serviceData,
                ...hotelDetails,
                amenitiesArray,
                destination: hotelDetails.destination || hotelData.destination
            });
            
        } catch (err) {
            console.error('Error:', err);
            setError("Hôtel non trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await axiosClient.delete(`/hotels/${id}`);
            alert("Hôtel supprimé avec succès!");
            navigate('/admin/hotels');
        } catch (err) {
            setError("Erreur lors de la suppression");
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const getAmenitiesWithIcons = (amenities) => {
        const amenitiesMap = {
            'Wifi gratuit': { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi gratuit', color: '#3b82f6' },
            'wifi': { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi gratuit', color: '#3b82f6' },
            'Petit-déjeuner': { icon: <Coffee className="w-5 h-5" />, label: 'Petit-déjeuner', color: '#f59e0b' },
            'petit-déjeuner': { icon: <Coffee className="w-5 h-5" />, label: 'Petit-déjeuner', color: '#f59e0b' },
            'Parking gratuit': { icon: <ParkingCircle className="w-5 h-5" />, label: 'Parking gratuit', color: '#10b981' },
            'parking': { icon: <ParkingCircle className="w-5 h-5" />, label: 'Parking gratuit', color: '#10b981' },
            'Piscine': { icon: <Wind className="w-5 h-5" />, label: 'Piscine', color: '#06b6d4' },
            'piscine': { icon: <Wind className="w-5 h-5" />, label: 'Piscine', color: '#06b6d4' },
            'Climatisation': { icon: <Wind className="w-5 h-5" />, label: 'Climatisation', color: '#8b5cf6' },
            'Salle de sport': { icon: <Dumbbell className="w-5 h-5" />, label: 'Salle de sport', color: '#ef4444' },
            'gym': { icon: <Dumbbell className="w-5 h-5" />, label: 'Salle de sport', color: '#ef4444' },
            'Spa': { icon: <Sparkles className="w-5 h-5" />, label: 'Spa & Bien-être', color: '#ec4899' },
            'spa': { icon: <Sparkles className="w-5 h-5" />, label: 'Spa & Bien-être', color: '#ec4899' },
            'Restaurant': { icon: <Utensils className="w-5 h-5" />, label: 'Restaurant', color: '#f97316' },
            'restaurant': { icon: <Utensils className="w-5 h-5" />, label: 'Restaurant', color: '#f97316' },
            'Service d\'étage': { icon: <Coffee className="w-5 h-5" />, label: 'Service d\'étage', color: '#8b5cf6' },
            'Réception 24/7': { icon: <Clock className="w-5 h-5" />, label: 'Réception 24/7', color: '#06b6d4' },
            'Animaux acceptés': { icon: <Heart className="w-5 h-5" />, label: 'Animaux acceptés', color: '#f59e0b' },
            'Familles': { icon: <Users className="w-5 h-5" />, label: 'Adapté aux familles', color: '#10b981' }
        };
        
        return amenities.map(amenity => {
            const found = amenitiesMap[amenity];
            if (found) return found;
            return { icon: <CheckCircle className="w-5 h-5 text-green-500" />, label: amenity, color: '#6b7280' };
        });
    };

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

    if (error || !hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Erreur</h2>
                    <p className="text-gray-500 mb-6">{error || "Hôtel non trouvé"}</p>
                    <Link to="/admin/hotels" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                        <ArrowLeft size={18} />
                        Retour à la liste
                    </Link>
                </div>
            </div>
        );
    }

    const amenitiesList = getAmenitiesWithIcons(hotel.amenitiesArray || []);
    const starRating = Math.floor(hotel.rating || 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Navigation */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/admin/hotels" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
                            <ArrowLeft size={20} />
                            Retour à la liste
                        </Link>
                        <div className="flex gap-3">
                            <Link
                                to={`/admin/editHotel/${id}`}
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
            <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image ? getImageUrl(hotel.image) : '/placeholder-hotel.jpg'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 text-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                            🏨 Hôtel
                        </span>
                        {hotel.enVedette === 1 && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-white" />
                                Populaire
                            </span>
                        )}
                        <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-white" />
                            {hotel.rating || 0} / 5
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{hotel.nomServ}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{hotel.destination?.ville || 'N/A'}, {hotel.destination?.pays || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            <span>ID: #{hotel.id}</span>
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
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📖 Description</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {hotel.description || "Aucune description disponible pour cet hôtel."}
                                </p>
                            </div>

                            {/* Équipements & Services */}
                            {amenitiesList.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">🛎️ Équipements & Services</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {amenitiesList.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-700 py-2 border-b border-gray-100">
                                                <div style={{ color: item.color }}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-sm">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Destination Info */}
                            {hotel.destination && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold mb-4">📍 Destination</h2>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {hotel.destination.ville?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{hotel.destination.ville}</h3>
                                            <p className="text-gray-500">{hotel.destination.pays} - {hotel.destination.continente}</p>
                                        </div>
                                    </div>
                                    {hotel.destination.description && (
                                        <p className="text-gray-600">{hotel.destination.description}</p>
                                    )}
                                </div>
                            )}

                            {/* Statistiques et Informations Admin */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📊 Informations administratives</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Date de création</div>
                                        <div className="font-semibold text-gray-800">
                                            {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Dernière modification</div>
                                        <div className="font-semibold text-gray-800">
                                            {hotel.updated_at ? new Date(hotel.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">ID du service</div>
                                        <div className="font-mono text-gray-800">{hotel.id}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">ID de destination</div>
                                        <div className="font-mono text-gray-800">{hotel.destination_id || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                {/* Prix */}
                                <div className="border-b pb-4 mb-4">
                                    {hotel.oldPrix && (
                                        <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                                            💰 Économisez {Math.round(((hotel.oldPrix - hotel.prix) / hotel.oldPrix) * 100)}%
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-2">
                                        {hotel.oldPrix && (
                                            <span className="text-lg text-gray-400 line-through">{hotel.oldPrix} MAD</span>
                                        )}
                                        <span className="text-3xl font-bold text-orange-500">{hotel.prix} MAD</span>
                                        <span className="text-gray-500">/nuit</span>
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
                                    <div className="text-2xl font-bold text-orange-500">{hotel.rating || 0} / 5</div>
                                    <div className="text-xs text-gray-400 mt-1">Basé sur les avis clients</div>
                                </div>

                                {/* Actions rapides */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700 mb-2">Actions rapides</h3>
                                    <Link
                                        to={`/admin/editHotel/${id}`}
                                        className="w-full bg-green-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-green-600"
                                    >
                                        <Edit size={18} />
                                        Modifier l'hôtel
                                    </Link>
                                    <Link
                                        to={`/admin/hotels`}
                                        className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-gray-200"
                                    >
                                        <Eye size={18} />
                                        Voir tous les hôtels
                                    </Link>
                                    <Link
                                        to="/admin/dashboard"
                                        className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 hover:bg-orange-600"
                                    >
                                        <Home size={18} />
                                        Tableau de bord
                                    </Link>
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
                                    Admin Panel • Gestion des hôtels
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}