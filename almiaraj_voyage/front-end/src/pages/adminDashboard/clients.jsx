import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Search, 
  X, 
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Filter,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminClients() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedNationality, setSelectedNationality] = useState("");
    const [nationalities, setNationalities] = useState([]);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        let result = [...clients];
        
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(client => {
                const fullName = `${client.prenomCl || ''} ${client.nomCl || ''}`.toLowerCase();
                const email = (client.email || '').toLowerCase();
                const phone = (client.numTelCl || '').toLowerCase();
                const cin = (client.cin || '').toLowerCase();
                return fullName.includes(search) || email.includes(search) || phone.includes(search) || cin.includes(search);
            });
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
                case "oldest":
                    return new Date(a.dateInscription) - new Date(b.dateInscription);
                case "newest":
                default:
                    return new Date(b.dateInscription) - new Date(a.dateInscription);
            }
        });
        
        setFilteredClients(result);
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [clients, searchTerm, sortBy, selectedNationality, itemsPerPage, dateRange]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axiosClient.get('/admin/clients');
            
            if (response.data && response.data.success === true) {
                setClients(response.data.data || []);
            } else if (response.data && Array.isArray(response.data)) {
                setClients(response.data);
            } else {
                setClients([]);
            }
            
            const clientsData = response.data?.data || response.data || [];
            const uniqueNationalities = [...new Set(clientsData.map(c => c.natCl).filter(Boolean))];
            setNationalities(uniqueNationalities);
            
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || "Erreur lors du chargement des clients");
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client ? Toutes ses réservations seront également supprimées.")) return;
        
        try {
            setDeletingId(id);
            await axiosClient.delete(`/admin/users/${id}`);
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

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortBy("newest");
        setSelectedNationality("");
        setDateRange({ start: "", end: "" });
    };

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredClients.slice(startIndex, endIndex);
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
        setTotalPages(Math.ceil(filteredClients.length / newItemsPerPage));
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
                <p className="text-gray-500 text-sm">Chargement des clients...</p>
            </div>
        );
    }

    const currentItems = getCurrentPageItems();

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Clients</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredClients.length} client(s) trouvé(s)</p>
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
                    <button onClick={fetchClients} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                        <RefreshCw size={14} />
                        Actualiser
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button onClick={fetchClients} className="ml-4 text-red-700 underline">Réessayer</button>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, téléphone ou CIN..."
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
                        <option value="newest">Plus récents</option>
                        <option value="oldest">Plus anciens</option>
                        <option value="name_asc">Nom (A-Z)</option>
                        <option value="name_desc">Nom (Z-A)</option>
                    </select>

                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${showFilters ? "bg-[#f59e0b] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        <Filter size={14} />
                        Filtres
                        {selectedNationality && <span className="w-2 h-2 bg-red-500 rounded-full ml-1"></span>}
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
                                <option value="">Toutes les nationalités</option>
                                {nationalities.map(nat => (
                                    <option key={nat} value={nat}>{nat}</option>
                                ))}
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
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nationalité</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">CIN</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date inscription</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((client) => (
                                    <tr 
                                        key={client.id} 
                                        onClick={() => handleRowClick(client.id)} 
                                        className="hover:bg-orange-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3 text-orange-600 font-mono text-sm font-medium">#{client.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] flex items-center justify-center text-white text-sm font-medium">
                                                    {client.prenomCl?.charAt(0) || 'C'}
                                                    {client.nomCl?.charAt(0) || 'L'}
                                                </div>
                                                <div className="font-medium text-gray-800">{client.prenomCl} {client.nomCl}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">{client.email}</span>
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
                                                <MapPin size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 capitalize">{client.natCl || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-mono text-gray-600">{client.cin || "-"}</span>
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
                                                    onClick={(e) => handleDelete(client.id, e)} 
                                                    disabled={deletingId === client.id} 
                                                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                            <div className="text-sm text-gray-500">
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredClients.length)} sur {filteredClients.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                                    <ChevronLeft size={16} />
                                    Précédent
                                </button>
                                <div className="flex gap-1">
                                    {getPageNumbers().map(page => (
                                        <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${currentPage === page ? 'bg-[#f59e0b] text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
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