"use client"

import { Loader2 } from "lucide-react"

export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-12 animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center">
                {/* Brand gradient ring spinner */}
                <div className="size-16 rounded-full border-4 border-slate-200/60 border-t-[#c9041a] animate-spin shadow-sm"></div>
                {/* Inside small glowing pulse */}
                <div className="absolute size-6 rounded-full bg-[#18182e] animate-pulse"></div>
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-widest text-zinc-450 text-zinc-400 animate-pulse">
                Caricamento console...
            </p>
        </div>
    )
}
