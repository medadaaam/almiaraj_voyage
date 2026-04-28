import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  MapPin,
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
  MessageCircle,
  Receipt,
  UserCheck,
  IdCard,
  Phone as PhoneIcon
} from "lucide-react";
import "./reservationDetails.css";

export default function ReservationDetails() {
  const { id } = useParams();
  const { getReservationDetails, cancelReservation } = useAuth();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchReservationDetails();
  }, [id]);

  const fetchReservationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReservationDetails(id);
      console.log("Reservation details response:", response);
      if (response?.success) {
        setReservation(response.reservation);
        console.log("Passagers:", response.reservation?.passagers);
      } else {
        setError(response?.message || "Réservation non trouvée");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;
    setCancelling(true);
    try {
      const response = await cancelReservation(id);
      if (response?.success) {
        await fetchReservationDetails();
      }
    } catch (err) {
      console.error("Error cancelling:", err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock size={20} />,
          label: "En attente",
          class: "pending",
          description: "Votre réservation est en cours de traitement",
          color: "#f59e0b"
        };
      case "confirmed":
        return {
          icon: <CheckCircle size={20} />,
          label: "Confirmée",
          class: "confirmed",
          description: "Votre réservation a été confirmée",
          color: "#10b981"
        };
      case "cancelled":
        return {
          icon: <XCircle size={20} />,
          label: "Annulée",
          class: "cancelled",
          description: "Cette réservation a été annulée",
          color: "#ef4444"
        };
      default:
        return {
          icon: <AlertCircle size={20} />,
          label: status,
          class: "",
          description: "",
          color: "#6b7280"
        };
    }
  };

  const getServiceIcon = (type) => {
    if (type?.includes("voyage") || type?.includes("vol")) return <Plane size={24} />;
    if (type?.includes("hotel") || type?.includes("hébergement")) return <Hotel size={24} />;
    return <Ticket size={24} />;
  };

  const getServiceTypeLabel = (type) => {
    if (type?.includes("voyage")) return "Voyage";
    if (type?.includes("vol")) return "Vol";
    if (type?.includes("hotel")) return "Hôtel";
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

  if (loading) {
    return (
      <div className="res-details-loading">
        <div className="res-details-spinner"></div>
        <p>Chargement des détails...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="res-details-error">
        <div className="error-icon">📋</div>
        <h2>Erreur</h2>
        <p>{error || "Réservation non trouvée"}</p>
        <Link to="/dashboard" className="error-btn">
          Retour au dashboard
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);
  const service = reservation.service;

  // Récupérer les passagers depuis différentes sources possibles
  const passagers = reservation.passagers || reservation.passager || reservation.passenger || [];

  // Client principal (réservant)
  const clientPrincipal = reservation.client_principal || reservation.client || {};

  console.log("Passagers data:", passagers);
  console.log("Client principal:", clientPrincipal);

  return (
    <div className="res-details-page">
      {/* Header */}
      <div className="res-details-header">
        <button onClick={() => navigate(-1)} className="res-back-btn">
          <ArrowLeft size={18} />
          Retour
        </button>
        <div className="res-header-info">
          <h1 className="res-header-title">Détails de la réservation</h1>
          <div className={`res-status-badge ${statusConfig.class}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>
      </div>

      <div className="res-details-grid">
        {/* Service Info Card */}
        <div className="res-card service-card">
          <div className="res-card-header">
            <div className="service-icon-wrapper" style={{ backgroundColor: `${statusConfig.color}15` }}>
              <div className="service-icon" style={{ color: statusConfig.color }}>
                {getServiceIcon(service?.type)}
              </div>
            </div>
            <div className="service-info">
              <h3 className="service-title">{service?.nomServ}</h3>
              <span className="service-badge">{getServiceTypeLabel(service?.type)}</span>
            </div>
          </div>

          <div className="res-card-body">
            <div className="res-info-row">
              <div className="res-info-icon">
                <Receipt size={18} />
              </div>
              <div>
                <span className="res-info-label">Référence</span>
                <p className="res-info-value">#{reservation.reference || reservation.id}</p>
              </div>
            </div>
            <div className="res-info-row">
              <div className="res-info-icon">
                <Calendar size={18} />
              </div>
              <div>
                <span className="res-info-label">Date de réservation</span>
                <p className="res-info-value">{formatDate(reservation.created_at)}</p>
              </div>
            </div>
            <div className="res-info-row">
              <div className="res-info-icon">
                <Users size={18} />
              </div>
              <div>
                <span className="res-info-label">Nombre de personnes</span>
                <p className="res-info-value">{reservation.nbPers || (passagers.length + 1) || 1} personne(s)</p>
              </div>
            </div>
            <div className="res-info-row">
              <div className="res-info-icon">
                <CreditCard size={18} />
              </div>
              <div>
                <span className="res-info-label">Prix total</span>
                <p className="res-info-value price">{reservation.prixTotal} DH</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Principal Card */}
        <div className="res-card client-card">
          <div className="res-card-header">
            <User size={20} />
            <h3 className="res-card-title">Client principal</h3>
          </div>
          <div className="res-card-body">
            {clientPrincipal && Object.keys(clientPrincipal).length > 0 ? (
              <div className="client-info">
                <div className="client-avatar">
                  {clientPrincipal.prenomCl?.charAt(0) || clientPrincipal.prenom?.charAt(0) || "C"}
                  {clientPrincipal.nomCl?.charAt(0) || clientPrincipal.nom?.charAt(0) || "L"}
                </div>
                <div className="client-details">
                  <p className="client-name">
                    {clientPrincipal.prenomCl || clientPrincipal.prenom} {clientPrincipal.nomCl || clientPrincipal.nom}
                  </p>
                  <div className="client-contact">
                    <Mail size={14} />
                    <span>{clientPrincipal.email || clientPrincipal.emailCl}</span>
                  </div>
                  <div className="client-contact">
                    <PhoneIcon size={14} />
                    <span>{clientPrincipal.numTelCl || clientPrincipal.telephone}</span>
                  </div>
                  {clientPrincipal.cin && (
                    <div className="client-contact">
                      <IdCard size={14} />
                      <span>CIN: {clientPrincipal.cin}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-client">
                <User size={32} className="no-client-icon" />
                <p>Information du client principal non disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Passagers Card */}
        <div className="res-card passagers-card">
          <div className="res-card-header">
            <UserCheck size={20} />
            <h3 className="res-card-title">
              Passagers supplémentaires
              {passagers.length > 0 && <span className="passagers-count">{passagers.length}</span>}
            </h3>
          </div>
          <div className="res-card-body">
            {passagers && Array.isArray(passagers) && passagers.length > 0 ? (
              <div className="passagers-list">
                {passagers.map((passager, index) => (
                  <div key={index} className="passager-item">
                    <div className="passager-avatar">
                      {passager.prenom?.charAt(0) || passager.prenomCl?.charAt(0) || "P"}
                      {passager.nom?.charAt(0) || passager.nomCl?.charAt(0) || "A"}
                    </div>
                    <div className="passager-details">
                      <p className="passager-name">{passager.prenomPas || passager.prenom} {passager.nomPas || passager.nom}</p>
                      <div className="passager-meta">
                        {passager.type_passager && (
                          <span className="passager-type">
                            {passager.type_passager === "adulte" ? "👤 Adulte" :
                             passager.type_passager === "enfant" ? "🧒 Enfant" : "🍼 Nourrisson"}
                          </span>
                        )}
                        {passager.cin && (
                          <span className="passager-cin">
                            <IdCard size={12} />
                            CIN: {passager.cin}
                          </span>
                        )}
                        {passager.passport && (
                          <span className="passager-passport">
                            <IdCard size={12} />
                            Passeport: {passager.passport}
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
        {(reservation.dateDebut || reservation.dateFin || reservation.check_in || reservation.check_out) && (
          <div className="res-card dates-card">
            <div className="res-card-header">
              <Calendar size={20} />
              <h3 className="res-card-title">Dates du séjour</h3>
            </div>
            <div className="res-card-body">
              {reservation.dateDebut && reservation.dateFin && (
                <div className="date-range">
                  <div className="date-item">
                    <span className="date-label">Départ</span>
                    <span className="date-value">{formatDate(reservation.dateDebut)}</span>
                  </div>
                  <div className="date-arrow">→</div>
                  <div className="date-item">
                    <span className="date-label">Retour</span>
                    <span className="date-value">{formatDate(reservation.dateFin)}</span>
                  </div>
                </div>
              )}
              {reservation.check_in && reservation.check_out && (
                <div className="date-range">
                  <div className="date-item">
                    <span className="date-label">Arrivée</span>
                    <span className="date-value">{formatDate(reservation.check_in)}</span>
                  </div>
                  <div className="date-arrow">→</div>
                  <div className="date-item">
                    <span className="date-label">Départ</span>
                    <span className="date-value">{formatDate(reservation.check_out)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Info Card */}
        <div className="res-card status-card">
          <div className="res-card-header">
            <AlertCircle size={20} />
            <h3 className="res-card-title">État de la réservation</h3>
          </div>
          <div className="res-card-body">
            <div className={`status-message ${statusConfig.class}`}>
              {statusConfig.icon}
              <p>{statusConfig.description}</p>
            </div>
            <div className="payment-status">
              <span className="payment-label">Paiement</span>
              <span className={`payment-badge ${reservation.payment_status === 'paid' ? 'paid' : 'pending'}`}>
                {reservation.payment_status === 'paid' ? 'Payé ✓' : 'En attente ⏳'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Card */}
        {reservation.notes && (
          <div className="res-card notes-card">
            <div className="res-card-header">
              <FileText size={20} />
              <h3 className="res-card-title">Notes supplémentaires</h3>
            </div>
            <div className="res-card-body">
              <p className="notes-text">{reservation.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="res-actions">
        {reservation.status === "pending" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="res-btn-cancel"
          >
            {cancelling ? <Loader2 size={18} className="spinner" /> : <XCircle size={18} />}
            {cancelling ? "Annulation..." : "Annuler la réservation"}
          </button>
        )}
        <Link to="/contact" className="res-btn-support">
          <MessageCircle size={18} />
          Contacter le support
        </Link>
      </div>
    </div>
  );
}
