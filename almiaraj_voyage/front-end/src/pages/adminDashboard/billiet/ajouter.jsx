import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, X, Calendar, Upload, Trash2, Plane } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AjouterBillet() {
  const navigate = useNavigate();
  const { getDestination, destinations } = useAuth();
  
  useEffect(() => {
    getDestination();
  }, []);
  
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    typeBi: "aller_retour",
    villeDepartBi: "",
    villeArriveeBi: "",
    destination_id: "",
    dateDepartBi: "",
    dateRetourBi: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  
  const [searchDepartureTerm, setSearchDepartureTerm] = useState("");
  const [searchArrivalTerm, setSearchArrivalTerm] = useState("");
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
  const [selectedDepartureCity, setSelectedDepartureCity] = useState(null);
  const [selectedArrivalCity, setSelectedArrivalCity] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];

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
              destinationId: dest.id,
            });
          });
        }
      });
    }
    return cities;
  };

  const filteredDepartureCities = getAllCities().filter(city => 
    city.cityName.toLowerCase().includes(searchDepartureTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchDepartureTerm.toLowerCase())
  );

  const filteredArrivalCities = getAllCities().filter(city => 
    city.cityName.toLowerCase().includes(searchArrivalTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchArrivalTerm.toLowerCase())
  ).filter(city => city.cityName !== form.villeDepartBi);

  const handleSelectDepartureCity = (city) => {
    setSelectedDepartureCity(city);
    setForm({ 
      ...form, 
      villeDepartBi: city.cityName,
      destination_id: city.destinationId
    });
    setSearchDepartureTerm(`${city.cityName}, ${city.country}`);
    setShowDepartureDropdown(false);
  };

  const handleSelectArrivalCity = (city) => {
    setSelectedArrivalCity(city);
    setForm({ ...form, villeArriveeBi: city.cityName });
    setSearchArrivalTerm(`${city.cityName}, ${city.country}`);
    setShowArrivalDropdown(false);
  };

  const clearDepartureCity = () => {
    setSelectedDepartureCity(null);
    setForm({ 
      ...form, 
      villeDepartBi: "",
      destination_id: "",
      villeArriveeBi: ""
    });
    setSelectedArrivalCity(null);
    setSearchDepartureTerm("");
    setSearchArrivalTerm("");
  };

  const clearArrivalCity = () => {
    setSelectedArrivalCity(null);
    setForm({ ...form, villeArriveeBi: "" });
    setSearchArrivalTerm("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!form.nomServ.trim()) {
      setError("Veuillez entrer le nom du billet");
      setIsSubmitting(false);
      return;
    }

    if (!form.prix || parseFloat(form.prix) <= 0) {
      setError("Veuillez entrer un prix valide");
      setIsSubmitting(false);
      return;
    }

    if (!form.villeDepartBi) {
      setError("Veuillez sélectionner une ville de départ");
      setIsSubmitting(false);
      return;
    }

    if (!form.villeArriveeBi) {
      setError("Veuillez sélectionner une ville d'arrivée");
      setIsSubmitting(false);
      return;
    }

    if (!form.dateDepartBi) {
      setError("Veuillez sélectionner une date de départ");
      setIsSubmitting(false);
      return;
    }

    if (form.typeBi === "aller_retour" && !form.dateRetourBi) {
      setError("Veuillez sélectionner une date de retour");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('typeBi', form.typeBi);
      formData.append('villeDepartBi', form.villeDepartBi);
      formData.append('villeArriveeBi', form.villeArriveeBi);
      formData.append('destination_id', form.destination_id);
      formData.append('dateDepartBi', form.dateDepartBi);
      if (form.dateRetourBi) {
        formData.append('dateRetourBi', form.dateRetourBi);
      }
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/billets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert('Billet ajouté avec succès!');
        navigate('/admin/billets');
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un billet</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du billet *
              </label>
              <input
                type="text"
                name="nomServ"
                value={form.nomServ}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                placeholder="Ex: Vol Casablanca - Paris"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de billet *
            </label>
            <select
              name="typeBi"
              value={form.typeBi}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
            >
              <option value="aller_simple">Aller simple</option>
              <option value="aller_retour">Aller-retour</option>
            </select>
          </div>

          {/* Departure City Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville de départ *
            </label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchDepartureTerm}
                  onChange={(e) => {
                    setSearchDepartureTerm(e.target.value);
                    setShowDepartureDropdown(true);
                  }}
                  onFocus={() => setShowDepartureDropdown(true)}
                  placeholder="Rechercher une ville de départ..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
                {searchDepartureTerm && (
                  <button
                    type="button"
                    onClick={clearDepartureCity}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {showDepartureDropdown && searchDepartureTerm && filteredDepartureCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredDepartureCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectDepartureCity(city)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      <MapPin size={16} className="text-[#fb923c]" />
                      <div>
                        <div className="font-medium">{city.cityName}</div>
                        <div className="text-xs text-gray-500">{city.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDepartureCity && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    Départ: {selectedDepartureCity.cityName}, {selectedDepartureCity.country}
                  </span>
                </div>
                <button type="button" onClick={clearDepartureCity} className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Arrival City Selection - Always visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville d'arrivée *
            </label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchArrivalTerm}
                  onChange={(e) => {
                    setSearchArrivalTerm(e.target.value);
                    setShowArrivalDropdown(true);
                  }}
                  onFocus={() => setShowArrivalDropdown(true)}
                  placeholder="Rechercher une ville d'arrivée..."
                  disabled={!form.villeDepartBi}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] disabled:bg-gray-100"
                />
                {searchArrivalTerm && (
                  <button
                    type="button"
                    onClick={clearArrivalCity}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {showArrivalDropdown && searchArrivalTerm && filteredArrivalCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredArrivalCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectArrivalCity(city)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      <MapPin size={16} className="text-[#fb923c]" />
                      <div>
                        <div className="font-medium">{city.cityName}</div>
                        <div className="text-xs text-gray-500">{city.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedArrivalCity && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    Arrivée: {selectedArrivalCity.cityName}, {selectedArrivalCity.country}
                  </span>
                </div>
                <button type="button" onClick={clearArrivalCity} className="text-red-500 hover:text-red-700">
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
                  name="dateDepartBi"
                  value={form.dateDepartBi}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de retour {form.typeBi === "aller_retour" && "*"}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="dateRetourBi"
                  value={form.dateRetourBi}
                  onChange={handleChange}
                  min={form.dateDepartBi || today}
                  disabled={form.typeBi !== "aller_retour"}
                  required={form.typeBi === "aller_retour"}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] disabled:bg-gray-100"
                />
              </div>
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
              placeholder="Détails du billet, services inclus..."
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
              {isSubmitting ? "Ajout en cours..." : "Ajouter le billet"}
            </button>
            <Link 
              to="/admin/billets" 
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