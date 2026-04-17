import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
// import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import "./search.css";

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

    const GuestItem = ({ label, value, setValue, min = 0 }) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm">{label}</span>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setValue(Math.max(min, value - 1))}
                    className="w-8 h-8 border rounded-md flex items-center justify-center hover:border-[#2f6f85] hover:text-[#2f6f85] transition-colors"
                    type="button"
                >
                    -
                </button>
                <span className="w-6 text-center">{value}</span>
                <button
                    onClick={() => setValue(value + 1)}
                    className="w-8 h-8 border rounded-md flex items-center justify-center hover:border-[#2f6f85] hover:text-[#2f6f85] transition-colors"
                    type="button"
                >
                    +
                </button>
            </div>
        </div>
    )

    const formatDateRange = () => {
        if (date?.from && date?.to) {
            return `${format(date.from, "EEE. d MMM")} — ${format(date.to, "EEE. d MMM")}`
        }
        return "mer. 15 avr. — jeu. 16 avr."
    }

    const getGuestsText = () => {
        return `${adults} adultes · ${children} enfant · ${rooms} chambre`
    }
    const [childrenAges, setChildrenAges] = React.useState([])

    const handleSearch = (e) => {
        e.preventDefault()
        if (children > 0 && childrenAges.some(age => age === "")) {
            alert("Merci de remplir l'âge de tous les enfants")
            return
        }

        console.log({ location, date, adults, children, rooms, childrenAges })
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Title Section */}
            {/* Search Form */}
            <div className="form">


                <form onSubmit={handleSearch} className="flex gap-3 items-center">
                    <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Où allez-vous ?"
                        className="flex-1 focus-visible:ring-[#2f6f85] hover:bg-[#2f6f85]/5 hover:border-[#2f6f85]"
                    />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex-1 justify-start text-left font-normal hover:bg-[#2f6f85]/5 hover:border-[#2f6f85]",
                                    !date?.from && "text-black-500"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDateRange()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                                classNames={{
                                    months: "flex gap-6",
                                    month: "space-y-4",
                                    caption: "flex justify-center pt-1 relative items-center",
                                    caption_label: "text-sm font-semibold",
                                    nav: "space-x-1 flex items-center",
                                    nav_button: "h-7 w-7 bg-transparent hover:bg-[#2f6f85]/10 rounded-md hover:text-[#2f6f85]",
                                    table: "w-full border-collapse",
                                    head_row: "flex",
                                    head_cell: "text-gray-500 rounded-md w-9 font-medium text-xs",
                                    row: "flex w-full mt-2",
                                    cell: "text-center text-sm p-0 relative [&:has(button[aria-selected])]:bg-[#2f6f85]/10 first:[&:has(button[aria-selected])]:rounded-l-md last:[&:has(button[aria-selected])]:rounded-r-md",
                                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#2f6f85]/10 rounded-full hover:text-[#2f6f85]",
                                    day_selected: "bg-[#2f6f85] text-white hover:bg-[#2f6f85] hover:text-white rounded-full",
                                    day_range_middle: "aria-selected:bg-[#2f6f85] aria-selected:text-white rounded-none",
                                    day_range_start: "bg-[#2f6f85] text-white rounded-full",
                                    day_range_end: "bg-[#2f6f85] text-white rounded-full",
                                    day_today: "border border-[#2f6f85] bg-transparent",
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <Popover open={openGuests} onOpenChange={setOpenGuests}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex-1 justify-start text-left hover:bg-[#2f6f85]/5 hover:border-[#2f6f85]"
                            >
                                {getGuestsText()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                            <div className="space-y-3">
                                <GuestItem label="Adultes" value={adults} setValue={setAdults} min={1} />
                                <GuestItem
                                    label="Enfants"
                                    value={children}
                                    setValue={(val) => {
                                        setChildren(val)

                                        // update ages array
                                        setChildrenAges((prev) => {
                                            const newAges = [...prev]

                                            if (val > prev.length) {
                                                // add new inputs
                                                return [...newAges, ...Array(val - prev.length).fill("")]
                                            } else {
                                                // remove extra inputs
                                                return newAges.slice(0, val)
                                            }
                                        })
                                    }}
                                />

                                {/* Ages Inputs */}
                                {children > 0 && (
                                    <div className="mt-2 space-y-2">
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
                                                className="w-full border rounded-md p-2 text-sm"
                                            >
                                                <option value="">Âge enfant {index + 1}</option>
                                                {[...Array(18)].map((_, i) => (
                                                    <option key={i} value={i}>
                                                        {i} ans
                                                    </option>
                                                ))}
                                            </select>
                                        ))}
                                    </div>
                                )}
                                <GuestItem label="Chambres" value={rooms} setValue={setRooms} min={1} />
                                <Button
                                    className="w-full bg-[#2f6f85] hover:bg-[#2f6f85]/80"
                                    onClick={() => setOpenGuests(false)}
                                    type="button"
                                >
                                    Terminer
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button
                        type="submit"
                        className="bg-[#2f6f85] hover:bg-[#2f6f85]/80"
                    >
                        Rechercher
                    </Button>
                </form>
            </div>

            {/* Recent Searches Section */}
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Vos recherches récentes</h2>
            </div>

        </div>
    )
}
