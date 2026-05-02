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

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        let cleanPath = imagePath.replace(/^public\//, '');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${cleanPath}`;
    };

    useEffect(() => {
        fetchVoyages();
    }, []);

    useEffect(() => {
        let result = [...voyages];

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(voyage => {
                const serviceData = voyage.service || voyage;
                const voyageData = voyage.voyage || voyage;
                const title = (serviceData.nomServ || "").toLowerCase();
                const country = getCountry(voyageData).toLowerCase();
                const city = getCity(voyageData).toLowerCase();
                return title.includes(search) || country.includes(search) || city.includes(search);
            });
        }

        if (selectedCountry) {
            result = result.filter(voyage => getCountry(voyage.voyage || voyage) === selectedCountry);
        }

        if (selectedCity) {
            result = result.filter(voyage => getCity(voyage.voyage || voyage) === selectedCity);
        }

        if (filterType === "available") {
            result = result.filter(voyage => new Date(voyage.voyage?.dateDepartV || voyage.dateDepartV) >= new Date());
        } else if (filterType === "completed") {
            result = result.filter(voyage => new Date(voyage.voyage?.dateDepartV || voyage.dateDepartV) < new Date());
        }

        result.sort((a, b) => {
            const serviceA = a.service || a;
            const serviceB = b.service || b;
            const voyageA = a.voyage || a;
            const voyageB = b.voyage || b;

            switch (sortBy) {
                case "price_asc": return (serviceA.prix || 0) - (serviceB.prix || 0);
                case "price_desc": return (serviceB.prix || 0) - (serviceA.prix || 0);
                case "name_asc": return (serviceA.nomServ || "").localeCompare(serviceB.nomServ || "");
                case "name_desc": return (serviceB.nomServ || "").localeCompare(serviceA.nomServ || "");
                case "city_asc": return getCity(voyageA).localeCompare(getCity(voyageB));
                case "city_desc": return getCity(voyageB).localeCompare(getCity(voyageA));
                case "country_asc": return getCountry(voyageA).localeCompare(getCountry(voyageB));
                case "country_desc": return getCountry(voyageB).localeCompare(getCountry(voyageA));
                case "oldest": return new Date(voyageA.dateDepartV) - new Date(voyageB.dateDepartV);
                default: return new Date(voyageB.dateDepartV) - new Date(voyageA.dateDepartV);
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
            if (response.data?.data) voyagesData = response.data.data;
            else if (Array.isArray(response.data)) voyagesData = response.data;
            else voyagesData = [];

            setVoyages(voyagesData);

            const uniqueCountries = [...new Set(voyagesData.map(v => getCountry(v.voyage || v)))].filter(c => c !== "N/A");
            const uniqueCities = [...new Set(voyagesData.map(v => getCity(v.voyage || v)))].filter(c => c !== "N/A");
            setCountries(uniqueCountries);
            setCities(uniqueCities);

            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement des voyages");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Supprimer ce voyage ?")) return;

        try {
            setDeletingId(id);
            await axiosClient.delete(`/voyages/${id}`);
            await fetchVoyages();
            alert("Voyage supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleRowClick = (voyageId) => navigate(`/admin/showVoyage/${voyageId}`);

    const getCountry = (voyage) => voyage.destination?.pays || voyage.voyage?.destination?.pays || "N/A";
    const getCity = (voyage) => voyage.destination?.ville || voyage.voyage?.destination?.ville || "N/A";
    const getDuration = (voyage) => {
        if (voyage.duree) return voyage.duree;
        if (voyage.voyage?.duree) return voyage.voyage.duree;
        if (voyage.dateDepartV && voyage.dateRetourV) {
            const diffDays = Math.ceil((new Date(voyage.dateRetourV) - new Date(voyage.dateDepartV)) / (1000 * 60 * 60 * 24));
            return `${diffDays} jours / ${diffDays - 1} nuits`;
        }
        return "N/A";
    };

    const handleImageError = (id) => setImageErrors(prev => ({ ...prev, [id]: true }));

    useEffect(() => {
        if (selectedCountry) {
            const filteredCities = [...new Set(voyages
                .filter(v => getCountry(v.voyage || v) === selectedCountry)
                .map(v => getCity(v.voyage || v))
                .filter(c => c !== "N/A"))];
            setCities(filteredCities);
        } else {
            const allCities = [...new Set(voyages.map(v => getCity(v.voyage || v)))].filter(c => c !== "N/A");
            setCities(allCities);
        }
        setSelectedCity("");
    }, [selectedCountry, voyages]);

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setFilterType("all");
        setSelectedCountry("");
        setSelectedCity("");
    };

    const getCurrentPageItems = () => filteredVoyages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
        setTotalPages(Math.ceil(filteredVoyages.length / parseInt(e.target.value)));
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
                <p className="text-gray-500 text-sm">Chargement des voyages...</p>
            </div>
        );
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>;
    }

    const currentItems = getCurrentPageItems();

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Voyages</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredVoyages.length} voyage(s) trouvé(s)</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchVoyages} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"><RefreshCw size={14} /> Actualiser</button>
                    <Link to="/admin/AjouterVoyage" className="bg-[#f59e0b] text-white px-3 py-1.5 rounded-lg hover:bg-[#d97706] transition flex items-center gap-2 text-sm">+ Ajouter</Link>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Rechercher par titre, pays ou ville..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm" />
                    {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2"><X size={16} className="text-gray-400 hover:text-gray-600" /></button>}
                </div>

                <div className="flex flex-wrap gap-3">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                        <option value="newest">Plus récents</option><option value="oldest">Plus anciens</option>
                        <option value="price_asc">Prix (croissant)</option><option value="price_desc">Prix (décroissant)</option>
                        <option value="name_asc">Nom (A-Z)</option><option value="name_desc">Nom (Z-A)</option>
                        <option value="country_asc">Pays (A-Z)</option><option value="country_desc">Pays (Z-A)</option>
                        <option value="city_asc">Ville (A-Z)</option><option value="city_desc">Ville (Z-A)</option>
                    </select>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                        <option value={5}>5 par page</option><option value={10}>10 par page</option>
                        <option value={20}>20 par page</option><option value={50}>50 par page</option>
                    </select>
                    <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"><Filter size={14} /> Filtres</button>
                    {(searchTerm || filterType !== "all" || selectedCountry || selectedCity) && <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 text-sm">Effacer les filtres</button>}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Pays</label>
                            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                <option value="">Tous les pays</option>{countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Ville</label>
                            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                <option value="">Toutes les villes</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Statut</label>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                                <option value="all">Tous les voyages</option><option value="available">Disponibles</option><option value="completed">Terminés</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {filteredVoyages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow"><div className="text-5xl mb-3">✈️</div><p className="text-gray-500">Aucun voyage trouvé</p></div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-gray-50 border-b"><tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Durée</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pays</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ville</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date Départ</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((voyage) => {
                                    const serviceData = voyage.service || voyage;
                                    const voyageData = voyage.voyage || voyage;
                                    const voyageId = voyage.id || voyageData.id;
                                    const isCompleted = new Date(voyageData.dateDepartV) < new Date();

                                    return (
                                        <tr key={voyageId} onClick={() => handleRowClick(voyageId)} className="hover:bg-orange-50 cursor-pointer transition-colors">
                                            <td className="px-4 py-3">
                                                {serviceData.image && !imageErrors[voyageId] ? (
                                                    <img src={getImageUrl(serviceData.image)} alt={serviceData.nomServ} className="w-12 h-12 object-cover rounded-md" onError={() => handleImageError(voyageId)} />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center"><Camera size={20} className="text-gray-400" /></div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3"><div className="font-medium text-gray-800">{serviceData.nomServ || "Sans titre"}</div>{isCompleted && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Terminé</span>}</td>
                                            <td className="px-4 py-3"><div className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /><span className="text-sm text-gray-600">{getDuration(voyageData)}</span></div></td>
                                            <td className="px-4 py-3"><div className="flex items-center gap-1.5"><Globe size={14} className="text-[#f59e0b]" /><span className="text-sm text-gray-700">{getCountry(voyageData)}</span></div></td>
                                            <td className="px-4 py-3"><div className="flex items-center gap-1.5"><MapPin size={14} className="text-[#f59e0b]" /><span className="text-sm text-gray-700">{getCity(voyageData)}</span></div></td>
                                            <td className="px-4 py-3"><span className="font-semibold text-[#f59e0b]">{serviceData.prix || 0} DH</span></td>
                                            <td className="px-4 py-3"><div className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /><span className="text-sm text-gray-600">{voyageData.dateDepartV ? new Date(voyageData.dateDepartV).toLocaleDateString('fr-FR') : "N/A"}</span></div></td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={(e) => handleDelete(voyageId, e)} disabled={deletingId === voyageId} className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition">
                                                        {deletingId === voyageId ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                            <div className="text-sm text-gray-500">Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredVoyages.length)} sur {filteredVoyages.length}</div>
                            <div className="flex items-center gap-2">
                                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Précédent</button>
                                <div className="flex gap-1">{getPageNumbers().map(page => <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${currentPage === page ? 'bg-[#f59e0b] text-white' : 'hover:bg-gray-100'}`}>{page}</button>)}</div>
                                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Suivant</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}