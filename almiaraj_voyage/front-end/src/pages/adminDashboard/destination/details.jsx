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
  Image as ImageIcon
} from "lucide-react";

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    let cleanPath = imagePath.replace(/^public\//, '');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${cleanPath}`;
  };

  const getContinentColor = (continent) => {
    const colors = {
      'Afrique': '#f59e0b',
      'Europe': '#3b82f6',
      'Asie': '#10b981',
      'Amérique': '#ef4444',
      'Océanie': '#8b5cf6'
    };
    return colors[continent] || '#6b7280';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">{error || "Destination non trouvée"}</h2>
        <Link to="/admin/destinations" className="text-[#fb923c] hover:underline mt-4 inline-block">
          Retour aux destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button onClick={() => navigate("/admin/destinations")} className="flex items-center gap-2 text-gray-600 hover:text-[#fb923c] transition">
          <ArrowLeft size={18} />
          Retour aux destinations
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image */}
        <div className="relative h-64 md:h-96">
          {destination.image ? (
            <img
              src={getImageUrl(destination.image)}
              alt={destination.ville}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#fb923c] to-[#ea580c] flex items-center justify-center">
              <Globe size={64} className="text-white opacity-50" />
            </div>
          )}
          {destination.en_vedette === 1 && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={14} />
              En vedette
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{destination.ville}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe size={16} />
                  <span>{destination.pays}</span>
                </div>
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: `${getContinentColor(destination.continente)}20`, color: getContinentColor(destination.continente) }}
                >
                  <Compass size={14} />
                  <span>{destination.continente}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/destinations/modifier/${destination.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <Edit size={16} />
                Modifier
              </Link>
              <button
                onClick={() => {
                  if (confirm("Supprimer cette destination ?")) {
                    axiosClient.delete(`/destinations/${destination.id}`).then(() => {
                      navigate("/admin/destinations");
                    });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>

          {/* Description */}
          {destination.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{destination.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Créé le:</span>
                <span className="ml-2 text-gray-700">{formatDate(destination.created_at)}</span>
              </div>
              <div>
                <span className="text-gray-500">Dernière modification:</span>
                <span className="ml-2 text-gray-700">{formatDate(destination.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}