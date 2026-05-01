import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Camera, Trash2, Edit, Calendar, Bed, Search, Filter, X, RefreshCw } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminHajjOmras() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [selectedFormule, setSelectedFormule] = useState("");
    const [formules, setFormules] = useState([]);
    
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
        fetchItems();
    }, []);

    // Filter and sort items whenever dependencies change
    useEffect(() => {
        let result = [...items];
        
        // Apply search
        if (searchTerm) {
            result = result.filter(item => {
                const serviceData = item.service || item;
                const name = (serviceData.nomServ || "").toLowerCase();
                const search = searchTerm.toLowerCase();
                return name.includes(search);
            });
        }
        
        // Apply type filter
        if (selectedType) {
            result = result.filter(item => {
                const itemData = item.hajj_omra || item;
                return itemData.type === selectedType;
            });
        }
        
        // Apply formule filter
        if (selectedFormule) {
            result = result.filter(item => {
                const itemData = item.hajj_omra || item;
                return itemData.formule === selectedFormule;
            });
        }
        
        // Apply sorting
        result.sort((a, b) => {
            const serviceA = a.service || a;
            const serviceB = b.service || b;
            
            switch(sortBy) {
                case "price_asc":
                    return (serviceA.prix || 0) - (serviceB.prix || 0);
                case "price_desc":
                    return (serviceB.prix || 0) - (serviceA.prix || 0);
                case "name_asc":
                    return (serviceA.nomServ || "").localeCompare(serviceB.nomServ || "");
                case "name_desc":
                    return (serviceB.nomServ || "").localeCompare(serviceA.nomServ || "");
                case "newest":
                default:
                    return new Date(serviceB.created_at || 0) - new Date(serviceA.created_at || 0);
            }
        });
        
        setFilteredItems(result);
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [items, searchTerm, sortBy, selectedType, selectedFormule, itemsPerPage]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/hajj-omras');
            
            let itemsData = [];
            if (response.data && response.data.data) {
                itemsData = response.data.data;
            } else if (Array.isArray(response.data)) {
                itemsData = response.data;
            } else {
                itemsData = [];
            }

            setItems(itemsData);
            
            // Extract unique formules for filter
            const uniqueFormules = [...new Set(itemsData.map(item => {
                const itemData = item.hajj_omra || item;
                return itemData.formule;
            }).filter(Boolean))];
            setFormules(uniqueFormules);
            
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/hajj-omras/${id}`);
            await fetchItems();
            alert("Service supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleRowClick = (itemId) => {
        navigate(`/admin/showHajj-omra/${itemId}`);
    };

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedType("");
        setSelectedFormule("");
    };

    // Pagination functions
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredItems.slice(startIndex, endIndex);
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
        setTotalPages(Math.ceil(filteredItems.length / newItemsPerPage));
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
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion Hajj & Omra</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredItems.length} service(s) trouvé(s)</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchItems} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                        <RefreshCw size={14} />
                        Actualiser
                    </button>
                    <Link
                        to="/admin/ajouterHajj-omra"
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
                        placeholder="Rechercher par nom..."
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

                    {(searchTerm || selectedType || selectedFormule) && (
                        <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Tous les types</option>
                                <option value="hajj">Hajj</option>
                                <option value="omra">Omra</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Formule</label>
                            <select
                                value={selectedFormule}
                                onChange={(e) => setSelectedFormule(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Toutes les formules</option>
                                {formules.map(formule => (
                                    <option key={formule} value={formule}>{formule}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-3">🕋</div>
                    <p className="text-gray-500">Aucun service trouvé</p>
                    {(searchTerm || selectedType || selectedFormule) && (
                        <button onClick={clearFilters} className="mt-3 text-[#f59e0b] hover:underline text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Formule</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Durée</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Chambre</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((item) => {
                                    const serviceData = item.service || item;
                                    const itemData = item.hajj_omra || item;
                                    const itemId = item.id || itemData.id;

                                    return (
                                        <tr 
                                            key={itemId} 
                                            onClick={() => handleRowClick(itemId)} 
                                            className="hover:bg-orange-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                {serviceData.image && !imageErrors[itemId] ? (
                                                    <img
                                                        src={getImageUrl(serviceData.image)}
                                                        alt={serviceData.nomServ}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                        onError={() => handleImageError(itemId)}
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
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                                    itemData.type === 'hajj' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {itemData.type === 'hajj' ? 'Hajj' : 'Omra'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">{itemData.formule || "-"}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{itemData.duree || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Bed size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{itemData.typeChambre || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-[#f59e0b]">{serviceData.prix || 0} DH</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Link
                                                        to={`/admin/editHajj-omra/${itemId}`}
                                                        className="p-1.5 bg-green-100 rounded-md hover:bg-green-500 hover:text-white transition"
                                                        title="Modifier"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={(e) => handleDelete(itemId, e)}
                                                        disabled={deletingId === itemId}
                                                        className="p-1.5 bg-red-100 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        {deletingId === itemId ? 
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
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredItems.length)} sur {filteredItems.length}
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