// src/pages/services/HotelsSejours.jsx
import { Link } from "react-router-dom";
import { Hotel, Wifi, Coffee, Waves, Dumbbell, Utensils, Car, Star, MapPin } from "lucide-react";

export default function HotelsSejours() {
    const hotels = [
        {
            id: 1,
            name: "Royal Mansour Marrakech",
            location: "Marrakech, Maroc",
            image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
            price: 1200,
            rating: 4.9,
            amenities: ["Piscine", "Spa", "Restaurant", "Wifi"],
            type: "Luxe"
        },
        {
            id: 2,
            name: "Four Seasons Istanbul",
            location: "Istanbul, Turquie",
            image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
            price: 950,
            rating: 4.8,
            amenities: ["Piscine", "Spa", "Restaurant", "Wifi", "Vue mer"],
            type: "Luxe"
        },
        {
            id: 3,
            name: "Atlantis The Palm",
            location: "Dubai, Émirats",
            image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
            price: 2100,
            rating: 4.9,
            amenities: ["Aquapark", "Piscine", "Spa", "Plage privée", "Wifi"],
            type: "Luxe"
        },
        {
            id: 4,
            name: "Hyatt Regency Casablanca",
            location: "Casablanca, Maroc",
            image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
            price: 750,
            rating: 4.7,
            amenities: ["Piscine", "Restaurant", "Wifi", "Business center"],
            type: "Affaires"
        }
    ];

    const amenitiesIcons = {
        "Wifi": <Wifi size={14} />,
        "Piscine": <Waves size={14} />,
        "Spa": <Waves size={14} />,
        "Restaurant": <Utensils size={14} />,
        "Parking": <Car size={14} />,
        "Aquapark": <Waves size={14} />,
        "Plage privée": <Waves size={14} />,
        "Business center": <Car size={14} />,
        "Vue mer": <Waves size={14} />
    };

    return (
        <div className="service-hotels">

            {/* Hotels Grid */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full text-left">

                    {/* HEADER */}
                    <thead className="bg-gray-100 text-gray-600 text-sm">
                        <tr>
                            <th className="p-3">Image</th>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Localisation</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3">Prix</th>
                            <th className="p-3">Services</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {hotels.map((hotel) => (
                            <tr key={hotel.id} className="border-b hover:bg-gray-50 transition">

                                {/* IMAGE */}
                                <td className="p-3">
                                    <img
                                        src={hotel.image}
                                        className="w-20 h-14 object-cover rounded-md"
                                    />
                                </td>

                                {/* NAME */}
                                <td className="p-3 font-semibold">
                                    {hotel.name}
                                </td>

                                {/* LOCATION */}
                                <td className="p-3 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {hotel.location}
                                    </div>
                                </td>

                                {/* TYPE */}
                                <td className="p-3">
                                    <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                                        {hotel.type}
                                    </span>
                                </td>

                                {/* RATING */}
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(hotel.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-xs text-gray-500">
                                            {hotel.rating}
                                        </span>
                                    </div>
                                </td>

                                {/* PRICE */}
                                <td className="p-3 font-bold text-[#fb923c]">
                                    {hotel.price} DH
                                </td>

                                {/* AMENITIES */}
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                            <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md">
                                                {amenitiesIcons[amenity] || <Hotel size={12} />}
                                                {amenity}
                                            </span>
                                        ))}
                                        {hotel.amenities.length > 3 && (
                                            <span className="text-xs text-gray-400">
                                                +{hotel.amenities.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* ACTION */}
                                <td className="p-3">
                                    <div className="flex gap-2">

                                        {/* DETAILS */}
                                        <Link
                                            to={`/services/details/${hotel.id}`}
                                            className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs hover:bg-blue-600 hover:text-white transition"
                                        >
                                            Détails
                                        </Link>

                                        {/* EDIT */}
                                        <Link
                                            to={`/admin/edit/${hotel.id}`}
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
