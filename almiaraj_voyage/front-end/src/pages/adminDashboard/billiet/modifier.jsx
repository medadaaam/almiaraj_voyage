import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Upload, Trash2, Plane, MapPin } from "lucide-react";

export default function ModifierBillet() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        nomServ: "",
        description: "",
        prix: "",
        typeBi: "aller_retour",
        villeDepartBi: "",
        destinationBi: "",
        dateDepartBi: "",
        dateRetourBi: "",
        image: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState("");
    const today = new Date().toISOString().split('T')[0];

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${imagePath}`;
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(`/billets/${id}`);
            
            let itemData = response.data.data || response.data;
            let serviceData = itemData.service || itemData;
            let detailsData = itemData.billet || itemData;
            
            setForm({
                nomServ: serviceData.nomServ || "",
                description: serviceData.description || "",
                prix: serviceData.prix || "",
                typeBi: detailsData.typeBi || "aller_retour",
                villeDepartBi: detailsData.villeDepartBi || "",
                destinationBi: detailsData.destinationBi || "",
                dateDepartBi: detailsData.dateDepartBi || "",
                dateRetourBi: detailsData.dateRetourBi || "",
                image: null,
            });
            
            if (serviceData.image) {
                setCurrentImage(serviceData.image);
            }
            
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement");
        } finally {
            setIsLoading(false);
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
            setError("Veuillez entrer le nom du billet");
            setIsSubmitting(false);
            return;
        }

        if (!form.prix || parseFloat(form.prix) <= 0) {
            setError("Veuillez entrer un prix valide");
            setIsSubmitting(false);
            return;
        }

        if (!form.villeDepartBi.trim()) {
            setError("Veuillez entrer la ville de départ");
            setIsSubmitting(false);
            return;
        }

        if (!form.destinationBi.trim()) {
            setError("Veuillez entrer la destination");
            setIsSubmitting(false);
            return;
        }

        if (!form.dateDepartBi) {
            setError("Veuillez sélectionner une date de départ");
            setIsSubmitting(false);
            return;
        }

        if (form.typeBi === "aller_retour" && !form.dateRetourBi) {
            setError("Veuillez sélectionner une date de retour pour un billet aller-retour");
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
            formData.append('destinationBi', form.destinationBi);
            formData.append('dateDepartBi', form.dateDepartBi);
            if (form.dateRetourBi) {
                formData.append('dateRetourBi', form.dateRetourBi);
            }
            formData.append('_method', 'PUT');
            
            if (form.image) {
                formData.append('image', form.image);
            }

            const response = await axiosClient.post(`/billets/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                alert('Billet modifié avec succès!');
                navigate('/admin/billets');
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier le billet</h2>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ville de départ *
                            </label>
                            <div className="relative">
                                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="villeDepartBi"
                                    value={form.villeDepartBi}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Destination *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="destinationBi"
                                    value={form.destinationBi}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                />
                            </div>
                        </div>
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
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de retour
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
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c] disabled:bg-gray-100"
                                />
                            </div>
                            {form.typeBi === "aller_retour" && (
                                <p className="text-xs text-gray-500 mt-1">Requis pour un billet aller-retour</p>
                            )}
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
                                <span>Changer l'image</span>
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
                            Formats supportés: JPG, PNG, GIF (max 2MB)
                        </p>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="bg-[#fb923c] text-white px-6 py-2 rounded-md hover:bg-[#ea580c] transition disabled:opacity-50" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Modification..." : "Mettre à jour"}
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