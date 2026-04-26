import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Clock, Upload, Trash2, Bed } from "lucide-react";

export default function AjouterHajjOmra() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    type: "omra",
    formule: "",
    dateDepartHO: "",
    dateRetourHO: "",
    typeChambre: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [calculatedDuree, setCalculatedDuree] = useState("");
  const today = new Date().toISOString().split('T')[0];

  // Calculate duration
  useEffect(() => {
    if (form.dateDepartHO && form.dateRetourHO) {
      const depart = new Date(form.dateDepartHO);
      const retour = new Date(form.dateRetourHO);
      
      if (retour >= depart) {
        const diffDays = Math.ceil((retour - depart) / (1000 * 60 * 60 * 24));
        setCalculatedDuree(`${diffDays} jours / ${diffDays - 1} nuits`);
      } else {
        setCalculatedDuree("");
      }
    } else {
      setCalculatedDuree("");
    }
  }, [form.dateDepartHO, form.dateRetourHO]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!form.nomServ.trim()) {
      setError("Veuillez entrer le nom du service");
      setIsSubmitting(false);
      return;
    }

    if (!form.prix || parseFloat(form.prix) <= 0) {
      setError("Veuillez entrer un prix valide");
      setIsSubmitting(false);
      return;
    }

    if (!form.formule) {
      setError("Veuillez sélectionner une formule");
      setIsSubmitting(false);
      return;
    }

    if (!form.dateDepartHO) {
      setError("Veuillez sélectionner une date de départ");
      setIsSubmitting(false);
      return;
    }

    if (!form.dateRetourHO) {
      setError("Veuillez sélectionner une date de retour");
      setIsSubmitting(false);
      return;
    }

    if (!form.typeChambre) {
      setError("Veuillez sélectionner un type de chambre");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('type', form.type);
      formData.append('formule', form.formule);
      formData.append('dateDepartHO', form.dateDepartHO);
      formData.append('dateRetourHO', form.dateRetourHO);
      formData.append('typeChambre', form.typeChambre);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/hajj-omras', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert('Service Hajj/Omra ajouté avec succès!');
        navigate('/admin/hajj-omras'); // Redirect to index page
      }
      
    } catch (error) {
      console.error('Error:', error.response?.data);
      setError(error.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un service Hajj / Omra</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du service *
              </label>
              <input
                type="text"
                name="nomServ"
                value={form.nomServ}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                placeholder="Ex: Hajj 2025 - Formule Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (DH) *
              </label>
              <input
                type="number"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
              >
                <option value="omra">Omra</option>
                <option value="hajj">Hajj</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formule *
              </label>
              <select
                name="formule"
                value={form.formule}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
              >
                <option value="">Sélectionner une formule</option>
                <option value="Économique">Économique</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de départ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="dateDepartHO"
                  value={form.dateDepartHO}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de retour *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="dateRetourHO"
                  value={form.dateRetourHO}
                  onChange={handleChange}
                  required
                  min={form.dateDepartHO || today}
                  disabled={!form.dateDepartHO}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Duration Display */}
          {calculatedDuree && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Clock size={18} className="inline mr-2 text-blue-600" />
              <span className="text-sm text-blue-700">
                Durée du séjour: <strong>{calculatedDuree}</strong>
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de chambre *
            </label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="typeChambre"
                value={form.typeChambre}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
              >
                <option value="">Sélectionner</option>
                <option value="Simple">Simple (1 personne)</option>
                <option value="Double">Double (2 personnes)</option>
                <option value="Triple">Triple (3 personnes)</option>
                <option value="Quadruple">Quadruple (4 personnes)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
              placeholder="Détails du programme, services inclus..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
                <Upload size={18} />
                <span>Choisir une image</span>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              )}
            </div>
            
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-md border" />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formats supportés: JPG, PNG, GIF (max 2MB)
            </p>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le service"}
            </button>
            <Link 
              to="/admin/hajj-omras" 
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