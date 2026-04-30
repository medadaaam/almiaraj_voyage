import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, Plane, Calendar, X, Upload, Trash2, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AjouterBillet() {
  const { getAllDestinations, allDestinations, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAllDestinations();
  }, []);

  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    typeBi: "aller_simple",
    villeDepartBi: "",
    villeArriveeBi: "",
    destination_id: "",
    dateDepartBi: "",
    dateRetourBi: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // states depart
  const [departSearch, setDepartSearch] = useState("");
  const [showDepart, setShowDepart] = useState(false);
  const [selectedDepart, setSelectedDepart] = useState(null);

  // states arrivee
  const [arrivalSearch, setArrivalSearch] = useState("");
  const [showArrival, setShowArrival] = useState(false);
  const [selectedArrival, setSelectedArrival] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // get cities
  const cities = Array.isArray(allDestinations) ? allDestinations : [];

  // filter depart
  const filteredDepart = cities.filter((d) => {
    const search = departSearch.toLowerCase();
    return (
      (d.ville || "").toLowerCase().includes(search) ||
      (d.pays || "").toLowerCase().includes(search)
    );
  });

  // filter arrival (exclude depart)
  const filteredArrival = cities.filter((d) => {
    const search = arrivalSearch.toLowerCase();
    const match =
      (d.ville || "").toLowerCase().includes(search) ||
      (d.pays || "").toLowerCase().includes(search);

    if (selectedDepart) {
      return match && d.id !== selectedDepart.id;
    }
    return match;
  });

  // select depart
  const selectDepart = (d) => {
    setSelectedDepart(d);
    setForm({ ...form, villeDepartBi: d.ville, destination_id: d.id });
    setDepartSearch(`${d.ville}, ${d.pays}`);
    setShowDepart(false);
  };

  // select arrival
  const selectArrival = (d) => {
    setSelectedArrival(d);
    setForm({ ...form, villeArriveeBi: d.ville });
    setArrivalSearch(`${d.ville}, ${d.pays}`);
    setShowArrival(false);
  };

  // clear
  const clearDepart = () => {
    setSelectedDepart(null);
    setDepartSearch("");
    setForm({ ...form, villeDepartBi: "", destination_id: "" });
  };

  const clearArrival = () => {
    setSelectedArrival(null);
    setArrivalSearch("");
    setForm({ ...form, villeArriveeBi: "" });
  };

  // prevent same city
  useEffect(() => {
    if (
      selectedDepart &&
      selectedArrival &&
      selectedDepart.id === selectedArrival.id
    ) {
      clearArrival();
    }
  }, [selectedDepart]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleType = (type) => {
    setForm({ ...form, typeBi: type });
    if (type === "aller_simple") {
      setForm((prev) => ({ ...prev, dateRetourBi: "" }));
    }
  };

  // image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

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

      const res = await axiosClient.post("/billets", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        alert("Billet ajouté avec succès!");
        navigate("/admin/billets");
        
        // Reset form
        setForm({
          nomServ: "",
          description: "",
          prix: "",
          typeBi: "aller_simple",
          villeDepartBi: "",
          villeArriveeBi: "",
          destination_id: "",
          dateDepartBi: "",
          dateRetourBi: "",
          image: null,
        });
        setSelectedDepart(null);
        setSelectedArrival(null);
        setImagePreview(null);
        setDepartSearch("");
        setArrivalSearch("");
      }
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Chargement des villes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un billet</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {(!allDestinations || allDestinations.length === 0) && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>Aucune ville disponible. Veuillez d'abord ajouter des destinations.</p>
            <Link to="/admin/ajouterDestination" className="text-yellow-800 underline mt-2 inline-block">
              + Ajouter une destination
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom et Prix */}
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

          {/* Type de billet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de billet *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.typeBi === "aller_simple"}
                  onChange={() => handleType("aller_simple")}
                  className="text-[#fb923c] focus:ring-[#fb923c]"
                />
                <span>Aller simple</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.typeBi === "aller_retour"}
                  onChange={() => handleType("aller_retour")}
                  className="text-[#fb923c] focus:ring-[#fb923c]"
                />
                <span>Aller-retour</span>
              </label>
            </div>
          </div>

          {/* Ville de départ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville de départ *
            </label>
            <div className="relative">
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={departSearch}
                  onChange={(e) => {
                    setDepartSearch(e.target.value);
                    setShowDepart(true);
                  }}
                  onFocus={() => setShowDepart(true)}
                  placeholder="Rechercher une ville de départ..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                  disabled={!allDestinations || allDestinations.length === 0}
                />
                {departSearch && (
                  <button
                    type="button"
                    onClick={clearDepart}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {showDepart && departSearch && filteredDepart.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredDepart.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => selectDepart(d)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      <MapPin size={16} className="text-[#fb923c] flex-shrink-0" />
                      <div>
                        <div className="font-medium">{d.ville}</div>
                        <div className="text-xs text-gray-500">{d.pays}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDepart && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>Départ:</strong> {selectedDepart.ville}, {selectedDepart.pays}
                  </span>
                </div>
                <button type="button" onClick={clearDepart} className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Ville d'arrivée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville d'arrivée *
            </label>
            <div className="relative">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={arrivalSearch}
                  onChange={(e) => {
                    setArrivalSearch(e.target.value);
                    setShowArrival(true);
                  }}
                  onFocus={() => setShowArrival(true)}
                  placeholder="Rechercher une ville d'arrivée..."
                  disabled={!form.villeDepartBi || !allDestinations || allDestinations.length === 0}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] disabled:bg-gray-100"
                />
                {arrivalSearch && (
                  <button
                    type="button"
                    onClick={clearArrival}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {showArrival && arrivalSearch && filteredArrival.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredArrival.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => selectArrival(d)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      <MapPin size={16} className="text-[#fb923c] flex-shrink-0" />
                      <div>
                        <div className="font-medium">{d.ville}</div>
                        <div className="text-xs text-gray-500">{d.pays}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedArrival && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>Arrivée:</strong> {selectedArrival.ville}, {selectedArrival.pays}
                  </span>
                </div>
                <button type="button" onClick={clearArrival} className="text-red-500 hover:text-red-700">
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
                  name="dateDepartBi"
                  value={form.dateDepartBi}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                />
              </div>
            </div>

            {form.typeBi === "aller_retour" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de retour *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="dateRetourBi"
                    value={form.dateRetourBi}
                    onChange={handleChange}
                    min={form.dateDepartBi || today}
                    disabled={!form.dateDepartBi}
                    required={form.typeBi === "aller_retour"}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] disabled:bg-gray-100"
                  />
                </div>
              </div>
            )}
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

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50"
              disabled={isSubmitting || !allDestinations || allDestinations.length === 0}
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