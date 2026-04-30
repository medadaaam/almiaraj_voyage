import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Hotel, 
  Plane, 
  Ticket, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye
} from "lucide-react";
import { axiosClient } from "@/api/axios";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalClients: 0,
    totalVoyages: 0,
    totalHotels: 0,
    totalBillets: 0,
    pendingPayments: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
    revenue: 0,
    monthlyRevenue: 0,
    growth: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch reservations
      const reservationsRes = await axiosClient.get('/admin/reservations');
      const reservations = reservationsRes.data?.data || [];
      
      // Fetch clients
      const clientsRes = await axiosClient.get('/admin/clients');
      const clients = clientsRes.data?.data || [];
      
      // Fetch services
      const voyagesRes = await axiosClient.get('/voyages');
      const hotelsRes = await axiosClient.get('/hotels');
      const billetsRes = await axiosClient.get('/billets');
      
      const voyages = voyagesRes.data?.data || [];
      const hotels = hotelsRes.data?.data || [];
      const billets = billetsRes.data?.data || [];
      
      // Calculate stats
      const totalReservations = reservations.length;
      const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
      const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;
      const pendingPayments = reservations.filter(r => r.payment_status === 'unpaid').length;
      
      const totalRevenue = reservations.reduce((sum, r) => sum + (r.prixTotal || 0), 0);
      
      // Calculate monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = reservations
        .filter(r => new Date(r.created_at) >= thirtyDaysAgo)
        .reduce((sum, r) => sum + (r.prixTotal || 0), 0);
      
      // Calculate growth (compare with previous month)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const previousMonthlyRevenue = reservations
        .filter(r => {
          const date = new Date(r.created_at);
          return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        })
        .reduce((sum, r) => sum + (r.prixTotal || 0), 0);
      
      const growth = previousMonthlyRevenue > 0 
        ? ((monthlyRevenue - previousMonthlyRevenue) / previousMonthlyRevenue) * 100 
        : monthlyRevenue > 0 ? 100 : 0;
      
      // Get recent reservations
      const recent = [...reservations]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      
      setStats({
        totalReservations,
        totalClients: clients.length,
        totalVoyages: voyages.length,
        totalHotels: hotels.length,
        totalBillets: billets.length,
        pendingPayments,
        confirmedReservations,
        cancelledReservations,
        revenue: totalRevenue,
        monthlyRevenue,
        growth: Math.round(growth * 100) / 100
      });
      
      setRecentReservations(recent);
      setError("");
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Réservations",
      value: stats.totalReservations,
      icon: <Calendar size={24} />,
      color: "#3b82f6",
      bgColor: "#dbeafe",
      link: "/admin/reservations"
    },
    {
      title: "Clients",
      value: stats.totalClients,
      icon: <Users size={24} />,
      color: "#10b981",
      bgColor: "#d1fae5",
      link: "/admin/users"
    },
    {
      title: "Voyages",
      value: stats.totalVoyages,
      icon: <Plane size={24} />,
      color: "#8b5cf6",
      bgColor: "#ede9fe",
      link: "/admin/voyages"
    },
    {
      title: "Hôtels",
      value: stats.totalHotels,
      icon: <Hotel size={24} />,
      color: "#f59e0b",
      bgColor: "#fef3c7",
      link: "/admin/hotels"
    },
    {
      title: "Billets",
      value: stats.totalBillets,
      icon: <Ticket size={24} />,
      color: "#ef4444",
      bgColor: "#fee2e2",
      link: "/admin/billets"
    }
  ];

  const statusCards = [
    {
      title: "Confirmées",
      value: stats.confirmedReservations,
      icon: <CheckCircle size={20} />,
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    {
      title: "En attente",
      value: stats.totalReservations - stats.confirmedReservations - stats.cancelledReservations,
      icon: <Clock size={20} />,
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
    {
      title: "Annulées",
      value: stats.cancelledReservations,
      icon: <XCircle size={20} />,
      color: "#ef4444",
      bgColor: "#fee2e2"
    },
    {
      title: "Paiements en attente",
      value: stats.pendingPayments,
      icon: <DollarSign size={20} />,
      color: "#ef4444",
      bgColor: "#fee2e2"
    }
  ];

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' DH';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          <RefreshCw size={16} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Bienvenue dans votre espace d'administration</p>
        </div>
        <button onClick={fetchDashboardData} className="refresh-btn">
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {/* Revenue Section */}
      <div className="revenue-section">
        <div className="revenue-card">
          <div className="revenue-icon">
            <DollarSign size={28} />
          </div>
          <div className="revenue-info">
            <span className="revenue-label">Chiffre d'affaires total</span>
            <span className="revenue-value">{formatPrice(stats.revenue)}</span>
          </div>
        </div>
        <div className="revenue-card">
          <div className="revenue-icon monthly">
            <TrendingUp size={28} />
          </div>
          <div className="revenue-info">
            <span className="revenue-label">Ce mois-ci</span>
            <span className="revenue-value">{formatPrice(stats.monthlyRevenue)}</span>
            <span className={`growth-badge ${stats.growth >= 0 ? 'positive' : 'negative'}`}>
              {stats.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(stats.growth)}% vs mois précédent
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index} className="stat-card">
            <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-title">{stat.title}</span>
            </div>
            <ArrowRight size={16} className="stat-arrow" />
          </Link>
        ))}
      </div>

      {/* Status Cards */}
      <div className="status-grid">
        {statusCards.map((card, index) => (
          <div key={index} className="status-card" style={{ borderLeftColor: card.color }}>
            <div className="status-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="status-info">
              <span className="status-value">{card.value}</span>
              <span className="status-title">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Réservations récentes</h2>
          <Link to="/admin/reservations" className="section-link">
            Voir toutes <ArrowRight size={16} />
          </Link>
        </div>

        <div className="recent-table-container">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((res) => (
                <tr key={res.id}>
                  <td className="reference">#{res.reference || res.id}</td>
                  <td>
                    <div className="client-cell">
                      <div className="client-avatar">
                        {res.client?.prenomCl?.charAt(0) || 'C'}
                        {res.client?.nomCl?.charAt(0) || 'L'}
                      </div>
                      <span>{res.client?.prenomCl} {res.client?.nomCl}</span>
                    </div>
                  </td>
                  <td>{res.service?.nomServ || 'N/A'}</td>
                  <td>{formatDate(res.created_at)}</td>
                  <td className="price">{formatPrice(res.prixTotal || 0)}</td>
                  <td>{getStatusBadge(res.status)}</td>
                  <td>
                    <Link to={`/admin/reservations/${res.id}`} className="view-link">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}