import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import { Calendar, Plane, MapPin, ArrowLeft, Edit, Trash2, Ticket, Star, AlertCircle, CheckCircle, Home, Eye } from "lucide-react";

export default function BilletDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        try {
            setDeleting(true);
            await axiosClient.delete(`/billets/${id}`);
            alert("Billet supprimé avec succès!");
            navigate('/admin/billets');
        } catch (err) {
            setError("Erreur lors de la suppression");
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'aller_simple': return 'Aller simple';
            case 'aller_retour': return 'Aller-retour';
            default: return type;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
            {/* Header with Navigation */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/billets" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500">
                    <ArrowLeft size={20} />
                    Retour à la liste
                </Link>
                <div className="flex gap-2">
                    <Link
                        to={`/admin/editBillet/${id}`}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center gap-2"
                    >
                        <Edit size={16} />
                        Modifier
                    </Link>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                        >
                            Supprimer
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                            >
                                {deleting ? "..." : "Confirmer"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    {/* Title and Type */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{item.nomServ}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700`}>
                                    <Ticket size={12} />
                                    {getTypeLabel(item.typeBi)}
                                </span>
                                {item.rating > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                        <Star size={12} />
                                        {item.rating} / 5
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-500">{formatPrice(item.prix)} DH</div>
                    </div>

                    {/* Flight Route */}
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="text-center flex-1">
                                <div className="text-sm text-gray-500">Départ</div>
                                <div className="text-lg font-semibold flex items-center justify-center gap-1 mt-1">
                                    <Plane size={16} className="text-orange-500" />
                                    {item.villeDepartBi}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{formatDate(item.dateDepartBi)}</div>
                            </div>
                            <div className="text-gray-400">→</div>
                            <div className="text-center flex-1">
                                <div className="text-sm text-gray-500">Arrivée</div>
                                <div className="text-lg font-semibold flex items-center justify-center gap-1 mt-1">
                                    <MapPin size={16} className="text-orange-500" />
                                    {item.villeArriveeBi}
                                </div>
                                {item.dateRetourBi && (
                                    <div className="text-xs text-gray-400 mt-1">Retour: {formatDate(item.dateRetourBi)}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    )}

                    {/* Services inclus */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Services inclus</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Billet d'avion</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Taxes incluses</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Bagage cabine</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Assistance 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Info */}
                    <div className="border-t pt-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">ID:</span>
                                <span className="ml-2 text-gray-700">{item.id}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Créé le:</span>
                                <span className="ml-2 text-gray-700">{formatDate(item.created_at)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Statut:</span>
                                <span className="ml-2 text-green-600">Actif</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Dernière modif:</span>
                                <span className="ml-2 text-gray-700">{formatDate(item.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex justify-end gap-3">
                <Link
                    to="/admin/billets"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <Home size={16} />
                    Dashboard
                </Link>
                <Link
                    to="/admin/billets"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition flex items-center gap-2"
                >
                    <Eye size={16} />
                    Tous les billets
                </Link>
            </div>
        </div>
    );
}