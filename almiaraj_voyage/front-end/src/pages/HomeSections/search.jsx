import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UsersIcon, MapPinIcon, SearchIcon, XIcon, StarIcon, WifiIcon, CoffeeIcon, CarIcon, UtensilsIcon, WavesIcon, DumbbellIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import "./styles/search.css";


export default function Search() {
    const [date, setDate] = React.useState({
        from: null,
        to: null,
    })
    const [month, setMonth] = React.useState(new Date())
    const [adults, setAdults] = React.useState(3)
    const [children, setChildren] = React.useState(0)
    const [rooms, setRooms] = React.useState(1)
    const [openGuests, setOpenGuests] = React.useState(false)
    const [location, setLocation] = React.useState("")
    const [recentSearches, setRecentSearches] = React.useState([])
    const [showRecent, setShowRecent] = React.useState(false)
    const [searchPerformed, setSearchPerformed] = React.useState(false)
    const [searchResults, setSearchResults] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const GuestItem = ({ label, value, setValue, min = 0 }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setValue(Math.max(min, value - 1))}
                    className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-[#2f6f85] hover:text-white hover:border-[#2f6f85] transition-all duration-300"
                    type="button"
                >
                    <span className="text-lg">-</span>
                </button>
                <span className="w-6 text-center font-semibold text-gray-800">{value}</span>
                <button
                    onClick={() => setValue(value + 1)}
                    className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-[#2f6f85] hover:text-white hover:border-[#2f6f85] transition-all duration-300"
                    type="button"
                >
                    <span className="text-lg">+</span>
                </button>
            </div>
        </div>
    )

    const formatDateRange = () => {
        if (date?.from && date?.to) {
            return `${format(date.from, "EEE. d MMM")} — ${format(date.to, "EEE. d MMM")}`
        }
        return "Sélectionner les dates"
    }

    const getGuestsText = () => {
        const parts = []
        if (adults > 0) parts.push(`${adults} adulte${adults > 1 ? 's' : ''}`)
        if (children > 0) parts.push(`${children} enfant${children > 1 ? 's' : ''}`)
        if (rooms > 0) parts.push(`${rooms} chambre${rooms > 1 ? 's' : ''}`)
        return parts.join(' · ')
    }

    const [childrenAges, setChildrenAges] = React.useState([])

    // Mock data for search results
    const mockDestinations = [
        {
            id: 1,
            name: "Marrakech, Maroc",
            image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
            price: 450,
            rating: 4.8,
            reviews: 234,
            amenities: ["Wifi", "Piscine", "Petit-déjeuner"],
            duration: "7 nuits",
            type: "Voyage culturel"
        },
        {
            id: 2,
            name: "Istanbul, Turquie",
            image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
            price: 380,
            rating: 4.6,
            reviews: 189,
            amenities: ["Wifi", "Hamam", "Petit-déjeuner"],
            duration: "5 nuits",
            type: "Voyage urbain"
        },
        {
            id: 3,
            name: "Dubai, Émirats",
            image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
            price: 650,
            rating: 4.9,
            reviews: 456,
            amenities: ["Wifi", "Piscine", "Spa", "Parking"],
            duration: "4 nuits",
            type: "Voyage luxe"
        },
        {
            id: 4,
            name: "Casablanca, Maroc",
            image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
            price: 320,
            rating: 4.5,
            reviews: 167,
            amenities: ["Wifi", "Petit-déjeuner"],
            duration: "3 nuits",
            type: "Voyage d'affaires"
        }
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        if (children > 0 && childrenAges.some(age => age === "")) {
            alert("Merci de remplir l'âge de tous les enfants")
            return
        }

        const searchData = {
            location,
            date,
            adults,
            children,
            rooms,
            childrenAges,
            timestamp: new Date().toISOString()
        }

        setRecentSearches(prev => {
            const newSearches = [searchData, ...prev.filter(s => s.location !== location)].slice(0, 5)
            return newSearches
        })

        setShowRecent(false)
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            let results = [...mockDestinations]
            if (location) {
                results = results.filter(dest =>
                    dest.name.toLowerCase().includes(location.toLowerCase())
                )
            }
            setSearchResults(results)
            setSearchPerformed(true)
            setLoading(false)
        }, 1000)

        console.log({ location, date, adults, children, rooms, childrenAges })
    }

    const resetSearch = () => {
        setSearchPerformed(false)
        setSearchResults([])
        setLocation("")
        setDate({ from: null, to: null })
        setAdults(3)
        setChildren(0)
        setRooms(1)
        setChildrenAges([])
    }

    const removeRecentSearch = (index) => {
        setRecentSearches(prev => prev.filter((_, i) => i !== index))
    }

    const loadRecentSearch = (search) => {
        setLocation(search.location)
        setDate(search.date)
        setAdults(search.adults)
        setChildren(search.children)
        setRooms(search.rooms)
        setChildrenAges(search.childrenAges || [])
        setShowRecent(false)
    }

    // Render stars for rating
    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={i} className="w-4 h-4 fill-[#fb923c] text-[#fb923c]" />)
        }
        if (hasHalfStar) {
            stars.push(<StarIcon key="half" className="w-4 h-4 fill-[#fb923c] text-[#fb923c] opacity-50" />)
        }
        const emptyStars = 5 - stars.length
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
        }
        return stars
    }

    return (
        <>
            <div className="search-wrapper">
                <div className="search-container">
                    {/* Search Header */}
                    <div className="search-header">
                        <h2 className="search-title">Où voulez-vous aller ?</h2>
                        <p className="search-subtitle">Trouvez votre prochain voyage en quelques clics</p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="search-form">
                        {/* Location */}
                        <div className="search-field">
                            <MapPinIcon className="search-field-icon" />
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onFocus={() => setShowRecent(true)}
                                placeholder="Destination, ville ou hôtel..."
                                className="search-input"
                            />
                            {location && (
                                <button type="button" onClick={() => setLocation("")} className="search-clear">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button type="button" className="search-field">
                                    <CalendarIcon className="search-field-icon" />
                                    <span className="search-field-text">{formatDateRange()}</span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="search-calendar-popover" align="start">
                                <Calendar
                                    mode="range"
                                    selected={date}
                                    onSelect={setDate}
                                    month={month}
                                    onMonthChange={setMonth}
                                    numberOfMonths={2}
                                    disabled={{ before: new Date() }}
                                    initialFocus
                                    showOutsideDays={false}
                                    fixedWeeks
                                    className="search-calendar"
                                    classNames={{
                                        months: "flex gap-6",
                                        month: "space-y-4",
                                        caption: "flex justify-center pt-1 relative items-center mb-2",
                                        caption_label: "text-sm font-semibold text-gray-800",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-8 w-8 bg-transparent hover:bg-[#2f6f85]/10 rounded-full hover:text-[#2f6f85] transition-colors",
                                        table: "w-full border-collapse",
                                        head_row: "flex",
                                        head_cell: "text-gray-500 rounded-md w-10 font-medium text-xs py-2",
                                        row: "flex w-full mt-1",
                                        cell: "text-center text-sm p-0 relative",
                                        day: "h-10 w-10 p-0 font-normal hover:bg-[#2f6f85]/10 rounded-full hover:text-[#2f6f85] transition-all duration-200",
                                        day_selected: "bg-[#2f6f85] text-white hover:bg-[#2f6f85] rounded-full",
                                        day_range_middle: "bg-[#2f6f85]/20 rounded-none",
                                        day_range_start: "bg-[#2f6f85] text-white rounded-full",
                                        day_range_end: "bg-[#2f6f85] text-white rounded-full",
                                        day_today: "border-2 border-[#fb923c] bg-transparent",
                                        day_outside: "text-gray-300",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Guests Picker */}
                        <Popover open={openGuests} onOpenChange={setOpenGuests}>
                            <PopoverTrigger asChild>
                                <button type="button" className="search-field">
                                    <UsersIcon className="search-field-icon" />
                                    <span className="search-field-text">{getGuestsText()}</span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="search-guests-popover" align="start">
                                <div className="guests-content">
                                    <GuestItem label="Adultes (18+ ans)" value={adults} setValue={setAdults} min={1} />
                                    <GuestItem
                                        label="Enfants (0-17 ans)"
                                        value={children}
                                        setValue={(val) => {
                                            setChildren(val)
                                            setChildrenAges((prev) => {
                                                const newAges = [...prev]
                                                if (val > prev.length) {
                                                    return [...newAges, ...Array(val - prev.length).fill("")]
                                                } else {
                                                    return newAges.slice(0, val)
                                                }
                                            })
                                        }}
                                    />

                                    {children > 0 && (
                                        <div className="children-ages">
                                            <p className="text-xs text-gray-500 mb-2">Âges des enfants</p>
                                            {childrenAges.map((age, index) => (
                                                <select
                                                    key={index}
                                                    value={age}
                                                    required
                                                    onChange={(e) => {
                                                        const newAges = [...childrenAges]
                                                        newAges[index] = e.target.value
                                                        setChildrenAges(newAges)
                                                    }}
                                                    className="child-age-select"
                                                >
                                                    <option value="">Âge enfant {index + 1}</option>
                                                    {[...Array(18)].map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i} {i === 0 || i === 1 ? 'an' : 'ans'}
                                                        </option>
                                                    ))}
                                                </select>
                                            ))}
                                        </div>
                                    )}

                                    <GuestItem label="Chambres" value={rooms} setValue={setRooms} min={1} />

                                    <button
                                        type="button"
                                        className="guests-done-btn"
                                        onClick={() => setOpenGuests(false)}
                                    >
                                        Terminer
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Search Button */}
                        <button type="submit" className="search-submit">
                            <SearchIcon className="w-5 h-5" />
                            <span>Rechercher</span>
                        </button>
                    </form>

                    {/* Recent Searches */}
                    {showRecent && recentSearches.length > 0 && (
                        <div className="recent-searches">
                            <div className="recent-header">
                                <h3 className="recent-title">Recherches récentes</h3>
                                <button onClick={() => setRecentSearches([])} className="recent-clear">
                                    Tout effacer
                                </button>
                            </div>
                            <div className="recent-list">
                                {recentSearches.map((search, index) => (
                                    <div key={index} className="recent-item" onClick={() => loadRecentSearch(search)}>
                                        <div className="recent-item-icon">
                                            <SearchIcon className="w-4 h-4" />
                                        </div>
                                        <div className="recent-item-content">
                                            <div className="recent-item-location">{search.location || "Destination"}</div>
                                            <div className="recent-item-details">
                                                {search.date?.from && search.date?.to && (
                                                    <span>{format(search.date.from, "dd MMM")} - {format(search.date.to, "dd MMM")}</span>
                                                )}
                                                <span>{search.adults} adulte{search.adults > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeRecentSearch(index)
                                            }}
                                            className="recent-item-remove"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section - Hidden when search performed */}
            {/* {!searchPerformed && !loading && (
                <div className="features-wrapper ">
                    <div className="features-container">
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="feature-title">Pour les amateurs de voyage</h3>
                                <p className="feature-description">
                                    Nous offrons des plans de voyage flexibles et personnalisés adaptés à vos intérêts et à votre budget.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="feature-title">Expériences de voyage inégalées</h3>
                                <p className="feature-description">
                                    Nous nous associons avec des hôtels et des compagnies de transport réputés dans le monde entier.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="feature-title">Support client 24/7</h3>
                                <p className="feature-description">
                                    Notre équipe est disponible 24h/24 et 7j/7 pour fournir une assistance immédiate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}*/}

            {/* Loading Spinner */}
            {loading && (
                <div className="loading-wrapper">
                    <div className="loading-spinner"></div>
                    <p>Recherche des meilleures offres...</p>
                </div>
            )}

            {/* Search Results */}
            {searchPerformed && !loading && (
                <div className="results-wrapper">
                    <div className="results-container">
                        <div className="results-header">
                            <h2 className="results-title">
                                {searchResults.length > 0
                                    ? `${searchResults.length} destination(s) trouvée(s) pour "${location || "toutes les destinations"}"`
                                    : "Aucune destination trouvée"}
                            </h2>
                            {searchResults.length > 0 && (
                                <button onClick={resetSearch} className="results-reset">
                                    Nouvelle recherche
                                </button>
                            )}
                        </div>

                        {searchResults.length === 0 ? (
                            <div className="no-results">
                                <p>Aucun résultat ne correspond à votre recherche.</p>
                                <button onClick={resetSearch} className="no-results-btn">
                                    Effectuer une nouvelle recherche
                                </button>
                            </div>
                        ) : (
                            <div className="results-grid">
                                {searchResults.map((result) => (
                                    <div key={result.id} className="result-card">
                                        <div className="result-image">
                                            <img src={result.image} alt={result.name} />
                                            <span className="result-type">{result.type}</span>
                                        </div>
                                        <div className="result-content">
                                            <div className="result-header">
                                                <h3 className="result-name">{result.name}</h3>
                                                <div className="result-rating">
                                                    {renderStars(result.rating)}
                                                    <span className="result-reviews">({result.reviews} avis)</span>
                                                </div>
                                            </div>
                                            <div className="result-amenities">
                                                {result.amenities.map((amenity, i) => (
                                                    <span key={i} className="result-amenity">{amenity}</span>
                                                ))}
                                            </div>
                                            <div className="result-footer">
                                                <div className="result-price">
                                                    <span className="price-amount">{result.price}Dh</span>
                                                    <span className="price-period">/personne</span>
                                                </div>
                                                <div className="result-duration">
                                                    <span>{result.duration}</span>
                                                </div>
                                                <button className="result-book">Réserver</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
