// src/pages/services/CircuitsTouristiques.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Star, Camera, Trash2, Edit, Eye, MapPin, Globe } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminVoyages() {
    const [voyages, setVoyages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    // Get the base URL for images
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        let cleanPath = imagePath.replace(/^public\//, '');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${cleanPath}`;
    };

    // Fetch voyages from API
    useEffect(() => {
        fetchVoyages();
    }, []);

    const fetchVoyages = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/voyages');
            console.log('Full response:', response);
            console.log('Voyages data:', response.data);

            let voyagesData = [];
            if (response.data && response.data.data) {
                voyagesData = response.data.data;
            } else if (Array.isArray(response.data)) {
                voyagesData = response.data;
            } else if (response.data && response.data.voyages) {
                voyagesData = response.data.voyages;
            } else {
                voyagesData = [];
            }

            console.log('Processed voyages:', voyagesData);
            setVoyages(voyagesData);
            setError("");
        } catch (err) {
            console.error('Error fetching voyages:', err);
            setError("Erreur lors du chargement des voyages");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce voyage ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/voyages/${id}`);
            await fetchVoyages();
            alert("Voyage supprimé avec succès!");
        } catch (err) {
            console.error('Error deleting voyage:', err);
            setError("Erreur lors de la suppression du voyage");
        } finally {
            setDeletingId(null);
        }
    };

    // Helper function to get country from destination
    const getCountry = (voyage) => {
        if (voyage.destination && voyage.destination.pays) {
            return voyage.destination.pays;
        }
        if (voyage.voyage && voyage.voyage.destination && voyage.voyage.destination.pays) {
            return voyage.voyage.destination.pays;
        }
        return "N/A";
    };

    // Helper function to get the city (ville) from destination
    const getCity = (voyage) => {
        if (voyage.destination && voyage.destination.ville) {
            return voyage.destination.ville;
        }
        if (voyage.voyage && voyage.voyage.destination && voyage.voyage.destination.ville) {
            return voyage.voyage.destination.ville;
        }
        return "N/A";
    };

    // Helper function to get duration
    const getDuration = (voyage) => {
        if (voyage.duree) {
            return voyage.duree;
        }
        if (voyage.voyage && voyage.voyage.duree) {
            return voyage.voyage.duree;
        }
        if (voyage.dateDepartV && voyage.dateRetourV) {
            const depart = new Date(voyage.dateDepartV);
            const retour = new Date(voyage.dateRetourV);
            const diffDays = Math.ceil((retour - depart) / (1000 * 60 * 60 * 24));
            return `${diffDays} jours / ${diffDays - 1} nuits`;
        }
        return "N/A";
    };

    const handleImageError = (voyageId) => {
        setImageErrors(prev => ({ ...prev, [voyageId]: true }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des voyages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        );
    }

    return (
        <div className="service-circuits">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Voyages</h1>
                <Link
                    to={`/admin/AjouterVoyage`}
                    className="bg-[#fb923c] text-white px-4 py-2 rounded-md hover:bg-[#ea580c] transition flex items-center gap-2"
                >
                    + Ajouter un voyage
                </Link>
            </div>

            {voyages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun voyage trouvé</p>
                    <Link
                        to="/admin/AjouterVoyage"
                        className="text-[#fb923c] hover:underline mt-2 inline-block"
                    >
                        Ajouter votre premier voyage
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Titre</th>
                                <th className="p-3">Durée</th>
                                <th className="p-3">Pays</th>
                                <th className="p-3">Ville</th>
                                <th className="p-3">Prix</th>
                                <th className="p-3">Date Départ</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voyages.map((voyage) => {
                                const serviceData = voyage.service || voyage;
                                const voyageData = voyage.voyage || voyage;
                                const voyageId = voyage.id || voyageData.id;

                                return (
                                    <tr key={voyageId} className="border-b hover:bg-gray-50 transition">
                                        {/* IMAGE */}
                                        <td className="p-3">
                                            {serviceData.image && !imageErrors[voyageId] ? (
                                                <img
                                                    src={getImageUrl(serviceData.image)}
                                                    alt={serviceData.nomServ}
                                                    className="w-20 h-14 object-cover rounded-md"
                                                    onError={() => handleImageError(voyageId)}
                                                />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <Camera size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        {/* TITLE */}
                                        <td className="p-3 font-semibold">
                                            {serviceData.nomServ || "Sans titre"}
                                        </td>

                                        {/* DURATION */}
                                        <td className="p-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {getDuration(voyageData)}
                                            </div>
                                        </td>

                                        {/* COUNTRY */}
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <Globe size={14} className="text-[#fb923c]" />
                                                <span className="text-sm font-medium">
                                                    {getCountry(voyageData)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* CITY - Single city */}
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-[#fb923c]" />
                                                <span className="text-sm">
                                                    {getCity(voyageData)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* PRICE */}
                                        <td className="p-3 font-bold text-[#fb923c]">
                                            {serviceData.prix ? `${serviceData.prix} DH` : "N/A"}
                                        </td>

                                        {/* DEPARTURE DATE */}
                                        <td className="p-3 text-sm">
                                            {voyageData.dateDepartV ? new Date(voyageData.dateDepartV).toLocaleDateString('fr-FR') : "N/A"}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/showVoyage/${voyageId}`}
                                                    className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition"
                                                    title="Détails"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                <Link
                                                    to={`/admin/editVoyage/${voyageId}`}
                                                    className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(voyageId)}
                                                    disabled={deletingId === voyageId}
                                                    className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === voyageId ? (
                                                        <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}