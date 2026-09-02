"use client"

import { useState, useEffect, useRef } from "react"
import { getPartnerSession, verifyStudentQrCode } from "@/app/actions/partner"
import { useRouter } from "@/i18n/routing"
import { QrCode, Camera, CheckCircle2, XCircle, Loader2, RefreshCw, UserCheck, Shield, AlertTriangle } from "lucide-react"

export default function PartnerScannerPage() {
    const router = useRouter()
    const [loadingSession, setLoadingSession] = useState(true)
    const [partner, setPartner] = useState<any>(null)

    const [scanning, setScanning] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [manualToken, setManualToken] = useState("")
    const [scanResult, setScanResult] = useState<any | null>(null)
    const [scannerError, setScannerError] = useState<string | null>(null)

    const html5QrCodeRef = useRef<any>(null)

    // Check Partner Session on Mount
    useEffect(() => {
        getPartnerSession().then((session) => {
            if (!session) {
                router.push("/partner/login")
            } else {
                setPartner(session)
                setLoadingSession(false)
            }
        })
    }, [router])

    // Initialize HTML5 QR Code Scanner
    const startScanner = async () => {
        setScannerError(null)
        setScanResult(null)

        try {
            const { Html5Qrcode } = await import("html5-qrcode")
            
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode("qr-reader")
            }

            setScanning(true)

            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                async (decodedText: string) => {
                    // Success callback
                    if (html5QrCodeRef.current?.isScanning) {
                        await html5QrCodeRef.current.stop()
                    }
                    setScanning(false)
                    handleVerify(decodedText)
                },
                (errorMessage: string) => {
                    // Ignore frame scanning errors
                }
            )
        } catch (err: any) {
            console.error("Camera access error:", err)
            setScanning(false)
            setScannerError("Impossibile accedere alla fotocamera. Verifica i permessi del browser o inserisci il codice manualmente.")
        }
    }

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop()
            } catch (e) {
                console.error("Error stopping scanner:", e)
            }
        }
        setScanning(false)
    }

    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(() => {})
            }
        }
    }, [])

    const handleVerify = async (token: string) => {
        if (!token) return
        setVerifying(true)
        setScanResult(null)

        // Haptic feedback if supported
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(100)
        }

        const res = await verifyStudentQrCode(token)
        setVerifying(false)
        setScanResult(res)
    }

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (manualToken.trim()) {
            handleVerify(manualToken.trim())
            setManualToken("")
        }
    }

    if (loadingSession) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-[#18182e] mb-4" />
                <p className="text-sm font-bold text-slate-600">Verifica sessione in corso...</p>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black text-[#c9041a] uppercase tracking-widest bg-red-50 border border-red-150 px-2.5 py-1 rounded-full">
                        Scanner Tessere Live
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                        Verifica Tessera Studente
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Inquadra il QR Code presente sul telefono dello studente per verificare la validità.
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center shrink-0">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Convenzione</span>
                    <span className="font-black text-sm text-slate-800">{partner?.conventionName}</span>
                </div>
            </div>

            {/* Verification Result Banner / Card */}
            {verifying && (
                <div className="bg-white rounded-3xl p-8 border border-blue-200 shadow-xl text-center space-y-3 animate-pulse">
                    <Loader2 className="size-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-lg font-black text-slate-800">Verifica in corso nel database...</p>
                </div>
            )}

            {scanResult && (
                <div className={`rounded-3xl p-8 border shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300 ${
                    scanResult.isValid 
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20" 
                        : "bg-red-600 text-white border-red-700 shadow-red-600/20"
                }`}>
                    <div className="size-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mx-auto flex items-center justify-center shadow-inner">
                        {scanResult.isValid ? (
                            <CheckCircle2 className="size-12 text-white" />
                        ) : (
                            <XCircle className="size-12 text-white" />
                        )}
                    </div>

                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-black uppercase tracking-widest mb-2">
                            {scanResult.isValid ? "TESSERA ATTIVA E VALIDA 🟢" : "NON VALIDA 🔴"}
                        </span>
                        
                        {scanResult.isValid && scanResult.student ? (
                            <div className="space-y-3 mt-3">
                                <h3 className="text-3xl font-black tracking-tight leading-none">
                                    {scanResult.student.name} {scanResult.student.surname}
                                </h3>
                                <p className="text-sm font-bold opacity-90">
                                    Matricola: #{scanResult.student.matricola}
                                </p>
                                <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2">
                                    <span className="px-3 py-1 bg-white/20 rounded-xl text-xs font-extrabold uppercase">
                                        {scanResult.student.department}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 rounded-xl text-xs font-extrabold uppercase">
                                        {scanResult.student.association}
                                    </span>
                                </div>
                                <p className="text-[11px] opacity-75 pt-2">
                                    Scansione registrata con successo a nome di {partner?.conventionName}.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 mt-3">
                                <h3 className="text-2xl font-black tracking-tight">Verifica Fallita</h3>
                                <p className="text-sm font-semibold opacity-90 max-w-sm mx-auto">
                                    {scanResult.error || "Tessera non riconosciuta o scaduta."}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setScanResult(null)
                            startScanner()
                        }}
                        className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="size-4" />
                        Scannerizza Un Altro Studente
                    </button>
                </div>
            )}

            {/* Scanner Viewport */}
            {!scanResult && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-6">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-square max-w-md mx-auto flex items-center justify-center border-4 border-slate-800 shadow-inner">
                        <div id="qr-reader" className="w-full h-full" />

                        {!scanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-white space-y-4">
                                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <Camera className="size-8 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Fotocamera Pronta</h3>
                                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                                        Premi il pulsante sottostante per avviare la scansione via fotocamera.
                                    </p>
                                </div>
                                <button
                                    onClick={startScanner}
                                    className="py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Camera className="size-4" />
                                    Avvia Fotocamera
                                </button>
                            </div>
                        )}
                    </div>

                    {scannerError && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2">
                            <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{scannerError}</span>
                        </div>
                    )}

                    {scanning && (
                        <div className="flex justify-center">
                            <button
                                onClick={stopScanner}
                                className="py-2.5 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all"
                            >
                                Interrompi Scansione
                            </button>
                        </div>
                    )}

                    {/* Manual Fallback Input */}
                    <div className="border-t border-slate-100 pt-6">
                        <form onSubmit={handleManualSubmit} className="space-y-3">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                                Oppure inserisci il Codice Tessera manualmente:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={manualToken}
                                    onChange={(e) => setManualToken(e.target.value)}
                                    placeholder="Es. uuid-tessera-studente..."
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!manualToken.trim()}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all"
                                >
                                    Verifica
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
