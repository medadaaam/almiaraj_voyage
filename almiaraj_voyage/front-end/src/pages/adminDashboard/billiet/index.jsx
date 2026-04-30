import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Camera, Trash2, Edit, Eye, Calendar, Plane, MapPin, Search, Filter, X } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminBillets() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [selectedDepartCity, setSelectedDepartCity] = useState("");
    const [departCities, setDepartCities] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    // Filter and sort items
    useEffect(() => {
        let result = [...items];
        
        // Apply search
        if (searchTerm) {
            result = result.filter(item => {
                const serviceData = item.service || item;
                const billetData = item.billet || item;
                const name = (serviceData.nomServ || "").toLowerCase();
                const depart = (billetData.villeDepartBi || item.villeDepartBi || "").toLowerCase();
                const arrivee = (billetData.villeArriveeBi || item.villeArriveeBi || "").toLowerCase();
                const search = searchTerm.toLowerCase();
                return name.includes(search) || depart.includes(search) || arrivee.includes(search);
            });
        }
        
        // Apply type filter
        if (selectedType) {
            result = result.filter(item => {
                const billetData = item.billet || item;
                return (billetData.typeBi || item.typeBi) === selectedType;
            });
        }
        
        // Apply departure city filter
        if (selectedDepartCity) {
            result = result.filter(item => {
                const billetData = item.billet || item;
                return (billetData.villeDepartBi || item.villeDepartBi) === selectedDepartCity;
            });
        }
        
        // Apply sorting
        result.sort((a, b) => {
            const serviceA = a.service || a;
            const serviceB = b.service || b;
            const billetA = a.billet || a;
            const billetB = b.billet || b;
            
            switch(sortBy) {
                case "price_asc":
                    return (serviceA.prix || 0) - (serviceB.prix || 0);
                case "price_desc":
                    return (serviceB.prix || 0) - (serviceA.prix || 0);
                case "name_asc":
                    return (serviceA.nomServ || "").localeCompare(serviceB.nomServ || "");
                case "name_desc":
                    return (serviceB.nomServ || "").localeCompare(serviceA.nomServ || "");
                case "date_asc":
                    return new Date(billetA.dateDepartBi || 0) - new Date(billetB.dateDepartBi || 0);
                case "newest":
                default:
                    return new Date(billetB.dateDepartBi || 0) - new Date(billetA.dateDepartBi || 0);
            }
        });
        
        setFilteredItems(result);
    }, [items, searchTerm, sortBy, selectedType, selectedDepartCity]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/billets');

            let itemsData = [];
            if (response.data) {
                if (response.data.success === true && response.data.data) {
                    itemsData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    itemsData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    itemsData = response.data.data;
                } else if (response.data.billets && Array.isArray(response.data.billets)) {
                    itemsData = response.data.billets;
                } else {
                    itemsData = [];
                }
            }

            setItems(Array.isArray(itemsData) ? itemsData : []);
            
            // Extract unique departure cities
            const uniqueCities = [...new Set(itemsData.map(item => {
                const billetData = item.billet || item;
                return billetData.villeDepartBi || item.villeDepartBi;
            }).filter(Boolean))];
            setDepartCities(uniqueCities);
            
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError(`Erreur lors du chargement: ${err.message}`);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce billet ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/billets/${id}`);
            await fetchItems();
            alert("Billet supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'aller_simple': return 'Aller simple';
            case 'aller_retour': return 'Aller-retour';
            default: return type;
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedType("");
        setSelectedDepartCity("");
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
                <p>{error}</p>
                <button onClick={fetchItems} className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="service-billets">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Billets</h1>
                <Link
                    to="/admin/ajouterBillet"
                    className="bg-[#fb923c] text-white px-4 py-2 rounded-md hover:bg-[#ea580c] transition flex items-center gap-2"
                >
                    + Ajouter un billet
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
                                placeholder="Rechercher par nom, départ ou arrivée..."
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
                            <option value="date_asc">Plus anciens</option>
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
                        {(selectedType || selectedDepartCity) && (
                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {(searchTerm || selectedType || selectedDepartCity) && (
                        <button onClick={clearFilters} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                            <X size={14} /> Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de billet</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Tous les types</option>
                                    <option value="aller_simple">Aller simple</option>
                                    <option value="aller_retour">Aller-retour</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ville de départ</label>
                                <select
                                    value={selectedDepartCity}
                                    onChange={(e) => setSelectedDepartCity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                >
                                    <option value="">Toutes les villes</option>
                                    {departCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-3 text-sm text-gray-500">
                    {filteredItems.length} billet(s) trouvé(s)
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun billet trouvé</p>
                    {(searchTerm || selectedType || selectedDepartCity) && (
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
                                <th className="p-3">Nom</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Départ</th>
                                <th className="p-3">Destination</th>
                                <th className="p-3">Date départ</th>
                                <th className="p-3">Prix</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => {
                                const itemId = item.id;
                                const serviceData = item.service || {};
                                const billetData = item.billet || item;

                                return (
                                    <tr key={itemId} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3 font-semibold">
                                            {serviceData.nomServ || item.nomServ || "Sans titre"}
                                        </td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                                {getTypeLabel(billetData.typeBi || item.typeBi)}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <Plane size={14} className="text-[#fb923c]" />
                                                {billetData.villeDepartBi || item.villeDepartBi || "-"}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-[#fb923c]" />
                                                {billetData.villeArriveeBi || item.villeArriveeBi || "-"}
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {billetData.dateDepartBi || item.dateDepartBi ?
                                                    new Date(billetData.dateDepartBi || item.dateDepartBi).toLocaleDateString('fr-FR') :
                                                    "-"}
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-[#fb923c]">
                                            {serviceData.prix || item.prix || 0} DH
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/showBillet/${itemId}`} className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition" title="Détails">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/admin/editBillet/${itemId}`} className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition" title="Modifier">
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(itemId)}
                                                    disabled={deletingId === itemId}
                                                    className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === itemId ?
                                                        <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div> :
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
            )}
        </div>
    );
}