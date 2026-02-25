"use client"

import { useState, forwardRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar as CalendarIcon, MapPin, Clock, Search, CheckCircle, Lock, Ticket, Award, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Association } from "@prisma/client"

// Types
type EventItem = {
    id: number
    title: string
    description: string
    details: string | null
    date: Date
    endDate: Date | null
    location: string
    cfuValue: string | null
    cfuType: string | null
    cfuDepartments: string | null
    image: string | null
    category: string
    bookingOpen: boolean
    bookingStart: Date | null
    bookingEnd: Date | null
    attachments: string | null
    associations: Association[]
    isRegistered?: boolean
}

// --- Helper: format date/time ---
function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}
function formatShortDate(date: Date) {
    return new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
}
function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function getBookingLabel(event: EventItem): { label: string; color: string; icon: typeof Ticket } {
    if (!event.bookingOpen) {
        return { label: "Prenotazione chiusa", color: "text-zinc-400 bg-zinc-100 border-zinc-200", icon: Lock }
    }

    const now = new Date()
    if (event.bookingStart && now < new Date(event.bookingStart)) {
        return { label: `Apre il ${formatShortDate(event.bookingStart)}`, color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock }
    }
    if (event.bookingEnd && now > new Date(event.bookingEnd)) {
        return { label: "Prenotazione scaduta", color: "text-red-500 bg-red-50 border-red-200", icon: Lock }
    }
    return { label: "Prenotazione aperta", color: "text-green-600 bg-green-50 border-green-200", icon: Ticket }
}

