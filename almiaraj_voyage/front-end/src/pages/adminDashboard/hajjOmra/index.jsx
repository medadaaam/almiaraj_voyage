// src/pages/services/HajjOmra.jsx
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Clock, Phone, Mail, Star, CheckCircle } from "lucide-react";

export default function AdminHajjOmra() {
    const packages = [
        {
            id: 1,
            title: "Hajj 2025 - Économique",
            duration: "25 jours",
            price: 8500,
            oldPrice: 9500,
            groupSize: "40 personnes",
            hotel: "Hôtel 3* à Aziziah",
            transport: "Bus climatisé + Train",
            meals: "Petit-déjeuner inclus",
            features: ["Guide francophone", "Assistance 24/7", "Visa inclus"]
        },
        {
            id: 2,
            title: "Omra - Ramadhan 2025",
            duration: "15 jours",
            price: 5500,
            oldPrice: 6500,
            groupSize: "25 personnes",
            hotel: "Hôtel 4* à Aziziah",
            transport: "Bus privé VIP",
            meals: "Demi-pension",
            features: ["Guide francophone", "Visa inclus", "Ziyarat à Médine"]
        },
        {
            id: 3,
            title: "Hajj 2025 - Confort",
            duration: "30 jours",
            price: 12000,
            oldPrice: 13500,
            groupSize: "25 personnes",
            hotel: "Hôtel 5* à Aziziah",
            transport: "Bus privé VIP",
            meals: "Pension complète",
            features: ["Guide francophone", "Assistance 24/7", "Visa inclus", "Chambre avec salle de bain"]
        },
        {
            id: 4,
            title: "Omra - Printemps 2025",
            duration: "12 jours",
            price: 4500,
            oldPrice: 5200,
            groupSize: "30 personnes",
            hotel: "Hôtel 3* à Aziziah",
            transport: "Bus climatisé",
            meals: "Petit-déjeuner inclus",
            features: ["Guide francophone", "Visa inclus"]
        }
    ];

    return (
        <div className="service-hajj">

            <div className="flex justify-end">
                <Link
                    to={`/admin/AjouterHajj-omra`}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xl hover:bg-blue-600 hover:text-white transition"
                >
                    + Ajouter hajj / omra
                </Link>
            </div><br />


            {/* Packages */}
            <div className="service-packages">
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-left">

                        {/* HEADER */}
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3">Titre</th>
                                <th className="p-3">Durée</th>
                                <th className="p-3">Groupe</th>
                                <th className="p-3">Hôtel</th>
                                <th className="p-3">Transport</th>
                                <th className="p-3">Prix</th>
                                <th className="p-3">Options</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {packages.map((pkg) => (
                                <tr key={pkg.id} className="border-b hover:bg-gray-50 transition">

                                    {/* TITLE */}
                                    <td className="p-3 font-semibold">
                                        <div className="flex flex-col">
                                            <span>{pkg.title}</span>
                                        </div>
                                    </td>

                                    {/* DURATION */}
                                    <td className="p-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {pkg.duration}
                                        </div>
                                    </td>

                                    {/* GROUP */}
                                    <td className="p-3 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Users size={14} />
                                            {pkg.groupSize}
                                        </div>
                                    </td>

                                    {/* HOTEL */}
                                    <td className="p-3 text-sm text-gray-500">
                                        {pkg.hotel}
                                    </td>

                                    {/* TRANSPORT */}
                                    <td className="p-3 text-sm text-gray-500">
                                        {pkg.transport}
                                    </td>

                                    {/* PRICE */}
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#fb923c]">
                                                {pkg.price} DH
                                            </span>
                                            {pkg.oldPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    {pkg.oldPrice} DH
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* FEATURES */}
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-1">
                                            {pkg.features.slice(0, 2).map((f, i) => (
                                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                                                    {f}
                                                </span>
                                            ))}
                                            {pkg.features.length > 2 && (
                                                <span className="text-xs text-gray-400">
                                                    +{pkg.features.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* ACTION */}
                                    <td className="p-3">
                                        <div className="flex gap-2">

                                            {/* DETAILS */}
                                            <Link
                                                to={`/services/details/${pkg.id}`}
                                                className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition"
                                            >
                                                Détails
                                            </Link>

                                            {/* EDIT */}
                                            <Link
                                                to={`/admin/edit/${pkg.id}`}
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

        </div>
    );
}
