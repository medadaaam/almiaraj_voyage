import { Link } from "react-router-dom";
import {
    Plane,
    Calendar,
    MapPin,
    CreditCard,
    Shield,
    Headphones,
    Globe,
    Star,
    Clock,
    ArrowRight,
} from "lucide-react";

export default function AdminBillets() {

    const billets = [
        {
            id: 1,
            from: "Casablanca",
            to: "Paris",
            date: "12 Juin 2026",
            returnDate: "20 Juin 2026",
            price: 2800,
            oldPrice: 3400,
            airline: "Royal Air Maroc",
            duration: "3h 10min",
            rating: 4.8,
        },
        {
            id: 2,
            from: "Fès",
            to: "Istanbul",
            date: "5 Juillet 2026",
            returnDate: "15 Juillet 2026",
            price: 4200,
            oldPrice: 5100,
            airline: "Turkish Airlines",
            duration: "4h 30min",
            rating: 4.9,
        },
    ];

    const features = [
        { icon: <CreditCard />, title: "Paiement sécurisé", desc: "Transactions 100% sécurisées" },
        { icon: <Shield />, title: "Garantie prix", desc: "Meilleurs prix garantis" },
        { icon: <Headphones />, title: "Support 24/7", desc: "Assistance avant et après vol" },
        { icon: <Globe />, title: "Destinations monde", desc: "Plus de 500 destinations" },
    ];

    return (
        <div className="service-flights">

            <div className="flex justify-end">
                <Link
                    to={`/admin/AjouterBillet`}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xl hover:bg-blue-600 hover:text-white transition"
                >
                    + Ajouter un billet
                </Link>
            </div><br />

            {/* SEARCH (خليتو) */}
            <div className="service-flight-search">
                <div className="service-flight-search-container">
                    <h3>Rechercher un vol</h3>

                    <div className="service-flight-search-form">
                        <div className="service-flight-input-group">
                            <label>Départ</label>
                            <div className="service-flight-input">
                                <MapPin size={18} />
                                <input type="text" placeholder="Ville de départ" />
                            </div>
                        </div>

                        <div className="service-flight-input-group">
                            <label>Destination</label>
                            <div className="service-flight-input">
                                <MapPin size={18} />
                                <input type="text" placeholder="Ville d'arrivée" />
                            </div>
                        </div>

                        <div className="service-flight-input-group">
                            <label>Aller</label>
                            <div className="service-flight-input">
                                <Calendar size={18} />
                                <input type="date" />
                            </div>
                        </div>

                        <div className="service-flight-input-group">
                            <label>Retour</label>
                            <div className="service-flight-input">
                                <Calendar size={18} />
                                <input type="date" />
                            </div>
                        </div>

                        <button className="service-flight-search-btn">
                            Rechercher
                        </button>
                    </div>
                </div>
            </div>

            {/* BILLETS CARDS */}
            <div className="overflow-x-auto mt-10">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">

                    {/* HEADER */}
                    <thead className="bg-[#f1f5f9] text-left">
                        <tr>
                            <th className="p-3">Vol</th>
                            <th className="p-3">Départ</th>
                            <th className="p-3">Destination</th>
                            <th className="p-3">Aller</th>
                            <th className="p-3">Retour</th>
                            <th className="p-3">Durée</th>
                            <th className="p-3">Prix</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {billets.map((b) => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">

                                <td className="p-3 font-medium">
                                    ✈️ {b.airline}
                                </td>

                                <td className="p-3">{b.from}</td>

                                <td className="p-3 flex items-center gap-2">
                                    <ArrowRight size={14} />
                                    {b.to}
                                </td>

                                <td className="p-3"><Calendar size={16} />{b.date}</td>

                                <td className="p-3"><Calendar size={16} />{b.returnDate}</td>

                                <td className="p-3 flex items-center gap-2">
                                    <Clock size={14} />
                                    {b.duration}
                                </td>

                                <td className="p-3">
                                    <div className="flex flex-col">
                                        <span className="text-red-500 line-through text-sm">
                                            {b.oldPrice} DH
                                        </span>
                                        <span className="text-[#fb923c] font-bold">
                                            {b.price} DH
                                        </span>
                                    </div>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3">
                                    <div className="flex gap-2">

                                        {/* DETAILS */}
                                        <Link
                                            to={`/services/details/${b.id}`}
                                            className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition"
                                        >
                                            Détails
                                        </Link>

                                        {/* EDIT */}
                                        <Link
                                            to={`/admin/edit/${b.id}`}
                                            className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs hover:bg-green-600 hover:text-white transition"
                                        >
                                            Modifier
                                        </Link>

                                        {/* DELETE */}
                                        <button
                                            className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs hover:bg-red-600 hover:text-white transition"
                                        >
                                            Supprimer
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>




        </div>
    );
}