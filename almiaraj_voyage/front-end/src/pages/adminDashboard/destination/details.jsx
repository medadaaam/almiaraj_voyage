import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Compass,
  Star,
  Calendar,
  Edit,
  Trash2,
  Loader,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Users,
  Award,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/destinations/${id}`);
      const data = response.data.data || response.data;
      setDestination(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Destination non trouvée");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette destination ? Cette action est irréversible.")) return;
    
    setDeleting(true);
    try {
      await axiosClient.delete(`/destinations/${id}`);
      alert("Destination supprimée avec succès!");
      navigate("/admin/destinations");
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur lors de la suppression");
      setDeleting(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    let cleanPath = imagePath.replace(/^public\//, '');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${cleanPath}`;
  };

  const getContinentColor = (continent) => {
    const colors = {
      'Afrique': { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
      'Europe': { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' },
      'Asie': { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' },
      'Amérique': { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
      'Océanie': { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' }
    };
    return colors[continent] || { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader className="animate-spin text-[#f59e0b]" size={48} />
        <p className="text-gray-500">Chargement des détails...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📍</div>
        <h2 className="text-2xl font-bold text-gray-700">{error || "Destination non trouvée"}</h2>
        <Link to="/admin/destinations" className="inline-flex items-center gap-2 mt-6 text-[#f59e0b] hover:underline">
          <ArrowLeft size={18} />
          Retour aux destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate("/admin/destinations")} 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#f59e0b] transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Retour aux destinations
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Hero Image Section */}
        <div className="relative h-80 md:h-96 bg-gradient-to-r from-[#f59e0b] to-[#d97706]">
          {destination.image ? (
            <img
              src={getImageUrl(destination.image)}
              alt={destination.ville}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Globe size={80} className="text-white opacity-50 mb-4" />
              <p className="text-white opacity-70">Aucune image</p>
            </div>
          )}
          
          {/* Featured Badge */}
          {destination.en_vedette === 1 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star size={14} />
              <span className="text-sm font-medium">En vedette</span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Title and Actions */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{destination.ville}</h1>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <Globe size={16} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">{destination.pays}</span>
                </div>
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: getContinentColor(destination.continente).bg, color: getContinentColor(destination.continente).text }}
                >
                  <Compass size={14} />
                  <span className="font-medium">{destination.continente}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/admin/editDestination/${destination.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md hover:shadow-lg"
              >
                <Edit size={16} />
                Modifier
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {deleting ? <Loader className="animate-spin" size={16} /> : <Trash2 size={16} />}
                Supprimer
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center mx-auto mb-2">
                <MapPin size={18} className="text-[#f59e0b]" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{destination.ville}</p>
              <p className="text-xs text-gray-500">Ville principale</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center mx-auto mb-2">
                <Globe size={18} className="text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">{destination.pays}</p>
              <p className="text-xs text-gray-500">Pays</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-2">
                <Compass size={18} className="text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">{destination.continente}</p>
              <p className="text-xs text-gray-500">Continent</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#f3e8ff] flex items-center justify-center mx-auto mb-2">
                <Calendar size={18} className="text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">{formatDate(destination.created_at)}</p>
              <p className="text-xs text-gray-500">Date de création</p>
            </div>
          </div>

          {/* Description Section */}
          {destination.description && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Info size={20} className="text-[#f59e0b]" />
                <h3 className="text-xl font-semibold text-gray-800">Description</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{destination.description}</p>
              </div>
            </div>
          )}

          {/* Services Section - If you have services linked to destination */}
          {destination.services && destination.services.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={20} className="text-[#f59e0b]" />
                <h3 className="text-xl font-semibold text-gray-800">Services disponibles</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {destination.services.map((service, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-sm text-gray-700">{service.nomServ}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="border-t border-gray-200 pt-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />
                <span>Créé le :</span>
                <span className="text-gray-700 font-medium">{formatDate(destination.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} />
                <span>Dernière modification :</span>
                <span className="text-gray-700 font-medium">{formatDate(destination.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
              {destination.en_vedette === 1 ? (
                <>
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-700">Cette destination est mise en avant sur le site</span>
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Cette destination n'est pas en vedette</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}