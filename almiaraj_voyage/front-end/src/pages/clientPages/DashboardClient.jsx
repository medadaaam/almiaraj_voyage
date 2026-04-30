import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plane,
  Hotel,
  Star,
  Clock,
  Heart,
  Settings,
  LogOut,
  Bell,
  Shield,
  Award,
  CreditCard,
  Globe,
  MessageCircle,
  ChevronRight,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Package,
  Ticket,
  MessageSquare,
  Users,
  TrendingUp,
  Wallet,
  Camera,
  Home,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./dashboardClient.css";

// Composant XCircle pour les statuts annulés
const XCircle = ({ size, ...props }) => <X size={size} {...props} />;

export default function DashboardClient() {
  const {
    client,
    clientProfile,
    loading,
    logout,
    updateClientProfile,
    getMyReservations,
    getMyMessages,
    getClientProfile,
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Utiliser les données du profil client (qui inclut toutes les informations)
  const currentClient = clientProfile?.client || client;

  const [formData, setFormData] = useState({
    nomCl: "",
    prenomCl: "",
    email: "",
    numTelCl: "",
    natCl: "maroc",
    cin: "",
    passport: "",
    adresse: "",
    ville: "",
    codePostal: "",
  });

  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  // ✅ Charger le profil client au démarrage si nécessaire
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        // Si pas de client mais qu'on est connecté, on charge le profil
        if (!currentClient && !loading) {
          await getClientProfile();
        }
      } catch (error) {
        console.error("Erreur chargement initial:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // ✅ Mettre à jour formData quand currentClient change
  useEffect(() => {
    if (currentClient) {
      setFormData({
        nomCl: currentClient.nomCl || "",
        prenomCl: currentClient.prenomCl || "",
        email: currentClient.email || "",
        numTelCl: currentClient.numTelCl || "",
        natCl: currentClient.natCl || "maroc",
        cin: currentClient.cin || "",
        passport: currentClient.passport || "",
        adresse: currentClient.adresse || "",
        ville: currentClient.ville || "",
        codePostal: currentClient.codePostal || "",
      });
    }
  }, [currentClient]);

  // ✅ Charger les réservations et messages UNIQUEMENT quand currentClient est disponible
  useEffect(() => {
    if (currentClient && !initialLoading) {
      fetchReservations();
      fetchMessages();
    }
  }, [currentClient, initialLoading]);

  // ✅ Rafraîchir quand on change d'onglet
  useEffect(() => {
    if (currentClient) {
      if (activeTab === "orders") {
        fetchReservations();
      }
      if (activeTab === "messages") {
        fetchMessages();
      }
    }
  }, [activeTab]);

  const fetchReservations = async () => {
    if (loadingReservations) return;
    setLoadingReservations(true);
    try {
      const data = await getMyReservations();
      if (data?.success) {
        setReservations(data.reservations || []);
        console.log("✅ Réservations chargées:", data.reservations?.length);
      }
    } catch (error) {
      console.error("❌ Erreur chargement réservations:", error);
    } finally {
      setLoadingReservations(false);
    }
  };

  const fetchMessages = async () => {
    if (loadingMessages) return;
    setLoadingMessages(true);
    try {
      const data = await getMyMessages();
      if (data?.success) {
        setMessages(data.messages || []);
        console.log("✅ Messages chargés:", data.messages?.length);
      }
    } catch (error) {
      console.error("❌ Erreur chargement messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdateSuccess("");
    setUpdateError("");
    try {
      const response = await updateClientProfile({
        nomCl: formData.nomCl,
        prenomCl: formData.prenomCl,
        email: formData.email,
        numTelCl: formData.numTelCl,
        natCl: formData.natCl,
        cin: formData.cin,
        passport: formData.passport,
      });

      if (response?.success) {
        setUpdateSuccess("Profil mis à jour avec succès !");
        setIsEditing(false);
        // Rafraîchir le profil après mise à jour
        await getClientProfile();
        setTimeout(() => setUpdateSuccess(""), 3000);
      } else {
        setUpdateError(response?.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("Update error:", err);
      setUpdateError(
        err.response?.data?.message || "Une erreur s'est produite",
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock size={14} />,
          label: "En attente",
          class: "pending",
        };
      case "confirmed":
        return {
          icon: <CheckCircle size={14} />,
          label: "Confirmée",
          class: "confirmed",
        };
      case "cancelled":
        return {
          icon: <XCircle size={14} />,
          label: "Annulée",
          class: "cancelled",
        };
      default:
        return { icon: null, label: status, class: "" };
    }
  };

  const getServiceIcon = (type) => {
    if (type?.includes("voyage")) return <Plane size={16} />;
    if (type?.includes("hotel")) return <Hotel size={16} />;
    return <Ticket size={16} />;
  };

  // ✅ Afficher le chargement tant que les données ne sont pas prêtes
  if (loading || initialLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Chargement de votre espace client...</p>
      </div>
    );
  }

  // ✅ Vérifier si on a des données après le chargement
  if (!currentClient) {
    return (
      <div className="dashboard-error">
        <div className="dashboard-error-icon">⚠️</div>
        <h2>Aucune donnée client trouvée</h2>
        <p>Veuillez vous reconnecter</p>
        <Link to="/login" className="dashboard-error-btn">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-client">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-overlay"></div>
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-avatar">
            {currentClient.prenomCl?.charAt(0)}
            {currentClient.nomCl?.charAt(0)}
          </div>
          <h1 className="dashboard-hero-title">
            Bonjour, {currentClient.prenomCl} {currentClient.nomCl}
          </h1>
          <p className="dashboard-hero-subtitle">
            Bienvenue dans votre espace personnel
          </p>
          <div className="dashboard-hero-badge">
            <Award size={16} />
            Membre depuis{" "}
            {currentClient.dateInscription
              ? new Date(currentClient.dateInscription).getFullYear()
              : "2024"}
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="dashboard-sidebar-menu">
            <button
              className={`dashboard-sidebar-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Home size={18} />
              Aperçu
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              Mon profil
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={18} />
              Mes réservations
              {reservations.length > 0 && (
                <span className="dashboard-badge">{reservations.length}</span>
              )}
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare size={18} />
              Messages
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="dashboard-badge">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings size={18} />
              Paramètres
            </button>
          </div>

          <button onClick={logout} className="dashboard-logout-btn">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>

        {/* Content */}
        <div className="dashboard-content">
          {activeTab === "overview" && (
            <>
              {/* À propos de vous */}
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">À propos de vous</h3>
                </div>
                <div className="dashboard-info-grid">
                  <div className="dashboard-info-item">
                    <User size={18} />
                    <div>
                      <span className="dashboard-info-label">Nom complet</span>
                      <p className="dashboard-info-value">
                        {currentClient.nomCl} {currentClient.prenomCl}
                      </p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Mail size={18} />
                    <div>
                      <span className="dashboard-info-label">Email</span>
                      <p className="dashboard-info-value">
                        {currentClient.email}
                      </p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Phone size={18} />
                    <div>
                      <span className="dashboard-info-label">Téléphone</span>
                      <p className="dashboard-info-value">
                        {currentClient.numTelCl || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Globe size={18} />
                    <div>
                      <span className="dashboard-info-label">Nationalité</span>
                      <p className="dashboard-info-value">
                        {currentClient.natCl || "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Calendar size={18} />
                    <div>
                      <span className="dashboard-info-label">
                        Membre depuis
                      </span>
                      <p className="dashboard-info-value">
                        {currentClient.dateInscription
                          ? new Date(
                              currentClient.dateInscription,
                            ).toLocaleDateString("fr-FR")
                          : "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">
                    Réservations récentes
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="dashboard-card-link"
                  >
                    Voir tout <ChevronRight size={16} />
                  </button>
                </div>
                {loadingReservations ? (
                  <div className="dashboard-loading-small">
                    <div className="spinner"></div>
                    <p>Chargement des réservations...</p>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="dashboard-empty">
                    <p>Aucune réservation pour le moment</p>
                    <Link to="/" className="dashboard-empty-btn">
                      Découvrir nos offres
                    </Link>
                  </div>
                ) : (
                  <div className="dashboard-recent-list">
                    {reservations.slice(0, 3).map((res) => {
                      const statusConfig = getStatusConfig(res.status);
                      return (
                        <div key={res.id} className="dashboard-recent-item">
                          <div className="dashboard-recent-icon">
                            {getServiceIcon(res.service?.type)}
                          </div>
                          <div className="dashboard-recent-info">
                            <h4>{res.service?.nomServ}</h4>
                            <p>
                              {new Date(res.created_at).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                          </div>
                          <div
                            className={`dashboard-recent-status ${statusConfig.class}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Mon profil</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="dashboard-edit-btn"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                ) : (
                  <div className="dashboard-edit-actions">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="dashboard-cancel-btn"
                    >
                      <X size={16} />
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="dashboard-save-btn"
                    >
                      <Save size={16} />
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              {updateSuccess && (
                <div className="dashboard-success-message">
                  <CheckCircle size={16} />
                  {updateSuccess}
                </div>
              )}
              {updateError && (
                <div className="dashboard-error-message">
                  <AlertCircle size={16} />
                  {updateError}
                </div>
              )}

              <form className="dashboard-profile-form">
                <div className="dashboard-form-row">
                  <div className="dashboard-form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      name="prenomCl"
                      value={formData.prenomCl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    />
                  </div>
                  <div className="dashboard-form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      name="nomCl"
                      value={formData.nomCl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    />
                  </div>
                </div>

                <div className="dashboard-form-row">
                  <div className="dashboard-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    />
                  </div>
                  <div className="dashboard-form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      name="numTelCl"
                      value={formData.numTelCl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    />
                  </div>
                </div>

                <div className="dashboard-form-row">
                  <div className="dashboard-form-group">
                    <label>Nationalité</label>
                    <select
                      name="natCl"
                      value={formData.natCl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    >
                      <option value="maroc">Maroc 🇲🇦</option>
                      <option value="france">France 🇫🇷</option>
                      <option value="espagne">Espagne 🇪🇸</option>
                      <option value="italie">Italie 🇮🇹</option>
                      <option value="tunisie">Tunisie 🇹🇳</option>
                      <option value="algerie">Algérie 🇩🇿</option>
                      <option value="autres">Autres</option>
                    </select>
                  </div>
                  <div className="dashboard-form-group">
                    <label>CIN</label>
                    <input
                      type="text"
                      name="cin"
                      value={formData.cin}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    />
                  </div>
                </div>

                <div className="dashboard-form-row">
                  <div className="dashboard-form-group">
                    <label>Passport</label>
                    <input
                      type="text"
                      name="passport"
                      value={formData.passport}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="dashboard-input"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Mes réservations</h3>
              </div>
              {loadingReservations ? (
                <div className="dashboard-loading-small">
                  <div className="spinner"></div>
                  <p>Chargement...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="dashboard-empty">
                  <Package size={48} className="dashboard-empty-icon" />
                  <p>Aucune réservation pour le moment</p>
                  <Link to="/" className="dashboard-empty-btn">
                    Découvrir nos offres
                  </Link>
                </div>
              ) : (
                <div className="dashboard-orders-list">
                  {reservations.map((res) => {
                    const statusConfig = getStatusConfig(res.status);
                    return (
                      <div key={res.id} className="dashboard-order-item">
                        <div className="dashboard-order-header">
                          <div className="dashboard-order-type">
                            {getServiceIcon(res.service?.type)}
                            <span>#{res.reference || res.id}</span>
                          </div>
                          <div
                            className={`dashboard-order-status ${statusConfig.class}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </div>
                        </div>
                        <div className="dashboard-order-body">
                          <h4>{res.service?.nomServ}</h4>
                          <div className="dashboard-order-details">
                            <Calendar size={14} />
                            <span>
                              {new Date(res.created_at).toLocaleDateString(
                                "fr-FR",
                              )}
                            </span>
                            <Users size={14} />
                            <span>{res.nbPers} personne(s)</span>
                          </div>
                          <div className="dashboard-order-price">
                            <span>Total</span>
                            <strong>{res.prixTotal} DH</strong>
                          </div>
                        </div>
                        <div className="dashboard-order-footer">
                          <Link
                            to={`/client/reservations/${res.id}`}
                            className="dashboard-order-btn"
                          >
                            Voir détails
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Mes messages</h3>
              </div>
              {loadingMessages ? (
                <div className="dashboard-loading-small">
                  <div className="spinner"></div>
                  <p>Chargement...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="dashboard-empty">
                  <MessageSquare size={48} className="dashboard-empty-icon" />
                  <p>Aucun message pour le moment</p>
                </div>
              ) : (
                <div className="dashboard-messages-list">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`dashboard-message-item ${!msg.read ? "unread" : ""}`}
                    >
                      <div className="dashboard-message-icon">
                        {!msg.read && <div className="unread-dot"></div>}
                        <MessageCircle size={20} />
                      </div>
                      <div className="dashboard-message-content">
                        <div className="dashboard-message-header">
                          <span className="dashboard-message-sender">
                            {msg.sender || "Agence"}
                          </span>
                          <span className="dashboard-message-date">
                            {new Date(msg.created_at).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>
                        <p className="dashboard-message-subject">
                          {msg.subject}
                        </p>
                        <p className="dashboard-message-preview">
                          {msg.message?.substring(0, 100)}...
                        </p>
                      </div>
                      <Link
                        to={`/client/messages/${msg.id}`}
                        className="dashboard-message-link"
                      >
                        Lire <ChevronRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">Paramètres du compte</h3>
              <div className="dashboard-settings-list">
                <div className="dashboard-setting-item">
                  <div className="dashboard-setting-info">
                    <Bell size={18} />
                    <div>
                      <h4>Notifications</h4>
                      <p>Recevoir les notifications par email</p>
                    </div>
                  </div>
                  <label className="dashboard-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="dashboard-toggle-slider"></span>
                  </label>
                </div>
                {/* <div className="dashboard-setting-item">
                  <div className="dashboard-setting-info">
                    <Shield size={18} />
                    <div>
                      <h4>Sécurité</h4>
                      <p>Changer mon mot de passe</p>
                    </div>
                  </div>
                  <Link
                    to="/change-password"
                    className="dashboard-setting-link"
                  >
                    Modifier
                  </Link>
                </div> */}
                {/* <div className="dashboard-setting-item">
                  <div className="dashboard-setting-info">
                    <CreditCard size={18} />
                    <div>
                      <h4>Moyens de paiement</h4>
                      <p>Gérer vos cartes et modes de paiement</p>
                    </div>
                  </div>
                  <Link
                    to="/payment-methods"
                    className="dashboard-setting-link"
                  >
                    Gérer
                  </Link>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
