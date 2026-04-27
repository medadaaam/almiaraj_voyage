// src/pages/ClientOrders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Calendar, MapPin, Users, CreditCard, Eye, XCircle, CheckCircle, Clock, Loader2, Plane, Hotel, Ticket } from "lucide-react";

export default function ClientOrders() {
    const { getMyReservations, cancelReservation } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        setLoading(true);
        const data = await getMyReservations();
        if (data?.success) {
            setReservations(data.reservations);
        }
        setLoading(false);
    };

    const handleCancel = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;
        setCancelling(id);
        try {
            await cancelReservation(id);
            await loadReservations();
        } catch (error) {
            alert("Erreur lors de l'annulation");
        } finally {
            setCancelling(null);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> En attente</span>;
            case 'confirmed': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Confirmée</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><XCircle size={12} /> Annulée</span>;
            default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
        }
    };

    const getServiceIcon = (type) => {
        if (type?.includes('voyage')) return <Plane size={18} className="text-orange-500" />;
        if (type?.includes('hotel')) return <Hotel size={18} className="text-orange-500" />;
        return <Ticket size={18} className="text-orange-500" />;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p className="ml-3 text-gray-500">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>

            {reservations.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Aucune réservation</h2>
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore effectué de réservation.</p>
                    <Link to="/services/circuits" className="bg-orange-500 text-white px-6 py-2 rounded-lg">Découvrir nos voyages</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map((res) => (
                        <div key={res.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                    {getServiceIcon(res.service?.type)}
                                    <span className="font-semibold">#{res.reference}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(res.status)}
                                    <span className="text-xs text-gray-500">{new Date(res.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{res.service?.nomServ}</h3>
                                {res.date_depart && (
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                        <Calendar size={14} />
                                        <span>Du {new Date(res.date_depart).toLocaleDateString('fr-FR')} au {new Date(res.date_retour).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                    <Users size={14} />
                                    <span>{res.nbPers} personne(s)</span>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                    <div>
                                        <span className="text-xs text-gray-500">Total</span>
                                        <p className="font-bold text-orange-500">{res.prixTotal} DH</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/client/reservations/${res.id}`} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                                            <Eye size={14} /> Détails
                                        </Link>
                                        {res.status === 'pending' && (
                                            <button onClick={() => handleCancel(res.id)} disabled={cancelling === res.id} className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                                                {cancelling === res.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
