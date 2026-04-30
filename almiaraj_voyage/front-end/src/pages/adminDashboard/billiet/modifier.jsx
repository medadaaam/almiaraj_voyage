import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Plane, MapPin, Loader } from "lucide-react";

export default function ModifierBillet() {
    const { id } = useParams();
    const navigate = useNavigate();

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
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get(`/billets/${id}`);


            let itemData = response.data.data || response.data;
            const serviceData = itemData.service || itemData;
            const billetData = itemData.billet || itemData;

            setForm({
                nomServ: serviceData.nomServ || "",
                description: serviceData.description || "",
                prix: serviceData.prix || "",
                typeBi: billetData.typeBi || "aller_simple",
                villeDepartBi: billetData.villeDepartBi || "",
                villeArriveeBi: billetData.villeArriveeBi || "",
                destination_id: billetData.destination_id || "",
                dateDepartBi: billetData.dateDepartBi || "",
                dateRetourBi: billetData.dateRetourBi || "",
            });

        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement du billet");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Validation
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

        if (!form.villeDepartBi || !form.villeDepartBi.trim()) {
            setError("Veuillez entrer la ville de départ");
            setIsSubmitting(false);
            return;
        }

        if (!form.villeArriveeBi || !form.villeArriveeBi.trim()) {
            setError("Veuillez entrer la ville d'arrivée");
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
            formData.append('_method', 'PUT');
            const response = await axiosClient.post(`/billets/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });


            if (response.data.success) {
                alert('Billet modifié avec succès!');
                navigate('/admin/billets');
            } else {
                setError(response.data.message || "Erreur lors de la modification");
            }

        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);
            setError(error.response?.data?.message || "Erreur lors de la modification");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Chargement...</p>
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
                                    placeholder="Ex: Casablanca"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ville d'arrivée *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="villeArriveeBi"
                                    value={form.villeArriveeBi}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                    placeholder="Ex: Paris"
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
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

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
