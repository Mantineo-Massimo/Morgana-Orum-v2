"use client"

import { useEffect, useState } from 'react'
import {
    Landmark, Briefcase, BookOpen, HeartPulse, MapPin, Navigation, ArrowRight, Utensils, Building2, Library, Stethoscope, Scale, Dumbbell, FlaskConical,
    Cpu, Building, BookOpenText, Lightbulb, GraduationCap, PawPrint, Calculator, Users, School, Brain, Book, FileText, Ambulance, Hospital, Dna, Microscope,
    Stethoscope as StethoscopeIcon
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { renderToString } from 'react-dom/server'

// Custom hook to handle map recentering
function ChangeView({ center, zoom }: { center: [number, number] | null, zoom: number }) {
    const map = useMap()
    if (center) {
        map.flyTo(center, zoom, {
            animate: true,
            duration: 1.5
        })
    }
    return null
}

function MapInteractionController({ activePoloIndex }: { activePoloIndex: number | null }) {
    const map = useMap();
    useEffect(() => {
        const shouldEnableInteraction = activePoloIndex !== null;

        if (shouldEnableInteraction) {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.enable();
            map.touchZoom.enable();
        } else {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
            map.touchZoom.disable();
        }
    }, [activePoloIndex, map]);
    return null;
}



const POLI = [
    {
        name: "Polo Papardo",
        address: "Viale F. Stagno d'Alcontres, 31",
        departments: ["Ingegneria", "Mift", "Chibiofaram"],
        position: [38.260137, 15.597834] as [number, number],
        color: "purple",
        icon: FlaskConical,
        mensa: "Pranzo 12:00-14:30 | Cena 19:00-20:30 (Lun-Ven)",
        mapsLink: "https://maps.app.goo.gl/yM4tU9kR8Q7KzP1H6",
        subLocations: [
            { name: "Ingegneria", position: [38.259000, 15.596254] as [number, number], icon: Landmark },
            { name: "Edificio A", position: [38.260040, 15.598920] as [number, number], icon: Building },
            { name: "Edificio B", position: [38.261679, 15.597456] as [number, number], icon: Building },
            { name: "Edificio SBA", position: [38.261051, 15.597697] as [number, number], icon: Building },
            { name: "Ex Incubatore", position: [38.258916, 15.597802] as [number, number], icon: Lightbulb },
            { name: "Aula Magna 'Vittorio Ricevuto'", position: [38.260466, 15.598285] as [number, number], icon: GraduationCap },
            { name: "Mensa Papardo", position: [38.261317, 15.598346] as [number, number], icon: Utensils },
        ]
    },
    {
        name: "Polo Annunziata",
        address: "Viale J. Palatucci, 13",
        departments: ["Veterinaria", "CUS", "Dicam", "Scienze Gastronomiche"],
        position: [38.230414, 15.551735] as [number, number],
        color: "green",
        icon: Dumbbell,
        mensa: "Pranzo (Lun-Ven) 12:00-14:30 | Cena (Lun-Gio) 19:00-20:30",
        mapsLink: "https://maps.app.goo.gl/YwJmD1X2qWj6hK2r6",
        subLocations: [
            { name: "Veterinaria", position: [38.230933, 15.551687] as [number, number], icon: Landmark },
            { name: "CUS Unime", position: [38.230191, 15.551850] as [number, number], icon: Dumbbell },
            { name: "DICAM", position: [38.230731, 15.550853] as [number, number], icon: Landmark },
            { name: "Mensa Annunziata", position: [38.229576, 15.550541] as [number, number], icon: Utensils },
        ]
    },
    {
        name: "Polo Centrale",
        address: "Piazza Pugliatti, 1",
        departments: ["Rettorato", "Giurisprudenza", "Economia", "Scipo", "Cospecs", "Aulario", "Polo Culturale (Sala Lettura)", "Segreterie Amm. (P.zza Antonello)"],
        position: [38.189431, 15.553146] as [number, number],
        color: "blue",
        icon: Landmark,
        mensa: "Pranzo 12:00-14:30 | Cena 19:00-20:30 (Tutti i giorni)",
        mapsLink: "https://maps.app.goo.gl/w1qf41CZbZ2h8h8j7",
        subLocations: [
            { name: "Rettorato", position: [38.189254, 15.552924] as [number, number], icon: Landmark },
            { name: "Giurisprudenza", position: [38.188917, 15.553492] as [number, number], icon: Landmark },
            { name: "Economia", position: [38.189794, 15.553435] as [number, number], icon: Landmark },
            { name: "SCIPOG", position: [38.192475, 15.547022] as [number, number], icon: Landmark },
            { name: "Aulario", position: [38.1929016, 15.5445094] as [number, number], icon: School },
            { name: "COSPECS", position: [38.199436, 15.556059] as [number, number], icon: Landmark },
            { name: "Mensa Centro", position: [38.185629, 15.552082] as [number, number], icon: Utensils },
            { name: "Sala Lettura", position: [38.186811, 15.559199] as [number, number], icon: Book },
            { name: "Segreterie Amministrative", position: [38.193571, 15.554283] as [number, number], icon: FileText },
        ]
    },
    {
        name: "Polo Policlinico",
        address: "Via Consolare Valeria, 1",
        departments: ["Biomorf", "Dimed", "Patologia Umana"],
        position: [38.165571, 15.534250] as [number, number] as [number, number],
        color: "red",
        icon: HeartPulse,
        mensa: "Pranzo 12:00-14:30 (Lun-Ven)",
        mapsLink: "https://maps.app.goo.gl/QcZ9wR4yU3HkK6h2A",
        subLocations: [
            { name: "Pronto Soccorso", position: [38.163103, 15.536977] as [number, number], icon: Ambulance },
            { name: "Padiglione A", position: [38.164522, 15.537167] as [number, number], icon: Hospital },
            { name: "Padiglione B", position: [38.165304, 15.537629] as [number, number], icon: Hospital },
            { name: "Padiglione C", position: [38.166091, 15.535710] as [number, number], icon: Hospital },
            { name: "Padiglione D", position: [38.166604, 15.535080] as [number, number], icon: Hospital },
            { name: "Padiglione E", position: [38.163323, 15.536765] as [number, number], icon: Hospital },
            { name: "Padiglione F", position: [38.163323, 15.536765] as [number, number], icon: Hospital },
            { name: "Padiglione G", position: [38.164600, 15.535323] as [number, number], icon: Hospital },
            { name: "Padiglione H", position: [38.163581, 15.534445] as [number, number], icon: Hospital },
            { name: "Padiglione L", position: [38.162286, 15.537303] as [number, number], icon: Hospital },
            { name: "Padiglione W", position: [38.164445, 15.536355] as [number, number], icon: Hospital },
            { name: "Padiglione NI", position: [38.162590, 15.536059] as [number, number], icon: Hospital },
            { name: "Polo Didattico", position: [38.166744, 15.531219] as [number, number], icon: School },
            { name: "Centro Congressi", position: [38.167258, 15.529835] as [number, number], icon: Users },
            { name: "Torre Biologica", position: [38.167571, 15.528923] as [number, number], icon: Dna },
            { name: "Mensa Policlinico", position: [38.163813, 15.535968] as [number, number], icon: Utensils },
        ]
    }
]

// Function to create a custom HTML glass pin using Tailwind classes
const createCustomPin = (color: string, Icon: React.ElementType, isActive: boolean) => {
    const iconHtml = renderToString(<Icon className="w-6 h-6" />)

    return L.divIcon({
        className: 'custom-map-pin bg-transparent border-0',
        html: `
            <div class="relative flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-125 -translate-y-2' : ''}">
                <div class="absolute inset-0 bg-${color}-400 rounded-full blur-xl transition-all duration-500 ${isActive ? 'opacity-60 scale-150' : 'opacity-0 scale-50'}" style="z-index: 0;"></div>
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-${color}-50 text-${color}-500 relative z-10">
                    ${iconHtml}
                </div>
                <div class="absolute -bottom-3 w-6 h-2 bg-black/10 blur-sm rounded-full"></div>
            </div>
        `,
        iconSize: [56, 56],
        iconAnchor: [28, 56],
        popupAnchor: [0, -60]
    });
}

// Sub location pin
const createSubPin = (color: string, Icon: React.ElementType) => {
    const iconHtml = renderToString(<Icon className="w-4 h-4" />)

    return L.divIcon({
        className: 'custom-map-pin bg-transparent border-0',
        html: `
            <div class="relative flex items-center justify-center transition-all duration-300">
                <div class="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-${color}-100 text-${color}-500 relative z-10 group-hover:scale-110 transition-transform">
                    ${iconHtml}
                </div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -20]
    });
}

export default function InteractiveMap() {
    const [activePoloIndex, setActivePoloIndex] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Default Map center: adjusted to see all poles correctly on small zoom
    const defaultCenter: [number, number] = [38.2100, 15.5500]

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex-1 w-full rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200/50 bg-zinc-50 relative min-h-[600px] z-0">


                {activePoloIndex !== null && (
                    <button
                        onClick={() => setActivePoloIndex(null)}
                        className="absolute top-4 right-4 z-[1000] bg-white text-zinc-800 px-4 py-2.5 rounded-full shadow-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 border border-zinc-200 transition-all flex items-center gap-2"
                    >
                        Torna alla vista globale
                    </button>
                )}

                {mounted && (
                    <MapContainer
                        center={defaultCenter}
                        zoom={11.5}
                        zoomSnap={0.5}
                        scrollWheelZoom={false}
                        dragging={false}
                        doubleClickZoom={false}
                        zoomControl={false}
                        touchZoom={false}
                        className="w-full h-full"
                        style={{ height: "100%", minHeight: "600px" }}
                    >
                        <MapInteractionController activePoloIndex={activePoloIndex} />
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <ChangeView center={activePoloIndex !== null ? POLI[activePoloIndex].position : defaultCenter} zoom={activePoloIndex !== null ? 15 : 11.5} />

                        {POLI.map((polo, index) => {
                            const isActive = activePoloIndex === index

                            // Don't render other main markers if one is active
                            if (activePoloIndex !== null && !isActive) return null

                            return (
                                <div key={index}>
                                    {/* Main marker is ONLY rendered if NOT active */}
                                    {!isActive && (
                                        <Marker
                                            position={polo.position}
                                            icon={createCustomPin(polo.color, polo.icon, isActive)}
                                            eventHandlers={{
                                                click: () => setActivePoloIndex(index),
                                            }}
                                        >
                                            <Popup className="custom-popup" closeButton={false} minWidth={320}>
                                                <style dangerouslySetInnerHTML={{
                                                    __html: `
                                                    .leaflet-popup-content-wrapper { padding: 0 !important; background: transparent !important; box-shadow: none !important; }
                                                    .leaflet-popup-tip { opacity: 0; }
                                                    .leaflet-popup-content { margin: 0 !important; width: 320px !important; }
                                                `}} />

                                                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-zinc-100 pointer-events-auto">
                                                    <div className="w-4 h-4 bg-white border-b border-r border-zinc-100 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 z-0"></div>

                                                    <span className={`inline-block py-0.5 px-2 rounded-md bg-${polo.color}-50 text-${polo.color}-600 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10`}>{polo.name}</span>
                                                    <h3 className="font-serif font-bold text-lg text-foreground mb-1 leading-tight relative z-10">{polo.name}</h3>
                                                    <p className="text-xs text-zinc-500 mb-3 flex items-start gap-1 relative z-10">
                                                        <MapPin className="w-3 h-3 mt-0.5 shrink-0" /> {polo.address}
                                                    </p>
                                                    {polo.mensa && (
                                                        <div className="bg-amber-50 rounded-lg p-2.5 mb-3 border border-amber-100 relative z-10">
                                                            <p className="text-[10px] text-amber-800 font-medium leading-[1.4]">
                                                                <span className="font-bold flex items-center gap-1 mb-1 text-[11px] text-amber-900">
                                                                    <Utensils className="w-3 h-3" /> Orari Mensa ERSU
                                                                </span>
                                                                {polo.mensa}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-wrap gap-1 relative z-10 mb-3">
                                                        {polo.departments.slice(0, 3).map((d, i) => (
                                                            <span key={i} className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200">
                                                                {d}
                                                            </span>
                                                        ))}
                                                        {polo.departments.length > 3 && <span className="text-[9px] text-zinc-400 font-medium px-1">+{polo.departments.length - 3}</span>}
                                                    </div>
                                                    <a
                                                        href={polo.mapsLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex justify-center items-center gap-2 text-xs font-bold text-white uppercase tracking-wider py-2 rounded-lg transition-colors w-full relative z-10 bg-${polo.color}-500 hover:bg-${polo.color}-600`}
                                                    >
                                                        Apri Google Maps <Navigation className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )}

                                    {/* Render Sub Locations if this Polo is active */}
                                    {isActive && polo.subLocations && polo.subLocations.map((sub, sIdx) => {
                                        const SubIcon = sub.icon
                                        return (
                                            <Marker
                                                key={`sub-${sIdx}`}
                                                position={sub.position}
                                                icon={createSubPin(polo.color, SubIcon)}
                                            >
                                                <Popup className="custom-popup" closeButton={false} minWidth={180}>
                                                    <style dangerouslySetInnerHTML={{
                                                        __html: `
                                                        .leaflet-popup-content-wrapper { padding: 0 !important; background: transparent !important; box-shadow: none !important; }
                                                        .leaflet-popup-tip { opacity: 0; }
                                                        .leaflet-popup-content { margin: 0 !important; width: 180px !important; }
                                                    `}} />
                                                    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl p-3 border border-zinc-100 text-center relative pointer-events-auto">
                                                        <div className="w-3 h-3 bg-white border-b border-r border-zinc-100 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-0"></div>
                                                        <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-md bg-${polo.color}-50 text-${polo.color}-600 text-[8px] font-bold uppercase tracking-widest mb-1.5 relative z-10`}>
                                                            <SubIcon className="w-2.5 h-2.5" />
                                                            {polo.name}
                                                        </span>
                                                        <h4 className="font-bold text-sm text-foreground leading-tight relative z-10">{sub.name}</h4>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </MapContainer>
                )}
            </div>

            {/* Interactive Grid Buttons Below Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 z-20">
                {POLI.map((polo, i) => {
                    const Icon = polo.icon
                    const isActive = activePoloIndex === i
                    return (
                        <div
                            key={i}
                            onMouseEnter={() => { }} // Remove hover interactions as it would constantly zoom map
                            onMouseLeave={() => { }}
                            onClick={() => setActivePoloIndex(i)}
                            className={`flex flex-col h-full p-5 rounded-2xl border transition-all cursor-pointer group bg-white/80 backdrop-blur-sm ${isActive ? `border-${polo.color}-300 shadow-xl ring-2 ring-${polo.color}-100 scale-[1.02] -translate-y-1` : 'border-zinc-200/60 shadow-sm hover:border-zinc-300 hover:shadow-md'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? `bg-${polo.color}-500 text-white shadow-md` : `bg-${polo.color}-50 text-${polo.color}-500 group-hover:bg-${polo.color}-100`}`}>
                                    <Icon className="size-5" />
                                </div>
                                <a
                                    href={polo.mapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`size-8 rounded-full flex items-center justify-center bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 transition-colors border border-zinc-200/50`}
                                    title="Apri indicazioni Google Maps"
                                >
                                    <Navigation className="size-3.5" />
                                </a>
                            </div>
                            <h4 className="font-bold text-foreground text-sm mb-1">{polo.name}</h4>
                            <p className="text-[10px] text-zinc-500 leading-tight mb-3 line-clamp-2" title={polo.departments.join(", ")}>{polo.departments.join(", ")}</p>

                            {polo.mensa && (
                                <div className={`mb-4 p-2 rounded-md border mt-auto transition-colors ${isActive ? `bg-${polo.color}-50/50 border-${polo.color}-100` : 'bg-amber-50/80 border-amber-100'}`}>
                                    <p className={`text-[9px] font-medium leading-tight flex flex-col gap-0.5 ${isActive ? `text-${polo.color}-800` : 'text-amber-800'}`}>
                                        <span className={`font-bold text-[10px] flex items-center gap-1 ${isActive ? `text-${polo.color}-900` : 'text-amber-900'}`}>
                                            <Utensils className="size-2.5" /> Mensa ERSU
                                        </span>
                                        {polo.mensa}
                                    </p>
                                </div>
                            )}

                            <div className={`mt-auto text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit transition-colors ${isActive ? `text-${polo.color}-600` : `text-zinc-400 group-hover:text-zinc-600`}`}>
                                {isActive ? 'In visualizzazione' : 'Esplora Polo'} <ArrowRight className={`size-3 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
