import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MessageCircle,
  Eye,
  Trash2,
  RefreshCw,
  IdCard,
  Globe,
  Home,
  FileText,
  AlertCircle,
  ShoppingBag,
  Heart,
  Star as StarIcon
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [avis, setAvis] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("reservations");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch client details with all relations
      const response = await axiosClient.get(`/admin/clients/${id}`);
      
      if (response.data?.success) {
        const clientData = response.data.data;
        setClient(clientData);
        setReservations(clientData.reservations || []);
        setAvis(clientData.avis || []);
        setMessages(clientData.messages || []);
      } else {
        setError("Client non trouvé");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    
    try {
      setDeletingId(reservationId);
      await axiosClient.delete(`/admin/reservations/${reservationId}`);
      await fetchClientData();
      alert("Réservation supprimée avec succès");
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAvis = async (avisId) => {
    if (!confirm("Supprimer cet avis ?")) return;
    
    try {
      setDeletingId(avisId);
      await axiosClient.delete(`/admin/avis/${avisId}`);
      await fetchClientData();
      alert("Avis supprimé avec succès");
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Supprimer ce message ?")) return;
    
    try {
      setDeletingId(messageId);
      await axiosClient.delete(`/admin/messages/${messageId}`);
      await fetchClientData();
      alert("Message supprimé avec succès");
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' DH';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="badge confirmed"><CheckCircle size={12}/> Confirmée</span>;
      case 'pending':
        return <span className="badge pending"><Clock size={12}/> En attente</span>;
      case 'cancelled':
        return <span className="badge cancelled"><XCircle size={12}/> Annulée</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    return status === 'paid' 
      ? <span className="payment-badge paid">Payé</span>
      : <span className="payment-badge unpaid">Non payé</span>;
  };

  const renderStars = (note) => {
    return (
      <div className="stars">
        {[1,2,3,4,5].map(star => (
          <StarIcon 
            key={star} 
            size={14} 
            className={star <= note ? 'filled' : 'empty'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
        <p className="text-gray-500 text-sm">Chargement des détails du client...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="client-details-error">
        <AlertCircle size={48} />
        <h2>Erreur</h2>
        <p>{error || "Client non trouvé"}</p>
        <button onClick={() => navigate("/admin/users")} className="back-btn">
          Retour aux clients
        </button>
      </div>
    );
  }

  return (
    <div className="client-details-page">
      {/* Header */}
      <div className="client-details-header">
        <button onClick={() => navigate("/admin/users")} className="back-button">
          <ArrowLeft size={18} />
          Retour
        </button>
        <button onClick={fetchClientData} className="refresh-button">
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {client.prenomCl?.charAt(0)}{client.nomCl?.charAt(0)}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{client.prenomCl} {client.nomCl}</h1>
          <p className="profile-role">Client</p>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <ShoppingBag size={18} />
            <span>{reservations.length} réservations</span>
          </div>
          <div className="stat-item">
            <StarIcon size={18} />
            <span>{avis.length} avis</span>
          </div>
          <div className="stat-item">
            <MessageCircle size={18} />
            <span>{messages.length} messages</span>
          </div>
        </div>
      </div>

      {/* Client Info Grid */}
      <div className="info-grid">
        <div className="info-card">
          <h3 className="info-title">
            <User size={18} />
            Informations personnelles
          </h3>
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">Nom complet</span>
              <span className="info-value">{client.prenomCl} {client.nomCl}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{client.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{client.numTelCl || "Non renseigné"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date d'inscription</span>
              <span className="info-value">{formatDate(client.dateInscription)}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-title">
            <IdCard size={18} />
            Documents d'identité
          </h3>
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">Nationalité</span>
              <span className="info-value">{client.natCl || "Non renseignée"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">CIN</span>
              <span className="info-value">{client.cin || "Non renseigné"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Passport</span>
              <span className="info-value">{client.passport || "Non renseigné"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <ShoppingBag size={18} />
            Réservations
            {reservations.length > 0 && <span className="tab-badge">{reservations.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'avis' ? 'active' : ''}`}
            onClick={() => setActiveTab('avis')}
          >
            <StarIcon size={18} />
            Avis
            {avis.length > 0 && <span className="tab-badge">{avis.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageCircle size={18} />
            Messages
            {messages.length > 0 && <span className="tab-badge">{messages.length}</span>}
          </button>
        </div>

        <div className="tab-content">
          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="reservations-tab">
              {reservations.length === 0 ? (
                <div className="empty-state">
                  <ShoppingBag size={48} />
                  <p>Aucune réservation</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Référence</th>
                        <th>Service</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Personnes</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Paiement</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res) => (
                        <tr key={res.id}>
                          <td className="reference">#{res.reference || res.id}</td>
                          <td>{res.service?.nomServ || 'N/A'}</td>
                          <td>
                            <span className="service-type">{res.service?.type}</span>
                          </td>
                          <td>{formatDate(res.created_at)}</td>
                          <td>{res.nbPers}</td>
                          <td className="price">{formatPrice(res.prixTotal)}</td>
                          <td>{getStatusBadge(res.status)}</td>
                          <td>{getPaymentStatusBadge(res.payment_status)}</td>
                          <td>
                            <div className="actions">
                              <Link 
                                to={`/admin/reservations/${res.id}`} 
                                className="action-btn view"
                                title="Voir détails"
                              >
                                <Eye size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteReservation(res.id)}
                                disabled={deletingId === res.id}
                                className="action-btn delete"
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
            </div>
          )}

          {/* Avis Tab */}
          {activeTab === 'avis' && (
            <div className="avis-tab">
              {avis.length === 0 ? (
                <div className="empty-state">
                  <StarIcon size={48} />
                  <p>Aucun avis</p>
                </div>
              ) : (
                <div className="avis-list">
                  {avis.map((a) => (
                    <div key={a.id} className="avis-card">
                      <div className="avis-header">
                        <div className="avis-service">
                          <span className="service-name">{a.service?.nomServ}</span>
                          {renderStars(a.note)}
                        </div>
                        <div className="avis-date">{formatDateTime(a.dateAv || a.created_at)}</div>
                      </div>
                      <div className="avis-content">
                        <p>{a.commentaire}</p>
                      </div>
                      <div className="avis-footer">
                        <Link to={`/admin/voyages/${a.service_id}`} className="view-service">
                          Voir le service
                        </Link>
                        <button
                          onClick={() => handleDeleteAvis(a.id)}
                          disabled={deletingId === a.id}
                          className="delete-avis"
                        >
                          {deletingId === a.id ? (
                            <div className="spinner-small"></div>
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="messages-tab">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <MessageCircle size={48} />
                  <p>Aucun message</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message-card ${msg.statusM === 'lu' ? 'read' : 'unread'}`}>
                      <div className="message-header">
                        <div className="message-info">
                          <span className="message-status">
                            {msg.statusM === 'lu' ? '✓ Lu' : '● Non lu'}
                          </span>
                          <span className="message-date">{formatDateTime(msg.created_at)}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          disabled={deletingId === msg.id}
                          className="delete-message"
                        >
                          {deletingId === msg.id ? (
                            <div className="spinner-small"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                      <div className="message-content">
                        <p>{msg.contenu}</p>
                      </div>
                      <div className="message-footer">
                        <button 
                          className="reply-btn"
                          onClick={() => window.location.href = `mailto:${msg.emailM}`}
                        >
                          <MessageCircle size={14} />
                          Répondre
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .client-details-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }
        .client-details-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .back-button, .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .back-button:hover, .refresh-button:hover {
          background: #f3f4f6;
        }
        .profile-card {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          color: white;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
        }
        .profile-name {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .profile-role {
          opacity: 0.8;
          margin: 0;
        }
        .profile-stats {
          display: flex;
          gap: 24px;
          margin-left: auto;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 14px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .info-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .info-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info-label {
          font-size: 13px;
          color: #6b7280;
        }
        .info-value {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
        }
        .tabs-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .tabs-header {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
          position: relative;
        }
        .tab-btn:hover {
          background: #f3f4f6;
        }
        .tab-btn.active {
          color: #f59e0b;
          background: white;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #f59e0b;
        }
        .tab-badge {
          background: #e5e7eb;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 11px;
        }
        .tab-content {
          padding: 24px;
        }
        .table-container {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th {
          text-align: left;
          padding: 12px 8px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }
        .data-table td {
          padding: 16px 8px;
          font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .data-table tr:hover {
          background: #f9fafb;
        }
        .reference {
          font-family: monospace;
          font-weight: 600;
          color: #f59e0b;
        }
        .price {
          font-weight: 600;
          color: #f59e0b;
        }
        .service-type {
          display: inline-block;
          padding: 4px 8px;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 11px;
          text-transform: capitalize;
        }
        .badge, .payment-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }
        .badge.confirmed { background: #d1fae5; color: #059669; }
        .badge.pending { background: #fef3c7; color: #d97706; }
        .badge.cancelled { background: #fee2e2; color: #dc2626; }
        .payment-badge.paid { background: #d1fae5; color: #059669; }
        .payment-badge.unpaid { background: #fee2e2; color: #dc2626; }
        .actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          padding: 6px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
        }
        .action-btn.view {
          background: #f3f4f6;
          color: #6b7280;
        }
        .action-btn.view:hover {
          background: #3b82f6;
          color: white;
        }
        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }
        .action-btn.delete:hover:not(:disabled) {
          background: #dc2626;
          color: white;
        }
        .avis-list, .messages-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .avis-card, .message-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
        }
        .message-card.unread {
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
        }
        .avis-header, .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .avis-service {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stars {
          display: flex;
          gap: 2px;
        }
        .stars .filled {
          fill: #f59e0b;
          color: #f59e0b;
        }
        .stars .empty {
          color: #d1d5db;
        }
        .avis-date, .message-date {
          font-size: 12px;
          color: #6b7280;
        }
        .avis-content p, .message-content p {
          margin: 0;
          line-height: 1.5;
        }
        .avis-footer, .message-footer {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .view-service, .reply-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-service:hover, .reply-btn:hover {
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }
        .delete-avis, .delete-message {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 12px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .delete-avis:hover, .delete-message:hover {
          background: #fee2e2;
        }
        .empty-state {
          text-align: center;
          padding: 48px;
          color: #9ca3af;
        }
        .client-details-loading, .client-details-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e5e7eb;
          border-top-color: #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #e5e7eb;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .client-details-page { padding: 16px; }
          .profile-card { flex-direction: column; text-align: center; }
          .profile-stats { margin-left: 0; flex-wrap: wrap; justify-content: center; }
          .info-grid { grid-template-columns: 1fr; }
          .tabs-header { flex-direction: column; }
          .tab-btn { justify-content: center; }
          .data-table th:nth-child(4), .data-table td:nth-child(4),
          .data-table th:nth-child(5), .data-table td:nth-child(5) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}