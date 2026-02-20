"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, CheckCircle, ChevronLeft, Lock, Ticket, Download, FileText, LogIn, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

type EventData = {
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
    association: string
    isRegistered?: boolean
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}
function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function isBookingActive(event: EventData): { canBook: boolean; message: string } {
    if (!event.bookingOpen) {
        return { canBook: false, message: "Le prenotazioni per questo evento non sono al momento disponibili." }
    }
    const now = new Date()
    if (event.bookingStart && now < new Date(event.bookingStart)) {
        return { canBook: false, message: `Le prenotazioni apriranno il ${formatDate(event.bookingStart)} alle ${formatTime(event.bookingStart)}.` }
    }
    if (event.bookingEnd && now > new Date(event.bookingEnd)) {
        return { canBook: false, message: "Le prenotazioni per questo evento sono chiuse." }
    }
    return { canBook: true, message: "" }
}

export default function EventDetailClient({
    event,
    isLoggedIn,
    userEmail
}: {
    event: EventData
    isLoggedIn: boolean
    userEmail: string | null
}) {
    const assoc = event.association?.toLowerCase() || "morgana & orum"
    let themeBg = "bg-purple-900"
    let themeText = "text-purple-900"
    if (assoc === "morgana") {
        themeBg = "bg-[#c12830]"
        themeText = "text-[#c12830]"
    } else if (assoc === "orum" || assoc === "o.r.u.m.") {
        themeBg = "bg-[#18182e]"
        themeText = "text-[#18182e]"
    }
    const theme = { bg: themeBg, text: themeText }

    const [isRegistering, setIsRegistering] = useState(false)
    const [registrationStatus, setRegistrationStatus] = useState<"idle" | "success" | "error">(event.isRegistered ? "success" : "idle")
    const [message, setMessage] = useState("")

    const formattedDate = formatDate(event.date)
    const formattedTime = formatTime(event.date)
    const hasEndDate = event.endDate && new Date(event.endDate).getTime() !== new Date(event.date).getTime()
    const booking = isBookingActive(event)

    // Parse attachments
    const attachmentList = event.attachments
        ? event.attachments.split(',').map(a => a.trim()).filter(Boolean)
        : []

    async function handleRegister() {
        setIsRegistering(true)
        setMessage("")

        const { registerForEvent } = await import("@/app/actions/events")
        const result = await registerForEvent(userEmail!, event.id)

        if (result.success) {
            setRegistrationStatus("success")
            setMessage(result.message)
        } else {
            setRegistrationStatus("error")
            setMessage(result.message)
        }
        setIsRegistering(false)
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Hero */}
            <div className={cn("relative overflow-hidden", theme.bg)}>
                {/* Cover image */}
                {event.image && (
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover opacity-20"
                    />
                )}
                <div className="relative z-10 text-white pt-32 pb-20">
                    <div className="container mx-auto px-6">
                        <Link href={`/events`} className="inline-flex items-center text-sm font-bold text-white/70 hover:text-white mb-6 uppercase tracking-widest transition-colors">
                            <ChevronLeft className="size-4 mr-1" /> Torna agli Eventi
                        </Link>
                        <span className="block text-sm font-bold uppercase tracking-widest text-white/60 mb-2">
                            {event.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-black mb-6 max-w-4xl">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-sm font-bold">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-5 text-white/80" />
                                {formattedDate}
                                {hasEndDate && ` – ${formatDate(event.endDate!)}`}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="size-5 text-white/80" /> {formattedTime}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="size-5 text-white/80" /> {event.location}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-20%] right-[-10%] size-96 rounded-full bg-white/5 blur-3xl" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-zinc-100 grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Descrizione</h2>
                            <p className="text-lg text-zinc-600 leading-relaxed text-pretty">
                                {event.description}
                            </p>
                        </div>

                        {/* Details */}
                        {event.details && (
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 mb-4">Dettagli</h2>
                                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                                    <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                                        {event.details}
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Attachments */}
                        {attachmentList.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 mb-4">Documenti & Programma</h2>
                                <div className="space-y-2">
                                    {attachmentList.map((attachment, i) => {
                                        const fileName = attachment.split('/').pop() || `Documento ${i + 1}`
                                        return (
                                            <a
                                                key={i}
                                                href={attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all group"
                                            >
                                                <FileText className="size-5 text-zinc-400 group-hover:text-zinc-600" />
                                                <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 flex-1">{fileName}</span>
                                                <Download className="size-4 text-zinc-400 group-hover:text-zinc-600" />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Action */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center space-y-4">
                            <h3 className="text-lg font-bold text-zinc-900">Partecipa all&apos;evento</h3>

                            {!isLoggedIn ? (
                                /* Not logged in — prompt to login */
                                <div className="space-y-3">
                                    <div className="p-4 bg-zinc-100 text-zinc-500 rounded-xl border border-zinc-200">
                                        <Lock className="size-8 mx-auto mb-2 text-zinc-400" />
                                        <p className="font-bold text-zinc-700">Accedi per prenotarti</p>
                                        <p className="text-xs mt-1">Devi effettuare l&apos;accesso o registrarti per prenotare un posto a questo evento.</p>
                                    </div>
                                    <Link
                                        href={`/login`}
                                        className={cn(
                                            "w-full py-3 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2",
                                            theme.bg
                                        )}
                                    >
                                        <LogIn className="size-5" />
                                        Accedi o Registrati
                                    </Link>
                                </div>
                            ) : registrationStatus === "success" || event.isRegistered ? (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                                    <CheckCircle className="size-8 mx-auto mb-2" />
                                    <p className="font-bold">Registrazione Confermata!</p>
                                    <p className="text-xs mt-1">Trovi il biglietto nella tua Dashboard.</p>
                                </div>
                            ) : booking.canBook ? (
                                <>
                                    <button
                                        onClick={handleRegister}
                                        disabled={isRegistering}
                                        className={cn(
                                            "w-full py-4 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
                                            theme.bg
                                        )}
                                    >
                                        <Ticket className="size-5" />
                                        {isRegistering ? "Registrazione in corso..." : "Prenota il tuo posto"}
                                    </button>
                                    {registrationStatus === "error" && (
                                        <p className="text-sm font-bold text-red-500">{message}</p>
                                    )}
                                    {/* Booking window info */}
                                    {event.bookingEnd && (
                                        <p className="text-xs text-zinc-500">
                                            Prenotazioni aperte fino al {formatDate(event.bookingEnd)} alle {formatTime(event.bookingEnd)}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="p-4 bg-zinc-100 text-zinc-500 rounded-xl border border-zinc-200">
                                    <Lock className="size-8 mx-auto mb-2 text-zinc-400" />
                                    <p className="font-bold text-zinc-700">Prenotazione non disponibile</p>
                                    <p className="text-xs mt-1">{booking.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Info summary */}
                        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                            <h3 className="font-bold text-zinc-900 mb-3">Informazioni</h3>
                            <ul className="space-y-2 text-sm text-zinc-600">
                                <li className="flex items-center gap-2"><Calendar className="size-4 text-zinc-400" /> <strong className="text-zinc-800">Data:</strong> {formattedDate}{hasEndDate && ` – ${formatDate(event.endDate!)}`}</li>
                                <li className="flex items-center gap-2"><Clock className="size-4 text-zinc-400" /> <strong className="text-zinc-800">Orario:</strong> {formattedTime}</li>
                                <li className="flex items-center gap-2"><MapPin className="size-4 text-zinc-400" /> <strong className="text-zinc-800">Luogo:</strong> {event.location}</li>
                                {event.cfuValue && (
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                                        <div>
                                            <strong className="text-zinc-800">CFU:</strong> {event.cfuValue}
                                            <div className="text-xs text-zinc-500 mt-0.5">
                                                ({event.cfuType === 'SENATO'
                                                    ? 'Valido per tutto l\'ateneo'
                                                    : `Dipartimenti: ${event.cfuDepartments}`})
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
