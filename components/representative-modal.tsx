"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Landmark, Mail, Phone, Instagram, User } from "lucide-react"
import { getRoleIcon } from "@/lib/role-icons"

interface RepresentativeModalProps {
    isOpen: boolean
    onClose: () => void
    representative: any
}

export function RepresentativeModal({ isOpen, onClose, representative }: RepresentativeModalProps) {
    if (!representative) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-white p-0 border-0 max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Image & Basic Info */}
                    <div className="w-full md:w-2/5 bg-zinc-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 relative">
                        {/* Logo in background opacity */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={
                                    representative.listName === "MORGANA" ? "/assets/morgana.png" :
                                        representative.listName === "O.R.U.M." ? "/assets/orum.png" :
                                            "/assets/azione.png"
                                }
                                alt={representative.listName}
                                className="w-4/5 object-contain grayscale"
                            />
                        </div>

                        <div className="size-48 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden mb-6 relative z-10">
                            {representative.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={representative.image} alt={representative.name} className="size-full object-cover" />
                            ) : (
                                <User className="size-20 text-zinc-300 m-auto mt-12" />
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-center text-zinc-900 leading-tight mb-2 relative z-10">{representative.name}</h2>
                        <span className="inline-block px-4 py-1.5 bg-zinc-200 rounded-full text-xs font-bold text-zinc-600 mb-6 relative z-10">
                            {representative.listName === "AZIONE" ? "Azione Universitaria" : representative.listName}
                        </span>

                        {/* Contact Info - full text */}
                        <div className="flex flex-col gap-2 w-full relative z-10">
                            {representative.email && (
                                <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 w-full">
                                    <Mail className="size-4 shrink-0" />
                                    <span className="text-sm break-all">{representative.email}</span>
                                </div>
                            )}
                            {representative.phone && (
                                <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50 rounded-lg border border-green-100 text-green-700 w-full">
                                    <Phone className="size-4 shrink-0" />
                                    <span className="text-sm">{representative.phone}</span>
                                </div>
                            )}
                            {representative.instagram && (
                                <div className="flex items-center gap-3 px-4 py-2.5 bg-pink-50 rounded-lg border border-pink-100 text-pink-700 w-full">
                                    <Instagram className="size-4 shrink-0" />
                                    <span className="text-sm break-all">{representative.instagram}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="w-full md:w-3/5 p-8">
                        <DialogHeader className="mb-6 text-left">
                            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                {(() => { const Icon = getRoleIcon(representative.role || ""); return <Icon className="size-5 text-zinc-400" /> })()}
                                {representative.role || representative.department || "Rappresentante"}
                            </h3>
                            <p className="text-sm text-zinc-500">
                                {(() => {
                                    const term = representative.term || ''
                                    const parts = term.split('-')
                                    if (parts.length === 2) {
                                        const years = parseInt(parts[1]) - parseInt(parts[0])
                                        const label = years === 2 ? 'Biennio' : years === 3 ? 'Triennio' : years === 4 ? 'Quadriennio' : 'Mandato'
                                        return `${label} ${term}`
                                    }
                                    return term
                                })()}
                            </p>
                        </DialogHeader>

                        <div className="space-y-6">
                            {representative.description && (
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Chi Sono</h4>
                                    <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                                        {representative.description}
                                    </p>
                                </div>
                            )}

                            {representative.roleDescription && (
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Il Mio Ruolo</h4>
                                    <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                                        {representative.roleDescription}
                                    </p>
                                </div>
                            )}

                            {(!representative.description && !representative.roleDescription) && (
                                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 text-center text-zinc-500 text-sm italic">
                                    Nessuna descrizione aggiuntiva disponibile.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
