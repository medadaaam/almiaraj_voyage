import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Camera, Trash2, Edit, Eye, MapPin, Globe, Star, Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminDestinations() {
    const navigate = useNavigate();
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
        fetchDestinations();
    }, []);

    useEffect(() => {
        let result = [...destinations];

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(dest => {
                const pays = (dest.pays || "").toLowerCase();
                const ville = (dest.ville || "").toLowerCase();
                const continente = (dest.continente || "").toLowerCase();
                return pays.includes(search) || ville.includes(search) || continente.includes(search);
            });
        }

        if (selectedContinent) {
            result = result.filter(dest => dest.continente === selectedContinent);
        }

        if (featuredOnly) {
            result = result.filter(dest => dest.en_vedette === 1);
        }

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
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [destinations, searchTerm, sortBy, selectedContinent, featuredOnly, itemsPerPage]);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/destinations');

            let destinationsData = [];
            if (response.data && response.data.data) {
                destinationsData = response.data.data;
            } else if (Array.isArray(response.data)) {
                destinationsData = response.data;
            } else {
                destinationsData = [];
            }

            setDestinations(destinationsData);

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

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette destination ?")) return;

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

    const handleRowClick = (destId) => {
        navigate(`/admin/editDestination/${destId}`);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedContinent("");
        setFeaturedOnly(false);
    };

    // Pagination functions
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDestinations.slice(startIndex, endIndex);
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
        setTotalPages(Math.ceil(filteredDestinations.length / newItemsPerPage));
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b] mx-auto"></div>
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
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Destinations</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredDestinations.length} destination(s) trouvée(s)</p>
                </div>
                <div className="flex gap-3">
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
                    <Link
                        to="/admin/ajouterDestination"
                        className="bg-[#f59e0b] text-white px-4 py-1.5 rounded-lg hover:bg-[#d97706] transition flex items-center gap-2 text-sm"
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
                        placeholder="Rechercher par pays, ville ou continent..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2">
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
                        <option value="newest">Plus récentes</option>
                        <option value="name_asc">Ville (A-Z)</option>
                        <option value="name_desc">Ville (Z-A)</option>
                        <option value="country_asc">Pays (A-Z)</option>
                        <option value="country_desc">Pays (Z-A)</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                            showFilters ? "bg-[#f59e0b] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <Filter size={14} />
                        Filtres
                        {(selectedContinent || featuredOnly) && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>

                    {(searchTerm || selectedContinent || featuredOnly) && (
                        <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Continent</label>
                            <select
                                value={selectedContinent}
                                onChange={(e) => setSelectedContinent(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Tous les continents</option>
                                {continents.map(continent => (
                                    <option key={continent} value={continent}>{continent}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Statut</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={featuredOnly}
                                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                                    className="w-4 h-4 text-[#f59e0b] focus:ring-[#f59e0b] rounded"
                                />
                                <span className="text-sm text-gray-700">Uniquement les destinations en vedette</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Destinations Table */}
            {filteredDestinations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-3">📍</div>
                    <p className="text-gray-500">Aucune destination trouvée</p>
                    {(searchTerm || selectedContinent || featuredOnly) && (
                        <button onClick={clearFilters} className="mt-3 text-[#f59e0b] hover:underline text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ville</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pays</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Continent</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((dest) => {
                                    const destId = dest.id;
                                    return (
                                        <tr 
                                            key={destId} 
                                            onClick={() => handleRowClick(destId)}
                                            className="hover:bg-orange-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                {dest.image && !imageErrors[destId] ? (
                                                    <img
                                                        src={getImageUrl(dest.image)}
                                                        alt={dest.ville}
                                                        className="w-16 h-12 object-cover rounded-md"
                                                        onError={() => handleImageError(destId)}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                        <Camera size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-[#f59e0b]" />
                                                    {dest.ville}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Globe size={14} className="text-[#f59e0b]" />
                                                    {dest.pays}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                                    {dest.continente}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
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
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => handleDelete(destId, e)}
                                                        disabled={deletingId === destId}
                                                        className="p-1.5 bg-red-100 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        {deletingId === destId ? (
                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                            <div className="text-sm text-gray-500">
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredDestinations.length)} sur {filteredDestinations.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                >
                                    <ChevronLeft size={16} />
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
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}