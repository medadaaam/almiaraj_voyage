import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Plane,
  Hotel,
  Ticket,
  User,
  Mail,
  Phone,
  FileText,
  Receipt,
  UserCheck,
  IdCard,
  Phone as PhoneIcon,
  MapPin,
  Edit,
  Trash2,
  MessageCircle,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Building
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReservationDetails();
  }, [id]);

  const fetchReservationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/admin/reservations/${id}`);
      if (response.data?.success) {
        setReservation(response.data.data);
      } else {
        setError(response.data?.message || "Réservation non trouvée");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Changer le statut de la réservation en "${newStatus}" ?`)) return;
    setUpdating(true);
    try {
      const response = await axiosClient.put(`/admin/reservations/${id}/status`, {
        status: newStatus
      });
      if (response.data?.success) {
        await fetchReservationDetails();
        alert("Statut mis à jour avec succès!");
      } else {
        alert(response.data?.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.")) return;
    setUpdating(true);
    try {
      const response = await axiosClient.delete(`/admin/reservations/${id}`);
      if (response.data?.success) {
        alert("Réservation supprimée avec succès!");
        navigate("/admin/reservations");
      } else {
        alert(response.data?.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock size={20} />,
          label: "En attente",
          class: "pending",
          description: "Cette réservation est en attente de confirmation",
          color: "#f59e0b",
          bgLight: "#fef3c7",
          actions: ["confirmed", "cancelled"]
        };
      case "confirmed":
        return {
          icon: <CheckCircle size={20} />,
          label: "Confirmée",
          class: "confirmed",
          description: "Cette réservation a été confirmée",
          color: "#10b981",
          bgLight: "#d1fae5",
          actions: ["cancelled"]
        };
      case "cancelled":
        return {
          icon: <XCircle size={20} />,
          label: "Annulée",
          class: "cancelled",
          description: "Cette réservation a été annulée",
          color: "#ef4444",
          bgLight: "#fee2e2",
          actions: []
        };
      default:
        return {
          icon: <AlertCircle size={20} />,
          label: status || "Inconnu",
          class: "",
          description: "",
          color: "#6b7280",
          bgLight: "#f3f4f6",
          actions: []
        };
    }
  };

  const getServiceIcon = (type) => {
    if (type?.includes("voyage")) return <Plane size={24} />;
    if (type?.includes("hotel")) return <Hotel size={24} />;
    if (type?.includes("billet")) return <Ticket size={24} />;
    return <Building size={24} />;
  };

  const getServiceTypeLabel = (type) => {
    if (type?.includes("voyage")) return "Voyage";
    if (type?.includes("hotel")) return "Hôtel";
    if (type?.includes("billet")) return "Billet";
    if (type?.includes("omra")) return "Omra";
    if (type?.includes("hajj")) return "Hajj";
    return "Service";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
        <p className="text-gray-500 text-sm">Chargement des détails de la réservation...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="admin-res-details-error">
        <div className="error-icon">📋</div>
        <h2>Erreur</h2>
        <p>{error || "Réservation non trouvée"}</p>
        <button onClick={() => navigate("/admin/reservations")} className="error-btn">
          Retour aux réservations
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);
  const service = reservation.service;
  const client = reservation.client;
  const passagers = reservation.passagers || [];

  return (
    <div className="admin-res-details-page">
      {/* Header */}
      <div className="admin-res-details-header">
        <div className="header-left">
          <button onClick={() => navigate("/admin/reservations")} className="admin-res-back-btn">
            <ArrowLeft size={18} />
            Retour
          </button>
          <button onClick={fetchReservationDetails} className="admin-res-refresh-btn">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
        <div className="admin-res-header-info">
          <h1 className="admin-res-header-title">Détails de la réservation</h1>
          <div className={`admin-res-status-badge ${statusConfig.class}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>
      </div>

      <div className="admin-res-details-grid">
        {/* Service Info Card */}
        <div className="admin-res-card service-card">
          <div className="admin-res-card-header">
            <div className="service-icon-wrapper" style={{ backgroundColor: `${statusConfig.color}15` }}>
              <div className="service-icon" style={{ color: statusConfig.color }}>
                {getServiceIcon(service?.type)}
              </div>
            </div>
            <div className="service-info">
              <h3 className="service-title">{service?.nomServ}</h3>
              <span className="service-badge" style={{ backgroundColor: statusConfig.bgLight, color: statusConfig.color }}>
                {getServiceTypeLabel(service?.type)}
              </span>
            </div>
          </div>

          <div className="admin-res-card-body">
            <div className="admin-res-info-row">
              <div className="admin-res-info-icon">
                <Receipt size={18} />
              </div>
              <div>
                <span className="admin-res-info-label">Référence</span>
                <p className="admin-res-info-value">#{reservation.reference || reservation.id}</p>
              </div>
            </div>
            <div className="admin-res-info-row">
              <div className="admin-res-info-icon">
                <Calendar size={18} />
              </div>
              <div>
                <span className="admin-res-info-label">Date de réservation</span>
                <p className="admin-res-info-value">{formatDateTime(reservation.created_at)}</p>
              </div>
            </div>
            <div className="admin-res-info-row">
              <div className="admin-res-info-icon">
                <Users size={18} />
              </div>
              <div>
                <span className="admin-res-info-label">Nombre de personnes</span>
                <p className="admin-res-info-value">{reservation.nbPers || (passagers.length + 1) || 1} personne(s)</p>
              </div>
            </div>
            <div className="admin-res-info-row">
              <div className="admin-res-info-icon">
                <DollarSign size={18} />
              </div>
              <div>
                <span className="admin-res-info-label">Prix unitaire</span>
                <p className="admin-res-info-value">{reservation.prixUnitaire} DH / pers</p>
              </div>
            </div>
            <div className="admin-res-info-row">
              <div className="admin-res-info-icon">
                <CreditCard size={18} />
              </div>
              <div>
                <span className="admin-res-info-label">Prix total</span>
                <p className="admin-res-info-value price">{reservation.prixTotal} DH</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info Card */}
        <div className="admin-res-card client-card">
          <div className="admin-res-card-header">
            <User size={20} />
            <h3 className="admin-res-card-title">Client</h3>
            {client && <ChevronRight size={16} className="click-icon" />}
          </div>
          <div className="admin-res-card-body">
            {client ? (
              <div className="client-info">
                <div className="client-avatar" style={{ backgroundColor: statusConfig.bgLight, color: statusConfig.color }}>
                  {client.prenomCl?.charAt(0) || "C"}
                  {client.nomCl?.charAt(0) || "L"}
                </div>
                <div className="client-details">
                  <p className="client-name">
                    {client.prenomCl} {client.nomCl}
                  </p>
                  <div className="client-contact">
                    <Mail size={14} />
                    <span>{client.email}</span>
                  </div>
                  <div className="client-contact">
                    <PhoneIcon size={14} />
                    <span>{client.numTelCl || "Non renseigné"}</span>
                  </div>
                  {client.cin && (
                    <div className="client-contact">
                      <IdCard size={14} />
                      <span>CIN: {client.cin}</span>
                    </div>
                  )}
                  {client.passport && (
                    <div className="client-contact">
                      <IdCard size={14} />
                      <span>Passport: {client.passport}</span>
                    </div>
                  )}
                  {client.natCl && (
                    <div className="client-contact">
                      <MapPin size={14} />
                      <span>Nationalité: {client.natCl}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-client">
                <User size={32} className="no-client-icon" />
                <p>Information du client non disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Passagers Card */}
        <div className="admin-res-card passagers-card">
          <div className="admin-res-card-header">
            <UserCheck size={20} />
            <h3 className="admin-res-card-title">
              Passagers
              {passagers.length > 0 && <span className="passagers-count">{passagers.length}</span>}
            </h3>
          </div>
          <div className="admin-res-card-body">
            {passagers && passagers.length > 0 ? (
              <div className="passagers-list">
                {passagers.map((passager, index) => (
                  <div key={index} className="passager-item">
                    <div className="passager-avatar" style={{ backgroundColor: statusConfig.bgLight, color: statusConfig.color }}>
                      {passager.prenomPas?.charAt(0) || passager.prenom?.charAt(0) || "P"}
                      {passager.nomPas?.charAt(0) || passager.nom?.charAt(0) || "A"}
                    </div>
                    <div className="passager-details">
                      <p className="passager-name">
                        {passager.prenomPas || passager.prenom} {passager.nomPas || passager.nom}
                      </p>
                      <div className="passager-meta">
                        {passager.type_passager && (
                          <span className="passager-type" style={{ backgroundColor: statusConfig.bgLight, color: statusConfig.color }}>
                            {passager.type_passager === "adulte" ? "👤 Adulte" :
                              passager.type_passager === "enfant" ? "🧒 Enfant" : "🍼 Nourrisson"}
                          </span>
                        )}
                        {passager.cinPas && (
                          <span className="passager-cin">
                            <IdCard size={12} />
                            CIN: {passager.cinPas}
                          </span>
                        )}
                        {passager.passportPas && (
                          <span className="passager-passport">
                            <IdCard size={12} />
                            Passeport: {passager.passportPas}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-passagers">
                <Users size={32} className="no-passagers-icon" />
                <p>Aucun passager supplémentaire</p>
                <span>Seul le client principal est enregistré</span>
              </div>
            )}
          </div>
        </div>

        {/* Dates Card */}
        {(reservation.check_in || reservation.check_out || reservation.date_depart || reservation.date_retour) && (
          <div className="admin-res-card dates-card">
            <div className="admin-res-card-header">
              <Calendar size={20} />
              <h3 className="admin-res-card-title">Dates</h3>
            </div>
            <div className="admin-res-card-body">
              {reservation.check_in && reservation.check_out && (
                <div className="date-range">
                  <div className="date-item" style={{ backgroundColor: statusConfig.bgLight }}>
                    <span className="date-label">Arrivée</span>
                    <span className="date-value">{formatDate(reservation.check_in)}</span>
                  </div>
                  <div className="date-arrow">→</div>
                  <div className="date-item" style={{ backgroundColor: statusConfig.bgLight }}>
                    <span className="date-label">Départ</span>
                    <span className="date-value">{formatDate(reservation.check_out)}</span>
                  </div>
                </div>
              )}
              {reservation.date_depart && reservation.date_retour && (
                <div className="date-range">
                  <div className="date-item" style={{ backgroundColor: statusConfig.bgLight }}>
                    <span className="date-label">Départ</span>
                    <span className="date-value">{formatDate(reservation.date_depart)}</span>
                  </div>
                  <div className="date-arrow">→</div>
                  <div className="date-item" style={{ backgroundColor: statusConfig.bgLight }}>
                    <span className="date-label">Retour</span>
                    <span className="date-value">{formatDate(reservation.date_retour)}</span>
                  </div>
                </div>
              )}
              {reservation.type_chambre && (
                <div className="chambre-info" style={{ color: statusConfig.color }}>
                  <Hotel size={14} />
                  <span>Type de chambre: {reservation.type_chambre}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status & Payment Card */}
        <div className="admin-res-card status-card">
          <div className="admin-res-card-header">
            <AlertCircle size={20} />
            <h3 className="admin-res-card-title">État de la réservation</h3>
          </div>
          <div className="admin-res-card-body">
            <div className={`status-message ${statusConfig.class}`} style={{ backgroundColor: statusConfig.bgLight, color: statusConfig.color }}>
              {statusConfig.icon}
              <p>{statusConfig.description}</p>
            </div>
            <div className="payment-status">
              <span className="payment-label">Paiement</span>
              <span className={`payment-badge ${reservation.payment_status === 'paid' ? 'paid' : 'pending'}`}>
                {reservation.payment_status === 'paid' ? 'Payé ✓' : 'En attente ⏳'}
              </span>
            </div>
            {reservation.voucher_generated && (
              <div className="voucher-info">
                <CheckCircle size={14} />
                <span>Voucher généré</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="admin-res-actions">
        <div className="status-buttons">
          {statusConfig.actions.includes("confirmed") && (
            <button
              onClick={() => handleStatusUpdate("confirmed")}
              disabled={updating}
              className="admin-res-btn-confirm"
            >
              <CheckCircle size={18} />
              Confirmer
            </button>
          )}
          {statusConfig.actions.includes("cancelled") && (
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={updating}
              className="admin-res-btn-cancel"
            >
              <XCircle size={18} />
              Annuler
            </button>
          )}
        </div>
        <div className="action-buttons">
          <Link to="/contact" className="admin-res-btn-support">
            <MessageCircle size={18} />
            Contacter le support
          </Link>
          <button
            onClick={handleDelete}
            disabled={updating}
            className="admin-res-btn-delete"
          >
            <Trash2 size={18} />
            Supprimer la réservation
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-res-details-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          background: #f9fafb;
          min-height: 100vh;
        }
        .admin-res-details-header {
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
        .admin-res-back-btn, .admin-res-refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s;
          font-weight: 500;
        }
        .admin-res-back-btn:hover, .admin-res-refresh-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        .admin-res-header-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .admin-res-header-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .admin-res-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
        }
        .admin-res-status-badge.pending {
          background: #fef3c7;
          color: #d97706;
        }
        .admin-res-status-badge.confirmed {
          background: #d1fae5;
          color: #059669;
        }
        .admin-res-status-badge.cancelled {
          background: #fee2e2;
          color: #dc2626;
        }
        .admin-res-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .admin-res-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .admin-res-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .admin-res-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #fafbfc;
          border-bottom: 1px solid #eff3f6;
        }
        .admin-res-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .passagers-count {
          background: #f59e0b;
          color: white;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .click-icon {
          margin-left: auto;
          color: #9ca3af;
          transition: all 0.2s;
        }
        .admin-res-card-body {
          padding: 20px;
        }
        .admin-res-info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .admin-res-info-row:last-child {
          border-bottom: none;
        }
        .admin-res-info-icon {
          width: 28px;
          color: #f59e0b;
        }
        .admin-res-info-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-res-info-value {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin-top: 4px;
        }
        .admin-res-info-value.price {
          color: #f59e0b;
          font-size: 20px;
          font-weight: 700;
        }
        .service-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .service-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }
        .service-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .client-info {
          display: flex;
          gap: 16px;
        }
        .client-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
        }
        .client-details {
          flex: 1;
        }
        .client-name {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }
        .client-contact {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .passagers-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .passager-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 14px;
          transition: all 0.2s;
        }
        .passager-item:hover {
          background: #f3f4f6;
        }
        .passager-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
        }
        .passager-details {
          flex: 1;
        }
        .passager-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 6px 0;
        }
        .passager-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
        }
        .passager-type {
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }
        .date-range {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .date-item {
          flex: 1;
          text-align: center;
          padding: 14px;
          border-radius: 12px;
        }
        .date-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          display: block;
          margin-bottom: 6px;
        }
        .date-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          display: block;
        }
        .date-arrow {
          color: #f59e0b;
          font-size: 20px;
          font-weight: 600;
        }
        .status-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .status-message p {
          margin: 0;
          font-weight: 500;
        }
        .payment-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }
        .payment-label {
          font-weight: 500;
          color: #6b7280;
        }
        .payment-badge {
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .payment-badge.paid {
          background: #d1fae5;
          color: #059669;
        }
        .payment-badge.pending {
          background: #fef3c7;
          color: #d97706;
        }
        .admin-res-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .status-buttons, .action-buttons {
          display: flex;
          gap: 12px;
        }
        .admin-res-btn-confirm, .admin-res-btn-cancel, .admin-res-btn-delete, .admin-res-btn-support {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }
        .admin-res-btn-confirm {
          background: #10b981;
          color: white;
        }
        .admin-res-btn-confirm:hover {
          background: #059669;
          transform: translateY(-1px);
        }
        .admin-res-btn-cancel {
          background: #f59e0b;
          color: white;
        }
        .admin-res-btn-cancel:hover {
          background: #d97706;
          transform: translateY(-1px);
        }
        .admin-res-btn-delete {
          background: #ef4444;
          color: white;
        }
        .admin-res-btn-delete:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }
        .admin-res-btn-support {
          background: #8b5cf6;
          color: white;
        }
        .admin-res-btn-support:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }
        .admin-res-btn-confirm:disabled, .admin-res-btn-cancel:disabled, .admin-res-btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .chambre-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          font-weight: 500;
        }
        .voucher-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
          color: #059669;
          font-weight: 500;
        }
        .no-client, .no-passagers {
          text-align: center;
          padding: 32px;
          color: #9ca3af;
        }
        .admin-res-details-loading, .admin-res-details-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        .admin-res-details-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #f3f4f6;
          border-top-color: #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .error-btn {
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
          .admin-res-details-page {
            padding: 16px;
          }
          .admin-res-details-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .admin-res-details-grid {
            grid-template-columns: 1fr;
          }
          .admin-res-actions {
            flex-direction: column;
          }
          .status-buttons, .action-buttons {
            width: 100%;
          }
          .status-buttons button, .action-buttons a, .action-buttons button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}