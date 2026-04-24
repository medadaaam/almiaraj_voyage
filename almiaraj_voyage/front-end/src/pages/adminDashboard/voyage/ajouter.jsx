import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, Globe, X, Calendar, Clock } from "lucide-react";

export default function AjouterVoyage() {
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
  
  // States pour la sélection de destination
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  // Calcul automatique de la durée
  const [calculatedDuree, setCalculatedDuree] = useState("");

  const today = new Date().toISOString().split('T')[0];

  // Charger toutes les destinations au montage
  useEffect(() => {
    fetchAllDestinations();
  }, []);

  // Calculer la durée quand les dates changent
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

  const fetchAllDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const response = await axiosClient.get('/destinations');
      console.log('Destinations chargées:', response.data);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setError('Erreur lors du chargement des destinations');
    } finally {
      setLoadingDestinations(false);
    }
  };

  const searchDestinations = async (term) => {
    if (term.length === 0) {
      fetchAllDestinations();
      return;
    }
    
    try {
      const response = await axiosClient.get(`/destinations/search?q=${term}`);
      setDestinations(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching destinations:', error);
    }
  };

  const handleDestinationSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      searchDestinations(term);
    } else {
      fetchAllDestinations();
      setShowDropdown(false);
    }
  };

  const handleSelectDestination = (destination) => {
    setSelectedDestination(destination);
    setForm({
      ...form,
      destination_id: destination.id
    });
    setSearchTerm(`${destination.nom}, ${destination.pays}`);
    setShowDropdown(false);
  };

  const clearDestination = () => {
    setSelectedDestination(null);
    setForm({
      ...form,
      destination_id: ""
    });
    setSearchTerm("");
    fetchAllDestinations();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (validTypes.includes(file.type)) {
          setForm({ ...form, image: file });
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
        } else {
          alert('Veuillez sélectionner une image valide (JPEG, PNG, JPG, GIF)');
          e.target.value = '';
        }
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validation
    if (parseFloat(form.prix) <= 0) {
      setError("Le prix doit être supérieur à 0");
      setIsSubmitting(false);
      return;
    }

    if (!form.destination_id) {
      setError("Veuillez sélectionner une destination");
      setIsSubmitting(false);
      return;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const departDate = new Date(form.dateDepartV);
    
    if (departDate < todayDate) {
      setError("La date de départ ne peut pas être dans le passé");
      setIsSubmitting(false);
      return;
    }
    
    const retourDate = new Date(form.dateRetourV);
    if (retourDate <= departDate) {
      setError("La date de retour doit être après la date de départ");
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
        }
      });
      
      alert('Voyage ajouté avec succès!');
      
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
      setImagePreview(null);
      setSearchTerm("");
      setSelectedDestination(null);
      setCalculatedDuree("");
      
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout du voyage');
      }
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
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
              />
            </div>
          </div>

          {/* Destination Selection avec recherche */}
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
                  onChange={handleDestinationSearch}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Rechercher une destination par ville ou pays..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearDestination}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dropdown results */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {loadingDestinations ? (
                    <div className="p-4 text-center text-gray-500">
                      Chargement...
                    </div>
                  ) : destinations.length > 0 ? (
                    destinations.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => handleSelectDestination(dest)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 transition-colors"
                      >
                        <MapPin size={16} className="text-[#fb923c]" />
                        <div>
                          <div className="font-medium">{dest.nom}</div>
                          <div className="text-xs text-gray-500">{dest.pays}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Aucune destination trouvée
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected destination display */}
            {selectedDestination && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    Destination sélectionnée: {selectedDestination.nom}, {selectedDestination.pays}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearDestination}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
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

          {/* Durée calculée automatiquement */}
          {calculatedDuree && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                <span className="text-sm text-blue-700">
                  Durée: <strong>{calculatedDuree}</strong>
                </span>
              </div>
            </div>
          )}

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
            />
          </div>

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
              placeholder="Jour 1: Arrivée à Casablanca...&#10;Jour 2: Visite de Rabat...&#10;Jour 3: ..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input 
              type="file" 
              name="image" 
              onChange={handleChange}
              accept="image/jpeg,image/png,image/jpg,image/gif"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </button>
            <Link 
              to="/admin" 
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