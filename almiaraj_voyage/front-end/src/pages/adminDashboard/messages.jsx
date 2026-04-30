import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  User,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
  Reply
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let result = [...messages];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.contenu?.toLowerCase().includes(search) ||
        m.nomM?.toLowerCase().includes(search) ||
        m.emailM?.toLowerCase().includes(search) ||
        m.client?.prenomCl?.toLowerCase().includes(search) ||
        m.client?.nomCl?.toLowerCase().includes(search)
      );
    }

    if (selectedStatus) {
      result = result.filter(m => m.statusM === selectedStatus);
    }

    setFilteredMessages(result);
  }, [messages, searchTerm, selectedStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/messages');
      
      if (response.data?.success) {
        setMessages(response.data.data || []);
      } else {
        setMessages([]);
      }
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce message ?")) return;
    
    try {
      setDeletingId(id);
      await axiosClient.delete(`/admin/messages/${id}`);
      await fetchMessages();
      alert("Message supprimé avec succès");
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      alert("Veuillez écrire une réponse");
      return;
    }
    
    setSendingReply(true);
    try {
      await axiosClient.put(`/admin/messages/${id}/reply`, { reply: replyText });
      alert("Réponse envoyée avec succès");
      setReplyText("");
      setShowDetailsModal(false);
      await fetchMessages();
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de l'envoi de la réponse");
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosClient.put(`/admin/messages/${id}/status`, { statusM: status });
      await fetchMessages();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'lu':
        return <span className="status-badge read"><CheckCircle size={12}/> Lu</span>;
      case 'repondu':
        return <span className="status-badge replied"><Reply size={12}/> Répondu</span>;
      default:
        return <span className="status-badge unread"><Clock size={12}/> Non lu</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  if (loading) {
    return (
      <div className="admin-messages-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des messages...</p>
      </div>
    );
  }

  return (
    <div className="admin-messages-container">
      {/* Header */}
      <div className="messages-header">
        <div>
          <h1 className="messages-title">Gestion des Messages</h1>
          <p className="messages-subtitle">{filteredMessages.length} message(s) trouvé(s)</p>
        </div>
        <button onClick={fetchMessages} className="refresh-btn">
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={fetchMessages}>Réessayer</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou contenu..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="non_lu">Non lus</option>
            <option value="lu">Lus</option>
            <option value="repondu">Répondus</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            <Filter size={16} />
            Filtres
          </button>

          {(searchTerm || selectedStatus) && (
            <button onClick={clearFilters} className="clear-filters">
              <X size={14} />
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="empty-state">
          <Mail size={48} />
          <h3>Aucun message trouvé</h3>
          <p>Les messages des clients apparaîtront ici</p>
        </div>
      ) : (
        <div className="messages-list">
          {filteredMessages.map((m) => (
            <div key={m.id} className={`message-card ${m.statusM !== 'non_lu' ? 'read' : 'unread'}`}>
              <div className="message-card-header">
                <div className="sender-info">
                  <div className="sender-avatar">
                    {m.client?.prenomCl?.charAt(0) || m.nomM?.charAt(0) || "M"}
                  </div>
                  <div>
                    <div className="sender-name">
                      {m.client?.prenomCl} {m.client?.nomCl} {!m.client && m.nomM && <span>({m.nomM})</span>}
                    </div>
                    <div className="sender-contact">
                      <Mail size={12} />
                      <span>{m.emailM}</span>
                      {m.numTelM && (
                        <>
                          <Phone size={12} />
                          <span>{m.numTelM}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="message-meta">
                  <span className="message-date">{formatDate(m.created_at)}</span>
                  {getStatusBadge(m.statusM)}
                </div>
              </div>

              <div className="message-content">
                <p>{m.contenu}</p>
              </div>

              {m.reply && (
                <div className="message-reply">
                  <div className="reply-badge">
                    <Reply size={14} />
                    Réponse de l'administrateur:
                  </div>
                  <p>{m.reply}</p>
                  <div className="reply-date">Répondu le {formatDate(m.replied_at)}</div>
                </div>
              )}

              <div className="message-card-footer">
                <button
                  onClick={() => {
                    setSelectedMessage(m);
                    setReplyText("");
                    setShowDetailsModal(true);
                    if (m.statusM !== 'lu') {
                      handleUpdateStatus(m.id, 'lu');
                    }
                  }}
                  className="view-btn"
                >
                  <Eye size={16} />
                  Voir détails
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  disabled={deletingId === m.id}
                  className="delete-btn"
                >
                  {deletingId === m.id ? (
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

      {/* Details & Reply Modal */}
      {showDetailsModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails du message</h3>
              <button onClick={() => setShowDetailsModal(false)} className="close-modal">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Expéditeur</h4>
                <div className="detail-row">
                  <span className="detail-label">Nom:</span>
                  <span className="detail-value">{selectedMessage.nomM || `${selectedMessage.client?.prenomCl} ${selectedMessage.client?.nomCl}`}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedMessage.emailM}</span>
                </div>
                {selectedMessage.client && (
                  <div className="detail-row">
                    <span className="detail-label">Client:</span>
                    <Link to={`/admin/users/${selectedMessage.client.id}`} className="detail-link">
                      Voir profil client <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h4>Message</h4>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(selectedMessage.created_at)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Statut:</span>
                  <span className="detail-value">{getStatusBadge(selectedMessage.statusM)}</span>
                </div>
                <div className="message-content-full">
                  <p>{selectedMessage.contenu}</p>
                </div>
              </div>

              <div className="reply-section">
                <h4>Répondre</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Écrire une réponse..."
                  className="reply-textarea"
                  rows={4}
                />
                <button
                  onClick={() => handleReply(selectedMessage.id)}
                  disabled={sendingReply}
                  className="send-reply-btn"
                >
                  {sendingReply ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <Send size={16} />
                  )}
                  Envoyer la réponse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-messages-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
        .messages-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .messages-title { font-size: 24px; font-weight: 600; color: #1f2937; margin: 0 0 4px 0; }
        .messages-subtitle { color: #6b7280; font-size: 14px; margin: 0; }
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
        .messages-list { display: flex; flex-direction: column; gap: 20px; }
        .message-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .message-card.unread { border-left: 4px solid #f59e0b; background: #fffbeb; }
        .message-card.read { border-left: 4px solid #10b981; }
        .message-card-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .sender-info { display: flex; gap: 12px; }
        .sender-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #f97316); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; color: white; }
        .sender-name { font-weight: 600; color: #1f2937; }
        .sender-contact { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9ca3af; margin-top: 4px; }
        .message-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .message-date { font-size: 12px; color: #9ca3af; }
        .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .status-badge.unread { background: #fef3c7; color: #d97706; }
        .status-badge.read { background: #d1fae5; color: #059669; }
        .status-badge.replied { background: #dbeafe; color: #3b82f6; }
        .message-content p { margin: 0; line-height: 1.6; color: #4b5563; }
        .message-reply { margin-top: 16px; padding: 12px; background: #f0fdf4; border-radius: 12px; border-left: 3px solid #10b981; }
        .reply-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #059669; margin-bottom: 8px; }
        .reply-date { font-size: 11px; color: #9ca3af; margin-top: 6px; }
        .message-card-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #f3f4f6; }
        .view-btn, .delete-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .view-btn { background: #f3f4f6; color: #6b7280; }
        .view-btn:hover { background: #3b82f6; color: white; }
        .delete-btn { background: #fee2e2; color: #dc2626; }
        .delete-btn:hover { background: #dc2626; color: white; }
        .empty-state { text-align: center; padding: 48px; background: white; border-radius: 16px; color: #9ca3af; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; width: 90%; max-width: 600px; max-height: 85vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
        .modal-body { padding: 20px; }
        .detail-section { margin-bottom: 24px; }
        .detail-section h4 { font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #1f2937; }
        .detail-row { display: flex; margin-bottom: 10px; }
        .detail-label { width: 100px; font-size: 13px; color: #6b7280; }
        .detail-value { flex: 1; font-size: 13px; color: #1f2937; }
        .detail-link { display: inline-flex; align-items: center; gap: 4px; color: #f59e0b; text-decoration: none; font-size: 13px; }
        .message-content-full { background: #f9fafb; padding: 12px; border-radius: 8px; margin-top: 8px; }
        .message-content-full p { margin: 0; line-height: 1.5; }
        .reply-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .reply-section h4 { font-size: 16px; font-weight: 600; margin: 0 0 12px 0; }
        .reply-textarea { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; font-family: inherit; resize: vertical; margin-bottom: 12px; }
        .reply-textarea:focus { outline: none; border-color: #f59e0b; }
        .send-reply-btn { display: flex; align-items: center; gap: 8px; justify-content: center; width: 100%; padding: 10px; background: #f59e0b; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; transition: background 0.2s; }
        .send-reply-btn:hover { background: #d97706; }
        .send-reply-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .close-modal { background: none; border: none; cursor: pointer; color: #6b7280; }
        .loading-spinner { width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #f59e0b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
        .admin-messages-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; }
        .spinner-small { width: 16px; height: 16px; border: 2px solid #e5e7eb; border-top-color: currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .admin-messages-container { padding: 16px; }
          .message-card-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}