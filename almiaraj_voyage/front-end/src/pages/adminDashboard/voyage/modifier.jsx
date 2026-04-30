import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, X, Calendar, Clock, Upload, Trash2, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ModifierVoyage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDestination, destinations } = useAuth();
    
    // Ref for click outside detection
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        getDestination();
        fetchVoyageDetails();
    }, [id]);
    
    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState("");
    
    // Destination selection states (single city)
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    
    // Duration calculation
    const [calculatedDuree, setCalculatedDuree] = useState("");
    const today = new Date().toISOString().split('T')[0];

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${imagePath}`;
    };

    const fetchVoyageDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(`/voyages/${id}`);
            
            let voyageData = response.data.data || response.data;
            let serviceData = voyageData.service || voyageData;
            let voyageDetails = voyageData.voyage || voyageData;
            
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
            
            if (serviceData.image) {
                setCurrentImage(serviceData.image);
            }
            
            // Set selected destination
            if (voyageDetails.destination) {
                setSelectedDestination(voyageDetails.destination);
                setSearchTerm(`${voyageDetails.destination.ville}, ${voyageDetails.destination.pays}`);
            } else if (voyageDetails.destination_id) {
                // Find destination from list
                const dest = getAllDestinations().find(d => d.id === voyageDetails.destination_id);
                if (dest) {
                    setSelectedDestination(dest);
                    setSearchTerm(`${dest.ville}, ${dest.pays}`);
                }
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

    // Get all destinations (each destination has a 'ville' property)
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

    const selectDestination = (dest) => {
        setSelectedDestination(dest);
        setForm({ ...form, destination_id: dest.id });
        setSearchTerm(`${dest.ville}, ${dest.pays}`);
        setShowDropdown(false);
    };

    const clearSelection = () => {
        setSelectedDestination(null);
        setForm({ ...form, destination_id: "" });
        setSearchTerm("");
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
            formData.append('_method', 'PUT');
            
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
            console.error('Error:', error);
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

                    {/* Destination/City Selection - Single */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Destination *
                        </label>
                        <div ref={dropdownRef} className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                    }}
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
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                        </div>

                        {/* Selected Destination Display */}
                        {selectedDestination && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-green-600" />
                                    <span className="text-sm text-green-700">
                                        <strong>Destination:</strong> {selectedDestination.ville}, {selectedDestination.pays}
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
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Duration */}
                    {calculatedDuree && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <Clock size={18} className="inline mr-2 text-blue-600" />
                            <span className="text-sm text-blue-700">Durée: <strong>{calculatedDuree}</strong></span>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] font-mono text-sm"
                            placeholder="Jour 1: Arrivée...&#10;Jour 2: Visite...&#10;Jour 3: Excursion...&#10;Jour 4: ..."
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
                        
                        {(imagePreview || currentImage) && (
                            <div className="mt-3">
                                <img 
                                    src={imagePreview || getImageUrl(currentImage)} 
                                    alt="Preview" 
                                    className="w-40 h-40 object-cover rounded-md border" 
                                />
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Laissez vide pour conserver l'image actuelle
                        </p>
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