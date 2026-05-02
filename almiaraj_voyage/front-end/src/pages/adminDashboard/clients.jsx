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
  Star as StarIcon,
  ChevronRight,
  Building,
  Plane,
  Hotel,
  Ticket,
  Loader2,
  TrendingUp,
  Award
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [reservations, setReservations] = useState([]);
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

      const response = await axiosClient.get(`/admin/clients`);

      if (response.data?.success) {
        const clientData = response.data.data;
        setClient(clientData);
        setReservations(clientData.reservations || []);
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' DH';
  };

  const getServiceIcon = (type) => {
    if (type?.includes("voyage")) return <Plane size={16} className="service-icon" />;
    if (type?.includes("hotel")) return <Hotel size={16} className="service-icon" />;
    if (type?.includes("billet")) return <Ticket size={16} className="service-icon" />;
    return <Building size={16} className="service-icon" />;
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

  const calculateTotalSpent = () => {
    return reservations.reduce((total, res) => total + (res.prixTotal || 0), 0);
  };

  const getTotalReservations = () => {
    return reservations.length;
  };

  const getCompletedReservations = () => {
    return reservations.filter(r => r.status === 'confirmed').length;
  };

  if (loading) {
    return (
      <div className="client-details-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des informations...</p>
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
        <div className="header-left">
          <button onClick={() => navigate("/admin/users")} className="back-button">
            <ArrowLeft size={18} />
            Retour
          </button>
          <button onClick={fetchClientData} className="refresh-button">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
        <div className="header-title">
          <h1>Détails du client</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {client.prenomCl?.charAt(0)}{client.nomCl?.charAt(0)}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{client.prenomCl} {client.nomCl}</h1>
          <p className="profile-role">Client</p>
          <div className="profile-contact">
            <span><Mail size={14} /> {client.email}</span>
            <span><Phone size={14} /> {client.numTelCl || "Non renseigné"}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <ShoppingBag size={18} />
            <div>
              <span className="stat-value">{getTotalReservations()}</span>
              <span className="stat-label">Réservations</span>
            </div>
          </div>
          <div className="stat-item">
            <CheckCircle size={18} />
            <div>
              <span className="stat-value">{getCompletedReservations()}</span>
              <span className="stat-label">Confirmées</span>
            </div>
          </div>
          <div className="stat-item">
            <TrendingUp size={18} />
            <div>
              <span className="stat-value">{formatPrice(calculateTotalSpent())}</span>
              <span className="stat-label">Dépensé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
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

      {/* Reservations Section */}
      <div className="reservations-section">
        <div className="section-header">
          <h3 className="section-title">
            <ShoppingBag size={20} />
            Réservations
            {reservations.length > 0 && <span className="section-badge">{reservations.length}</span>}
          </h3>
        </div>

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
                    <td>
                      <div className="service-cell">
                        {getServiceIcon(res.service?.type)}
                        <span>{res.service?.nomServ || 'N/A'}</span>
                      </div>
                    </td>
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

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/contact" className="quick-action-btn">
          <MessageCircle size={18} />
          Contacter le client
        </Link>
        <Link to="/admin/reservations" className="quick-action-btn">
          <Eye size={18} />
          Voir toutes les réservations
        </Link>
      </div>

      <style jsx>{`
        .client-details-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
          background: #f9fafb;
          min-height: 100vh;
        }
        .client-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .header-left {
          display: flex;
          gap: 12px;
        }
        .header-title h1 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
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
          font-weight: 500;
        }
        .back-button:hover, .refresh-button:hover {
          background: #f3f4f6;
        }
        .profile-card {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          border-radius: 24px;
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
          font-weight: 700;
        }
        .profile-info {
          flex: 1;
        }
        .profile-name {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        .profile-role {
          opacity: 0.9;
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        .profile-contact {
          display: flex;
          gap: 16px;
          font-size: 13px;
          opacity: 0.85;
        }
        .profile-contact span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .profile-stats {
          display: flex;
          gap: 24px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .stat-item .stat-value {
          font-size: 20px;
          font-weight: 700;
          display: block;
          line-height: 1.2;
        }
        .stat-item .stat-label {
          font-size: 11px;
          opacity: 0.8;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .info-card {
          background: white;
          border-radius: 20px;
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
          color: #1f2937;
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
        .reservations-section {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }
        .section-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: #fafbfc;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #1f2937;
        }
        .section-badge {
          background: #f59e0b;
          color: white;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 20px;
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
          padding: 14px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .data-table td {
          padding: 16px 12px;
          font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .data-table tr:hover {
          background: #fef3c7;
        }
        .reference {
          font-family: monospace;
          font-weight: 600;
          color: #f59e0b;
        }
        .service-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .service-icon {
          color: #f59e0b;
        }
        .price {
          font-weight: 600;
          color: #f59e0b;
        }
        .service-type {
          display: inline-block;
          padding: 4px 10px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 11px;
          text-transform: capitalize;
          font-weight: 500;
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
          border-radius: 8px;
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
        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #e5e7eb;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .empty-state {
          text-align: center;
          padding: 48px;
          color: #9ca3af;
        }
        .quick-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
        }
        .quick-action-btn:hover {
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
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
        .back-btn {
          margin-top: 20px;
          padding: 10px 24px;
          background: #f59e0b;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .client-details-page {
            padding: 16px;
          }
          .profile-card {
            flex-direction: column;
            text-align: center;
          }
          .profile-contact {
            justify-content: center;
          }
          .profile-stats {
            width: 100%;
            justify-content: center;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .data-table th:nth-child(4), .data-table td:nth-child(4),
          .data-table th:nth-child(5), .data-table td:nth-child(5) {
            display: none;
          }
          .quick-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
