import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Camera, Trash2, Edit, Eye, Calendar, Bed } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminHajjOmras() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        let cleanPath = imagePath.replace(/^public\//, '');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/${cleanPath}`;
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/hajj-omras');
            
            let itemsData = [];
            if (response.data && response.data.data) {
                itemsData = response.data.data;
            } else if (Array.isArray(response.data)) {
                itemsData = response.data;
            } else {
                itemsData = [];
            }

            setItems(itemsData);
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/hajj-omras/${id}`);
            await fetchItems();
            alert("Service supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
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

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        );
    }

    return (
        <div className="service-hajj-omras">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestion Hajj & Omra</h1>
                <Link
                    to="/admin/ajouterHajj-omra"
                    className="bg-[#fb923c] text-white px-4 py-2 rounded-md hover:bg-[#ea580c] transition flex items-center gap-2"
                >
                    + Ajouter un service
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun service trouvé</p>
                    <Link to="/admin/ajouterHajjOmra" className="text-[#fb923c] hover:underline mt-2 inline-block">
                        Ajouter votre premier service
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Nom</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Formule</th>
                                <th className="p-3">Durée</th>
                                <th className="p-3">Chambre</th>
                                <th className="p-3">Prix</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const serviceData = item.service || item;
                                const itemData = item.hajj_omra || item;
                                const itemId = item.id || itemData.id;

                                return (
                                    <tr key={itemId} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            {serviceData.image && !imageErrors[itemId] ? (
                                                <img
                                                    src={getImageUrl(serviceData.image)}
                                                    alt={serviceData.nomServ}
                                                    className="w-20 h-14 object-cover rounded-md"
                                                    onError={() => handleImageError(itemId)}
                                                />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                                                    <Camera size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-semibold">{serviceData.nomServ || "Sans titre"}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${itemData.type === 'hajj' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {itemData.type === 'hajj' ? 'Hajj' : 'Omra'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm">{itemData.formule}</td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {itemData.duree}
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Bed size={14} />
                                                {itemData.typeChambre}
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-[#fb923c]">{serviceData.prix} DH</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/showHajjOmra/${itemId}`} className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition" title="Détails">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/admin/editHajjOmra/${itemId}`} className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition" title="Modifier">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(itemId)} disabled={deletingId === itemId} className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50" title="Supprimer">
                                                    {deletingId === itemId ? <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}