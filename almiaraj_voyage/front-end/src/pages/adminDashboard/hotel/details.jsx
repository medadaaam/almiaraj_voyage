import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Clock, MapPin, Globe, Star, ArrowLeft, Edit, Trash2, Wifi, Coffee, Car, Dumbbell, Utensils, Sparkles } from "lucide-react";

export default function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

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
            
            setHotel({
                ...serviceData,
                ...hotelDetails,
                destination: hotelDetails.destination
            });
            
        } catch (err) {
            console.error('Error:', err);
            setError("Hôtel non trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet hôtel ?")) return;
        try {
            setDeleting(true);
            await axiosClient.delete(`/hotels/${id}`);
            alert("Hôtel supprimé avec succès!");
            navigate('/admin/hotels');
        } catch (err) {
            setError("Erreur lors de la suppression");
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || "Hôtel non trouvé"}
                </div>
                <Link to="/admin/hotels" className="mt-4 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Retour
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link to="/admin/hotels" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
                <ArrowLeft size={20} /> Retour à la liste
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {hotel.image && (
                    <div className="w-full h-96 overflow-hidden">
                        <img src={getImageUrl(hotel.image)} alt={hotel.nomServ} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{hotel.nomServ}</h1>
                        <div className="text-2xl font-bold text-[#fb923c]">{hotel.prix} DH <span className="text-sm">/nuit</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Globe size={18} />
                            <span>Pays: {hotel.destination?.pays || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Star size={18} className="text-yellow-400" />
                            <span>Note: {hotel.rating || 0} / 5</span>
                        </div>
                    </div>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Sparkles size={18} />
                                Équipements & Services
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                        {amenity === "Wifi gratuit" && <Wifi size={14} />}
                                        {amenity === "Petit-déjeuner" && <Coffee size={14} />}
                                        {amenity === "Parking gratuit" && <Car size={14} />}
                                        {amenity === "Salle de sport" && <Dumbbell size={14} />}
                                        {amenity === "Restaurant" && <Utensils size={14} />}
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {hotel.description && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
                        </div>
                    )}


                    <div className="flex gap-3 pt-4 border-t">
                        <Link
                            to={`/admin/editHotel/${id}`}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Modifier
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            {deleting ? "Suppression..." : "Supprimer"}
                        </button>
                        <Link
                            to="/admin"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                        >
                            Fermer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}