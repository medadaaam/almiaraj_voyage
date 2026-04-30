import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Star, Camera, Trash2, Edit, Eye, MapPin, Globe, Wifi, Search, Filter, X } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminHotels() {
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
                const hotelData = hotel.hotel || hotel;
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
            const hotelA = a.hotel || a;
            const hotelB = b.hotel || b;
            
            switch(sortBy) {
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
    }, [hotels, searchTerm, sortBy, selectedCountry, selectedCity]);

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

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, pays ou ville..."
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
                            <option value="name_asc">Nom (A-Z)</option>
                            <option value="name_desc">Nom (Z-A)</option>
                            <option value="price_asc">Prix (croissant)</option>
                            <option value="price_desc">Prix (décroissant)</option>
                            <option value="rating_desc">Note (élevée à basse)</option>
                            <option value="rating_asc">Note (basse à élevée)</option>
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
                        {(selectedCountry || selectedCity) && (
                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Clear Filters Button */}
                    {(searchTerm || selectedCountry || selectedCity) && (
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
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-3 text-sm text-gray-500">
                    {filteredHotels.length} hôtel(s) trouvé(s)
                </div>
            </div>

            {filteredHotels.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun hôtel trouvé</p>
                    {(searchTerm || selectedCountry || selectedCity) && (
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
                                <th className="p-3">Nom</th>
                                <th className="p-3">Pays</th>
                                <th className="p-3">Ville</th>
                                <th className="p-3">Prix/Nuit</th>
                                <th className="p-3">Note</th>
                                <th className="p-3">Équipements</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHotels.map((hotel) => {
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
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-[#fb923c]" />
                                                <span>{hotel.destination?.ville || "N/A"}</span>
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
                                                    return amenitiesArray.slice(0, 3).map((amenity, idx) => (
                                                        <span key={idx} className="text-xs text-gray-600">{amenity}</span>
                                                    ));
                                                })()}
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