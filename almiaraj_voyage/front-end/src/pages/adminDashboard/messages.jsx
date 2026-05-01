import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Trash2,
  Search,
  Filter,
  X,
  User,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
  Reply,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { axiosClient } from "@/api/axios";

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let result = [...messages];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.contenu?.toLowerCase().includes(search) ||
        m.nomM?.toLowerCase().includes(search) ||
        m.emailM?.toLowerCase().includes(search) ||
        m.client?.prenomCl?.toLowerCase().includes(search) ||
        m.client?.nomCl?.toLowerCase().includes(search)
      );
    }

    if (selectedStatus) {
      result = result.filter(m => m.statusM === selectedStatus);
    }

    setFilteredMessages(result);
    setCurrentPage(1);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
  }, [messages, searchTerm, selectedStatus, itemsPerPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/messages');
      
      if (response.data?.success) {
        setMessages(response.data.data || []);
      } else {
        setMessages([]);
      }
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce message ?")) return;
    
    try {
      setDeletingId(id);
      await axiosClient.delete(`/admin/messages/${id}`);
      await fetchMessages();
      alert("Message supprimé avec succès");
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      alert("Veuillez écrire une réponse");
      return;
    }
    
    setSendingReply(true);
    try {
      await axiosClient.put(`/admin/messages/${id}/reply`, { reply: replyText });
      alert("Réponse envoyée avec succès");
      setReplyText("");
      setShowDetailsModal(false);
      await fetchMessages();
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur lors de l'envoi de la réponse");
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosClient.put(`/admin/messages/${id}/status`, { statusM: status });
      await fetchMessages();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleRowClick = (messageId) => {
    navigate(`/admin/messages/${messageId}`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'lu':
        return <span className="status-badge read"><CheckCircle size={12}/> Lu</span>;
      case 'repondu':
        return <span className="status-badge replied"><Reply size={12}/> Répondu</span>;
      default:
        return <span className="status-badge unread"><Clock size={12}/> Non lu</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  // Pagination functions
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMessages.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredMessages.length / newItemsPerPage));
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
      </div>
    );
  }

  const currentItems = getCurrentPageItems();

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Messages</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredMessages.length} message(s) trouvé(s)</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange} 
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          >
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
            <option value={50}>50 par page</option>
          </select>
          <button onClick={fetchMessages} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
            <RefreshCw size={14} />
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={fetchMessages} className="ml-4 text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou contenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2">
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          >
            <option value="">Tous les statuts</option>
            <option value="non_lu">Non lus</option>
            <option value="lu">Lus</option>
            <option value="repondu">Répondus</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
              showFilters ? "bg-[#f59e0b] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter size={14} />
            Filtres
          </button>

          {(searchTerm || selectedStatus) && (
            <button onClick={clearFilters} className="px-3 py-1.5 text-red-500 hover:text-red-700 text-sm">
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Mail size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">Aucun message trouvé</h3>
          <p className="text-gray-500 text-sm">Les messages des clients apparaîtront ici</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentItems.map((m) => (
              <div 
                key={m.id} 
                onClick={() => handleRowClick(m.id)}
                className={`bg-white rounded-lg shadow p-5 cursor-pointer transition-all hover:shadow-md ${m.statusM !== 'non_lu' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-orange-500'}`}
              >
                <div className="flex justify-between items-start flex-wrap gap-4 mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] flex items-center justify-center text-white font-semibold">
                      {m.client?.prenomCl?.charAt(0) || m.nomM?.charAt(0) || "M"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {m.client?.prenomCl} {m.client?.nomCl} {!m.client && m.nomM && <span>({m.nomM})</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Mail size={12} /> {m.emailM}</span>
                        {m.numTelM && <span className="flex items-center gap-1"><Phone size={12} /> {m.numTelM}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{formatDate(m.created_at)}</span>
                    {getStatusBadge(m.statusM)}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700 line-clamp-2">{m.contenu}</p>
                </div>

                {m.reply && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border-l-3 border-l-green-500">
                    <div className="flex items-center gap-2 text-xs font-medium text-green-600 mb-2">
                      <Reply size={14} />
                      Réponse de l'administrateur:
                    </div>
                    <p className="text-sm text-gray-700">{m.reply}</p>
                    <div className="text-xs text-gray-400 mt-2">Répondu le {formatDate(m.replied_at)}</div>
                  </div>
                )}

                <div className="flex justify-end mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setSelectedMessage(m);
                      setReplyText("");
                      setShowDetailsModal(true);
                      if (m.statusM !== 'lu') {
                        handleUpdateStatus(m.id, 'lu');
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition text-sm"
                  >
                    <MessageCircle size={14} />
                    Voir & Répondre
                  </button>
                  <button
                    onClick={(e) => handleDelete(m.id, e)}
                    disabled={deletingId === m.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition text-sm ml-2"
                  >
                    {deletingId === m.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-500">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredMessages.length)} sur {filteredMessages.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={16} />
                  Précédent
                </button>
                <div className="flex gap-1">
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${
                        currentPage === page
                          ? 'bg-[#f59e0b] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Suivant
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Details & Reply Modal */}
      {showDetailsModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Détails du message</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Expéditeur</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Nom:</span> <span className="font-medium">{selectedMessage.nomM || `${selectedMessage.client?.prenomCl} ${selectedMessage.client?.nomCl}`}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedMessage.emailM}</span></div>
                  {selectedMessage.numTelM && <div><span className="text-gray-500">Téléphone:</span> <span className="font-medium">{selectedMessage.numTelM}</span></div>}
                  {selectedMessage.client && (
                    <div><span className="text-gray-500">Client:</span> <button onClick={() => navigate(`/admin/users/${selectedMessage.client.id}`)} className="text-[#f59e0b] hover:underline">Voir profil</button></div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.contenu}</p>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>Reçu le {formatDate(selectedMessage.created_at)}</span>
                  {getStatusBadge(selectedMessage.statusM)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Répondre</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Écrire une réponse..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-sm"
                  rows={4}
                />
                <button
                  onClick={() => handleReply(selectedMessage.id)}
                  disabled={sendingReply}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#f59e0b] text-white rounded-lg hover:bg-[#d97706] transition disabled:opacity-50"
                >
                  {sendingReply ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} />
                  )}
                  Envoyer la réponse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}