export default function EventsClient({
    events,
    categories,
    mode = 'upcoming'
}: {
    events: EventItem[]
    categories: string[]
    mode?: 'upcoming' | 'past'
}) {
    const [activeCategory, setActiveCategory] = useState("Tutti")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const allCategories = ["Tutti", ...categories]

    const filteredEvents = events.filter(item => {
        // Filter by category
        const itemCats = item.category ? item.category.split(",").map(c => c.trim()) : []
        if (activeCategory !== "Tutti" && !itemCats.includes(activeCategory)) return false

        // Filter by search text
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase()
            const matchTitle = item.title.toLowerCase().includes(lowerQ)
            const matchLoc = item.location.toLowerCase().includes(lowerQ)
            if (!matchTitle && !matchLoc) return false
        }

        // Filter by selected date (matching precisely the day)
        if (selectedDate) {
            const eventDate = new Date(item.date)
            const isSameDay =
                eventDate.getDate() === selectedDate.getDate() &&
                eventDate.getMonth() === selectedDate.getMonth() &&
                eventDate.getFullYear() === selectedDate.getFullYear()

            // if it has an end date, maybe it falls in between? For simplicity let's match start day.
            if (!isSameDay) return false
        }

        return true
    })

    // Calendar generation logic
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const shift = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Make Monday = 0
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

    const days = []
    for (let i = 0; i < shift; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))


    return (
        <div className="min-h-screen bg-zinc-50 py-20">
            {/* Header */}
            <div className="container mx-auto px-6 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                            Agenda Studentesca
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-4">
                            {mode === 'upcoming' ? 'Prossimi Eventi' : 'Eventi Passati'}
                        </h1>
                        <p className="text-xl text-zinc-600 font-medium italic">
                            Uniti per costruire il futuro.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/events"
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold transition-all border",
                                mode === 'upcoming'
                                    ? "bg-[#18182e]/50 text-white border-[#18182e]/50 shadow-lg shadow-blue-200"
                                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            In Arrivo
                        </Link>
                        <Link
                            href="/events/past"
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold transition-all border",
                                mode === 'past'
                                    ? "bg-[#18182e]/50 text-white border-[#18182e]/50 shadow-lg shadow-zinc-200"
                                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                            )}
                        >
                            Archivio
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 grid lg:grid-cols-4 gap-12">
                {/* Left Sidebar: Filters & Calendar */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Search */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-foreground">Ricerca</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Cerca evento..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm bg-white"
                            />
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-foreground">Calendario</h3>
                            {selectedDate && (
                                <button onClick={() => setSelectedDate(null)} className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center">
                                    <X className="size-3 mr-1" /> Reset
                                </button>
                            )}
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth} className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-500"><ChevronLeft className="size-4" /></button>
                                <span className="font-bold text-sm text-foreground">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                                <button onClick={nextMonth} className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-500"><ChevronRight className="size-4" /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
                                    <div key={i} className="text-[10px] font-bold text-zinc-400">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((d, i) => {
                                    if (!d) return <div key={`empty-${i}`} />
                                    const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
                                    const isSelected = selectedDate?.toDateString() === dateObj.toDateString()
                                    const isToday = new Date().toDateString() === dateObj.toDateString()
                                    const hasEvent = events.some(e => new Date(e.date).toDateString() === dateObj.toDateString())

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(dateObj)}
                                            className={cn(
                                                "h-8 rounded-lg text-xs font-bold transition-colors flex flex-col items-center justify-center relative",
                                                isSelected
                                                    ? "bg-[#18182e]/50 text-white shadow-md"
                                                    : isToday
                                                        ? "bg-red-50 text-red-600 border border-red-100"
                                                        : "hover:bg-zinc-100 text-zinc-700",
                                                !isSelected && !isToday && hasEvent && "text-foreground bg-zinc-50"
                                            )}
                                        >
                                            {d}
                                            {!isSelected && hasEvent && <span className="absolute bottom-1 size-1 rounded-full bg-red-600" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-foreground">Categorie</h3>
                        <div className="space-y-1">
                            {allCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                                        activeCategory === cat
                                            ? "bg-white text-foreground shadow-sm border border-zinc-200"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-foreground border border-transparent"
                                    )}
                                >
                                    {cat}
                                    {activeCategory === cat && <CheckCircle className="size-4 text-green-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: Event Grid */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((item) => (
                                <EventCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20 text-zinc-400">
                            <CalendarIcon className="size-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">Nessun evento trovato in questa categoria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const EventCard = forwardRef<HTMLDivElement, { item: EventItem }>(
    ({ item }, ref) => {
        const booking = getBookingLabel(item)
        const BookingIcon = booking.icon

        const theme = {
            title: "group-hover:text-zinc-600",
            button: "bg-[#18182e]/50 text-white hover:bg-[#18182e]/70 shadow-lg",
            border: "hover:border-zinc-300"
        }


        // Date display
        const dateStr = formatDate(item.date)
        const hasEndDate = item.endDate && new Date(item.endDate).toDateString() !== new Date(item.date).toDateString()
        const dateDisplay = hasEndDate
            ? `${formatShortDate(item.date)} – ${formatShortDate(item.endDate!)}`
            : dateStr

        return (
            <motion.div
                ref={ref}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <Link
                    href={`/events/${item.id}`}
                    className={cn(
                        "group bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full block",
                        theme.border
                    )}
                >
                    {/* Cover Image */}
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden">
                        {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <CalendarIcon className="size-16 text-zinc-300" />
                            </div>
                        )}
                        {/* Date badge on image (TOP LEFT) */}
                        <div className="absolute top-4 left-4 z-20">
                            <div className="bg-white/95 backdrop-blur-sm text-center p-2 rounded-xl min-w-[3.5rem] shadow-lg border border-white/20">
                                <span className="block text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                                    {new Date(item.date).toLocaleDateString('it-IT', { month: 'short' })}
                                </span>
                                <span className="block text-2xl font-black leading-none text-foreground mt-0.5">
                                    {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit' })}
                                </span>
                            </div>
                        </div>


                        {/* Category badge (Top Right, consistent with News) */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 items-end">
                            {item.category.split(",").map((cat: string) => (
                                <span key={cat.trim()} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#18182e]/90 backdrop-blur-sm text-white shadow-sm border border-white/10">
                                    {cat.trim()}
                                </span>
                            ))}
                        </div>

                        {item.isRegistered && (
                            <div className="absolute bottom-3 right-3 z-20">
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-500/95 backdrop-blur-sm text-white shadow-sm flex items-center gap-1 border border-green-400">
                                    <CheckCircle className="size-3" /> Registrato
                                </span>
                            </div>
                        )}
                        {/* CFU badge (moved to bottom left) */}
                        {item.cfuValue && (
                            <div className="absolute bottom-3 left-3 z-20">
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-sm text-white shadow-sm flex items-center gap-1">
                                    <Award className="size-3" /> {item.cfuValue} CFU
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                        {/* Title */}
                        <h3 className={cn("text-lg font-bold text-foreground mb-2 transition-colors leading-tight group-hover:underline decoration-2 underline-offset-4", theme.title)}>
                            {item.title}
                        </h3>
                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-4">
                            {item.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-col gap-1.5 mb-4 text-xs text-zinc-500 font-medium">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="size-3.5 shrink-0" /> {dateDisplay}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="size-3.5 shrink-0" /> {formatTime(item.date)}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="size-3.5 shrink-0" /> {item.location}
                            </div>
                        </div>

                        {/* Booking Status */}
                        <div className="mt-auto">
                            <div className={cn("w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2", booking.color)}>
                                <BookingIcon className="size-3.5" />
                                {booking.label}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        )
    })
EventCard.displayName = "EventCard"
