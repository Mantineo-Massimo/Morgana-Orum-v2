"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrand } from "@/components/brand-provider"

export function Footer() {
    const { brand } = useBrand()
    const bgColor = "bg-zinc-900"
    const textColor = "text-white"
    const mutedColor = "text-white/70 hover:text-white"

    // Mapping per i loghi e nomi del network
    const networkInfo: Record<string, { name: string, logo: string }> = {
        unimhealth: { name: "Unimhealth", logo: "/assets/unimhealth.png" },
        economia: { name: "Studenti Economia", logo: "/assets/studentieconomia.png" },
        matricole: { name: "Unime Matricole", logo: "/assets/unimematricole.png" },
        scipog: { name: "Studenti Scipog", logo: "/assets/studentiscipog.png" },
        dicam: { name: "Inside Dicam", logo: "/assets/insidedicam.png" },
    }

    const currentNetwork = brand && networkInfo[brand] ? networkInfo[brand] : null

    const BRAND_COLORS: Record<string, string> = {
        unimhealth: "text-[#c9041a]",
        economia: "text-[#202549]",
        matricole: "text-[#f6f6f6]",
        scipog: "text-[#fbc363]",
        dicam: "text-[#f34ab4]"
    }

    const SOCIAL_MAPPING: Record<string, string> = {
        matricole: "unime.matricole",
        unimhealth: "unimhealth",
        economia: "studentieconomia",
        scipog: "studentiscipog",
        dicam: "insidedicam"
    }

    const networkIG = brand && SOCIAL_MAPPING[brand] ? SOCIAL_MAPPING[brand] : null
    const networkColor = brand && BRAND_COLORS[brand] ? BRAND_COLORS[brand] : null

    return (
        <footer id="site-footer" className={cn("w-full pt-16 pb-8", bgColor, textColor)}>
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Column 1: Brand Info */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 mb-2">
                            {/* Logos Row */}
                            <div className="flex items-center gap-3">
                                {/* Morgana */}
                                <Link href="/" className="relative h-14 w-14 hover:scale-110 transition-transform cursor-pointer">
                                    <Image src="/assets/morgana.png" alt="Morgana logo" fill className="object-contain" sizes="56px" />
                                </Link>
                                {/* Orum */}
                                <Link href="/" className="relative h-14 w-14 hover:scale-110 transition-transform cursor-pointer">
                                    <Image src="/assets/orum.png" alt="Orum logo" fill className="object-contain" sizes="56px" />
                                </Link>
                                {/* Azione Universitaria */}
                                <a href="https://azioneuniversitaria.it" target="_blank" rel="noopener noreferrer" className="relative h-14 w-14 hover:scale-110 transition-transform cursor-pointer">
                                    <Image src="/assets/azione.png" alt="Azione Universitaria logo" fill className="object-contain" sizes="56px" />
                                </a>
                                {currentNetwork && (
                                    <>
                                        <div className="w-px h-8 bg-white/20 mx-1"></div>
                                        <div className="relative h-14 w-14 hover:scale-110 transition-transform">
                                            <Image src={currentNetwork.logo} alt={`${currentNetwork.name} logo`} fill className="object-contain" sizes="56px" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-90">
                                Associazioni Universitarie <br />
                                Morgana & O.R.U.M.
                            </p>
                            <p className="text-[11px] leading-relaxed opacity-60 italic font-medium">
                                Impegno, passione e competenza al servizio della comunità accademica.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://www.facebook.com/Morgana.Associazione/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors"><Facebook className="size-5" /></a>
                            <a href="https://www.instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors"><Instagram className="size-5" /></a>
                            <a href="https://www.youtube.com/@morganaassociazione5592" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors"><Youtube className="size-5" /></a>
                            <div className="w-px h-5 bg-white/20 mx-1"></div>
                            <a href="https://www.facebook.com/AssociazioneOrum/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Facebook className="size-5" /></a>
                            <a href="https://www.instagram.com/orum_unime" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><Instagram className="size-5" /></a>
                            {networkIG && (
                                <>
                                    <div className="w-px h-5 bg-white/20 mx-1"></div>
                                    <a href={`https://www.instagram.com/${networkIG}`} target="_blank" rel="noopener noreferrer" className={cn("transition-colors", networkColor ? `hover:${networkColor}` : "hover:text-primary", networkColor)}>
                                        <Instagram className="size-5" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Navigazione */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold font-serif uppercase tracking-widest mb-2 border-b border-white/20 pb-2 w-fit">
                            Navigazione
                        </h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="/" className={cn("transition-colors", mutedColor)}>Home Portale</Link></li>
                            <li><Link href={`/about`} className={cn("transition-colors", mutedColor)}>Chi Siamo</Link></li>
                            <li><Link href={`/news`} className={cn("transition-colors", mutedColor)}>Notizie</Link></li>
                            <li><Link href={`/events`} className={cn("transition-colors", mutedColor)}>Eventi</Link></li>
                            <li><Link href={`/representatives`} className={cn("transition-colors", mutedColor)}>Rappresentanti</Link></li>
                            <li><Link href={`/login`} className={cn("transition-colors font-bold", mutedColor)}>Area Riservata</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Il Nostro Network */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold font-serif uppercase tracking-widest mb-2 border-b border-white/20 pb-2 w-fit">
                            Il Network
                        </h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="/network/unimhealth" className={cn("transition-colors", mutedColor)}>Unimhealth</Link></li>
                            <li><Link href="/network/economia" className={cn("transition-colors", mutedColor)}>Studenti Economia</Link></li>
                            <li><Link href="/network/matricole" className={cn("transition-colors", mutedColor)}>Unime Matricole</Link></li>
                            <li><Link href="/network/scipog" className={cn("transition-colors", mutedColor)}>Studenti Scipog</Link></li>
                            <li><Link href="/network/dicam" className={cn("transition-colors", mutedColor)}>Inside Dicam</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Link Utili / Legali */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold font-serif uppercase tracking-widest mb-2 border-b border-white/20 pb-2 w-fit">
                            Link Utili
                        </h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href="/statuto" className={cn("transition-colors", mutedColor)}>Statuto Associazione</Link></li>
                            <li><Link href="#" className={cn("transition-colors", mutedColor)}>Iscriviti</Link></li>
                            <li><Link href="/privacy" className={cn("transition-colors", mutedColor)}>Privacy Policy</Link></li>
                            <li><Link href="/cookies" className={cn("transition-colors", mutedColor)}>Cookie Policy</Link></li>
                            <li><Link href="/contact" className={cn("transition-colors", mutedColor)}>Contattaci</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contatti */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold font-serif uppercase tracking-widest mb-2 border-b border-white/20 pb-2 w-fit">
                            Contatti
                        </h3>
                        <div className="flex flex-col gap-3 text-sm opacity-80">
                            <div className="flex items-start gap-3">
                                <MapPin className="size-4 mt-1 shrink-0" />
                                <span>
                                    Via Sant&apos;Elia, 11<br />
                                    98122 Messina (ME)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <a href="mailto:associazionemorgana@gmail.com" className="hover:underline text-red-100">associazionemorgana@gmail.com</a>
                                    <a href="mailto:orum_unime@gmail.com" className="hover:underline text-blue-100">orum_unime@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Box */}
                <div className="mb-16 bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-2xl font-serif font-black mb-2">Iscriviti alla Newsletter</h3>
                        <p className="text-white/60 font-medium">Ricevi aggiornamenti su eventi, scadenze universitarie e nuove convenzioni.</p>
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const email = new FormData(e.currentTarget).get('email') as string;
                            // Simple alert for now as we don't have a dedicated "subscribe" only action yet
                            // but we can point it to a new action or just explain it's linked to the portal account
                            alert("Grazie! Ti contatteremo presto per confermare l'iscrizione.");
                        }}
                        className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
                    >
                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="Il tuo indirizzo email"
                            className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30 font-medium w-full sm:min-w-[300px]"
                        />
                        <button
                            type="submit"
                            className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shrink-0"
                        >
                            Iscriviti
                        </button>
                    </form>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-60">
                    <p className="text-center md:text-left">© {new Date().getFullYear()} Associazioni Universitarie Morgana & O.R.U.M.. Tutti i diritti riservati.</p>
                    <div className="w-full md:w-auto border-t border-white/10 md:border-0 pt-4 md:pt-0 text-center md:text-right">
                        <p>Designed by Massimo Mantineo</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}