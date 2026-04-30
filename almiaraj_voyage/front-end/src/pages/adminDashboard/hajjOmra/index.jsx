import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Camera, Trash2, Edit, Eye, Calendar, Bed, Search, Filter, X, MapPin, Globe } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminHajjOmras() {
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
                const itemData = item.hajj_omra || item;
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
    }, [items, searchTerm, sortBy, selectedType, selectedFormule]);

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

    const handleDelete = async (id) => {
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

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedType("");
        setSelectedFormule("");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
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
        <div className="service-hajj-omras">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestion Hajj & Omra</h1>
                <Link
                    to="/admin/ajouterHajj-omra"
                    className="bg-[#fb923c] text-white px-4 py-2 rounded-md hover:bg-[#ea580c] transition flex items-center gap-2"
                >
                    + Ajouter un service
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

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
                        </select>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                            showFilters ? "bg-[#fb923c] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <Filter size={18} />
                        Filtres
                        {(selectedType || selectedFormule) && (
                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {(searchTerm || selectedType || selectedFormule) && (
                        <button onClick={clearFilters} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                            <X size={14} /> Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Tous les types</option>
                                    <option value="hajj">Hajj</option>
                                    <option value="omra">Omra</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Formule</label>
                                <select
                                    value={selectedFormule}
                                    onChange={(e) => setSelectedFormule(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Toutes les formules</option>
                                    {formules.map(formule => (
                                        <option key={formule} value={formule}>{formule}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-3 text-sm text-gray-500">
                    {filteredItems.length} service(s) trouvé(s)
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun service trouvé</p>
                    {(searchTerm || selectedType || selectedFormule) && (
                        <button onClick={clearFilters} className="text-[#fb923c] hover:underline mt-2 inline-block">
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
                                <th className="p-3">Type</th>
                                <th className="p-3">Formule</th>
                                <th className="p-3">Durée</th>
                                <th className="p-3">Chambre</th>
                                <th className="p-3">Prix</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => {
                                const serviceData = item.service || item;
                                const itemData = item.hajj_omra || item;
                                const itemId = item.id || itemData.id;

                                return (
                                    <tr key={itemId} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            {serviceData.image && !imageErrors[itemId] ? (
                                                <img
                                                    src={getImageUrl(serviceData.image)}
                                                    alt={serviceData.nomServ}
                                                    className="w-20 h-14 object-cover rounded-md"
                                                    onError={() => handleImageError(itemId)}
                                                />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <Camera size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-semibold">{serviceData.nomServ || "Sans titre"}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${itemData.type === 'hajj' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {itemData.type === 'hajj' ? 'Hajj' : 'Omra'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm">{itemData.formule}</td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {itemData.duree}
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Bed size={14} />
                                                {itemData.typeChambre}
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-[#fb923c]">{serviceData.prix} DH</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/showHajj-omra/${itemId}`} className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition" title="Détails">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/admin/editHajj-omra/${itemId}`} className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition" title="Modifier">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(itemId)} disabled={deletingId === itemId} className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50" title="Supprimer">
                                                    {deletingId === itemId ? <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div> : <Trash2 size={16} />}
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