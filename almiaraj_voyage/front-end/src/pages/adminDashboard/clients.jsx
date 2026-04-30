import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye, Search, X, Mail, Phone, Filter, Calendar, Globe, RefreshCw } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminClients() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedNationality, setSelectedNationality] = useState("");
    const [nationalities, setNationalities] = useState([]);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        let result = [...clients];
        
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(client => 
                `${client.prenomCl} ${client.nomCl}`.toLowerCase().includes(search) ||
                client.email?.toLowerCase().includes(search) ||
                client.numTelCl?.toLowerCase().includes(search) ||
                client.natCl?.toLowerCase().includes(search)
            );
        }
        
        if (selectedNationality) {
            result = result.filter(client => client.natCl === selectedNationality);
        }
        
        if (dateRange.start) {
            const startDate = new Date(dateRange.start);
            result = result.filter(client => new Date(client.dateInscription) >= startDate);
        }
        if (dateRange.end) {
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59);
            result = result.filter(client => new Date(client.dateInscription) <= endDate);
        }
        
        result.sort((a, b) => {
            switch(sortBy) {
                case "name_asc":
                    return `${a.prenomCl} ${a.nomCl}`.localeCompare(`${b.prenomCl} ${b.nomCl}`);
                case "name_desc":
                    return `${b.prenomCl} ${b.nomCl}`.localeCompare(`${a.prenomCl} ${a.nomCl}`);
                case "date_asc":
                    return new Date(a.dateInscription) - new Date(b.dateInscription);
                case "date_desc":
                    return new Date(b.dateInscription) - new Date(a.dateInscription);
                case "email_asc":
                    return (a.email || "").localeCompare(b.email || "");
                case "email_desc":
                    return (b.email || "").localeCompare(a.email || "");
                case "newest":
                default:
                    return new Date(b.dateInscription) - new Date(a.dateInscription);
            }
        });
        
        setFilteredClients(result);
    }, [clients, searchTerm, sortBy, selectedNationality, dateRange]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/admin/clients');
            
            if (response.data && response.data.success === true) {
                setClients(response.data.data || []);
            } else if (Array.isArray(response.data)) {
                setClients(response.data);
            } else {
                setClients([]);
            }
            
            const uniqueNationalities = [...new Set(response.data.data?.map(c => c.natCl).filter(Boolean))];
            setNationalities(uniqueNationalities);
            
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || "Erreur de chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Supprimer ce client ? Toutes ses réservations seront également supprimées.")) return;
        
        try {
            setDeletingId(id);
            await axiosClient.delete(`/admin/clients/${id}`);
            await fetchClients();
            alert("Client supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleRowClick = (clientId) => {
        navigate(`/admin/users/${clientId}`);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedNationality("");
        setDateRange({ start: "", end: "" });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-6">
                {error}
                <button onClick={fetchClients} className="ml-4 text-red-700 underline">Réessayer</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Clients</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredClients.length} client(s) trouvé(s)</p>
                </div>
                <button onClick={fetchClients} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                    <RefreshCw size={14} />
                    Actualiser
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, téléphone ou nationalité..."
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
                        <option value="date_asc">Plus anciens</option>
                        <option value="name_asc">Nom (A-Z)</option>
                        <option value="name_desc">Nom (Z-A)</option>
                        <option value="email_asc">Email (A-Z)</option>
                        <option value="email_desc">Email (Z-A)</option>
                    </select>

                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                        <Filter size={14} /> Filtres
                    </button>

                    {(searchTerm || selectedNationality || dateRange.start || dateRange.end) && (
                        <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nationalité</label>
                            <select 
                                value={selectedNationality} 
                                onChange={(e) => setSelectedNationality(e.target.value)} 
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Toutes</option>
                                {nationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date inscription (début)</label>
                            <input 
                                type="date" 
                                value={dateRange.start} 
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date inscription (fin)</label>
                            <input 
                                type="date" 
                                value={dateRange.end} 
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Clients Table */}
            {filteredClients.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-3">👥</div>
                    <p className="text-gray-500">Aucun client trouvé</p>
                    {(searchTerm || selectedNationality || dateRange.start || dateRange.end) && (
                        <button onClick={clearFilters} className="mt-3 text-[#f59e0b] hover:underline text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nationalité</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inscription</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClients.map((client) => (
                                <tr 
                                    key={client.id} 
                                    onClick={() => handleRowClick(client.id)} 
                                    className="hover:bg-orange-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 text-orange-600 font-mono text-sm font-medium">#{client.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] flex items-center justify-center text-white text-sm font-medium">
                                                {client.prenomCl?.charAt(0)}{client.nomCl?.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-800">{client.prenomCl} {client.nomCl}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-600 truncate max-w-[180px]">{client.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{client.numTelCl || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Globe size={14} className="text-gray-400" />
                                            <span className="text-sm text-gray-600 capitalize">{client.natCl || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="text-sm text-gray-600 whitespace-nowrap">{formatDate(client.dateInscription)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => { setSelectedClient(client); setShowDetailsModal(true); }} 
                                                className="p-1.5 bg-gray-100 rounded-md hover:bg-blue-500 hover:text-white transition"
                                                title="Voir détails"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(client.id, e)} 
                                                disabled={deletingId === client.id} 
                                                className="p-1.5 bg-red-100 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                                title="Supprimer"
                                            >
                                                {deletingId === client.id ? 
                                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : 
                                                    <Trash2 size={16} />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Client Details Modal */}
            {showDetailsModal && selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] flex items-center justify-center text-white font-bold">
                                    {selectedClient.prenomCl?.charAt(0)}{selectedClient.nomCl?.charAt(0)}
                                </div>
                                <h2 className="text-lg font-bold">{selectedClient.prenomCl} {selectedClient.nomCl}</h2>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Prénom</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.prenomCl}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Nom</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.nomCl}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                    <p className="font-medium text-gray-800 mt-1 break-all">{selectedClient.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Téléphone</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.numTelCl || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Nationalité</label>
                                    <p className="font-medium text-gray-800 mt-1 capitalize">{selectedClient.natCl || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">CIN</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.cin || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Passport</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.passport || "-"}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Adresse</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.adresse || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Ville</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.ville || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Code postal</label>
                                    <p className="font-medium text-gray-800 mt-1">{selectedClient.codePostal || "-"}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Date d'inscription</label>
                                    <p className="font-medium text-gray-800 mt-1">{formatDate(selectedClient.dateInscription)}</p>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}