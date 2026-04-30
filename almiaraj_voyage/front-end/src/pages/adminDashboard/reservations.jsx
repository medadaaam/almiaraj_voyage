import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Eye, 
  Search, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  User,
  Calendar,
  DollarSign
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
    }, [reservations, searchTerm, sortBy, selectedStatus, selectedServiceType]);

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
        e.stopPropagation(); // Prevent event from bubbling to row click
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

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <span className="status-badge pending"><Clock size={12}/> En attente</span>;
            case 'confirmed':
                return <span className="status-badge confirmed"><CheckCircle size={12}/> Confirmée</span>;
            case 'cancelled':
                return <span className="status-badge cancelled"><AlertCircle size={12}/> Annulée</span>;
            default:
                return <span className="status-badge">{status || 'N/A'}</span>;
        }
    };

    const getServiceTypeBadge = (type) => {
        const badges = {
            'voyage': { class: 'voyage', label: 'Voyage' },
            'hotel': { class: 'hotel', label: 'Hôtel' },
            'billet': { class: 'billet', label: 'Billet' },
            'hajj': { class: 'hajj', label: 'Hajj' },
            'omra': { class: 'omra', label: 'Omra' }
        };
        const badge = badges[type] || { class: 'default', label: type || 'Service' };
        return <span className={`service-badge ${badge.class}`}>{badge.label}</span>;
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
    };

    if (loading) {
        return (
            <div className="admin-reservations-loading">
                <div className="loading-spinner"></div>
                <p>Chargement des réservations...</p>
            </div>
        );
    }

    return (
        <div className="admin-reservations-container">
            
            {/* Search and Filters */}
            <div className="filters-section">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher par client, référence ou service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="clear-search">
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="filters-row">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="newest">Plus récentes</option>
                        <option value="date_asc">Plus anciennes</option>
                        <option value="price_desc">Prix (décroissant)</option>
                        <option value="price_asc">Prix (croissant)</option>
                        <option value="client_asc">Client (A-Z)</option>
                        <option value="client_desc">Client (Z-A)</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`filter-toggle ${showFilters ? 'active' : ''}`}
                    >
                        Filtres
                        {(selectedStatus || selectedServiceType) && <span className="filter-badge"></span>}
                    </button>

                    {(searchTerm || selectedStatus || selectedServiceType) && (
                        <button onClick={clearFilters} className="clear-filters">
                            <X size={14} />
                            Effacer les filtres
                        </button>
                    )}
                </div>

                {showFilters && (
                    <div className="advanced-filters">
                        <div className="filter-group">
                            <label>Statut</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Type de service</label>
                            <select
                                value={selectedServiceType}
                                onChange={(e) => setSelectedServiceType(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Tous les types</option>
                                <option value="voyage">Voyage</option>
                                <option value="hotel">Hôtel</option>
                                <option value="billet">Billet</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Reservations Table */}
            {filteredReservations.length === 0 ? (
                <div className="empty-state">
                    <Calendar size={48} className="empty-icon" />
                    <h3>Aucune réservation trouvée</h3>
                    <p>{searchTerm || selectedStatus || selectedServiceType ? "Essayez d'autres critères de recherche" : "Les réservations apparaîtront ici"}</p>
                    {(searchTerm || selectedStatus || selectedServiceType) && (
                        <button onClick={clearFilters} className="empty-action">
                            Effacer les filtres
                        </button>
                    )}
                </div>
            ) : (
                <div className="reservations-table-container">
                    <table className="reservations-table">
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Client</th>
                                <th>Service</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Prix</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((res) => (
                                <tr 
                                    key={res.id} 
                                    onClick={() => handleRowClick(res.id)}
                                    className="reservation-row"
                                >
                                    <td className="reference-cell">
                                        <span className="reference">#{res.reference || res.id}</span>
                                    </td>
                                    <td>
                                        <div className="client-info">
                                            <div className="client-avatar">
                                                {res.client?.prenomCl?.charAt(0) || 'C'}
                                                {res.client?.nomCl?.charAt(0) || 'L'}
                                            </div>
                                            <div className="client-details">
                                                <span className="client-name">
                                                    {res.client?.prenomCl} {res.client?.nomCl}
                                                </span>
                                                <span className="client-email">{res.client?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="service-name">
                                            {res.service?.nomServ || "N/A"}
                                        </div>
                                    </td>
                                    <td>
                                        {getServiceTypeBadge(res.service?.type)}
                                    </td>
                                    <td>
                                        <div className="date-info">
                                            <Calendar size={12} />
                                            <span>{formatDate(res.created_at)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="price-cell">
                                            <DollarSign size={14} />
                                            <span className="price-value">{res.prixTotal || 0} DH</span>
                                        </div>
                                    </td>
                                    <td>
                                        {getStatusBadge(res.status)}
                                    </td>
                                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                        <div className="actions-buttons">
                                            <button
                                                onClick={() => handleRowClick(res.id)}
                                                className="action-btn view-btn"
                                                title="Voir les détails"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(res.id, e)}
                                                disabled={deletingId === res.id}
                                                className="action-btn delete-btn"
                                                title="Supprimer"
                                            >
                                                {deletingId === res.id ? (
                                                    <div className="spinner-small"></div>
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .admin-reservations-container {
                    padding: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .admin-reservations-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .admin-reservations-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 4px 0;
                }
                .admin-reservations-subtitle {
                    color: #6b7280;
                    font-size: 14px;
                    margin: 0;
                }
                .refresh-btn {
                    padding: 8px 16px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .refresh-btn:hover {
                    background: #e5e7eb;
                }
                .error-alert {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: #fee2e2;
                    border-radius: 8px;
                    color: #dc2626;
                    margin-bottom: 20px;
                }
                .error-alert button {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #dc2626;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .filters-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .search-bar {
                    position: relative;
                    margin-bottom: 16px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }
                .search-input {
                    width: 100%;
                    padding: 10px 36px 10px 40px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s;
                }
                .search-input:focus {
                    border-color: #f59e0b;
                    box-shadow: 0 0 0 2px rgba(245,158,11,0.1);
                }
                .clear-search {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                }
                .filters-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .filter-select {
                    padding: 8px 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    background: white;
                    cursor: pointer;
                }
                .filter-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    position: relative;
                }
                .filter-toggle.active {
                    background: #fef3c7;
                    color: #d97706;
                }
                .filter-badge {
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    position: absolute;
                    top: -2px;
                    right: -2px;
                }
                .clear-filters {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 8px 12px;
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    font-size: 13px;
                }
                .advanced-filters {
                    display: flex;
                    gap: 20px;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #e5e7eb;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .filter-group label {
                    font-size: 12px;
                    color: #6b7280;
                }
                .reservations-table-container {
                    background: white;
                    border-radius: 12px;
                    overflow-x: auto;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .reservations-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .reservations-table th {
                    text-align: left;
                    padding: 16px;
                    background: #f9fafb;
                    font-weight: 600;
                    font-size: 13px;
                    color: #6b7280;
                    border-bottom: 1px solid #e5e7eb;
                }
                .reservations-table td {
                    padding: 16px;
                    border-bottom: 1px solid #f3f4f6;
                    font-size: 14px;
                }
                .reservation-row {
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .reservation-row:hover {
                    background: #fef3c7;
                }
                .reference-cell .reference {
                    font-family: monospace;
                    font-weight: 600;
                    color: #f59e0b;
                }
                .client-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .client-avatar {
                    width: 36px;
                    height: 36px;
                    background: #fef3c7;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 600;
                    color: #d97706;
                }
                .client-details {
                    display: flex;
                    flex-direction: column;
                }
                .client-name {
                    font-weight: 500;
                    color: #1f2937;
                }
                .client-email {
                    font-size: 12px;
                    color: #9ca3af;
                }
                .service-name {
                    font-weight: 500;
                    color: #374151;
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .status-badge.pending {
                    background: #fef3c7;
                    color: #d97706;
                }
                .status-badge.confirmed {
                    background: #d1fae5;
                    color: #059669;
                }
                .status-badge.cancelled {
                    background: #fee2e2;
                    color: #dc2626;
                }
                .service-badge {
                    display: inline-flex;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                }
                .service-badge.voyage {
                    background: #dbeafe;
                    color: #2563eb;
                }
                .service-badge.hotel {
                    background: #fef3c7;
                    color: #d97706;
                }
                .service-badge.billet {
                    background: #e0e7ff;
                    color: #4338ca;
                }
                .date-info {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #6b7280;
                }
                .price-cell {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 600;
                }
                .price-value {
                    color: #f59e0b;
                }
                .actions-cell {
                    text-align: center;
                }
                .actions-buttons {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }
                .action-btn {
                    padding: 6px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .view-btn {
                    background: #f3f4f6;
                    color: #6b7280;
                }
                .view-btn:hover {
                    background: #3b82f6;
                    color: white;
                }
                .delete-btn {
                    background: #fee2e2;
                    color: #dc2626;
                }
                .delete-btn:hover:not(:disabled) {
                    background: #dc2626;
                    color: white;
                }
                .delete-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .empty-state {
                    text-align: center;
                    padding: 48px;
                    background: white;
                    border-radius: 12px;
                }
                .empty-icon {
                    color: #d1d5db;
                    margin-bottom: 16px;
                }
                .empty-state h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #374151;
                    margin: 0 0 8px 0;
                }
                .empty-state p {
                    color: #9ca3af;
                    margin: 0 0 16px 0;
                }
                .empty-action {
                    padding: 8px 16px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .admin-reservations-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                }
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid #f3f4f6;
                    border-top-color: #f59e0b;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                .spinner-small {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f4f6;
                    border-top-color: currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .admin-reservations-container {
                        padding: 16px;
                    }
                    .advanced-filters {
                        flex-direction: column;
                    }
                    .reservations-table th, .reservations-table td {
                        padding: 12px;
                    }
                }
            `}</style>
        </div>
    );
}