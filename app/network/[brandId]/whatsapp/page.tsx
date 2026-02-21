import { Phone, Users, CheckCircle2, AlertCircle, ArrowRight, Building2 } from "lucide-react"

type CourseGroup = { name: string; link: string };

const DEPARTMENTS: Record<string, CourseGroup[]> = {
    "DICAM (Civiltà Antiche e Moderne)": [
        { name: "L1 Beni Archeologici: territorio, insediamenti, cultura materiale", link: "https://chat.whatsapp.com/KZcGdNRzRyFD6FSfXRApHo?mode=ac_t" },
        { name: "L5 Filosofia", link: "https://chat.whatsapp.com/IBpYfQq98D8LxhbeCNR9IC?mode=ac_t" },
        { name: "L10 Lettere", link: "https://chat.whatsapp.com/K52GZ3ee5SsHkRRBldx2LY?mode=ac_t" },
        { name: "L11 - L12 Lingue, letterature straniere e mediazione linguistica", link: "https://chat.whatsapp.com/LAV3896B2H2JLiGWLroMaj?mode=ac_t" },
        { name: "L20 Scienze dell'informazione", link: "https://chat.whatsapp.com/KhbMdnmNABDBbog8Jq2pPI?mode=ac_t" },
        { name: "LM2 - LM15 Tradizione classica e archeologia", link: "https://chat.whatsapp.com/Dwki9DMbkeKEYZkIp4I3I4?mode=ac_t" },
        { name: "LM14 Civiltà letteraria dell'Italia medievale e moderna", link: "https://chat.whatsapp.com/Fm5RI9UcmGd50rYd0RKhk5?mode=ac_t" },
        { name: "LM19 Metodi e linguaggi del giornalismo", link: "https://chat.whatsapp.com/DBV3Q80p5MlIaot33Omv2A?mode=ac_t" },
        { name: "LM37 Lingue moderne: letterature e traduzione", link: "https://chat.whatsapp.com/BM8gdSHQmRgCHQC0gbYyMc?mode=ac_t" },
        { name: "LM78 Filosofia contemporanea", link: "https://chat.whatsapp.com/Cym4Pm4qVi89arDq2d7FY3?mode=ac_t" },
        { name: "LM84 Scienze storiche", link: "https://chat.whatsapp.com/KDvST5ig7tGEZysNYWPyhu?mode=ac_t" }
    ],
    "Economia": [
        { name: "L18 Economia aziendale", link: "https://chat.whatsapp.com/D3nZVjwPtIU0eINj4NNGuA?mode=ac_t" },
        { name: "L18 Management d'impresa", link: "https://chat.whatsapp.com/LhzjbSuefoE8ujH54oJJWV?mode=ac_t" },
        { name: "L33 Economia, banca e finanza", link: "https://chat.whatsapp.com/ENi7JSkNUrGAmXW9wDLXnx?mode=ac_t" },
        { name: "LM56 Metodi Quantitativi per l'Economia e la Finanza", link: "https://chat.whatsapp.com/ITJfLrifRyo2ZJSWt9z96I?mode=ac_t" },
        { name: "LM77 Consulenza e gestione di impresa", link: "https://chat.whatsapp.com/CatVTLZigEQ0UIugFpX0Bq?mode=ac_t" },
        { name: "LM77 Digital Trasformation e Innovation Managment", link: "https://chat.whatsapp.com/JDkn5dgtrpI2CIWydG23Pw?mode=ac_t" }
    ],
    "Scienze Politiche e Giuridiche (SCIPOG) / Giurisprudenza": [
        { name: "LMG01 Giurisprudenza", link: "https://chat.whatsapp.com/HLwJP2tBoNz1Q6RlZULQ2Z?mode=ac_t" },
        { name: "L14 Consulente del lavoro e scienze dei servizi giuridici", link: "https://chat.whatsapp.com/Hv10lQnAmHN5wXqRObWd0a?mode=ac_t" },
        { name: "L14 Transnational and European Legal Studies", link: "https://chat.whatsapp.com/HnILHdfXFsiE7t4hPVmhSy?mode=ac_t" },
        { name: "L14 Diritto delle Nuove Tecnologie", link: "https://chat.whatsapp.com/KfM3aE7JWV8LrR7HTfc5Ox" },
        { name: "LM/SC-GIUR Diritto dell'Innovazione e della sostenibilità", link: "https://chat.whatsapp.com/G9wmtJAHL8o4epwCasYDlG?mode=ac_t" },
        { name: "L16 Scienze politiche, amministrazione e servizi", link: "https://chat.whatsapp.com/JiTMKoGv3tvGS1L5tUJ2pD" },
        { name: "L36 Scienze politiche e delle relazioni internazionali", link: "https://chat.whatsapp.com/IfWk5cm0ogUCMJix3UVK2z" },
        { name: "L39 Scienze del servizio sociale", link: "https://chat.whatsapp.com/FyoXN0yW4gjFvZkPsSKKrV" },
        { name: "LM52 Relazioni internazionali", link: "https://chat.whatsapp.com/DoLQytacGsR8HpBV5qVoef" },
        { name: "LM63 Scienze delle pubbliche amministrazioni", link: "https://chat.whatsapp.com/Hk2FeofTKJz27TQ30Bt6tn" }
    ],
    "Ingegneria": [
        { name: "L7 Ingegneria civile", link: "https://chat.whatsapp.com/Cc1cX0tEaSrDO5MQfBeZ41?mode=ac_t" },
        { name: "L8 Ingegneria Biomedica", link: "https://chat.whatsapp.com/DSR00zzDeOEJ0zxYBlNr0H?mode=ac_t" },
        { name: "L8 Ingegneria elettronica e informatica", link: "https://chat.whatsapp.com/JghispA6VYF0iINYFIoYUo?mode=ac_t" },
        { name: "L9 Ingegneria Gestionale", link: "https://chat.whatsapp.com/HJxHEyNm9X8AEExao322P5?mode=ac_t" },
        { name: "L9 Ingegneria industriale", link: "https://chat.whatsapp.com/ElsnvJmil6kEfeNxv48QA5?mode=ac_t" },
        { name: "L28 Scienze e tecnologie della navigazione", link: "https://chat.whatsapp.com/KYVTrxWHKmwK45jU4Ee0oq?mode=ac_t" },
        { name: "LM21 Bioingegneria", link: "https://chat.whatsapp.com/GtjeUiVE9NYCaTjdhBnxbT?mode=ac_t" },
        { name: "LM33 Ingegneria meccanica", link: "https://chat.whatsapp.com/Fbf4fCcLDMg7lafwl1VZPx?mode=ac_t" }
    ],
    "Scienze, MIFT e CHIBIOFARAM": [
        { name: "L30 Fisica", link: "https://chat.whatsapp.com/GwtSTTDKKHmJUyrd2SWjuD?mode=r_t" },
        { name: "L31 Informatica", link: "https://chat.whatsapp.com/Lm7t8w5JerO1rXuNyogE8H?mode=r_t" },
        { name: "L31 Data Analysis", link: "https://chat.whatsapp.com/L2fUk14ojts5lRTmgYpKWj?mode=r_t" },
        { name: "L35 Matematica", link: "https://chat.whatsapp.com/FiSnMipRhm75dKKNrwPEdx?mode=r_t" },
        { name: "LMDATA Data Science", link: "https://chat.whatsapp.com/JWuCtnXmeOZ4hJbyCE3MNO?mode=r_t" },
        { name: "LM17 Fisica", link: "https://chat.whatsapp.com/Ftb4OeeY2RBLlPqO5BQxxz?mode=r_t" },
        { name: "LM17 Physics", link: "https://chat.whatsapp.com/Ftb4OeeY2RBLlPqO5BQxxz?mode=r_t" },
        { name: "LM40 Matematica", link: "https://chat.whatsapp.com/KBMu0K1da960HR9JxE6LbX?mode=r_t" },
        { name: "LM79 Geophysical Sciences", link: "https://chat.whatsapp.com/DvVKROn2P9uDTtdpQ9m1tC?mode=r_t" },
        { name: "L2 Biotecnologie", link: "https://chat.whatsapp.com/EDZ7OEfLXaGCHqdDOEgCbj?mode=r_c" },
        { name: "LM9 Biotecnologie Mediche", link: "https://chat.whatsapp.com/LNzL0Cr3fQj7JmhlIuZCI0?mode=r_c" },
        { name: "LM13 Chimica e tecnologie farmaceutiche", link: "https://chat.whatsapp.com/Lkl38ig0HqlJy3mV5lQT6o" },
        { name: "LM13 Farmacia", link: "https://chat.whatsapp.com/HAjkMIkGEjmA54fn8fMuah" },
        { name: "L13 Scienze biologiche", link: "https://chat.whatsapp.com/DVsmpe3bYr0D1iz2N24HcX" },
        { name: "L13 Marine Biology and Blue Biotechnologies", link: "https://chat.whatsapp.com/DRqpVvtnTn26TYEKg8o64t" },
        { name: "L27 Chimica", link: "https://chat.whatsapp.com/JIyYlxQEGJK9qzxqBheIiN" },
        { name: "L29 Scienze Nutraceutiche e Alimenti Funzionali", link: "https://chat.whatsapp.com/IhERELxI5vX3WmY36lABZy" },
        { name: "L32 Scienze ambientali marine e terrestri", link: "https://chat.whatsapp.com/CZwxghD9rhoGw93nTerNeD" },
        { name: "LM6 Biologia della Salute delle Tecnologie applicate e Nutrizione", link: "https://chat.whatsapp.com/CToHY3b6JRF0Mmu171hVMa" },
        { name: "LM6 Biologia ed ecologia dell'ambiente marino costiero", link: "https://chat.whatsapp.com/EDg9LxMv430Lfg8xiXCTIN?mode=ac_c" },
        { name: "LM54 Chimica Magistrale", link: "https://chat.whatsapp.com/KDtLpMAXtZjK2mhHNDVOma?mode=ac_t" },
        { name: "LM61 Scienza della Alimentazione e Nutrizione Umana", link: "https://chat.whatsapp.com/GMiTc7341we4BFtRXTkBxx" }
    ],
    "Medicina, Professioni Sanitarie e Scienze Motorie": [
        { name: "LM41 Medicina e Chirugia (Ita / Eng / Bio)", link: "https://chat.whatsapp.com/FAcVNuwITmMITtBo6OzpPg?mode=ac_t" },
        { name: "LM46 Odontoiatria e protesi dentaria", link: "https://chat.whatsapp.com/IFjfZcBitC52KBvhcXUiZ9?mode=r_c" },
        { name: "L/SNT1 Infermieristica (e Pediatrica)", link: "https://chat.whatsapp.com/GJMvgAQZn30FPFh0cABIMW" },
        { name: "L/SNT1 Ostetricia", link: "https://chat.whatsapp.com/FYFLeuTthgqKqs9rUOlJBH?mode=ac_t" },
        { name: "L/SNT2 Fisioterapia", link: "https://chat.whatsapp.com/F2NVlxqewHuJK5FP6dAmDx" },
        { name: "L/SNT2 Logopedia", link: "https://chat.whatsapp.com/Bqp6i1c3d7EA0ccIEq5i2s?mode=ac_t" },
        { name: "L/SNT2 Terapia della neuro e della psicomotricità", link: "https://chat.whatsapp.com/I4ga2II1sreHhdfxRBdu8k?mode=ac_t" },
        { name: "L/SNT2 Ortottica ed assistenza in oftalmologia", link: "https://chat.whatsapp.com/GJA0vbMiTly31GLNMiopIi?mode=r_c" },
        { name: "L/SNT2 Tecnica della riabilitazione psichiatrica", link: "https://chat.whatsapp.com/DU7W5sMal8H99GY6mD9RWU?mode=r_c" },
        { name: "L/SNT3 Tecniche di neurofisiopatologia", link: "https://chat.whatsapp.com/CAITQ1K9JCzKaPSEsxeBsL" },
        { name: "L/SNT3 Tecniche audioprotesiche", link: "https://chat.whatsapp.com/EdW4Q5Qbf4U5k9LAgcgg4X?mode=ac_t" },
        { name: "L/SNT3 Tecniche di laboratorio biomedico", link: "https://chat.whatsapp.com/K6Fve75weBUH0HVxfHymHx?mode=r_c" },
        { name: "L/SNT3 Tecniche di radiologia medica", link: "https://chat.whatsapp.com/BigGzFnbUjm6TFVzXk9Wyf?mode=r_c" },
        { name: "L/SNT4 Tecniche della prevenzione nell'ambiente", link: "https://chat.whatsapp.com/F0JH9CcAjoELS9F1bGGFl5?mode=r_c" },
        { name: "LM/SNT1 Scienze infermieristiche e ostetriche", link: "https://chat.whatsapp.com/Ii5MmFlpgmOF9rNXUDbXRy?mode=ac_t" },
        { name: "LM/SNT2 Scienze riabilitative delle prof. sanitarie", link: "https://chat.whatsapp.com/HQXyZObz5K6Ai91XHJKmmK?mode=ac_t" },
        { name: "LM/SNT3 Scienze delle professioni sanitarie diagnostiche", link: "https://chat.whatsapp.com/FLucAeK0z0XELG9BqsLeev?mode=r_c" },
        { name: "L24 Scienze e Tecniche psicologiche", link: "https://chat.whatsapp.com/Fk7PDzERVHXI1k13BAEnnK" },
        { name: "LM51 Psicologia clinica", link: "https://chat.whatsapp.com/H3j8GLOeRz31q5LQNVLm9j" },
        { name: "L22 Scienze motorie, sport e salute", link: "https://chat.whatsapp.com/GHafECTtLF01yXmPKmnrZp?mode=r_c" },
        { name: "LM67 Scienze e tecniche attività motorie adattate", link: "https://chat.whatsapp.com/Kzqqak58NEf714b42XKKKp?mode=r_c" },
        { name: "L26 Scienze gastronomiche", link: "https://chat.whatsapp.com/BUOvXAMoyB5Azg4wksU6XU?mode=r_c" }
    ],
    "Veterinaria": [
        { name: "LM42 Medicina veterinaria", link: "https://chat.whatsapp.com/FAcVNuwITmMITtBo6OzpPg?mode=ac_t" },
        { name: "L25 Scienze e Tecnologie Agrarie", link: "https://chat.whatsapp.com/DIxVM1HvFwh9ZRAczs9XRQ?mode=ac_t" },
        { name: "L38 Scienze, tecnologie e sicurezza prod. animali", link: "https://chat.whatsapp.com/LPiJ8Gdxwae5TXWmmlDoX7?mode=ac_t" },
        { name: "LM9 Biotecnologie Veterinarie", link: "https://chat.whatsapp.com/EYrUtbwBb9ZDAK12IjAlvM?mode=ac_t" },
        { name: "LM86 Sicurezza e Qualità delle Produzioni Animali", link: "https://chat.whatsapp.com/H0wdj8PcalOJ7WM0rlE1s0?mode=ac_t" }
    ]
}

