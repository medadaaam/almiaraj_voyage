import { useState, useEffect } from "react";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, Globe, X, Calendar, Clock, Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function AjouterVoyage() {
  const { getDestination, destinations } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    getDestination();
  }, []);
  
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    destination_id: "",
    dateDepartV: "",
    dateRetourV: "",
    programme: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  
  // Destination selection states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  // Duration calculation
  const [calculatedDuree, setCalculatedDuree] = useState("");
  const today = new Date().toISOString().split('T')[0];

  // Calculate duration
  useEffect(() => {
    if (form.dateDepartV && form.dateRetourV) {
      const depart = new Date(form.dateDepartV);
      const retour = new Date(form.dateRetourV);
      
      if (retour >= depart) {
        const diffTime = Math.abs(retour - depart);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setCalculatedDuree(`${diffDays} jours / ${diffDays - 1} nuits`);
      } else {
        setCalculatedDuree("");
      }
    } else {
      setCalculatedDuree("");
    }
  }, [form.dateDepartV, form.dateRetourV]);

  // Get all destinations (each destination is a city)
  const getAllDestinations = () => {
    if (Array.isArray(destinations)) {
      return destinations;
    }
    return [];
  };

  // Filter destinations based on search term
  const filteredDestinations = getAllDestinations().filter(dest => 
    dest.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.pays?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add destination to selection
  const selectDestination = (dest) => {
    setSelectedDestination(dest);
    setForm({ 
      ...form, 
      destination_id: dest.id 
    });
    setSearchTerm(`${dest.ville}, ${dest.pays}`);
    setShowDropdown(false);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDestination(null);
    setForm({ 
      ...form, 
      destination_id: "" 
    });
    setSearchTerm("");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

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

    // Validations
    if (!form.nomServ.trim()) {
      setError("Veuillez entrer le nom du voyage");
      setIsSubmitting(false);
      return;
    }

    if (!form.prix || parseFloat(form.prix) <= 0) {
      setError("Veuillez entrer un prix valide");
      setIsSubmitting(false);
      return;
    }

    if (!form.destination_id) {
      setError("Veuillez sélectionner une destination");
      setIsSubmitting(false);
      return;
    }

    if (!form.dateDepartV) {
      setError("Veuillez sélectionner une date de départ");
      setIsSubmitting(false);
      return;
    }

    if (!form.dateRetourV) {
      setError("Veuillez sélectionner une date de retour");
      setIsSubmitting(false);
      return;
    }

    if (!form.programme.trim()) {
      setError("Veuillez entrer le programme du voyage");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('destination_id', form.destination_id);
      formData.append('dateDepartV', form.dateDepartV);
      formData.append('dateRetourV', form.dateRetourV);
      formData.append('programme', form.programme);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/voyages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert('Voyage ajouté avec succès!');
        navigate('/admin/voyages');
        
        // Reset form
        setForm({
          nomServ: "",
          description: "",
          prix: "",
          destination_id: "",
          dateDepartV: "",
          dateRetourV: "",
          programme: "",
          image: null,
        });
        setSelectedDestination(null);
        setImagePreview(null);
        setSearchTerm("");
        setCalculatedDuree("");
        
        const fileInput = document.getElementById('image-input');
        if (fileInput) fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Error:', error.response?.data);
      setError(error.response?.data?.message || "Erreur lors de l'ajout du voyage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un voyage</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du voyage *
              </label>
              <input
                type="text"
                name="nomServ"
                value={form.nomServ}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                placeholder="Ex: Aventure à Marrakech"
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

          {/* Single Destination Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination *
            </label>

            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Rechercher une destination (ville ou pays)..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dropdown Results */}
              {showDropdown && searchTerm && filteredDestinations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => selectDestination(dest)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b flex items-center gap-2"
                    >
                      <MapPin size={16} className="text-[#fb923c]" />
                      <div>
                        <div className="font-medium">{dest.ville}</div>
                        <div className="text-xs text-gray-500">
                          {dest.pays} • {dest.continente}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && searchTerm && filteredDestinations.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500">
                  Aucune destination trouvée pour "{searchTerm}"
                </div>
              )}
            </div>

            {/* Selected Destination Display */}
            {selectedDestination && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>Destination sélectionnée:</strong> {selectedDestination.ville}, {selectedDestination.pays}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de départ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="dateDepartV"
                  value={form.dateDepartV}
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
                  name="dateRetourV"
                  value={form.dateRetourV}
                  onChange={handleChange}
                  required
                  min={form.dateDepartV || today}
                  disabled={!form.dateDepartV}
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
                Durée: <strong>{calculatedDuree}</strong>
              </span>
            </div>
          )}

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
              placeholder="Une brève description du voyage..."
            />
          </div>

          {/* Programme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programme / Itinéraire *
            </label>
            <textarea
              name="programme"
              value={form.programme}
              onChange={handleChange}
              rows="6"
              required
              placeholder="Jour 1: Arrivée...&#10;Jour 2: Visite...&#10;Jour 3: Excursion...&#10;Jour 4: ..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] font-mono text-sm"
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
            
            <p className="text-xs text-gray-500 mt-2">
              Formats supportés: JPG, PNG, GIF (max 2MB)
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le voyage"}
            </button>
            <Link 
              to="/admin/voyages" 
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