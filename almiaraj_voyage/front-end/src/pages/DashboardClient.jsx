import { useAuth } from "@/context/AuthContext";
import {
  User, Mail, Phone, MapPin, Calendar,
  Plane, Hotel, Star, Clock, Heart,
  Settings, LogOut, Bell, Shield, Award,
  CreditCard, Globe, MessageCircle, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function DashboardClient() {
  const { client, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Chargement de votre espace client...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="dashboard-error">
        <div className="dashboard-error-icon">⚠️</div>
        <h2>Aucune donnée client trouvée</h2>
        <p>Veuillez vous reconnecter</p>
        <Link to="/login" className="dashboard-error-btn">Se connecter</Link>
      </div>
    );
  }

  const stats = [
    { icon: <Plane />, value: "3", label: "Voyages réservés" },
    { icon: <Hotel />, value: "5", label: "Nuits d'hôtel" },
    { icon: <Star />, value: "4.8", label: "Note moyenne" },
    { icon: <Heart />, value: "12", label: "Destinations favorites" },
  ];

  const upcomingTrips = [
    { id: 1, destination: "Marrakech, Maroc", date: "15 Avr 2025", status: "Confirmé", image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg" },
    { id: 2, destination: "Istanbul, Turquie", date: "10 Mai 2025", status: "En attente", image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg" },
  ];

  const recentActivities = [
    { id: 1, action: "Réservation confirmée", destination: "Marrakech", date: "Il y a 2 jours", icon: <Plane size={16} /> },
    { id: 2, action: "Paiement reçu", destination: "Istanbul", date: "Il y a 5 jours", icon: <CreditCard size={16} /> },
    { id: 3, action: "Nouvelle destination ajoutée", destination: "Dubai", date: "Il y a 1 semaine", icon: <Heart size={16} /> },
  ];

  return (
    <div className="dashboard-client">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-overlay"></div>
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-avatar">
            {client.nomCl?.charAt(0)}{client.prenomCl?.charAt(0)}
          </div>
          <h1 className="dashboard-hero-title">
            Bonjour, {client.prenomCl} {client.nomCl}
          </h1>
          <p className="dashboard-hero-subtitle">
            Bienvenue dans votre espace personnel
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card">
            <div className="dashboard-stat-icon">{stat.icon}</div>
            <div className="dashboard-stat-info">
              <span className="dashboard-stat-value">{stat.value}</span>
              <span className="dashboard-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
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
              <User size={18} />
              Aperçu
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "trips" ? "active" : ""}`}
              onClick={() => setActiveTab("trips")}
            >
              <Plane size={18} />
              Mes voyages
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <Settings size={18} />
              Profil
            </button>
            <button
              className={`dashboard-sidebar-item ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell size={18} />
              Notifications
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
              {/* Profile Info */}
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Informations personnelles</h3>
                <div className="dashboard-info-grid">
                  <div className="dashboard-info-item">
                    <User size={18} />
                    <div>
                      <span className="dashboard-info-label">Nom complet</span>
                      <p className="dashboard-info-value">{client.nomCl} {client.prenomCl}</p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Mail size={18} />
                    <div>
                      <span className="dashboard-info-label">Email</span>
                      <p className="dashboard-info-value">{client.email}</p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Phone size={18} />
                    <div>
                      <span className="dashboard-info-label">Téléphone</span>
                      <p className="dashboard-info-value">{client.numTelCl || "Non renseigné"}</p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Globe size={18} />
                    <div>
                      <span className="dashboard-info-label">Nationalité</span>
                      <p className="dashboard-info-value">{client.natCl}</p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Calendar size={18} />
                    <div>
                      <span className="dashboard-info-label">Membre depuis</span>
                      <p className="dashboard-info-value">{new Date(client.dateInscription).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="dashboard-info-item">
                    <Shield size={18} />
                    <div>
                      <span className="dashboard-info-label">Statut</span>
                      <p className="dashboard-info-value badge-success">Premium</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Trips */}
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Prochains voyages</h3>
                  <Link to="/trips" className="dashboard-card-link">
                    Voir tout <ChevronRight size={16} />
                  </Link>
                </div>
                <div className="dashboard-trips">
                  {upcomingTrips.map((trip) => (
                    <div key={trip.id} className="dashboard-trip-item">
                      <div className="dashboard-trip-image">
                        <img src={trip.image} alt={trip.destination} />
                      </div>
                      <div className="dashboard-trip-info">
                        <h4 className="dashboard-trip-destination">{trip.destination}</h4>
                        <p className="dashboard-trip-date">
                          <Calendar size={14} /> {trip.date}
                        </p>
                      </div>
                      <div className="dashboard-trip-status">
                        <span className={`status-badge ${trip.status === "Confirmé" ? "status-confirmed" : "status-pending"}`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="dashboard-card">
                <h3 className="dashboard-card-title">Activités récentes</h3>
                <div className="dashboard-activities">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="dashboard-activity-item">
                      <div className="dashboard-activity-icon">{activity.icon}</div>
                      <div className="dashboard-activity-info">
                        <p className="dashboard-activity-action">{activity.action}</p>
                        <p className="dashboard-activity-destination">{activity.destination}</p>
                      </div>
                      <span className="dashboard-activity-date">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <div className="dashboard-card">
              <h3 className="dashboard-card-title">Modifier mon profil</h3>
              <form className="dashboard-profile-form">
                <div className="dashboard-form-row">
                  <div className="dashboard-form-group">
                    <label>Nom</label>
                    <input type="text" defaultValue={client.nomCl} className="dashboard-input" />
                  </div>
                  <div className="dashboard-form-group">
                    <label>Prénom</label>
                    <input type="text" defaultValue={client.prenomCl} className="dashboard-input" />
                  </div>
                </div>
                <div className="dashboard-form-row">
                  <div className="dashboard-form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={client.email} className="dashboard-input" />
                  </div>
                  <div className="dashboard-form-group">
                    <label>Téléphone</label>
                    <input type="tel" defaultValue={client.numTelCl} className="dashboard-input" />
                  </div>
                </div>
                <div className="dashboard-form-group">
                  <label>Nationalité</label>
                  <input type="text" defaultValue={client.natCl} className="dashboard-input" />
                </div>
                <button type="submit" className="dashboard-save-btn">Enregistrer les modifications</button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-client {
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Hero Section */
        .dashboard-hero {
          position: relative;
          background: linear-gradient(135deg, #2f6f85 0%, #1e5a6e 100%);
          padding: 60px 40px;
          text-align: center;
        }

        .dashboard-hero-overlay {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .dashboard-hero-content {
          position: relative;
          z-index: 2;
        }

        .dashboard-hero-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #fb923c, #ea580c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin: 0 auto 20px;
          border: 4px solid white;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
        }

        .dashboard-hero-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .dashboard-hero-subtitle {
          color: rgba(255,255,255,0.9);
        }

        /* Stats */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: -40px auto 40px;
          padding: 0 24px;
          position: relative;
          z-index: 5;
        }

        .dashboard-stat-card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);
        }

        .dashboard-stat-icon {
          width: 50px;
          height: 50px;
          background: #fff7ed;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fb923c;
        }

        .dashboard-stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b;
          display: block;
        }

        .dashboard-stat-label {
          font-size: 12px;
          color: #64748b;
        }

        /* Main Layout */
        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 60px;
          display: flex;
          gap: 32px;
        }

        /* Sidebar */
        .dashboard-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: white;
          border-radius: 24px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .dashboard-sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .dashboard-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dashboard-sidebar-item:hover {
          background: #f1f5f9;
          color: #fb923c;
        }

        .dashboard-sidebar-item.active {
          background: #fff7ed;
          color: #fb923c;
        }

        .dashboard-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dashboard-logout-btn:hover {
          background: #fef2f2;
        }

        /* Content */
        .dashboard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .dashboard-card {
          background: white;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .dashboard-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .dashboard-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .dashboard-card-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #fb923c;
          text-decoration: none;
        }

        /* Info Grid */
        .dashboard-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .dashboard-info-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-info-item svg {
          color: #fb923c;
        }

        .dashboard-info-label {
          font-size: 12px;
          color: #64748b;
          display: block;
        }

        .dashboard-info-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .badge-success {
          display: inline-block;
          padding: 2px 10px;
          background: #dcfce7;
          color: #166534;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Trips */
        .dashboard-trips {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dashboard-trip-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 16px;
        }

        .dashboard-trip-image {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
        }

        .dashboard-trip-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dashboard-trip-info {
          flex: 1;
        }

        .dashboard-trip-destination {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .dashboard-trip-date {
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-confirmed {
          background: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        /* Activities */
        .dashboard-activities {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dashboard-activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .dashboard-activity-icon {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fb923c;
        }

        .dashboard-activity-info {
          flex: 1;
        }

        .dashboard-activity-action {
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
        }

        .dashboard-activity-destination {
          font-size: 11px;
          color: #64748b;
        }

        .dashboard-activity-date {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Profile Form */
        .dashboard-profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dashboard-form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .dashboard-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dashboard-form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .dashboard-input {
          padding: 10px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .dashboard-input:focus {
          border-color: #fb923c;
          outline: none;
          box-shadow: 0 0 0 3px rgba(251,146,60,0.1);
        }

        .dashboard-save-btn {
          padding: 12px 24px;
          background: #2f6f85;
          color: white;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dashboard-save-btn:hover {
          background: #1e5a6e;
          transform: translateY(-2px);
        }

        /* Loading & Error */
        .dashboard-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .dashboard-loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #e2e8f0;
          border-top-color: #2f6f85;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        .dashboard-error {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #f8fafc;
        }

        .dashboard-error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .dashboard-error h2 {
          color: #1e293b;
          margin-bottom: 8px;
        }

        .dashboard-error p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .dashboard-error-btn {
          padding: 10px 24px;
          background: #2f6f85;
          color: white;
          border-radius: 40px;
          text-decoration: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-main {
            flex-direction: column;
          }

          .dashboard-sidebar {
            width: 100%;
            position: static;
          }

          .dashboard-sidebar-menu {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .dashboard-info-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }

          .dashboard-hero {
            padding: 40px 20px;
          }

          .dashboard-hero-title {
            font-size: 22px;
          }

          .dashboard-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
