import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Plane, MapPin, ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function BilletDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

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
            setLoading(true);
            const response = await axiosClient.get(`/billets/${id}`);
            
            let itemData = response.data.data || response.data;
            let serviceData = itemData.service || itemData;
            let detailsData = itemData.billet || itemData;
            
            setItem({
                ...serviceData,
                ...detailsData,
            });
            
        } catch (err) {
            console.error('Error:', err);
            setError("Billet non trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce billet ?")) return;
        try {
            setDeleting(true);
            await axiosClient.delete(`/billets/${id}`);
            alert("Billet supprimé avec succès!");
            navigate('/admin/billets');
        } catch (err) {
            setError("Erreur lors de la suppression");
            setDeleting(false);
        }
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'aller_simple': return 'Aller simple';
            case 'aller_retour': return 'Aller-retour';
            default: return type;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || "Billet non trouvé"}
                </div>
                <Link to="/admin/billets" className="mt-4 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Retour
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link to="/admin/billets" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
                <ArrowLeft size={20} /> Retour à la liste
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {item.image && (
                    <div className="w-full h-96 overflow-hidden">
                        <img src={getImageUrl(item.image)} alt={item.nomServ} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{item.nomServ}</h1>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700`}>
                                {getTypeLabel(item.typeBi)}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-[#fb923c]">{item.prix} DH</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Plane size={18} />
                            <span>Départ: {item.villeDepartBi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={18} />
                            <span>Destination: {item.destinationBi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={18} />
                            <span>Date départ: {new Date(item.dateDepartBi).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {item.dateRetourBi && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={18} />
                                <span>Date retour: {new Date(item.dateRetourBi).toLocaleDateString('fr-FR')}</span>
                            </div>
                        )}
                    </div>

                    {item.description && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                        <Link to={`/admin/editBillet/${id}`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center gap-2">
                            <Edit size={16} /> Modifier
                        </Link>
                        <button onClick={handleDelete} disabled={deleting} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50">
                            <Trash2 size={16} /> {deleting ? "Suppression..." : "Supprimer"}
                        </button>
                        <Link to="/admin/billets" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition">
                            Fermer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}