export default function WhatsAppPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="size-20 bg-[#25D366]/10 text-[#25D366] rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Phone className="size-10" />
                    </div>
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 italic">Unime Matricole</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">Gruppi WhatsApp</h1>
                    <p className="text-lg text-zinc-600 leading-relaxed mb-8">
                        Unisciti alla più grande community di studenti dell'Ateneo. Seleziona il tuo corso di laurea per entrare nel gruppo ufficiale gestito dai nostri rappresentanti.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-zinc-500">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <CheckCircle2 className="size-4 text-green-500" /> Moderazione attiva 24/7
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <AlertCircle className="size-4 text-blue-500" /> Solo info verificate
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto space-y-16">
                    {Object.entries(DEPARTMENTS).map(([deptName, courses]) => (
                        <div key={deptName} className="scroll-mt-32">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-zinc-200 flex-1"></div>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground uppercase tracking-widest flex items-center gap-3">
                                    <Building2 className="size-5 md:size-6 text-zinc-400" /> {deptName}
                                </h2>
                                <div className="h-px bg-zinc-200 flex-1"></div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {courses.map((group, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 md:p-6 border border-zinc-100 shadow-sm hover:shadow-xl hover:border-[#25D366]/30 transition-all group flex flex-col items-start justify-between min-h-[140px]">
                                        <div className="w-full">
                                            <h3 className="text-sm md:text-base font-bold text-foreground mb-2 leading-tight group-hover:text-[#25D366] transition-colors line-clamp-3">{group.name}</h3>
                                        </div>
                                        <a href={group.link} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white py-2.5 md:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all duration-300">
                                            Entra nel gruppo <ArrowRight className="size-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 max-w-2xl mx-auto bg-blue-50/50 border border-blue-100 rounded-3xl p-8 text-center text-blue-900">
                    <h3 className="text-xl font-bold mb-3 font-serif">Non trovi il tuo corso?</h3>
                    <p className="opacity-80 mb-6 text-sm md:text-base">
                        Stiamo aggiornando costantemente l'elenco dei gruppi. Se il tuo corso non è presente, contattaci sui nostri canali social e ti forniremo il link dedicato.
                    </p>
                    <a href="https://instagram.com/morganamessina" target="_blank" rel="noopener noreferrer" className="inline-block font-bold uppercase tracking-widest text-xs border-2 border-blue-900/20 px-6 py-3 rounded-full hover:bg-blue-900 hover:text-white transition-colors">
                        Scrivici su Instagram
                    </a>
                </div>
            </div>
        </div>
    )
}
