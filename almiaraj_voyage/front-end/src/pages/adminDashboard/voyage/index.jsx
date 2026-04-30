// src/pages/services/CircuitsTouristiques.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Star, Camera, Trash2, Edit, Eye, MapPin, Globe, Search, Filter, X } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminVoyages() {
    const [voyages, setVoyages] = useState([]);
    const [filteredVoyages, setFilteredVoyages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filterType, setFilterType] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

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

    // Filter and sort voyages whenever dependencies change
    useEffect(() => {
        let result = [...voyages];

        // Apply search
        if (searchTerm) {
            result = result.filter(voyage => {
                const serviceData = voyage.service || voyage;
                const voyageData = voyage.voyage || voyage;
                const title = (serviceData.nomServ || "").toLowerCase();
                const country = getCountry(voyageData).toLowerCase();
                const city = getCity(voyageData).toLowerCase();
                const search = searchTerm.toLowerCase();

                return title.includes(search) || country.includes(search) || city.includes(search);
            });
        }

        // Apply country filter
        if (selectedCountry) {
            result = result.filter(voyage => {
                const voyageData = voyage.voyage || voyage;
                return getCountry(voyageData) === selectedCountry;
            });
        }

        // Apply city filter
        if (selectedCity) {
            result = result.filter(voyage => {
                const voyageData = voyage.voyage || voyage;
                return getCity(voyageData) === selectedCity;
            });
        }

        // Apply type filter
        if (filterType === "available") {
            result = result.filter(voyage => {
                const voyageData = voyage.voyage || voyage;
                const departDate = new Date(voyageData.dateDepartV);
                const today = new Date();
                return departDate >= today;
            });
        } else if (filterType === "completed") {
            result = result.filter(voyage => {
                const voyageData = voyage.voyage || voyage;
                const departDate = new Date(voyageData.dateDepartV);
                const today = new Date();
                return departDate < today;
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            const serviceA = a.service || a;
            const serviceB = b.service || b;
            const voyageA = a.voyage || a;
            const voyageB = b.voyage || b;

            switch(sortBy) {
                case "price_asc":
                    return (serviceA.prix || 0) - (serviceB.prix || 0);
                case "price_desc":
                    return (serviceB.prix || 0) - (serviceA.prix || 0);
                case "name_asc":
                    return (serviceA.nomServ || "").localeCompare(serviceB.nomServ || "");
                case "name_desc":
                    return (serviceB.nomServ || "").localeCompare(serviceA.nomServ || "");
                case "city_asc":
                    return getCity(voyageA).localeCompare(getCity(voyageB));
                case "city_desc":
                    return getCity(voyageB).localeCompare(getCity(voyageA));
                case "country_asc":
                    return getCountry(voyageA).localeCompare(getCountry(voyageB));
                case "country_desc":
                    return getCountry(voyageB).localeCompare(getCountry(voyageA));
                case "oldest":
                    return new Date(voyageA.dateDepartV) - new Date(voyageB.dateDepartV);
                case "newest":
                default:
                    return new Date(voyageB.dateDepartV) - new Date(voyageA.dateDepartV);
            }
        });

        setFilteredVoyages(result);
    }, [voyages, searchTerm, sortBy, filterType, selectedCountry, selectedCity]);

    const fetchVoyages = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/voyages');

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

            setVoyages(voyagesData);

            // Extract unique countries and cities for filter
            const uniqueCountries = [...new Set(voyagesData.map(voyage => {
                const voyageData = voyage.voyage || voyage;
                return getCountry(voyageData);
            }))].filter(country => country !== "N/A");
            setCountries(uniqueCountries);

            const uniqueCities = [...new Set(voyagesData.map(voyage => {
                const voyageData = voyage.voyage || voyage;
                return getCity(voyageData);
            }))].filter(city => city !== "N/A");
            setCities(uniqueCities);

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

    // Update cities when country changes
    useEffect(() => {
        if (selectedCountry) {
            const citiesForCountry = [...new Set(voyages
                .filter(voyage => {
                    const voyageData = voyage.voyage || voyage;
                    return getCountry(voyageData) === selectedCountry;
                })
                .map(voyage => {
                    const voyageData = voyage.voyage || voyage;
                    return getCity(voyageData);
                })
                .filter(city => city !== "N/A"))];
            setCities(citiesForCountry);
        } else {
            const allCities = [...new Set(voyages.map(voyage => {
                const voyageData = voyage.voyage || voyage;
                return getCity(voyageData);
            }))].filter(city => city !== "N/A");
            setCities(allCities);
        }
        setSelectedCity("");
    }, [selectedCountry, voyages]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setFilterType("all");
        setSelectedCountry("");
        setSelectedCity("");
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

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par titre, pays ou ville..."
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
                            <option value="newest">Plus récents</option>
                            <option value="oldest">Plus anciens</option>
                            <option value="price_asc">Prix (croissant)</option>
                            <option value="price_desc">Prix (décroissant)</option>
                            <option value="name_asc">Nom (A-Z)</option>
                            <option value="name_desc">Nom (Z-A)</option>
                            <option value="country_asc">Pays (A-Z)</option>
                            <option value="country_desc">Pays (Z-A)</option>
                            <option value="city_asc">Ville (A-Z)</option>
                            <option value="city_desc">Ville (Z-A)</option>
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
                        {(filterType !== "all" || selectedCountry || selectedCity) && (
                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Clear Filters Button */}
                    {(searchTerm || filterType !== "all" || selectedCountry || selectedCity) && (
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Country Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pays
                                </label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Tous les pays</option>
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ville
                                </label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Toutes les villes</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="all">Tous les voyages</option>
                                    <option value="available">Disponibles</option>
                                    <option value="completed">Terminés</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-3 text-sm text-gray-500">
                    {filteredVoyages.length} voyage(s) trouvé(s)
                </div>
            </div>

            {filteredVoyages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun voyage trouvé</p>
                    {(searchTerm || filterType !== "all" || selectedCountry || selectedCity) && (
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
                            {filteredVoyages.map((voyage) => {
                                const serviceData = voyage.service || voyage;
                                const voyageData = voyage.voyage || voyage;
                                const voyageId = voyage.id || voyageData.id;
                                const isCompleted = new Date(voyageData.dateDepartV) < new Date();

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
                                            {isCompleted && (
                                                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                    Terminé
                                                </span>
                                            )}
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

                                        {/* CITY */}
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
