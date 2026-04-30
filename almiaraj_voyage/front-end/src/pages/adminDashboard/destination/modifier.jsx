import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Upload, Trash2, Globe, MapPin, Compass, Star, Loader } from "lucide-react";

export default function ModifierDestination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  
  const [form, setForm] = useState({
    pays: "",
    ville: "",
    continente: "",
    en_vedette: 0,
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`/destinations/${id}`);
      const data = response.data.data || response.data;
      
      setForm({
        pays: data.pays || "",
        ville: data.ville || "",
        continente: data.continente || "",
        en_vedette: data.en_vedette || 0,
        description: data.description || "",
        image: null,
      });
      
      if (data.image) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        setCurrentImage(`${baseUrl}/storage/${data.image.replace(/^public\//, '')}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur lors du chargement de la destination");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    const input = document.getElementById('image-input');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.pays || !form.ville || !form.continente) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pays', form.pays);
      formData.append('ville', form.ville);
      formData.append('continente', form.continente);
      formData.append('en_vedette', form.en_vedette);
      formData.append('description', form.description || '');
      if (form.image) {
        formData.append('image', form.image);
      }
      formData.append('_method', 'PUT');

      const response = await axiosClient.post(`/destinations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert("Destination modifiée avec succès!");
        navigate("/admin/destinations");
      } else {
        setError(response.data.message || "Erreur lors de la modification");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier la destination</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="pays"
                  value={form.pays}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Continent *
              </label>
              <div className="relative">
                <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="continente"
                  value={form.continente}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                >
                  <option value="">Sélectionner un continent</option>
                  <option value="Afrique">Afrique</option>
                  <option value="Europe">Europe</option>
                  <option value="Asie">Asie</option>
                  <option value="Amérique">Amérique</option>
                  <option value="Océanie">Océanie</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="en_vedette"
                  checked={form.en_vedette === 1}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#fb923c] focus:ring-[#fb923c]"
                />
                <Star size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-700">Mettre en vedette</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
                <Upload size={18} />
                <span>Changer l'image</span>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {(imagePreview || currentImage) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={18} />
                  Supprimer l'image
                </button>
              )}
            </div>
            {(imagePreview || currentImage) && (
              <div className="mt-3">
                <img 
                  src={imagePreview || currentImage} 
                  alt="Preview" 
                  className="w-40 h-40 object-cover rounded-md border" 
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Laissez vide pour conserver l'image actuelle
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50"
            >
              {loading ? "Modification..." : "Mettre à jour"}
            </button>
            <Link
              to="/admin/destinations"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition text-center"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}