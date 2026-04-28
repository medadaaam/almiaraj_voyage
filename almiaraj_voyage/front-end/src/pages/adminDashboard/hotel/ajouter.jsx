import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, Globe, X, Upload, Trash2, Star, Wifi, Coffee, Car, Dumbbell, Utensils, Sparkles, Wind, PawPrint, Clock as ClockIcon, Sun, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AjouterHotel() {
  const { getDestination, destinations } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    getDestination();
  }, []);
  
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    rating: 0,
    destination_id: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  
  // Destination selection states (same as AjouterVoyage)
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  // Common amenities list with icons
  const amenitiesList = [
    { name: "Wifi gratuit", icon: <Wifi size={18} />, category: "Internet" },
    { name: "Petit-déjeuner", icon: <Coffee size={18} />, category: "Repas" },
    { name: "Parking gratuit", icon: <Car size={18} />, category: "Transport" },
    { name: "Piscine", icon: <Sun size={18} />, category: "Loisirs" },
    { name: "Climatisation", icon: <Wind size={18} />, category: "Confort" },
    { name: "Salle de sport", icon: <Dumbbell size={18} />, category: "Loisirs" },
    { name: "Spa", icon: <Sparkles size={18} />, category: "Bien-être" },
    { name: "Restaurant", icon: <Utensils size={18} />, category: "Repas" },
    { name: "Service d'étage", icon: <Coffee size={18} />, category: "Service" },
    { name: "Réception 24/7", icon: <ClockIcon size={18} />, category: "Service" },
    { name: "Animaux acceptés", icon: <PawPrint size={18} />, category: "Service" },
    { name: "Familles", icon: <Users size={18} />, category: "Service" },
    { name: "Chambres non-fumeurs", icon: <Wind size={18} />, category: "Confort" },
    { name: "Terrasse", icon: <Sun size={18} />, category: "Loisirs" },
    { name: "Jardin", icon: <Sun size={18} />, category: "Loisirs" },
    { name: "Transfert aéroport", icon: <Car size={18} />, category: "Transport" }
  ];

  // Group amenities by category
  const amenitiesByCategory = amenitiesList.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {});

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Get all destinations (each destination is a city) - SAME AS AjouterVoyage
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

  // Select destination (city)
  const selectDestination = (dest) => {
    setSelectedDestination(dest);
    setForm({ 
      ...form, 
      destination_id: dest.id,
    });
    setSearchTerm(`${dest.ville}, ${dest.pays}`);
    setShowDropdown(false);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDestination(null);
    setForm({ 
      ...form, 
      destination_id: "",
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

  // Handle rating
  const handleRatingChange = (rating) => {
    setForm({ ...form, rating });
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity) => {
    if (selectedAmenities.some(a => a.name === amenity.name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a.name !== amenity.name));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Clear all amenities
  const clearAllAmenities = () => {
    setSelectedAmenities([]);
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
    setError("Veuillez entrer le nom de l'hôtel");
    setIsSubmitting(false);
    return;
  }

  if (!form.prix || parseFloat(form.prix) <= 0) {
    setError("Veuillez entrer un prix valide");
    setIsSubmitting(false);
    return;
  }

  if (!form.destination_id) {
    setError("Veuillez sélectionner une ville");
    setIsSubmitting(false);
    return;
  }

  if (selectedAmenities.length === 0) {
    setError("Veuillez sélectionner au moins un équipement");
    setIsSubmitting(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append('nomServ', form.nomServ);
    formData.append('description', form.description || '');
    formData.append('prix', form.prix);
    formData.append('rating', form.rating);
    formData.append('destination_id', form.destination_id);
    
    // Convert amenities array to JSON string - make sure it's properly formatted
    const amenitiesArray = selectedAmenities.map(amenity => amenity.name);
    const amenitiesJSON = JSON.stringify(amenitiesArray);
    console.log('Sending amenities as JSON:', amenitiesJSON);
    formData.append('amenities', amenitiesJSON);
    
    if (form.image) {
      formData.append('image', form.image);
    }

    // Debug: Log all form data
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const response = await axiosClient.post('/hotels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      alert('Hôtel ajouté avec succès!');
      navigate('/admin/hotels');
      
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        rating: 0,
        destination_id: "",
        image: null,
      });
      setSelectedAmenities([]);
      setSelectedDestination(null);
      setImagePreview(null);
      setSearchTerm("");
      
      const fileInput = document.getElementById('image-input');
      if (fileInput) fileInput.value = '';
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un hôtel</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'hôtel *
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
                Prix par nuit (DH) *
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
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note / Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= form.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {form.rating} / 5
              </span>
            </div>
          </div>

          {/* Destination/City Selection - EXACT SAME PATTERN as AjouterVoyage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville de l'hôtel *
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
                  placeholder="Rechercher une ville (ex: Casablanca, Marrakech, Paris...)"
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
                  Aucune ville trouvée pour "{searchTerm}"
                </div>
              )}
            </div>

            {/* Selected Destination Display */}
            {selectedDestination && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>Ville sélectionnée:</strong> {selectedDestination.ville}, {selectedDestination.pays}
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

          {/* Amenities Selection - Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements & Services * (Sélectionnez plusieurs)
            </label>

            {selectedAmenities.length > 0 && (
              <div className="mb-3 p-2 bg-blue-50 rounded-md flex justify-between items-center">
                <span className="text-sm text-blue-700">
                  {selectedAmenities.length} équipement(s) sélectionné(s)
                </span>
                <button
                  type="button"
                  onClick={clearAllAmenities}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Tout effacer
                </button>
              </div>
            )}

            <div className="border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
              {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                <div key={category} className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">{category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {amenities.map((amenity) => (
                      <label
                        key={amenity.name}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.some(a => a.name === amenity.name)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-[#fb923c] focus:ring-[#fb923c]"
                        />
                        <span className="flex items-center gap-2 text-sm">
                          {amenity.icon}
                          {amenity.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              💡 Cochez tous les équipements et services disponibles dans cet hôtel
            </p>
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
              placeholder="Décrivez l'hôtel, ses atouts, sa localisation..."
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
              {isSubmitting ? "Ajout en cours..." : "Ajouter l'hôtel"}
            </button>
            <Link 
              to="/admin/hotels" 
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