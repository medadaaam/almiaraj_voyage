import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, X, Calendar, Clock, Upload, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ModifierVoyage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDestination, destinations } = useAuth();
    
    useEffect(() => {
        getDestination();
        fetchVoyageDetails();
    }, [id]);
    
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
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState("");
    
    // City selection states
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);
    
    // Duration calculation
    const [calculatedDuree, setCalculatedDuree] = useState("");
    const today = new Date().toISOString().split('T')[0];

    // Same image function as index.jsx
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${imagePath}`;
    };

    // Fetch voyage details
    const fetchVoyageDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(`/voyages/${id}`);
            
            let voyageData = response.data.data || response.data;
            let serviceData = voyageData.service || voyageData;
            let voyageDetails = voyageData.voyage || voyageData;
            
            // Set form data
            setForm({
                nomServ: serviceData.nomServ || "",
                description: serviceData.description || "",
                prix: serviceData.prix || "",
                destination_id: voyageDetails.destination_id || "",
                dateDepartV: voyageDetails.dateDepartV || "",
                dateRetourV: voyageDetails.dateRetourV || "",
                programme: voyageDetails.programme || "",
                image: null,
            });
            
            // Set current image
            if (serviceData.image) {
                setCurrentImage(serviceData.image);
            }
            
            // Set selected cities
            if (voyageDetails.selected_cities && Array.isArray(voyageDetails.selected_cities)) {
                const cities = voyageDetails.selected_cities.map(city => ({
                    cityName: city,
                    destinationId: voyageDetails.destination_id
                }));
                setSelectedCities(cities);
            }
            
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement du voyage");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate duration
    useEffect(() => {
        if (form.dateDepartV && form.dateRetourV) {
            const depart = new Date(form.dateDepartV);
            const retour = new Date(form.dateRetourV);
            
            if (retour >= depart) {
                const diffDays = Math.ceil((retour - depart) / (1000 * 60 * 60 * 24));
                setCalculatedDuree(`${diffDays} jours / ${diffDays - 1} nuits`);
            } else {
                setCalculatedDuree("");
            }
        }
    }, [form.dateDepartV, form.dateRetourV]);

    // Get all cities
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

    // Filter cities
    const filteredCities = getAllCities().filter(city => 
        city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(city => 
        !selectedCities.some(selected => selected.cityName === city.cityName)
    );

    const addCity = (city) => {
        const newSelectedCities = [...selectedCities, city];
        setSelectedCities(newSelectedCities);
        
        if (!form.destination_id) {
            setForm({ ...form, destination_id: city.destinationId });
        }
        
        setSearchTerm("");
        setShowDropdown(false);
    };

    const removeCity = (cityToRemove) => {
        const newSelectedCities = selectedCities.filter(city => city.cityName !== cityToRemove.cityName);
        setSelectedCities(newSelectedCities);
        
        if (newSelectedCities.length === 0) {
            setForm({ ...form, destination_id: "" });
        }
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
        setCurrentImage(null);
        const fileInput = document.getElementById('image-input');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

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

        if (selectedCities.length === 0) {
            setError("Veuillez sélectionner au moins une ville");
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nomServ', form.nomServ);
            formData.append('description', form.description || '');
            formData.append('prix', form.prix);
            formData.append('destination_id', form.destination_id);
            formData.append('_method', 'PUT');
            
            const citiesArray = selectedCities.map(city => city.cityName);
            formData.append('selected_cities', JSON.stringify(citiesArray));
            
            formData.append('dateDepartV', form.dateDepartV);
            formData.append('dateRetourV', form.dateRetourV);
            formData.append('programme', form.programme);
            
            if (form.image) {
                formData.append('image', form.image);
            }

            const response = await axiosClient.post(`/voyages/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                alert('Voyage modifié avec succès!');
                navigate('/admin/voyages');
            }
            
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la modification");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier le voyage</h2>

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
                            />
                        </div>
                    </div>

                    {/* Cities Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Villes à visiter *
                        </label>

                        {/* Selected cities tags */}
                        {selectedCities.length > 0 && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-md">
                                <div className="flex flex-wrap gap-2">
                                    {selectedCities.map((city, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                            <MapPin size={14} />
                                            {city.cityName}
                                            <button type="button" onClick={() => removeCity(city)} className="ml-1 hover:text-red-700">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Rechercher une ville..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                            />
                            
                            {showDropdown && searchTerm && filteredCities.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredCities.map((city) => (
                                        <button
                                            key={city.id}
                                            type="button"
                                            onClick={() => addCity(city)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b flex items-center justify-between"
                                        >
                                            <span>{city.cityName} ({city.country})</span>
                                            <Plus size={16} className="text-green-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de départ *
                            </label>
                            <input
                                type="date"
                                name="dateDepartV"
                                value={form.dateDepartV}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de retour *
                            </label>
                            <input
                                type="date"
                                name="dateRetourV"
                                value={form.dateRetourV}
                                onChange={handleChange}
                                required
                                min={form.dateDepartV || today}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    {calculatedDuree && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <Clock size={18} className="inline mr-2 text-blue-600" />
                            <span className="text-sm">Durée: <strong>{calculatedDuree}</strong></span>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Image - SIMPLE like index.jsx */}
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
                            {(imagePreview || currentImage) && (
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
                        
                        {/* Image preview - SIMPLE */}
                        {(imagePreview || currentImage) && (
                            <div className="mt-3">
                                <img 
                                    src={imagePreview || getImageUrl(currentImage)} 
                                    alt="Preview" 
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Modification..." : "Mettre à jour"}
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