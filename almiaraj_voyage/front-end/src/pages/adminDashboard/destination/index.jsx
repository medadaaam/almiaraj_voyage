import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Camera, Trash2, Edit, Eye, MapPin, Globe, Star, Search, Filter, X } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminDestinations() {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState("");
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [continents, setContinents] = useState([]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        let cleanPath = imagePath.replace(/^public\//, '');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${cleanPath}`;
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    // Filter and sort destinations
    useEffect(() => {
        let result = [...destinations];

        // Apply search
        if (searchTerm) {
            result = result.filter(dest => {
                const pays = (dest.pays || "").toLowerCase();
                const ville = (dest.ville || "").toLowerCase();
                const continente = (dest.continente || "").toLowerCase();
                const search = searchTerm.toLowerCase();
                return pays.includes(search) || ville.includes(search) || continente.includes(search);
            });
        }

        // Apply continent filter
        if (selectedContinent) {
            result = result.filter(dest => dest.continente === selectedContinent);
        }

        // Apply featured filter
        if (featuredOnly) {
            result = result.filter(dest => dest.en_vedette === 1);
        }

        // Apply sorting
        result.sort((a, b) => {
            switch(sortBy) {
                case "name_asc":
                    return (a.ville || "").localeCompare(b.ville || "");
                case "name_desc":
                    return (b.ville || "").localeCompare(a.ville || "");
                case "country_asc":
                    return (a.pays || "").localeCompare(b.pays || "");
                case "country_desc":
                    return (b.pays || "").localeCompare(a.pays || "");
                case "newest":
                default:
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            }
        });

        setFilteredDestinations(result);
    }, [destinations, searchTerm, sortBy, selectedContinent, featuredOnly]);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/destinations');

            console.log('Response:', response.data);

            let destinationsData = [];
            if (response.data && response.data.data) {
                destinationsData = response.data.data;
            } else if (Array.isArray(response.data)) {
                destinationsData = response.data;
            } else {
                destinationsData = [];
            }

            setDestinations(destinationsData);

            // Extract unique continents for filter
            const uniqueContinents = [...new Set(destinationsData.map(dest => dest.continente).filter(Boolean))];
            setContinents(uniqueContinents);

            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement des destinations");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette destination ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/destinations/${id}`);
            await fetchDestinations();
            alert("Destination supprimée avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleImageError = (destId) => {
        setImageErrors(prev => ({ ...prev, [destId]: true }));
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedContinent("");
        setFeaturedOnly(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des destinations...</p>
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
        <div className="service-destinations">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Destinations</h1>
                <Link
                    to="/admin/ajouterDestination"
                    className="bg-[#fb923c] text-white px-4 py-2 rounded-md hover:bg-[#ea580c] transition flex items-center gap-2"
                >
                    + Ajouter une destination
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par pays, ville ou continent..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="w-48">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                        >
                            <option value="newest">Plus récentes</option>
                            <option value="name_asc">Ville (A-Z)</option>
                            <option value="name_desc">Ville (Z-A)</option>
                            <option value="country_asc">Pays (A-Z)</option>
                            <option value="country_desc">Pays (Z-A)</option>
                        </select>
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                            showFilters ? "bg-[#fb923c] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <Filter size={18} />
                        Filtres
                        {(selectedContinent || featuredOnly) && (
                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Clear Filters Button */}
                    {(searchTerm || selectedContinent || featuredOnly) && (
                        <button
                            onClick={clearFilters}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                            <X size={14} />
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Continent Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Continent
                                </label>
                                <select
                                    value={selectedContinent}
                                    onChange={(e) => setSelectedContinent(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Tous les continents</option>
                                    {continents.map(continent => (
                                        <option key={continent} value={continent}>{continent}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Featured Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={featuredOnly}
                                        onChange={(e) => setFeaturedOnly(e.target.checked)}
                                        className="w-4 h-4 text-[#fb923c] focus:ring-[#fb923c] rounded"
                                    />
                                    <span className="text-sm text-gray-700">Uniquement les destinations en vedette</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-3 text-sm text-gray-500">
                    {filteredDestinations.length} destination(s) trouvée(s)
                </div>
            </div>

            {filteredDestinations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucune destination trouvée</p>
                    {(searchTerm || selectedContinent || featuredOnly) && (
                        <button
                            onClick={clearFilters}
                            className="text-[#fb923c] hover:underline mt-2 inline-block"
                        >
                            Effacer les filtres
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Ville</th>
                                <th className="p-3">Pays</th>
                                <th className="p-3">Continent</th>
                                <th className="p-3">Statut</th>
                                <th className="p-3">Date création</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDestinations.map((dest) => {
                                const destId = dest.id;

                                return (
                                    <tr key={destId} className="border-b hover:bg-gray-50 transition">
                                        {/* IMAGE */}
                                        <td className="p-3">
                                            {dest.image && !imageErrors[destId] ? (
                                                <img
                                                    src={getImageUrl(dest.image)}
                                                    alt={dest.ville}
                                                    className="w-20 h-14 object-cover rounded-md"
                                                    onError={() => handleImageError(destId)}
                                                />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <Camera size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        {/* VILLE */}
                                        <td className="p-3 font-semibold">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-[#fb923c]" />
                                                {dest.ville}
                                            </div>
                                        </td>

                                        {/* PAYS */}
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <Globe size={14} className="text-[#fb923c]" />
                                                {dest.pays}
                                            </div>
                                        </td>

                                        {/* CONTINENT */}
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                                {dest.continente}
                                            </span>
                                        </td>

                                        {/* STATUT (En vedette) */}
                                        <td className="p-3">
                                            {dest.en_vedette === 1 ? (
                                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
                                                    <Star size={12} />
                                                    En vedette
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                                    Normal
                                                </span>
                                            )}
                                        </td>

                                        {/* DATE CREATION */}
                                        <td className="p-3 text-sm">
                                            {dest.created_at ? new Date(dest.created_at).toLocaleDateString('fr-FR') : "-"}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/${destId}`}
                                                    className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition"
                                                    title="Détails"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                <Link
                                                    to={`/admin/editDestination/${destId}`}
                                                    className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(destId)}
                                                    disabled={deletingId === destId}
                                                    className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === destId ? (
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
