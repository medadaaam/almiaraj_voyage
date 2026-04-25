import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, Globe, X, Upload, Trash2, Star, Wifi, Coffee, Car, Dumbbell, Utensils, Sparkles, Wind, PawPrint, Clock as ClockIcon, Sun, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AjouterHotel() {
  const { getDestination, destinations } = useAuth();
  
  useEffect(() => {
    getDestination();
  }, []);
  
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    rating: 0,
    destination_id: "",
    selectedCity: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  
  // City selection states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  
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

  // Get all cities from all destinations
  const getAllCities = () => {
    const cities = [];
    if (Array.isArray(destinations)) {
      destinations.forEach(dest => {
        if (Array.isArray(dest.villes)) {
          dest.villes.forEach(ville => {
            cities.push({
              id: `${dest.id}_${ville}`,
              cityName: ville,
              country: dest.pays,
              continent: dest.continente,
              destinationId: dest.id,
              destination: dest
            });
          });
        }
      });
    }
    return cities;
  };

  // Filter cities based on search term
  const filteredCities = getAllCities().filter(city => 
    city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle city selection
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setForm({ 
      ...form, 
      destination_id: city.destinationId,
      selectedCity: city.cityName
    });
    setSearchTerm(`${city.cityName}, ${city.country}`);
    setShowDropdown(false);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedCity(null);
    setForm({ 
      ...form, 
      destination_id: "",
      selectedCity: ""
    });
    setSearchTerm("");
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
      formData.append('selected_city', form.selectedCity);
      
      const amenitiesArray = selectedAmenities.map(amenity => amenity.name);
      formData.append('amenities', JSON.stringify(amenitiesArray));
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert('Hôtel ajouté avec succès!');
        
        setForm({
          nomServ: "",
          description: "",
          prix: "",
          rating: 0,
          destination_id: "",
          selectedCity: "",
          image: null,
        });
        setSelectedAmenities([]);
        setSelectedCity(null);
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

          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville de l'hôtel *
            </label>

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

              {/* Dropdown results */}
              {showDropdown && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 transition-colors"
                      >
                        <MapPin size={16} className="text-[#fb923c]" />
                        <div>
                          <div className="font-medium">{city.cityName}</div>
                          <div className="text-xs text-gray-500">
                            {city.country} • {city.continent}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Aucune ville trouvée pour "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedCity && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>Ville sélectionnée:</strong> {selectedCity.cityName}, {selectedCity.country}
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