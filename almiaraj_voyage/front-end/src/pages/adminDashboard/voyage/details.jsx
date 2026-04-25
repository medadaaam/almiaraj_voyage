import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Clock, MapPin, Globe, DollarSign, ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function VoyageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [voyage, setVoyage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Same image function as index.jsx
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
                destination: voyageDetails.destination
            });
            
        } catch (err) {
            console.error('Error:', err);
            setError("Voyage non trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce voyage ?")) {
            return;
        }

        try {
            setDeleting(true);
            await axiosClient.delete(`/voyages/${id}`);
            alert("Voyage supprimé avec succès!");
            navigate('/admin');
        } catch (err) {
            console.error('Error:', err);
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

    if (error || !voyage) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || "Voyage non trouvé"}
                </div>
                <Link to="/admin" className="mt-4 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Retour
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Back button */}
            <Link to="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
                <ArrowLeft size={20} />
                Retour à la liste
            </Link>

            {/* Main Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image */}
                {voyage.image && (
                    <div className="w-full h-96 overflow-hidden">
                        <img 
                            src={getImageUrl(voyage.image)} 
                            alt={voyage.nomServ}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Title and Price */}
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{voyage.nomServ}</h1>
                        <div className="text-2xl font-bold text-[#fb923c]">
                            {voyage.prix} DH
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Duration */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={18} />
                            <span>Durée: {voyage.duree || "N/A"}</span>
                        </div>

                        {/* Departure Date */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={18} />
                            <span>Départ: {voyage.dateDepartV ? new Date(voyage.dateDepartV).toLocaleDateString('fr-FR') : "N/A"}</span>
                        </div>

                        {/* Return Date */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={18} />
                            <span>Retour: {voyage.dateRetourV ? new Date(voyage.dateRetourV).toLocaleDateString('fr-FR') : "N/A"}</span>
                        </div>

                        {/* Country */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <Globe size={18} />
                            <span>Pays: {voyage.destination?.pays || "N/A"}</span>
                        </div>
                    </div>

                    {/* Cities */}
                    {voyage.selected_cities && voyage.selected_cities.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={18} />
                                Villes à visiter
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {voyage.selected_cities.map((city, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {voyage.description && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{voyage.description}</p>
                        </div>
                    )}

                    {/* Programme */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Programme / Itinéraire</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {voyage.programme}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Link
                            to={`/admin/editVoyage/${id}`}
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