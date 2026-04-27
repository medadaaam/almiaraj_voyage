import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Search, MapPin, X, Upload, Trash2, Plus, Star, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ModifierHotel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDestination, destinations } = useAuth();
    
    useEffect(() => {
        getDestination();
        fetchHotelDetails();
    }, [id]);
    
    const [form, setForm] = useState({
        nomServ: "",
        description: "",
        prix: "",
        rating: 0,
        destination_id: "",
        image: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState("");
    
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [currentDestination, setCurrentDestination] = useState(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${imagePath}`;
    };

    const commonAmenities = [
        "Wifi gratuit", "Piscine", "Parking gratuit", "Climatisation",
        "Petit-déjeuner", "Salle de sport", "Spa", "Restaurant",
        "Service d'étage", "Réception 24/7", "Animaux acceptés", "Familles"
    ];

    const getAllAmenities = () => {
        return commonAmenities.map(amenity => ({ amenityName: amenity }));
    };

    const filteredAmenities = getAllAmenities().filter(amenity => 
        amenity.amenityName.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(amenity => 
        !selectedAmenities.some(selected => selected.amenityName === amenity.amenityName)
    );

    const fetchHotelDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(`/hotels/${id}`);
            
            let hotelData = response.data.data || response.data;
            let serviceData = hotelData.service || hotelData;
            let hotelDetails = hotelData.hotel || hotelData;
            
            setForm({
                nomServ: serviceData.nomServ || "",
                description: serviceData.description || "",
                prix: serviceData.prix || "",
                rating: serviceData.rating || 0,
                destination_id: hotelDetails.destination_id || "",
                image: null,
            });
            
            if (serviceData.image) {
                setCurrentImage(serviceData.image);
            }
            
            if (hotelDetails.amenities && Array.isArray(hotelDetails.amenities)) {
                const amenities = hotelDetails.amenities.map(amenity => ({ amenityName: amenity }));
                setSelectedAmenities(amenities);
            }
            
            if (hotelDetails.destination) {
                setCurrentDestination(hotelDetails.destination);
                setSearchTerm(hotelDetails.destination.pays);
            }
            
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement");
        } finally {
            setIsLoading(false);
        }
    };

    const addAmenity = (amenity) => {
        setSelectedAmenities([...selectedAmenities, amenity]);
        setSearchTerm("");
        setShowDropdown(false);
    };

    const removeAmenity = (amenityToRemove) => {
        setSelectedAmenities(selectedAmenities.filter(amenity => amenity.amenityName !== amenityToRemove.amenityName));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleRatingChange = (rating) => {
        setForm({ ...form, rating });
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
            setError("Veuillez entrer le nom");
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
            formData.append('_method', 'PUT');
            
            const amenitiesArray = selectedAmenities.map(amenity => amenity.amenityName);
            formData.append('amenities', JSON.stringify(amenitiesArray));
            
            if (form.image) {
                formData.append('image', form.image);
            }

            const response = await axiosClient.post(`/hotels/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                alert('Hôtel modifié avec succès!');
                navigate('/admin/hotels');
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier l'hôtel</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'hôtel *</label>
                            <input type="text" name="nomServ" value={form.nomServ} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#fb923c]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prix par nuit (DH) *</label>
                            <input type="number" name="prix" value={form.prix} onChange={handleChange} required min="0" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#fb923c]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note / Rating</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
                                    <Star size={24} className={`${star <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">{form.rating} / 5</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                        <div className="relative">
                            <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} placeholder="Rechercher..." className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#fb923c]" />
                            {showDropdown && searchTerm && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {destinations?.filter(dest => dest.pays.toLowerCase().includes(searchTerm.toLowerCase())).map((dest) => (
                                        <button key={dest.id} type="button" onClick={() => { setCurrentDestination(dest); setForm({ ...form, destination_id: dest.id }); setSearchTerm(dest.pays); setShowDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b">
                                            {dest.pays}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {currentDestination && <div className="mt-2 p-2 bg-green-50 border rounded-md">✓ {currentDestination.pays}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Équipements & Services *</label>
                        {selectedAmenities.length > 0 && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-md">
                                <div className="flex flex-wrap gap-2">
                                    {selectedAmenities.map((amenity, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                            {amenity.amenityName}
                                            <button type="button" onClick={() => removeAmenity(amenity)} className="ml-1 hover:text-red-700"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="relative">
                            <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} placeholder="Ajouter un équipement..." className="w-full px-3 py-2 border rounded-md" />
                            {showDropdown && searchTerm && filteredAmenities.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredAmenities.map((amenity) => (
                                        <button key={amenity.amenityName} type="button" onClick={() => addAmenity(amenity)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b flex justify-between">
                                            <span>{amenity.amenityName}</span>
                                            <Plus size={16} className="text-green-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-md" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
                                <Upload size={18} /><span>Choisir une image</span>
                                <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            {(imagePreview || currentImage) && <button type="button" onClick={removeImage} className="text-red-500"><Trash2 size={18} /> Supprimer</button>}
                        </div>
                        {(imagePreview || currentImage) && (
                            <div className="mt-3"><img src={imagePreview || getImageUrl(currentImage)} alt="Preview" className="w-32 h-32 object-cover rounded-md border" /></div>
                        )}
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50" disabled={isSubmitting}>
                            {isSubmitting ? "Modification..." : "Mettre à jour"}
                        </button>
                        <Link to="/admin/hotels" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}