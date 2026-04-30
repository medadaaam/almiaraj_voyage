import { useState, useEffect } from "react";
import { Trash2, Eye, Search, X, Mail, Phone, MapPin } from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        let result = [...clients];
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(client => 
                `${client.prenomCl} ${client.nomCl}`.toLowerCase().includes(search) ||
                client.email?.toLowerCase().includes(search) ||
                client.numTelCl?.toLowerCase().includes(search)
            );
        }
        setFilteredClients(result);
    }, [clients, searchTerm]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/admin/clients');
            
            if (response.data && response.data.success === true) {
                setClients(response.data.data || []);
            } else if (Array.isArray(response.data)) {
                setClients(response.data);
            } else {
                setClients([]);
            }
            setError("");
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || "Erreur de chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce client ? Toutes ses réservations seront également supprimées.")) return;
        
        try {
            setDeletingId(id);
            await axiosClient.delete(`/admin/clients/${id}`);
            await fetchClients();
            alert("Client supprimé avec succès!");
        } catch (err) {
            setError("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb923c]"></div>
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <X size={16} className="text-gray-400" />
                        </button>
                    )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    {filteredClients.length} client(s) trouvé(s)
                </div>
            </div>

            {/* Table */}
            {filteredClients.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Aucun client trouvé</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Nom complet</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Téléphone</th>
                                <th className="p-3">Nationalité</th>
                                <th className="p-3">Date inscription</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-sm">#{client.id}</td>
                                    <td className="p-3 font-medium">{client.prenomCl} {client.nomCl}</td>
                                    <td className="p-3">{client.email}</td>
                                    <td className="p-3">{client.numTelCl || "-"}</td>
                                    <td className="p-3 capitalize">{client.natCl || "-"}</td>
                                    <td className="p-3">{client.dateInscription ? new Date(client.dateInscription).toLocaleDateString('fr-FR') : "-"}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setShowDetailsModal(true);
                                                }}
                                                className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-600 hover:text-white transition"
                                                title="Détails"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client.id)}
                                                disabled={deletingId === client.id}
                                                className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                                                title="Supprimer"
                                            >
                                                {deletingId === client.id ? (
                                                    <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent"></div>
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Client Details Modal */}
            {showDetailsModal && selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Détails du client</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Prénom</label>
                                    <p className="font-medium">{selectedClient.prenomCl}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Nom</label>
                                    <p className="font-medium">{selectedClient.nomCl}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="font-medium">{selectedClient.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Téléphone</label>
                                    <p className="font-medium">{selectedClient.numTelCl || "Non renseigné"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Nationalité</label>
                                    <p className="font-medium capitalize">{selectedClient.natCl || "Non renseignée"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">CIN</label>
                                    <p className="font-medium">{selectedClient.cin || "Non renseigné"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Passport</label>
                                    <p className="font-medium">{selectedClient.passport || "Non renseigné"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Adresse</label>
                                    <p className="font-medium">{selectedClient.adresse || "Non renseignée"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Ville</label>
                                    <p className="font-medium">{selectedClient.ville || "Non renseignée"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Date d'inscription</label>
                                    <p className="font-medium">{new Date(selectedClient.dateInscription).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}