import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UsersIcon, MapPinIcon, SearchIcon, XIcon, StarIcon } from "lucide-react"
import "./styles/search.css";
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"
import { axiosClient } from "@/api/axios"

export default function Search() {
    const { hotels, getHotels } = useAuth();
    const [destinations, setDestinations] = React.useState([]);

    React.useEffect(() => {
        getHotels();
        fetchDestinations();
    }, [])

    // Fetch destinations from API
    const fetchDestinations = async () => {
        try {
            const response = await axiosClient.get('/destinations');
            let destinationsData = [];
            if (response.data && response.data.data) {
                destinationsData = response.data.data;
            } else if (Array.isArray(response.data)) {
                destinationsData = response.data;
            } else if (response.data && response.data.destinations) {
                destinationsData = response.data.destinations;
            }
            setDestinations(destinationsData);
        } catch (error) {
            console.error("Error fetching destinations:", error);
        }
    };

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
    const [showCustomDropdown, setShowCustomDropdown] = React.useState(false)
    const inputRef = React.useRef(null)
    const dropdownRef = React.useRef(null)

    // Get destination suggestions from API (cities with country)
    const getDestinationSuggestions = () => {
        const suggestionsMap = new Map();
        
        destinations.forEach(dest => {
            const city = dest.ville;
            const country = dest.pays;
            if (city && !suggestionsMap.has(city)) {
                suggestionsMap.set(city, {
                    city: city,
                    country: country,
                    display: `${city}, ${country}`
                });
            }
        });
        
        return Array.from(suggestionsMap.values());
    };

    const destinationSuggestions = getDestinationSuggestions();

    // Filter suggestions based on user input
    const filteredSuggestions = destinationSuggestions.filter(suggestion =>
        suggestion.city.toLowerCase().includes(location.toLowerCase()) ||
        suggestion.country.toLowerCase().includes(location.toLowerCase())
    );

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowCustomDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Open dropdown on focus
    const handleInputFocus = () => {
        setShowRecent(true);
        if (filteredSuggestions.length > 0) {
            setShowCustomDropdown(true);
        }
    };

    // Select a suggestion
    const handleSelectSuggestion = (suggestion) => {
        setLocation(suggestion.display);
        setShowCustomDropdown(false);
        setShowRecent(false);
    };

    const GuestItem = ({ label, value, setValue, min = 0 }) => (
        <div className="guest-item">
            <span className="guest-label">{label}</span>
            <div className="guest-controls">
                <button onClick={() => setValue(Math.max(min, value - 1))} className="guest-btn" type="button">−</button>
                <span className="guest-value">{value}</span>
                <button onClick={() => setValue(value + 1)} className="guest-btn" type="button">+</button>
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

    const handleSearch = (e) => {
        e.preventDefault()
        if (children > 0 && childrenAges.some(age => age === "")) {
            alert("Merci de remplir l'âge de tous les enfants")
            return
        }

        const searchData = { location, date, adults, children, rooms, childrenAges, timestamp: new Date().toISOString() }

        setRecentSearches(prev => [searchData, ...prev.filter(s => s.location !== location)].slice(0, 5))
        setShowRecent(false)
        setShowCustomDropdown(false)
        setLoading(true)

        setTimeout(() => {
            let results = [...hotels];
            if (location) {
                const searchTerm = location.toLowerCase().trim();
                // Extract city name from "City, Country" format
                const searchCity = searchTerm.split(',')[0].trim();
                results = hotels.filter(hotel =>
                    hotel.location?.toLowerCase().includes(searchCity) ||
                    hotel.name?.toLowerCase().includes(searchTerm)
                );
            }
            setSearchResults(results);
            setSearchPerformed(true);
            setLoading(false);
        }, 500)
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
        setShowCustomDropdown(false)
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            handleSearch(fakeEvent);
        }, 100);
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating || 0)
        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={i} className="star-filled" />)
        }
        const emptyStars = 5 - stars.length
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} className="star-empty" />)
        }
        return stars
    }

    return (
        <>
            <div className="search-wrapper">
                <div className="search-container">
                    <div className="search-header">
                        <h2 className="search-title">Où voulez-vous aller ?</h2>
                        <p className="search-subtitle">Trouvez l'hôtel parfait pour votre séjour</p>
                    </div>

                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-field-wrapper">
                            <div className="search-field">
                                <MapPinIcon className="search-field-icon" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onFocus={handleInputFocus}
                                    placeholder="Entrez une ville, un pays..."
                                    className="search-input"
                                    autoComplete="off"
                                />
                                {location && (
                                    <button type="button" onClick={() => setLocation("")} className="search-clear">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Custom Dropdown for destination suggestions */}
                            {showCustomDropdown && filteredSuggestions.length > 0 && (
                                <div className="custom-dropdown" ref={dropdownRef}>
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="dropdown-item"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <MapPinIcon className="dropdown-icon" />
                                            <div className="dropdown-content">
                                                <span className="dropdown-title">{suggestion.city}</span>
                                                <span className="dropdown-subtitle">{suggestion.country}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                    classNames={{}}
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
                                    <GuestItem label="Enfants (0-17 ans)" value={children} setValue={(val) => {
                                        setChildren(val)
                                        setChildrenAges((prev) => {
                                            const newAges = [...prev]
                                            if (val > prev.length) return [...newAges, ...Array(val - prev.length).fill("")]
                                            return newAges.slice(0, val)
                                        })
                                    }} />
                                    {children > 0 && (
                                        <div className="children-ages">
                                            <p className="children-ages-label">Âges des enfants</p>
                                            {childrenAges.map((age, index) => (
                                                <select key={index} value={age} onChange={(e) => {
                                                    const newAges = [...childrenAges]
                                                    newAges[index] = e.target.value
                                                    setChildrenAges(newAges)
                                                }} className="child-age-select">
                                                    <option value="">Âge enfant {index + 1}</option>
                                                    {[...Array(18)].map((_, i) => (
                                                        <option key={i} value={i}>{i} {i === 0 || i === 1 ? 'an' : 'ans'}</option>
                                                    ))}
                                                </select>
                                            ))}
                                        </div>
                                    )}
                                    <GuestItem label="Chambres" value={rooms} setValue={setRooms} min={1} />
                                    <button type="button" className="guests-done-btn" onClick={() => setOpenGuests(false)}>Terminer</button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <button type="submit" className="search-submit">
                            <SearchIcon className="w-5 h-5" />
                            <span>Rechercher</span>
                        </button>
                    </form>

                    {/* Recent Searches */}
                    {showRecent && recentSearches.length > 0 && !showCustomDropdown && (
                        <div className="recent-searches">
                            <div className="recent-header">
                                <h3 className="recent-title">Recherches récentes</h3>
                                <button onClick={() => setRecentSearches([])} className="recent-clear">Tout effacer</button>
                            </div>
                            <div className="recent-list">
                                {recentSearches.map((search, index) => (
                                    <div key={index} className="recent-item" onClick={() => loadRecentSearch(search)}>
                                        <div className="recent-item-icon"><SearchIcon className="w-4 h-4" /></div>
                                        <div className="recent-item-content">
                                            <div className="recent-item-location">{search.location || "Destination"}</div>
                                            <div className="recent-item-details">
                                                {search.date?.from && search.date?.to && <span>{format(search.date.from, "dd MMM")} - {format(search.date.to, "dd MMM")}</span>}
                                                <span>{search.adults} adulte{search.adults > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); removeRecentSearch(index) }} className="recent-item-remove"><XIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="loading-wrapper">
                    <div className="loading-spinner"></div>
                    <p>Recherche des meilleurs hôtels...</p>
                </div>
            )}

            {/* Results */}
            {searchPerformed && !loading && (
                <div className="results-wrapper">
                    <div className="results-container">
                        <div className="results-header">
                            <h2 className="results-title">{searchResults.length > 0 ? `${searchResults.length} hôtel(s) trouvé(s) pour "${location || "tous les hôtels"}"` : "Aucun hôtel trouvé"}</h2>
                            {searchResults.length > 0 && <button onClick={resetSearch} className="results-reset">Nouvelle recherche</button>}
                        </div>

                        {searchResults.length === 0 ? (
                            <div className="no-results">
                                <p>Aucun hôtel ne correspond à votre recherche "{location}".</p>
                                <button onClick={resetSearch} className="no-results-btn">Effectuer une nouvelle recherche</button>
                            </div>
                        ) : (
                            <div className="results-grid">
                                {searchResults.map((hotel) => (
                                    <div key={hotel.id} className="result-card">
                                        <div className="result-image">
                                            <img src={hotel.image || "/placeholder.jpg"} alt={hotel.name} />
                                            {hotel.enVedette === 1 && <span className="hotel-featured"><StarIcon className="w-3 h-3" />Populaire</span>}
                                            {hotel.oldPrix && <span className="hotel-discount">-{Math.round(((hotel.oldPrix - hotel.prix) / hotel.oldPrix) * 100)}%</span>}
                                        </div>
                                        <div className="result-content">
                                            <h3 className="result-name">{hotel.name}</h3>
                                            <div className="result-rating">{renderStars(parseFloat(hotel.rating))}</div>
                                            <div className="result-location"><MapPinIcon className="w-3 h-3" /><span>{hotel.location}</span></div>
                                            <div className="result-amenities">{hotel.amenities?.slice(0, 3).map((amenity, i) => <span key={i} className="result-amenity">{amenity}</span>)}</div>
                                            <div className="result-footer">
                                                <div className="result-price">
                                                    {hotel.oldPrix && <span className="old-price">{hotel.oldPrix}DH</span>}
                                                    <span className="price-amount">{hotel.prix}DH</span>
                                                    <span className="price-period">/nuit</span>
                                                </div>
                                                <div className="result-buttons">
                                                    <a href={`/hotels/${hotel.id}`} className="result-details">Détails</a>
                                                    <Link to={`/hotels/${hotel.id}/reserver`} className="result-book">Réserver</Link>
                                                </div>
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
