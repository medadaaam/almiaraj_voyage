// hotel.jsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Star } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function Hotel({ hotelId = 1 }) { // Ajoutez hotelId comme prop
    const oldPrice = 14000.99
    const newPrice = 12000.99
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    const rating = 4
    const navigate = useNavigate()

    const handleReservation = () => {
        // Naviguer vers /services/reservation
        navigate("/services/reservation", { 
            state: { hotelId: hotelId } // Vous pouvez passer des données
        })
    }

    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video " />
            <img
                src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary" className="text-[#2f6f85] border-[#2f6f85] rounded-full bg-[#2f708512]">disponible</Badge>
                </CardAction>
                <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>
                <CardTitle>nom de l'hotel</CardTitle>
                <CardDescription>
                    cet hotel se trouve dans le maroc, il a 5 etoils...
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-around">
                {/* Changement ici - au lieu de Link, utilisez button avec onClick */}
                <button 
                    onClick={handleReservation}
                    className="text-[#ff793a] bg-[#ff5b0f0e] border-[#ff793a] 
                    hover:bg-[#ff793a] hover:text-white px-4 py-2 rounded-md transition-colors"
                >
                    Reserver
                </button>
                <div className="flex items-center gap-3">
                    {/* New Price */}
                    <p className="text-black-600 font-bold text-lg">
                        {oldPrice} DH
                    </p>

                    {/* Old Price */}
                    <p className="text-red-600 line-through text-sm">
                        {newPrice} DH
                    </p>

                    {/* Promo Badge */}
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-md font-semibold">
                        -{discount}%
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}