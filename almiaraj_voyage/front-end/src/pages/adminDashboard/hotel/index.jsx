import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Star, Camera, Trash2, Edit, Eye, MapPin, Globe, Wifi } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        let cleanPath = imagePath.replace(/^public\//, '');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${cleanPath}`;
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/hotels');

            let hotelsData = [];
            if (response.data && response.data.data) {
                hotelsData = response.data.data;
            } else if (Array.isArray(response.data)) {
                hotelsData = response.data;
            } else {
                hotelsData = [];
            }

            setHotels(hotelsData);
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement des hôtels");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet hôtel ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/hotels/${id}`);
            await fetchHotels();
            alert("Hôtel supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleImageError = (hotelId) => {
        setImageErrors(prev => ({ ...prev, [hotelId]: true }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des hôtels...</p>
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
        <div className="service-hotels">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Hôtels</h1>
                <Link
                    to={`/admin/ajouterHotel`}
                    className="bg-[#fb923c] text-white px-4 py-2 rounded-md hover:bg-[#ea580c] transition flex items-center gap-2"
                >
                    + Ajouter un hôtel
                </Link>
            </div>

            {hotels.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun hôtel trouvé</p>
                    <Link to="/admin/ajouterHotel" className="text-[#fb923c] hover:underline mt-2 inline-block">
                        Ajouter votre premier hôtel
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Nom</th>
                                <th className="p-3">Pays</th>
                                <th className="p-3">Prix/Nuit</th>
                                <th className="p-3">Note</th>
                                <th className="p-3">Équipements</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map((hotel) => {
                                const serviceData = hotel.service || hotel;
                                const hotelData = hotel.hotel || hotel;
                                const hotelId = hotel.id || hotelData.id;

                                return (
                                    <tr key={hotelId} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            {serviceData.image && !imageErrors[hotelId] ? (
                                                <img
                                                    src={getImageUrl(serviceData.image)}
                                                    alt={serviceData.nomServ}
                                                    className="w-20 h-14 object-cover rounded-md"
                                                    onError={() => handleImageError(hotelId)}
                                                />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <Camera size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-semibold">{serviceData.nomServ || "Sans titre"}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <Globe size={14} className="text-[#fb923c]" />
                                                <span>{hotel.destination?.pays || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-[#fb923c]">{serviceData.prix} DH</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < (serviceData.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                    />
                                                ))}
                                                <span className="text-xs">({serviceData.rating || 0})</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1">
                                                {(() => {
                                                    // Parse amenities if it's a string, or use as is if it's already an array
                                                    let amenitiesArray = [];
                                                    if (typeof hotelData.amenities === 'string') {
                                                        try {
                                                            amenitiesArray = JSON.parse(hotelData.amenities);
                                                        } catch (e) {
                                                            // If it's a comma-separated string, split it
                                                            amenitiesArray = hotelData.amenities.split(',');
                                                        }
                                                    } else if (Array.isArray(hotelData.amenities)) {
                                                        amenitiesArray = hotelData.amenities;
                                                    }

                                                    return amenitiesArray.slice(0, 3).map((amenity, idx) => (
                                                        <span key={idx} className="text-xs text-gray-600">{amenity}</span>
                                                    ));
                                                })()}
                                                {hotelData.amenities?.length > 2 && (
                                                    <span className="text-xs text-gray-400">+{hotelData.amenities.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/showHotel/${hotelId}`} className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition" title="Détails">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/admin/editHotel/${hotelId}`} className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition" title="Modifier">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(hotelId)} disabled={deletingId === hotelId} className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50" title="Supprimer">
                                                    {deletingId === hotelId ? <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div> : <Trash2 size={16} />}
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