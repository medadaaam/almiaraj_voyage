import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Search, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  DollarSign,
  RefreshCw,
  Filter,
  User
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminReservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedServiceType, setSelectedServiceType] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        let result = [...reservations];
        
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(res => {
                const clientName = `${res.client?.prenomCl || ''} ${res.client?.nomCl || ''}`.toLowerCase();
                const reference = (res.reference || res.id || '').toString().toLowerCase();
                const serviceName = (res.service?.nomServ || '').toLowerCase();
                return clientName.includes(search) || reference.includes(search) || serviceName.includes(search);
            });
        }
        
        if (selectedStatus) {
            result = result.filter(res => res.status === selectedStatus);
        }
        
        if (selectedServiceType) {
            result = result.filter(res => res.service?.type === selectedServiceType);
        }
        
        if (dateRange.start) {
            const startDate = new Date(dateRange.start);
            result = result.filter(res => new Date(res.created_at) >= startDate);
        }
        if (dateRange.end) {
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59);
            result = result.filter(res => new Date(res.created_at) <= endDate);
        }
        
        result.sort((a, b) => {
            switch(sortBy) {
                case "date_asc":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "price_desc":
                    return (b.prixTotal || 0) - (a.prixTotal || 0);
                case "price_asc":
                    return (a.prixTotal || 0) - (b.prixTotal || 0);
                case "client_asc":
                    const nameA = `${a.client?.prenomCl || ''} ${a.client?.nomCl || ''}`;
                    const nameB = `${b.client?.prenomCl || ''} ${b.client?.nomCl || ''}`;
                    return nameA.localeCompare(nameB);
                case "client_desc":
                    const nameC = `${a.client?.prenomCl || ''} ${a.client?.nomCl || ''}`;
                    const nameD = `${b.client?.prenomCl || ''} ${b.client?.nomCl || ''}`;
                    return nameD.localeCompare(nameC);
                case "newest":
                default:
                    return new Date(b.created_at) - new Date(a.created_at);
            }
        });
        
        setFilteredReservations(result);
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [reservations, searchTerm, sortBy, selectedStatus, selectedServiceType, itemsPerPage, dateRange]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axiosClient.get('/admin/reservations');
            
            if (response.data && response.data.success === true) {
                setReservations(response.data.data || []);
            } else if (response.data && Array.isArray(response.data)) {
                setReservations(response.data);
            } else {
                setReservations([]);
            }
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || "Erreur lors du chargement des réservations");
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;
        
        try {
            setDeletingId(id);
            await axiosClient.delete(`/admin/reservations/${id}`);
            await fetchReservations();
            alert("Réservation supprimée avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleRowClick = (reservationId) => {
        navigate(`/admin/reservations/${reservationId}`);
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
        setSelectedStatus("");
        setSelectedServiceType("");
        setDateRange({ start: "", end: "" });
    };

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredReservations.slice(startIndex, endIndex);
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
        setTotalPages(Math.ceil(filteredReservations.length / newItemsPerPage));
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

    const currentItems = getCurrentPageItems();

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
                    <p className="text-gray-500 text-sm mt-1">{filteredReservations.length} réservation(s) trouvée(s)</p>
                </div>
                <button onClick={fetchReservations} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                    <RefreshCw size={14} />
                    Actualiser
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button onClick={fetchReservations} className="ml-4 text-red-700 underline">Réessayer</button>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par client, référence ou service..."
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
                        <option value="newest">Plus récentes</option>
                        <option value="date_asc">Plus anciennes</option>
                        <option value="price_desc">Prix (décroissant)</option>
                        <option value="price_asc">Prix (croissant)</option>
                        <option value="client_asc">Client (A-Z)</option>
                        <option value="client_desc">Client (Z-A)</option>
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

                    {(searchTerm || selectedStatus || selectedServiceType || dateRange.start || dateRange.end) && (
                        <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Statut</label>
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)} 
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Type de service</label>
                            <select 
                                value={selectedServiceType} 
                                onChange={(e) => setSelectedServiceType(e.target.value)} 
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            >
                                <option value="">Tous les types</option>
                                <option value="voyage">Voyage</option>
                                <option value="hotel">Hôtel</option>
                                <option value="billet">Billet</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date réservation (début)</label>
                            <input 
                                type="date" 
                                value={dateRange.start} 
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date réservation (fin)</label>
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

            {/* Reservations Table */}
            {filteredReservations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-3">📋</div>
                    <p className="text-gray-500">Aucune réservation trouvée</p>
                    {(searchTerm || selectedStatus || selectedServiceType || dateRange.start || dateRange.end) && (
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Référence</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentItems.map((res) => (
                                    <tr 
                                        key={res.id} 
                                        onClick={() => handleRowClick(res.id)} 
                                        className="hover:bg-orange-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3 text-orange-600 font-mono text-sm font-medium">
                                            #{res.reference || res.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] flex items-center justify-center text-white text-sm font-medium">
                                                    {res.client?.prenomCl?.charAt(0) || 'C'}
                                                    {res.client?.nomCl?.charAt(0) || 'L'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {res.client?.prenomCl} {res.client?.nomCl}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{res.client?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-700">{res.service?.nomServ || "N/A"}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                                res.service?.type === 'voyage' ? 'bg-blue-100 text-blue-700' :
                                                res.service?.type === 'hotel' ? 'bg-orange-100 text-orange-700' :
                                                'bg-purple-100 text-purple-700'
                                            }`}>
                                                {res.service?.type === 'voyage' ? 'Voyage' :
                                                 res.service?.type === 'hotel' ? 'Hôtel' : 'Billet'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 whitespace-nowrap">{formatDate(res.created_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={14} className="text-[#f59e0b]" />
                                                <span className="font-semibold text-[#f59e0b]">{res.prixTotal || 0} DH</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                                res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {res.status === 'pending' && <Clock size={10} />}
                                                {res.status === 'confirmed' && <CheckCircle size={10} />}
                                                {res.status === 'cancelled' && <AlertCircle size={10} />}
                                                {res.status === 'pending' ? 'En attente' :
                                                 res.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={(e) => handleDelete(res.id, e)} 
                                                    disabled={deletingId === res.id} 
                                                    className="p-1.5 bg-red-100 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === res.id ? 
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
                        <div className="flex flex-col sm:flex-row justify-around items-center gap-4 mt-6">
                            <div className="text-sm text-gray-500">
                                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredReservations.length)} sur {filteredReservations.length}
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