import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Clock, Upload, Trash2, Bed } from "lucide-react";

export default function ModifierHajjOmra() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        nomServ: "",
        description: "",
        prix: "",
        type: "omra",
        formule: "",
        dateDepartHO: "",
        dateRetourHO: "",
        typeChambre: "",
        image: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState("");
    const [calculatedDuree, setCalculatedDuree] = useState("");
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

    useEffect(() => {
        if (form.dateDepartHO && form.dateRetourHO) {
            const depart = new Date(form.dateDepartHO);
            const retour = new Date(form.dateRetourHO);
            if (retour >= depart) {
                const diffDays = Math.ceil((retour - depart) / (1000 * 60 * 60 * 24));
                setCalculatedDuree(`${diffDays} jours / ${diffDays - 1} nuits`);
            } else {
                setCalculatedDuree("");
            }
        }
    }, [form.dateDepartHO, form.dateRetourHO]);

    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(`/hajj-omras/${id}`);
            
            let itemData = response.data.data || response.data;
            let serviceData = itemData.service || itemData;
            let detailsData = itemData.hajj_omra || itemData;
            
            setForm({
                nomServ: serviceData.nomServ || "",
                description: serviceData.description || "",
                prix: serviceData.prix || "",
                type: detailsData.type || "omra",
                formule: detailsData.formule || "",
                dateDepartHO: detailsData.dateDepartHO || "",
                dateRetourHO: detailsData.dateRetourHO || "",
                typeChambre: detailsData.typeChambre || "",
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
            setError("Veuillez entrer le nom");
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nomServ', form.nomServ);
            formData.append('description', form.description || '');
            formData.append('prix', form.prix);
            formData.append('type', form.type);
            formData.append('formule', form.formule);
            formData.append('dateDepartHO', form.dateDepartHO);
            formData.append('dateRetourHO', form.dateRetourHO);
            formData.append('typeChambre', form.typeChambre);
            formData.append('_method', 'PUT');
            
            if (form.image) {
                formData.append('image', form.image);
            }

            const response = await axiosClient.post(`/hajj-omras/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                alert('Service modifié avec succès!');
                navigate('/admin/hajj-omras');
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier le service Hajj / Omra</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du service *</label>
                            <input type="text" name="nomServ" value={form.nomServ} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#fb923c]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DH) *</label>
                            <input type="number" name="prix" value={form.prix} onChange={handleChange} required min="0" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#fb923c]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                            <select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#fb923c]">
                                <option value="omra">Omra</option>
                                <option value="hajj">Hajj</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Formule *</label>
                            <input type="text" name="formule" value={form.formule} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
                            <input type="date" name="dateDepartHO" value={form.dateDepartHO} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date de retour *</label>
                            <input type="date" name="dateRetourHO" value={form.dateRetourHO} onChange={handleChange} required min={form.dateDepartHO} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    {calculatedDuree && (
                        <div className="p-3 bg-blue-50 border rounded-md">
                            <Clock size={18} className="inline mr-2 text-blue-600" />
                            <span>Durée: <strong>{calculatedDuree}</strong></span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type de chambre *</label>
                        <select name="typeChambre" value={form.typeChambre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                            <option value="">Sélectionner</option>
                            <option value="Simple">Simple (1 personne)</option>
                            <option value="Double">Double (2 personnes)</option>
                            <option value="Triple">Triple (3 personnes)</option>
                            <option value="Quadruple">Quadruple (4 personnes)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-md" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
                                <Upload size={18} /><span>Changer l'image</span>
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
                        <Link to="/admin/hajj-omras" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}