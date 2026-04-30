import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  User,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminAvis() {
  const [avis, setAvis] = useState([]);
  const [filteredAvis, setFilteredAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAvis, setSelectedAvis] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAvis();
  }, []);

  useEffect(() => {
    let result = [...avis];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.commentaire?.toLowerCase().includes(search) ||
        a.client?.prenomCl?.toLowerCase().includes(search) ||
        a.client?.nomCl?.toLowerCase().includes(search) ||
        a.service?.nomServ?.toLowerCase().includes(search)
      );
    }

    if (selectedRating) {
      result = result.filter(a => a.note === parseInt(selectedRating));
    }

    if (selectedStatus) {
      result = result.filter(a => a.status === selectedStatus);
    }

    setFilteredAvis(result);
  }, [avis, searchTerm, selectedRating, selectedStatus]);

  const fetchAvis = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/avis');
      
      if (response.data?.success) {
        setAvis(response.data.data || []);
      } else {
        setAvis([]);
      }
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur lors du chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet avis ?")) return;
    
    try {
      setDeletingId(id);
      await axiosClient.delete(`/admin/avis/${id}`);
      await fetchAvis();
      alert("Avis supprimé avec succès");
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="status-badge approved"><CheckCircle size={12}/> Approuvé</span>;
      case 'pending':
        return <span className="status-badge pending"><Clock size={12}/> En attente</span>;
      case 'rejected':
        return <span className="status-badge rejected"><AlertCircle size={12}/> Rejeté</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const renderStars = (note) => {
    return (
      <div className="stars">
        {[1,2,3,4,5].map(star => (
          <Star 
            key={star} 
            size={14} 
            className={star <= note ? 'filled' : 'empty'}
          />
        ))}
      </div>
    );
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
    setSelectedRating("");
    setSelectedStatus("");
  };

  if (loading) {
    return (
      <div className="admin-avis-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des avis...</p>
      </div>
    );
  }

  return (
    <div className="admin-avis-container">
      {/* Header */}
      <div className="avis-header">
        <div>
          <h1 className="avis-title">Gestion des Avis</h1>
          <p className="avis-subtitle">{filteredAvis.length} avis trouvé(s)</p>
        </div>
        <button onClick={fetchAvis} className="refresh-btn">
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={fetchAvis}>Réessayer</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par client, service ou commentaire..."
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
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles ★★★★★</option>
            <option value="4">4 étoiles ★★★★☆</option>
            <option value="3">3 étoiles ★★★☆☆</option>
            <option value="2">2 étoiles ★★☆☆☆</option>
            <option value="1">1 étoile ★☆☆☆☆</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="approved">Approuvés</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejetés</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            <Filter size={16} />
            Filtres
          </button>

          {(searchTerm || selectedRating || selectedStatus) && (
            <button onClick={clearFilters} className="clear-filters">
              <X size={14} />
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* Avis List */}
      {filteredAvis.length === 0 ? (
        <div className="empty-state">
          <Star size={48} />
          <h3>Aucun avis trouvé</h3>
          <p>Les avis des clients apparaîtront ici</p>
        </div>
      ) : (
        <div className="avis-list">
          {filteredAvis.map((a) => (
            <div key={a.id} className="avis-card">
              <div className="avis-card-header">
                <div className="client-info">
                  <div className="client-avatar">
                    {a.client?.prenomCl?.charAt(0)}{a.client?.nomCl?.charAt(0)}
                  </div>
                  <div>
                    <div className="client-name">
                      {a.client?.prenomCl} {a.client?.nomCl}
                    </div>
                    <div className="service-name">
                      <Link to={`/admin/voyages/${a.service_id}`}>
                        {a.service?.nomServ}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="avis-meta">
                  {renderStars(a.note)}
                  <span className="avis-date">{formatDate(a.dateAv || a.created_at)}</span>
                  {getStatusBadge(a.status)}
                </div>
              </div>

              <div className="avis-content">
                <p>{a.commentaire}</p>
              </div>

              <div className="avis-card-footer">
                <button
                  onClick={() => {
                    setSelectedAvis(a);
                    setShowDetailsModal(true);
                  }}
                  className="view-btn"
                >
                  <Eye size={16} />
                  Voir détails
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deletingId === a.id}
                  className="delete-btn"
                >
                  {deletingId === a.id ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAvis && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'avis</h3>
              <button onClick={() => setShowDetailsModal(false)} className="close-modal">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Client:</span>
                <span className="detail-value">{selectedAvis.client?.prenomCl} {selectedAvis.client?.nomCl}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Service:</span>
                <span className="detail-value">{selectedAvis.service?.nomServ}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Note:</span>
                <span className="detail-value">{renderStars(selectedAvis.note)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Commentaire:</span>
                <p className="detail-comment">{selectedAvis.commentaire}</p>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(selectedAvis.dateAv || selectedAvis.created_at)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Statut:</span>
                <span className="detail-value">{getStatusBadge(selectedAvis.status)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-avis-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
        .avis-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .avis-title { font-size: 24px; font-weight: 600; color: #1f2937; margin: 0 0 4px 0; }
        .avis-subtitle { color: #6b7280; font-size: 14px; margin: 0; }
        .refresh-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f3f4f6; border: none; border-radius: 10px; cursor: pointer; }
        .error-alert { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #fee2e2; border-radius: 10px; color: #dc2626; margin-bottom: 20px; }
        .filters-section { background: white; border-radius: 16px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .search-bar { position: relative; margin-bottom: 16px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .search-input { width: 100%; padding: 10px 36px 10px 40px; border: 1px solid #e5e7eb; border-radius: 10px; }
        .search-input:focus { outline: none; border-color: #f59e0b; }
        .clear-search { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
        .filters-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .filter-select { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; }
        .filter-toggle { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer; }
        .filter-toggle.active { background: #fef3c7; color: #d97706; }
        .clear-filters { display: flex; align-items: center; gap: 4px; padding: 8px 12px; background: none; border: none; color: #ef4444; cursor: pointer; }
        .avis-list { display: flex; flex-direction: column; gap: 16px; }
        .avis-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .avis-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .avis-card-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .client-info { display: flex; gap: 12px; }
        .client-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #f97316); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; color: white; }
        .client-name { font-weight: 600; color: #1f2937; }
        .service-name a { font-size: 13px; color: #f59e0b; text-decoration: none; }
        .avis-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .stars { display: flex; gap: 2px; }
        .stars .filled { fill: #f59e0b; color: #f59e0b; }
        .stars .empty { color: #d1d5db; }
        .avis-date { font-size: 12px; color: #9ca3af; }
        .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .status-badge.approved { background: #d1fae5; color: #059669; }
        .status-badge.pending { background: #fef3c7; color: #d97706; }
        .status-badge.rejected { background: #fee2e2; color: #dc2626; }
        .avis-content p { margin: 0; line-height: 1.6; color: #4b5563; }
        .avis-card-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #f3f4f6; }
        .view-btn, .delete-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .view-btn { background: #f3f4f6; color: #6b7280; }
        .view-btn:hover { background: #3b82f6; color: white; }
        .delete-btn { background: #fee2e2; color: #dc2626; }
        .delete-btn:hover { background: #dc2626; color: white; }
        .empty-state { text-align: center; padding: 48px; background: white; border-radius: 16px; color: #9ca3af; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
        .modal-body { padding: 20px; }
        .detail-row { display: flex; margin-bottom: 16px; }
        .detail-label { width: 120px; font-weight: 500; color: #6b7280; }
        .detail-value { flex: 1; color: #1f2937; }
        .detail-comment { flex: 1; margin: 0; line-height: 1.5; }
        .close-modal { background: none; border: none; cursor: pointer; color: #6b7280; }
        .loading-spinner { width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #f59e0b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
        .admin-avis-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .admin-avis-container { padding: 16px; }
          .avis-card-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}