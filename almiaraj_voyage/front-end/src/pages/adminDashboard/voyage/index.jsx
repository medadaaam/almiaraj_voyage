// src/pages/services/CircuitsTouristiques.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Star, Camera, Trash2, Edit, MapPin, Globe, Search, Filter, X, Calendar, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminVoyages() {
    const navigate = useNavigate();
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
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

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
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [voyages, searchTerm, sortBy, filterType, selectedCountry, selectedCity, itemsPerPage]);

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

    const handleDelete = async (id, e) => {
        e.stopPropagation();
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

    const handleRowClick = (voyageId) => {
        navigate(`/admin/showVoyage/${voyageId}`);
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

    // Pagination functions
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredVoyages.slice(startIndex, endIndex);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        setTotalPages(Math.ceil(filteredVoyages.length / newItemsPerPage));
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
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

    const currentItems = getCurrentPageItems();

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Voyages</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredVoyages.length} voyage(s) trouvé(s)</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchVoyages} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                        <RefreshCw size={14} />
                        Actualiser
                    </button>
                    <Link
                        to={`/admin/AjouterVoyage`}
                        className="bg-[#f59e0b] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-[#d97706] transition flex items-center gap-2 text-sm"
                    >
                        + Ajouter
                    </Link>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par titre, pays ou ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <X size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)} 
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
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

                    <select 
                        value={itemsPerPage} 
                        onChange={handleItemsPerPageChange} 
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                    >
                        <option value={5}>5 par page</option>
                        <option value={10}>10 par page</option>
                        <option value={20}>20 par page</option>
                        <option value={50}>50 par page</option>
                    </select>

                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                        <Filter size={14} /> Filtres
                    </button>

                    {(searchTerm || filterType !== "all" || selectedCountry || selectedCity) && (
                        <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Pays</label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Tous les pays</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Ville</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Toutes les villes</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Statut</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="all">Tous les voyages</option>
                                <option value="available">Disponibles</option>
                                <option value="completed">Terminés</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {filteredVoyages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-3">✈️</div>
                    <p className="text-gray-500">Aucun voyage trouvé</p>
                    {(searchTerm || filterType !== "all" || selectedCountry || selectedCity) && (
                        <button onClick={clearFilters} className="mt-3 text-[#f59e0b] hover:underline text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Durée</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pays</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ville</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date Départ</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((voyage) => {
                                    const serviceData = voyage.service || voyage;
                                    const voyageData = voyage.voyage || voyage;
                                    const voyageId = voyage.id || voyageData.id;
                                    const isCompleted = new Date(voyageData.dateDepartV) < new Date();

                                    return (
                                        <tr 
                                            key={voyageId} 
                                            onClick={() => handleRowClick(voyageId)} 
                                            className="hover:bg-orange-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                {serviceData.image && !imageErrors[voyageId] ? (
                                                    <img
                                                        src={getImageUrl(serviceData.image)}
                                                        alt={serviceData.nomServ}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                        onError={() => handleImageError(voyageId)}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                        <Camera size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{serviceData.nomServ || "Sans titre"}</div>
                                                {isCompleted && (
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Terminé</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{getDuration(voyageData)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe size={14} className="text-[#f59e0b]" />
                                                    <span className="text-sm text-gray-700">{getCountry(voyageData)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-[#f59e0b]" />
                                                    <span className="text-sm text-gray-700">{getCity(voyageData)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-[#f59e0b]">{serviceData.prix || 0} DH</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600 whitespace-nowrap">
                                                        {voyageData.dateDepartV ? new Date(voyageData.dateDepartV).toLocaleDateString('fr-FR') : "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Link
                                                        to={`/admin/editVoyage/${voyageId}`}
                                                        className="p-1.5 bg-green-100 rounded-md hover:bg-green-500 hover:text-white transition"
                                                        title="Modifier"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={(e) => handleDelete(voyageId, e)}
                                                        disabled={deletingId === voyageId}
                                                        className="p-1.5 bg-red-100 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        {deletingId === voyageId ? 
                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : 
                                                            <Trash2 size={16} />
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                            <div className="text-sm text-gray-500">
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredVoyages.length)} sur {filteredVoyages.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                >
                                    Précédent
                                </button>
                                <div className="flex gap-1">
                                    {getPageNumbers().map(page => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${
                                                currentPage === page
                                                    ? 'bg-[#f59e0b] text-white'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}