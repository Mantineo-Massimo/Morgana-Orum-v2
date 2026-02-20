import { Construction } from "lucide-react"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 grid place-items-center p-6">
            <div className="text-center max-w-md">
                <div className="mx-auto w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <Construction className="size-10 text-zinc-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Impostazioni in Arrivo</h1>
                <p className="text-zinc-500 mb-6">Stiamo lavorando per darti il pieno controllo del tuo account. Torna presto!</p>
                <div className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm text-left">
                    <h3 className="font-bold text-sm mb-2">Cosa potrai fare:</h3>
                    <ul className="text-xs text-zinc-500 space-y-2 list-disc list-inside">
                        <li>Modificare la password</li>
                        <li>Gestire le notifiche email</li>
                        <li>Aggiornare i dati del profilo</li>
                        <li>Scaricare tutti i tuoi dati (GDPR)</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
