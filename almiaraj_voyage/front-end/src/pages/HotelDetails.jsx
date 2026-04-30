// pages/HotelDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft, MapPin, Star, Calendar, Clock, Users, ChevronRight,
    Wifi, Coffee, Wind, Phone, CheckCircle, Heart,
    Bath, Utensils, Dumbbell, Sparkles, Tv, ShieldCheck, Clock as ClockIcon,
    ParkingCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HotelDetailsCl() {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getHotelDetails } = useAuth();

    useEffect(() => {
        const fetchHotelDetails = async () => {
            setLoading(true);
            setError(null);

            console.log("Fetching hotel with id:", id);

            const data = await getHotelDetails(id);
            console.log("Received data:", data);

            if (data && data.id) {
                setHotel(data);
            } else if (data && data.success === false) {
                setError(data.message || "Hôtel non trouvé");
            } else if (!data) {
                setError("Impossible de charger les détails de l'hôtel");
            }

            setLoading(false);
        };

        if (id) {
            fetchHotelDetails();
        } else {
            setError("ID de l'hôtel manquant");
            setLoading(false);
        }
    }, [id, getHotelDetails]);

    const getAmenitiesList = (amenitiesString) => {
        if (!amenitiesString) return [];
        const amenities = amenitiesString.split(',').map(a => a.trim());

        const amenitiesWithIcons = {
            'Wifi': { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi gratuit' },
            'wifi': { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi gratuit' },
            'WiFi': { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi gratuit' },
            'Hamam': { icon: <Bath className="w-5 h-5" />, label: 'Hamam & Spa' },
            'hamam': { icon: <Bath className="w-5 h-5" />, label: 'Hamam & Spa' },
            'Petit-déjeuner': { icon: <Coffee className="w-5 h-5" />, label: 'Petit-déjeuner inclus' },
            'petit-déjeuner': { icon: <Coffee className="w-5 h-5" />, label: 'Petit-déjeuner inclus' },
            'Vue mer': { icon: <Wind className="w-5 h-5" />, label: 'Vue sur mer' },
            'vue mer': { icon: <Wind className="w-5 h-5" />, label: 'Vue sur mer' },
            'Parking': { icon: <ParkingCircle className="w-5 h-5" />, label: 'Parking gratuit' },
            'parking': { icon: <ParkingCircle className="w-5 h-5" />, label: 'Parking gratuit' },
            'Spa': { icon: <Sparkles className="w-5 h-5" />, label: 'Spa & Bien-être' },
            'spa': { icon: <Sparkles className="w-5 h-5" />, label: 'Spa & Bien-être' },
            'Restaurant': { icon: <Utensils className="w-5 h-5" />, label: 'Restaurant' },
            'restaurant': { icon: <Utensils className="w-5 h-5" />, label: 'Restaurant' },
            'Gym': { icon: <Dumbbell className="w-5 h-5" />, label: 'Salle de sport' },
            'gym': { icon: <Dumbbell className="w-5 h-5" />, label: 'Salle de sport' },
            'TV': { icon: <Tv className="w-5 h-5" />, label: 'TV écran plat' },
            'tv': { icon: <Tv className="w-5 h-5" />, label: 'TV écran plat' },
        };

        return amenities.map(amenity => {
            const found = amenitiesWithIcons[amenity];
            return {
                label: found ? found.label : amenity,
                icon: found ? found.icon : <CheckCircle className="w-5 h-5 text-green-500" />
            };
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-4">Erreur</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link to="/destinations" className="text-orange-500 hover:underline">
                        Retour aux destinations
                    </Link>
                </div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏨</div>
                    <h2 className="text-2xl font-bold mb-4">Hôtel non trouvé</h2>
                    <Link to="/destinations" className="text-orange-500 hover:underline">
                        Retour aux destinations
                    </Link>
                </div>
            </div>
        );
    }

    const service = hotel.service;
    const destination = hotel.destination;
    const amenities = getAmenitiesList(hotel.amenities);

    return (
        <div className="hotel-details-page">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${service?.image || destination?.image || '/placeholder.jpg'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                <div className="absolute top-6 left-6 right-6 z-10">
                    <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                </div>
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 text-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                            🏨 Hôtel de luxe
                        </span>
                        {service?.enVedette === 1 && (
                            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-white" />
                                Populaire
                            </span>
                        )}
                        <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-white" />
                            {service?.rating} / 5
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">{service?.nomServ}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{hotel.villeHotel}, {destination?.pays}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span>4 étoiles</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Left */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Destination Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📍 Emplacement</h2>
                                <div className="flex items-center gap-4 mb-4">
                                    {destination?.image && (
                                        <div className="w-20 h-20 rounded-full overflow-hidden">
                                            <img src={service.image} alt={destination.nom} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-semibold">{destination?.nom}</h3>
                                        <p className="text-gray-500">{destination?.pays} - {destination?.continente}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">{destination?.description}</p>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📖 Description</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {service?.description || `L'hôtel ${hotel.villeHotel} vous accueille dans un cadre exceptionnel.
                                    Profitez d'un séjour de luxe avec des prestations de qualité et un service irréprochable.`}
                                </p>
                            </div>

                            {/* Équipements & Services */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">🛎️ Équipements & Services</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {amenities.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-700 py-2 border-b border-gray-100">
                                            {item.icon}
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Informations pratiques */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">ℹ️ Informations pratiques</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* <div className="flex items-center gap-3 text-gray-600">
                                        <ClockIcon className="w-5 h-5 text-orange-500" />
                                        <span>Check-in: 14:00 | Check-out: 12:00</span>
                                    </div> */}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Users className="w-5 h-5 text-orange-500" />
                                        <span>Capacité: Jusqu'à 4 personnes/chambre</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="w-5 h-5 text-orange-500" />
                                        <span>Service client 24h/24</span>
                                    </div>
                                    {/* <div className="flex items-center gap-3 text-gray-600">
                                        <ShieldCheck className="w-5 h-5 text-orange-500" />
                                        <span>Certifié COVID-19 Safe</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                {/* Price */}
                                <div className="border-b pb-4 mb-4">
                                    {service?.oldPrix && (
                                        <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                                            💰 Économisez {Math.round(((service.oldPrix - service.prix) / service.oldPrix) * 100)}%
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-2">
                                        {service?.oldPrix && (
                                            <span className="text-lg text-gray-400 line-through">{service.oldPrix} MAD</span>
                                        )}
                                        <span className="text-3xl font-bold text-orange-500">{service?.prix} MAD</span>
                                        <span className="text-gray-500">/nuit</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Taxes incluses</p>
                                </div>

                                {/* What's included */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">✅ Ce qui est inclus</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Petit-déjeuner buffet</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Wi-Fi haut débit</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Accès à la piscine</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Parking gratuit</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Service de navette</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cancellation policy */}
                                <div className="mb-6 p-3 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold mb-2 text-sm">📋 Politique d'annulation</h3>
                                    <p className="text-xs text-gray-500">
                                        Annulation gratuite jusqu'à 7 jours avant l'arrivée.
                                        Frais de 50% appliqués entre 7 et 3 jours avant.
                                        Non remboursable moins de 72h.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <Link
                                    to={`reserver`}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mb-3"
                                >
                                    Réserver maintenant
                                    <ChevronRight className="w-4 h-4" />
                                </Link>

                                <Link to='/contact' className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Contacter l'hôtel
                                </Link>

                                <div className="flex items-center justify-center gap-1 mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(service?.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">{service?.rating} / 5</span>
                                </div>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Paiement sécurisé • Annulation gratuite • Assistance 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
