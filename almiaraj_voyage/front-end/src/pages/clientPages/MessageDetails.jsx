// src/pages/client/MessageDetails.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Reply
} from "lucide-react";
import "./messageDetails.css";

export default function MessageDetails() {
  const { id } = useParams();
  const { getMessageDetails, sendReply, user, clientProfile } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchMessageDetails();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [message, showReplyForm]);

  const fetchMessageDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Fetching message ID:", id);
      const response = await getMessageDetails(id);
      console.log("📦 Response:", response);

      if (response?.success && response?.message) {
        setMessage(response.message);
      } else {
        setError(response?.message || "Message non trouvé");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const response = await sendReply(id, { message: replyText });
      if (response?.success) {
        setReplyText("");
        setShowReplyForm(false);
        await fetchMessageDetails();
      } else {
        setError(response?.message || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Une erreur s'est produite");
    } finally {
      setSending(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "lu":
        return {
          icon: <CheckCircle size={16} />,
          label: "Lu",
          class: "read"
        };
      case "repondu":
        return {
          icon: <CheckCircle size={16} />,
          label: "Répondu",
          class: "read"
        };
      case "en_attente":
        return {
          icon: <Clock size={16} />,
          label: "En attente",
          class: "pending"
        };
      default:
        return {
          icon: <AlertCircle size={16} />,
          label: status || "Inconnu",
          class: ""
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="msg-details-loading">
        <div className="msg-details-spinner"></div>
        <p>Chargement du message...</p>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="msg-details-error">
        <div className="error-icon">💬</div>
        <h2>Erreur</h2>
        <p>{error || "Message non trouvé"}</p>
        <Link to="/dashboard" className="error-btn">
          Retour au dashboard
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(message.statusM);
  const client = message.client;

  return (
    <div className="msg-details-page">
      {/* Header */}
      <div className="msg-details-header">
        <button onClick={() => navigate(-1)} className="msg-back-btn">
          <ArrowLeft size={18} />
          Retour
        </button>
        <div className="msg-header-info">
          <h1 className="msg-header-title">Détails du message</h1>
          <div className={`msg-status-badge ${statusConfig.class}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>
      </div>

      <div className="msg-details-grid">
        {/* Message Content Card */}
        <div className="msg-card message-card">
          <div className="msg-card-header">
            <div className="msg-subject">
              <MessageCircle size={20} />
              <h3>Sujet: {message.nomM || "Message"}</h3>
            </div>
          </div>
          <div className="msg-card-body">
            <div className="message-content">
              <p>{message.contenu}</p>
            </div>
            <div className="message-meta">
              <span className="message-date">
                <Calendar size={14} />
                Envoyé le {formatDate(message.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Client Info Card */}
        <div className="msg-card client-card">
          <div className="msg-card-header">
            <User size={20} />
            <h3>Informations de l'expéditeur</h3>
          </div>
          <div className="msg-card-body">
            <div className="client-info">
              <div className="client-avatar">
                {client?.prenomCl?.charAt(0) || message.nomM?.charAt(0) || "C"}
              </div>
              <div className="client-details">
                <p className="client-name">
                  {client?.prenomCl} {client?.nomCl || message.nomM}
                </p>
                <div className="client-contact">
                  <Mail size={14} />
                  <span>{client?.email || message.emailM}</span>
                </div>
                <div className="client-contact">
                  <Phone size={14} />
                  <span>{client?.numTelCl || message.numTelM}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Response from admin */}
        {message.reponse && (
          <div className="msg-card response-card">
            <div className="msg-card-header">
              <Reply size={20} />
              <h3>Réponse de l'agence</h3>
            </div>
            <div className="msg-card-body">
              <div className="response-content">
                <div className="response-bubble">
                  <div className="response-header">
                    <span className="response-sender">Al Miaraj Voyages</span>
                    <span className="response-date">{formatDate(message.updated_at)}</span>
                  </div>
                  <p>{message.reponse}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
