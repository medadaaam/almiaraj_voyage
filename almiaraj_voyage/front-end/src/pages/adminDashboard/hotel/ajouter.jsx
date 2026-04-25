import { useState } from "react";
import "./ajouter.css";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function AjouterHotel() {
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    villeHotel: "",
    image: null,
    destination_id: ""
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

  // Charger toutes les destinations au montage
  useEffect(() => {
    fetchAllDestinations();
  }, []);

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

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('villeHotel', form.villeHotel);
      formData.append('destination_id', form.destination_id);

      // Only append image if it exists
      if (form.image) {
        formData.append('image', form.image);
      }

      // Log the form data for debugging
      console.log('Sending form data:');
      for (let pair of formData.entries()) {
        if (pair[0] === 'image') {
          console.log(pair[0] + ': ' + pair[1].name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      const response = await axiosClient.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Success:', response.data);

      // Reset form after successful submission
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        villeHotel: "",
        image: null,
        destination_id: ""
      });
      setImagePreview(null);
      setSearchTerm("");
      setSelectedDestination(null);

      alert('Hôtel ajouté avec succès!');

    } catch (error) {
      console.error('Error details:', error.response?.data);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout de l\'hôtel');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter un hotel</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de l'hotel</label>
          <input
            type="text"
            name="nomServ"
            value={form.nomServ}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Prix par nuit (DH)</label>
          <input
            type="number"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            required
          />
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

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/jpeg,image/png,image/jpg,image/gif"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
            </div>
          )}
        </div>

        <div className="btns">
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
          </button>
          <Link to="/admin" className="cancel-btn">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}