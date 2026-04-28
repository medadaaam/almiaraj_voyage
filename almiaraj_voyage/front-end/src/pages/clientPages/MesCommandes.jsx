// src/pages/ClientOrders.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar, MapPin, Users, CreditCard, Eye, XCircle, CheckCircle,
  Clock, Loader2, Plane, Hotel, Ticket, Phone, Mail, AlertCircle,
  ChevronRight, Download, Receipt, CalendarDays, User, Star, Info,
  MessageCircle, Send
} from "lucide-react";
import "./clientOrders.css";

export default function ClientOrders() {
    const { getMyReservations, cancelReservation, contactAgence } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);
    const [contactModal, setContactModal] = useState(null);
    const [contactMessage, setContactMessage] = useState("");
    const location = useLocation();
    const [toast, setToast] = useState(location.state || null);

    // Auto-hide toast after 5 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        setLoading(true);
        const data = await getMyReservations();
        if (data?.success) {
            setReservations(data.reservations);
        }
        setLoading(false);
    };

    const handleCancel = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;
        setCancelling(id);
        try {
            await cancelReservation(id);
            await loadReservations();
            setToast({ message: "❌ Réservation annulée avec succès", type: "error" });
            setTimeout(() => setToast(null), 5000);
        } catch (error) {
            alert("Erreur lors de l'annulation");
        } finally {
            setCancelling(null);
        }
    };

    // const handleContactAgence = async (reservationId) => {
    //     if (!contactMessage.trim()) {
    //         alert("Veuillez écrire un message");
    //         return;
    //     }
    //     try {
    //         await contactAgence(reservationId, contactMessage);
    //         alert("✅ Message envoyé ! L'agence vous répondra dans les plus brefs délais.");
    //         setContactModal(null);
    //         setContactMessage("");
    //     } catch (error) {
    //         alert("Erreur lors de l'envoi du message");
    //     }
    // };

    const getStatusConfig = (status) => {
        switch(status) {
            case 'pending':
                return {
                    icon: <Clock size={14} />,
                    label: 'En attente',
                    class: 'pending',
                    description: 'Votre demande est en cours de traitement',
                    color: '#d97706'
                };
            case 'confirmed':
                return {
                    icon: <CheckCircle size={14} />,
                    label: 'Confirmée',
                    class: 'confirmed',
                    description: 'Votre réservation est confirmée',
                    color: '#16a34a'
                };
            case 'cancelled':
                return {
                    icon: <XCircle size={14} />,
                    label: 'Annulée',
                    class: 'cancelled',
                    description: 'Cette réservation a été annulée',
                    color: '#dc2626'
                };
            default:
                return { icon: null, label: status, class: '', description: '', color: '#64748b' };
        }
    };

    const getServiceIcon = (type) => {
        if (type?.includes('voyage')) return <Plane size={18} className="service-icon voyage" />;
        if (type?.includes('hotel')) return <Hotel size={18} className="service-icon hotel" />;
        return <Ticket size={18} className="service-icon vol" />;
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="orders-loading-spinner"></div>
                <p>Chargement de vos réservations...</p>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Toast Notification */}
            {toast && (
                <div className={`orders-toast ${toast.type}`}>
                    <div className="orders-toast-content">
                        {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="orders-container">
                <div className="orders-header">
                    <h1 className="orders-title">Mes Réservations</h1>
                    <p className="orders-subtitle">Suivez l'état de vos voyages et séjours</p>
                </div>

                {reservations.length === 0 ? (
                    <div className="orders-empty">
                        <div className="orders-empty-icon">📭</div>
                        <h2>Aucune réservation</h2>
                        <p>Vous n'avez pas encore effectué de réservation.</p>
                        <Link to="/services" className="orders-empty-btn">
                            Découvrir nos voyages
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {reservations.map((res) => {
                            const statusConfig = getStatusConfig(res.status);
                            return (
                                <div key={res.id} className="order-card">
                                    <div className="order-card-header">
                                        <div className="order-card-type">
                                            {getServiceIcon(res.service?.type)}
                                            <span className="order-card-reference">#{res.reference || res.id}</span>
                                        </div>
                                        <div className="order-card-status">
                                            <span className={`status-badge ${statusConfig.class}`}>
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </span>
                                            <span className="order-card-date">
                                                <Calendar size={12} />
                                                {new Date(res.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-card-body">
                                        <h3 className="order-card-title">{res.service?.nomServ}</h3>

                                        {res.date_depart && (
                                            <div className="order-card-info">
                                                <CalendarDays size={16} />
                                                <span>
                                                    Du {new Date(res.date_depart).toLocaleDateString('fr-FR')}
                                                    au {new Date(res.date_retour).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        )}

                                        <div className="order-card-info">
                                            <Users size={16} />
                                            <span>{res.nbPers} personne(s)</span>
                                        </div>

                                        {res.destination && (
                                            <div className="order-card-info">
                                                <MapPin size={16} />
                                                <span>{res.destination}</span>
                                            </div>
                                        )}

                                        {/* ✅ Message explicatif selon le statut */}
                                        <div className={`order-card-status-message ${statusConfig.class}`}>
                                            <Info size={14} />
                                            <span>{statusConfig.description}</span>
                                            {res.status === 'pending' && (
                                                <span className="status-action">
                                                    Notre équipe étudie votre demande et vous contactera dans les plus brefs délais.
                                                </span>
                                            )}
                                            {res.status === 'confirmed' && (
                                                <span className="status-action">
                                                    Votre réservation est confirmée ! Un email de confirmation vous a été envoyé.
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="order-card-footer">
                                        <div className="order-card-price">
                                            <span className="price-label">Total</span>
                                            <span className="price-value">{res.prixTotal} DH</span>
                                        </div>
                                        <div className="order-card-actions">
                                            <Link to={`/client/reservations/${res.id}`} className="order-btn details">
                                                <Eye size={16} />
                                                Détails
                                            </Link>

                                            {/* ✅ Bouton contacter l'agence (pour les réservations en attente) */}
                                            {res.status === 'pending' && (
                                                <a
                                                    href="/contact"
                                                    className="order-btn contact"
                                                >
                                                    <MessageCircle size={16} />
                                                    Contacter
                                                </a>
                                            )}

                                            {res.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(res.id)}
                                                    disabled={cancelling === res.id}
                                                    className="order-btn cancel"
                                                >
                                                    {cancelling === res.id ? <Loader2 size={14} className="spinner" /> : <XCircle size={14} />}
                                                    Annuler
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ✅ Modal pour contacter l'agence */}
            {contactModal && (
                <div className="orders-modal-overlay" onClick={() => setContactModal(null)}>
                    <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="orders-modal-header">
                            <h3>Contacter l'agence</h3>
                            <button className="orders-modal-close" onClick={() => setContactModal(null)}>✕</button>
                        </div>
                        <div className="orders-modal-body">
                            <p>Vous avez une question concernant votre réservation ? Notre équipe vous répondra rapidement.</p>
                            <textarea
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                placeholder="Écrivez votre message ici..."
                                rows={4}
                                className="orders-modal-textarea"
                            />
                        </div>
                        <div className="orders-modal-footer">
                            <button className="orders-modal-cancel" onClick={() => setContactModal(null)}>Annuler</button>
                            <button className="orders-modal-send" onClick={() => handleContactAgence(contactModal)}>
                                <Send size={16} />
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
