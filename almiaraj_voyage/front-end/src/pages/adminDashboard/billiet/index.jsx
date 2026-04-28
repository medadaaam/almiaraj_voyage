import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Camera, Trash2, Edit, Eye, Calendar, Plane, MapPin } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminBillets() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/billets');

            console.log('Full API Response:', response);

            let itemsData = [];

            if (response.data) {
                if (response.data.success === true && response.data.data) {
                    itemsData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    itemsData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    itemsData = response.data.data;
                } else if (response.data.billets && Array.isArray(response.data.billets)) {
                    itemsData = response.data.billets;
                } else {
                    itemsData = [];
                }
            }

            console.log('Final itemsData:', itemsData);
            setItems(Array.isArray(itemsData) ? itemsData : []);
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError(`Erreur lors du chargement: ${err.message}`);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce billet ?")) {
            return;
        }

        try {
            setDeletingId(id);
            await axiosClient.delete(`/billets/${id}`);
            await fetchItems();
            alert("Billet supprimé avec succès!");
        } catch (err) {
            console.error('Error:', err);
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };


    const getTypeLabel = (type) => {
        switch (type) {
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

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
                <button
                    onClick={fetchItems}
                    className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="service-billets">
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 text-sm">
                        <tr>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Départ</th>
                            <th className="p-3">Destination</th>
                            <th className="p-3">Date départ</th>
                            <th className="p-3">Prix</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const itemId = item.id;
                            // Get data from service relationship
                            const serviceData = item.service || {};
                            const billetData = item.billet || item;

                            return (
                                <tr key={itemId} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 font-semibold">
                                        {serviceData.nomServ || item.nomServ || "Sans titre"}
                                    </td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                            {getTypeLabel(billetData.typeBi || item.typeBi)}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            <Plane size={14} className="text-[#fb923c]" />
                                            {billetData.villeDepartBi || item.villeDepartBi || "-"}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} className="text-[#fb923c]" />
                                            {billetData.villeArriveeBi || item.villeArriveeBi || "-"}
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {billetData.dateDepartBi || item.dateDepartBi ?
                                                new Date(billetData.dateDepartBi || item.dateDepartBi).toLocaleDateString('fr-FR') :
                                                "-"}
                                        </div>
                                    </td>
                                    <td className="p-3 font-bold text-[#fb923c]">
                                        {serviceData.prix || item.prix || 0} DH
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Link to={`/admin/showBillet/${itemId}`} className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition" title="Détails">
                                                <Eye size={16} />
                                            </Link>
                                            <Link to={`/admin/editBillet/${itemId}`} className="bg-green-100 text-green-600 p-2 rounded-md hover:bg-green-600 hover:text-white transition" title="Modifier">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(itemId)}
                                                disabled={deletingId === itemId}
                                                className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                                                title="Supprimer"
                                            >
                                                {deletingId === itemId ?
                                                    <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div> :
                                                    <Trash2 size={16} />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}