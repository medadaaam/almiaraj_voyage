// src/pages/services/CircuitsTouristiques.jsx
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Star, Camera, Mountain, Umbrella, Landmark } from "lucide-react";

export default function AdminVoyages() {
    const circuits = [
        {
            id: 1,
            title: "Circuit Impérial - Maroc",
            duration: "8 jours / 7 nuits",
            price: 4200,
            cities: ["Casablanca", "Rabat", "Meknès", "Fès", "Marrakech"],
            image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
            rating: 4.8,
            type: "Culturel",
            icon: <Landmark />
        },
        {
            id: 2,
            title: "Merveilles de Turquie",
            duration: "10 jours / 9 nuits",
            price: 5800,
            cities: ["Istanbul", "Cappadoce", "Pamukkale", "Antalya"],
            image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
            rating: 4.9,
            type: "Culturel",
            icon: <Mountain />
        },
        {
            id: 3,
            title: "Égypte des Pharaons",
            duration: "7 jours / 6 nuits",
            price: 4900,
            cities: ["Le Caire", "Louxor", "Assouan", "Alexandrie"],
            image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
            rating: 4.7,
            type: "Culturel",
            icon: <Camera />
        },
        {
            id: 4,
            title: "Andalousie Espagnole",
            duration: "6 jours / 5 nuits",
            price: 3900,
            cities: ["Séville", "Grenade", "Cordoue", "Malaga"],
            image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
            rating: 4.8,
            type: "Culturel",
            icon: <Umbrella />
        }
    ];

    return (
        <div className="service-circuits">

            {/* Circuits Grid */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full text-left">

                    {/* HEADER */}
                    <thead className="bg-gray-100 text-gray-600 text-sm">
                        <tr>
                            <th className="p-3">Image</th>
                            <th className="p-3">Titre</th>
                            <th className="p-3">Durée</th>
                            <th className="p-3">Villes</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3">Prix</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {circuits.map((circuit) => (
                            <tr key={circuit.id} className="border-b hover:bg-gray-50 transition">

                                {/* IMAGE */}
                                <td className="p-3">
                                    <img
                                        src={circuit.image}
                                        className="w-20 h-14 object-cover rounded-md"
                                    />
                                </td>

                                {/* TITLE */}
                                <td className="p-3 font-semibold">
                                    {circuit.title}
                                </td>

                                {/* DURATION */}
                                <td className="p-3 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {circuit.duration}
                                    </div>
                                </td>

                                {/* CITIES */}
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {circuit.cities.slice(0, 2).map((city, i) => (
                                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                                                {city}
                                            </span>
                                        ))}
                                        {circuit.cities.length > 2 && (
                                            <span className="text-xs text-gray-400">
                                                +{circuit.cities.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* RATING */}
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(circuit.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-xs text-gray-500">
                                            {circuit.rating}
                                        </span>
                                    </div>
                                </td>

                                {/* PRICE */}
                                <td className="p-3 font-bold text-[#fb923c]">
                                    {circuit.price} DH
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3">
                                        <div className="flex gap-2">

                                            {/* DETAILS */}
                                            <Link
                                                to={`/services/details/${circuit.id}`}
                                                className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition"
                                            >
                                                Détails
                                            </Link>

                                            {/* EDIT */}
                                            <Link
                                                to={`/admin/edit/${circuit.id}`}
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
