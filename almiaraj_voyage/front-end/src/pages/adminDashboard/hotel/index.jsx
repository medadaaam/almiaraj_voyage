import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Camera, Trash2, Edit, MapPin, Globe, Search, Filter, X, RefreshCw, Wifi } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminHotels() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

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

    // Filter and sort hotels whenever dependencies change
    useEffect(() => {
        let result = [...hotels];

        // Apply search
        if (searchTerm) {
            result = result.filter(hotel => {
                const serviceData = hotel.service || hotel;
                const name = (serviceData.nomServ || "").toLowerCase();
                const country = (hotel.destination?.pays || "").toLowerCase();
                const city = (hotel.destination?.ville || "").toLowerCase();
                const search = searchTerm.toLowerCase();

                return name.includes(search) || country.includes(search) || city.includes(search);
            });
        }

        // Apply country filter
        if (selectedCountry) {
            result = result.filter(hotel => hotel.destination?.pays === selectedCountry);
        }

        // Apply city filter
        if (selectedCity) {
            result = result.filter(hotel => hotel.destination?.ville === selectedCity);
        }

        // Apply sorting
        result.sort((a, b) => {
            const serviceA = a.service || a;
            const serviceB = b.service || b;

            switch (sortBy) {
                case "price_asc":
                    return (serviceA.prix || 0) - (serviceB.prix || 0);
                case "price_desc":
                    return (serviceB.prix || 0) - (serviceA.prix || 0);
                case "rating_asc":
                    return (serviceA.rating || 0) - (serviceB.rating || 0);
                case "rating_desc":
                    return (serviceB.rating || 0) - (serviceA.rating || 0);
                case "name_asc":
                    return (serviceA.nomServ || "").localeCompare(serviceB.nomServ || "");
                case "name_desc":
                    return (serviceB.nomServ || "").localeCompare(serviceA.nomServ || "");
                case "newest":
                default:
                    return new Date(serviceB.created_at || 0) - new Date(serviceA.created_at || 0);
            }
        });

        setFilteredHotels(result);
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [hotels, searchTerm, sortBy, selectedCountry, selectedCity, itemsPerPage]);

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

            // Extract unique countries and cities for filters
            const uniqueCountries = [...new Set(hotelsData.map(hotel => hotel.destination?.pays).filter(Boolean))];
            const uniqueCities = [...new Set(hotelsData.map(hotel => hotel.destination?.ville).filter(Boolean))];
            setCountries(uniqueCountries);
            setCities(uniqueCities);

            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement des hôtels");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
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

    const handleRowClick = (hotelId) => {
        navigate(`/admin/showHotel/${hotelId}`);
    };

    const handleImageError = (hotelId) => {
        setImageErrors(prev => ({ ...prev, [hotelId]: true }));
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedCountry("");
        setSelectedCity("");
    };

    // Update cities when country changes
    useEffect(() => {
        if (selectedCountry) {
            const citiesForCountry = [...new Set(hotels
                .filter(hotel => hotel.destination?.pays === selectedCountry)
                .map(hotel => hotel.destination?.ville)
                .filter(Boolean))];
            setCities(citiesForCountry);
        } else {
            const allCities = [...new Set(hotels.map(hotel => hotel.destination?.ville).filter(Boolean))];
            setCities(allCities);
        }
        setSelectedCity("");
    }, [selectedCountry, hotels]);

    // Pagination functions
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredHotels.slice(startIndex, endIndex);
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
        setTotalPages(Math.ceil(filteredHotels.length / newItemsPerPage));
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
            <div className="flex flex-col justify-center items-center h-64 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
                <p className="text-gray-500 text-sm">Chargement des hotels...</p>
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
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Hôtels</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredHotels.length} hôtel(s) trouvé(s)</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchHotels} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                        <RefreshCw size={14} />
                        Actualiser
                    </button>
                    <Link
                        to={`/admin/ajouterHotel`}
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
                        placeholder="Rechercher par nom, pays ou ville..."
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
                        <option value="name_asc">Nom (A-Z)</option>
                        <option value="name_desc">Nom (Z-A)</option>
                        <option value="price_asc">Prix (croissant)</option>
                        <option value="price_desc">Prix (décroissant)</option>
                        <option value="rating_desc">Note (élevée à basse)</option>
                        <option value="rating_asc">Note (basse à élevée)</option>
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

                    {(searchTerm || selectedCountry || selectedCity) && (
                        <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                )}
            </div>

            {filteredHotels.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-3">🏨</div>
                    <p className="text-gray-500">Aucun hôtel trouvé</p>
                    {(searchTerm || selectedCountry || selectedCity) && (
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pays</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ville</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix/Nuit</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Note</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Équipements</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((hotel) => {
                                    const serviceData = hotel.service || hotel;
                                    const hotelData = hotel.hotel || hotel;
                                    const hotelId = hotel.id || hotelData.id;

                                    return (
                                        <tr
                                            key={hotelId}
                                            onClick={() => handleRowClick(hotelId)}
                                            className="hover:bg-orange-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                {serviceData.image && !imageErrors[hotelId] ? (
                                                    <img
                                                        src={getImageUrl(serviceData.image)}
                                                        alt={serviceData.nomServ}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                        onError={() => handleImageError(hotelId)}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                        <Camera size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{serviceData.nomServ || "Sans titre"}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe size={14} className="text-[#f59e0b]" />
                                                    <span className="text-sm text-gray-700">{hotel.destination?.pays || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-[#f59e0b]" />
                                                    <span className="text-sm text-gray-700">{hotel.destination?.ville || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-[#f59e0b]">{serviceData.prix} DH</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={`${i < (serviceData.rating || 0) ? "fill-[#f59e0b] text-[#f59e0b]" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                    <span className="text-xs text-gray-500 ml-1">({serviceData.rating || 0})</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {(() => {
                                                        let amenitiesArray = [];
                                                        if (typeof hotelData.amenities === 'string') {
                                                            try {
                                                                amenitiesArray = JSON.parse(hotelData.amenities);
                                                            } catch (e) {
                                                                amenitiesArray = hotelData.amenities.split(',');
                                                            }
                                                        } else if (Array.isArray(hotelData.amenities)) {
                                                            amenitiesArray = hotelData.amenities;
                                                        }
                                                        return amenitiesArray.slice(0, 2).map((amenity, idx) => (
                                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                                {amenity.length > 15 ? amenity.substring(0, 12) + '...' : amenity}
                                                            </span>
                                                        ));
                                                    })()}
                                                    {(() => {
                                                        let amenitiesArray = [];
                                                        if (typeof hotelData.amenities === 'string') {
                                                            try {
                                                                amenitiesArray = JSON.parse(hotelData.amenities);
                                                            } catch (e) {
                                                                amenitiesArray = hotelData.amenities.split(',');
                                                            }
                                                        } else if (Array.isArray(hotelData.amenities)) {
                                                            amenitiesArray = hotelData.amenities;
                                                        }
                                                        return amenitiesArray.length > 2 && (
                                                            <span className="text-xs text-gray-400">+{amenitiesArray.length - 2}</span>
                                                        );
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={(e) => handleDelete(hotelId, e)}
                                                        disabled={deletingId === hotelId}
                                                        className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        {deletingId === hotelId ?
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
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredHotels.length)} sur {filteredHotels.length}
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
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${currentPage === page
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