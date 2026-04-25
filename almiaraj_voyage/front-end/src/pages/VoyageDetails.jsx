// pages/VoyageDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Calendar, Clock, Users, ChevronRight, Plane, Luggage, CheckCircle, Info, Phone, Hotel, Coffee, Heart, Tag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VoyageDetails() {
    const { id } = useParams();
    const [voyage, setVoyage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getVoyageDetails } = useAuth();

    useEffect(() => {
        const fetchVoyageDetails = async () => {
            setLoading(true);
            setError(null);

            console.log("Fetching voyage with id:", id);

            const data = await getVoyageDetails(id);
            console.log("Received data:", data);

            if (data && data.id) {
                setVoyage(data);
            } else if (data && data.success === false) {
                setError(data.message || "Voyage non trouvé");
            } else if (!data) {
                setError("Impossible de charger les détails du voyage");
            }

            setLoading(false);
        };

        if (id) {
            fetchVoyageDetails();
        } else {
            setError("ID du voyage manquant");
            setLoading(false);
        }
    }, [id, getVoyageDetails]);

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

    if (!voyage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">✈️</div>
                    <h2 className="text-2xl font-bold mb-4">Voyage non trouvé</h2>
                    <Link to="/destinations" className="text-orange-500 hover:underline">
                        Retour aux destinations
                    </Link>
                </div>
            </div>
        );
    }

    const service = voyage.service;
    const destination = voyage.destination;

    // Calculer la durée du séjour
    const startDate = new Date(voyage.dateDepartV);
    const endDate = new Date(voyage.dateRetourV);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Formater les dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="voyage-details-page">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${destination?.image || service?.image || '/placeholder.jpg'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                <div className="absolute top-6 left-6 right-6 z-10">
                    <button onClick={() => window.history.back()}  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                </div>
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 text-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                            ✈️ Voyage organisé
                        </span>
                        {service?.enVedette === 1 && (
                            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-white" />
                                Populaire
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">{service?.nomServ}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{destination?.pays || voyage.destinationV}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{duration} jours / {duration - 1} nuits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span>Groupe de {voyage.groupSize || 20} pers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{service?.rating} / 5</span>
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
                                <h2 className="text-2xl font-bold mb-4">📍 Destination</h2>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden">
                                        <img src={destination?.image} alt={destination?.nom} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{destination?.nom}</h3>
                                        <p className="text-gray-500">{destination?.pays} - {destination?.continente}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">{destination?.description}</p>
                            </div>

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
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">📖 Description</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {service?.description || `Partez à la découverte de ${destination?.pays || voyage.destinationV} lors de ce voyage organisé de ${duration} jours.
                                    Un séjour inoubliable vous attend avec un programme varié alliant culture, gastronomie et détente.`}
                                </p>
                            </div>

                            {/* Informations pratiques */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold mb-4">ℹ️ Informations pratiques</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* <div className="flex items-center gap-3 text-gray-600">
                                        <Users className="w-5 h-5 text-orange-500" />
                                        <span>Groupe de {voyage.groupSize || 20} personnes maximum</span>
                                    </div> */}
                                    {/* <div className="flex items-center gap-3 text-gray-600">
                                        <Luggage className="w-5 h-5 text-orange-500" />
                                        <span>Bagages inclus: 23kg</span>
                                    </div> */}
                                    {/* <div className="flex items-center gap-3 text-gray-600">
                                        <Info className="w-5 h-5 text-orange-500" />
                                        <span>Assurance voyage incluse</span>
                                    </div> */}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Plane className="w-5 h-5 text-orange-500" />
                                        <span>Vols aller-retour inclus</span>
                                    </div>
                                    {/* <div className="flex items-center gap-3 text-gray-600">
                                        <Hotel className="w-5 h-5 text-orange-500" />
                                        <span>Hébergement en hôtel 4*</span>
                                    </div> */}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Coffee className="w-5 h-5 text-orange-500" />
                                        <span>Petit-déjeuner inclus</span>
                                    </div>
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
                                            <Tag className="w-4 h-4" />
                                            Économisez {Math.round(((service.oldPrix - service.prix) / service.oldPrix) * 100)}%
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-2">
                                        {service?.oldPrix && (
                                            <span className="text-lg text-gray-400 line-through">{service.oldPrix} MAD</span>
                                        )}
                                        <span className="text-3xl font-bold text-orange-500">{service?.prix} MAD</span>
                                        <span className="text-gray-500">/pers</span>
                                    </div>
                                </div>

                                {/* What's included */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">✅ Ce qui est inclus</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Vols aller-retour</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Hébergement {duration - 1} nuits</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Petit-déjeuner quotidien</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Visites guidées</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>Assurance voyage</span>
                                        </div>
                                    </div>
                                </div>

                                {/* What's not included */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">❌ Non inclus</h3>
                                    <div className="space-y-2">

                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>• Repas non spécifiés</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>• Frais de visa</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <Link
                                    to={`/reserver/voyage/${voyage.id}`}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mb-3"
                                >
                                    Réserver maintenant
                                    <ChevronRight className="w-4 h-4" />
                                </Link>

                                <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Poser une question
                                </button>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Paiement sécurisé • Annulation gratuite sous 30 jours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
