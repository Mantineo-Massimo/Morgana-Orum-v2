import { PrismaClient, OrganigrammaAssociation, OrganigrammaSection, WhatsAppGroupCategory } from '@prisma/client'

const prisma = new PrismaClient()

const representatives = [
    // --- ORGANI CENTRALI ---
    { name: "Gallo Dario", listName: "O.R.U.M.", category: "CENTRAL", role: "CdA (Consiglio di Amministrazione)", term: "2025-2027", roleDescription: `È il "braccio economico" e gestionale dell'università.\nCosa fa: Gestisce il budget, approva il bilancio, delibera sulle assunzioni del personale e decide gli investimenti per le infrastrutture (edifici, aule, laboratori).\nIn breve: È dove si decide come spendere i soldi dell'Ateneo.` },
    { name: "Consentino Veronica", listName: "O.R.U.M.", category: "CENTRAL", role: "SA (Senato Accademico)", term: "2025-2027", roleDescription: `Se l'università fosse uno Stato, il Senato sarebbe il suo Parlamento.\nCosa fa: Si occupa della didattica e della ricerca. Decide l'attivazione di nuovi corsi di laurea, approva i regolamenti interni e definisce le linee guida scientifiche dell'Ateneo.\nIn breve: È dove si decide cosa e come si studia.` },

    // --- DIPARTIMENTI (Tutti 2025-2027) ---
    // DICAM
    { name: "Nostro Gabriele", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },
    { name: "Sgroi Alda", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },
    { name: "Adamo Marta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },
    { name: "Bertuccio Enzo Antonino", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },

    // Economia
    { name: "Harzallah Nour El Houda", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Manganaro Piergiorgio", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Venuti Simone", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Mazzù Paolo", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Gringeri Roberto", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Crisafulli Marco", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Millemaci Alessia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Travagliante Anna", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Milanese Giuseppe", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Ciraolo Laura", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Pistonina Andrea", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Campisi Virginia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },
    { name: "Cambria Marco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Economia", term: "2025-2027" },

    // Giurisprudenza
    { name: "Pandolfino Ivan", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Giurisprudenza", term: "2025-2027" },
    { name: "Bungay John Federick", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Giurisprudenza", term: "2025-2027" },
    { name: "Mulè Manuel Maria Pio", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Giurisprudenza", term: "2025-2027" },
    { name: "Cambria Sara", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Giurisprudenza", term: "2025-2027" },
    { name: "Longo Giuseppe", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Giurisprudenza", term: "2025-2027" },
    { name: "Gioffrè Carla", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Giurisprudenza", term: "2025-2027" },

    // Ingegneria
    { name: "Vinci Giulio Giuseppe", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Ingegneria", term: "2025-2027" },
    { name: "Piccolo Chiara Maria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Ingegneria", term: "2025-2027" },
    { name: "Cartaregia Antonio", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Ingegneria", term: "2025-2027" },
    { name: "Ioppolo Roberta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Ingegneria", term: "2025-2027" },
    { name: "Florena Pierluigi", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Ingegneria", term: "2025-2027" },
    { name: "Elmerghany Shahad Amgad Adel", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Ingegneria", term: "2025-2027" },

    // DIMED
    { name: "Battaglia Francesca", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Micale Daniele", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Novarino Clara Elda", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Falcone Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Magro Roberta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Palmeri Luca Maria Carmelo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Iannello Siria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Lucà Giorgia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },

    // Patologia Umana
    { name: "Blanco Giorgia Maria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"", term: "2025-2027" },
    { name: "Sceusa Alessia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"", term: "2025-2027" },
    { name: "Cambria Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"", term: "2025-2027" },
    { name: "Gallo Dario", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"", term: "2025-2027" },

    // BIOMORF
    { name: "Purehashemi Hamed", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "Serio Giulia Maria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "Aliberti Filippo Mauro", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "Ricciari Roberta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "La Mendola Gaia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "Aghayari Moghadam Arian", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "Khosravi Bakhtiari Rouzbeh", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },
    { name: "Fallico Valeria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)", term: "2025-2027" },

    // CHIBIOFARAM
    { name: "Costanzino Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Mastrolembo Ventura Fabio", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Zito Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Restuccia Gloria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Papisca Alessandro", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Taca Laura", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Messina Riccardo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Quercio Chiara", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Tavella Martina", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Ferrara Andrea Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Zuco Simona", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Iaria Mariachiara", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Messina Salvatore", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Strangio Giovanni", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Brunaccini Giuseppe", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Pelaia Maia Valeria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Rizzo Elena", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Fruci Luciano", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Vita Matteo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Guerrisi Giada", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Favata Salvatore", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Fiumara Roberto", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },

    // COSPECS
    { name: "Aretino Zaira", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Silvestro Gioele Salvatore", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Calabrò Giada", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Ventrice Ilenia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Tranchida Antonio Valerio", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Albanese Aylin", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)", term: "2025-2027" },

    // MIFT
    { name: "Mantineo Massimo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Angioletti Angela", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Marzullo Simona", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Puglisi Emanuele", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Msadak Youssef", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Anas Muhammad", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },

    // SCIPOG
    { name: "Cosentino Maria Giovanna", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Hallajian Nasim", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Mandracchia Sophia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Karunanayaka Rishin Sasith Kavinga Silva", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Scarfì Medrano Erica Jane", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Iellamo Paolo Antonio", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Sciabà Giovanni Pio", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Maimone Andrea", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Stanzione Mattia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Lazzaro Maria Sara", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },

    // VET
    { name: "Scauzzo Taragnino Giovanni Giacomo", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Virga Alessandro", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Patti Giuseppe Placido", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Arsuffi Alice", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Barbaro Sofia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Brusca Simona", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Klinkov Vittoria", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Orfanello Silvia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Pellegrino Francesco", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Longi Dèsirèe", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Evola Carola", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },
    { name: "Romano Salvatore", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento di Scienze Veterinarie", term: "2025-2027" },

    // --- ORGANI NAZIONALI ---
    { name: "Sbilordo Fabrizio", listName: "AZIONE UNIVERITARIA", category: "NATIONAL", role: "CNSU (Consiglio Nazionale degli Studenti Universitari)", term: "2025-2028", roleDescription: `È il massimo organo di rappresentanza studentesca a livello statale.\nCosa fa: Funge da ponte tra gli studenti e il MUR (Ministero dell’Università e della Ricerca). Formula pareri obbligatori sui decreti che riguardano l'università, propone riforme e monitora la condizione studentesca in tutta Italia.\nComposizione: È formato da 28 studenti eletti ogni tre anni su base nazionale.` },

    // --- ENTI REGIONALI ---
    { name: "Nostro Dario", listName: "O.R.U.M.", category: "CENTRAL", role: "ERSU (Ente Regionale per il Diritto allo Studio Universitario)", term: "2024-2027", roleDescription: `A differenza degli altri, non è un ufficio interno all'università, ma un ente della Regione.\nCosa fa: Gestisce tutto ciò che permette materialmente di studiare: borse di studio, posti alloggio negli studentati, mense e sussidi straordinari.\nNota bene: In alcune regioni può cambiare nome (es. ADiSU, DiSCo, ALiSEO), ma la funzione rimane la stessa.` },

    // --- CdS (Consiglio Studenti) ---
    { name: "Callea Juliana", listName: "MORGANA", category: "CENTRAL", role: "CdS (Consiglio degli Studenti)", term: "2024-2026", roleDescription: `È l'organo che dà voce agli studenti all'interno dell'Ateneo.\nCosa fa: È un organo consultivo. Esprime pareri (spesso obbligatori) su tasse, servizi agli studenti e diritto allo studio. Serve a coordinare i rappresentanti eletti nei vari dipartimenti per portare una visione unitaria al Senato e al CdA.` },
    { name: "Parisi Marco", listName: "MORGANA", category: "CENTRAL", role: "CdS (Consiglio degli Studenti)", term: "2024-2026", roleDescription: `È l'organo che dà voce agli studenti all'interno dell'Ateneo.\nCosa fa: È un organo consultivo. Esprime pareri (spesso obbligatori) su tasse, servizi agli studenti e diritto allo studio. Serve a coordinare i rappresentanti eletti nei vari dipartimenti per portare una visione unitaria al Senato e al CdA.` },
    { name: "Costanzino Francesco", listName: "O.R.U.M.", category: "CENTRAL", role: "CdS (Consiglio degli Studenti)", term: "2024-2026", roleDescription: `È l'organo che dà voce agli studenti all'interno dell'Ateneo.\nCosa fa: È un organo consultivo. Esprime pareri (spesso obbligatori) su tasse, servizi agli studenti e diritto allo studio. Serve a coordinare i rappresentanti eletti nei vari dipartimenti per portare una visione unitaria al Senato e al CdA.` },
    { name: "Mantineo Massimo", listName: "O.R.U.M.", category: "CENTRAL", role: "CdS (Consiglio degli Studenti)", term: "2024-2026", roleDescription: `È l'organo che dà voce agli studenti all'interno dell'Ateneo.\nCosa fa: È un organo consultivo. Esprime pareri (spesso obbligatori) su tasse, servizi agli studenti e diritto allo studio. Serve a coordinare i rappresentanti eletti nei vari dipartimenti per portare una visione unitaria al Senato e al CdA.` }
]

const servicesData = [
    {
        id: "accademici",
        title: "1. Servizi Accademici e Amministrativi",
        titleEn: "1. Academic & Administrative Services",
        icon: "GraduationCap",
        color: "blue",
        order: 0,
        items: [
            {
                name: "Welcome Point",
                nameEn: "Welcome Point",
                description: "Accoglienza e supporto per nuovi studenti nazionali e internazionali nelle procedure di immatricolazione.",
                descriptionEn: "Welcome and support for new national and international students during enrollment.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/welcome-point",
                order: 0
            },
            {
                name: "Segreterie Studenti",
                nameEn: "Student Secretariats",
                description: "Assistenza per iscrizioni, tasse, certificati e pergamene per tutti i Corsi di Laurea.",
                descriptionEn: "Assistance for enrollments, fees, certificates, and diplomas for all degree courses.",
                href: "https://www.unime.it/it/studenti/segreterie-studenti",
                order: 1
            },
            {
                name: "Master e Alta Formazione",
                nameEn: "Masters & High Education",
                description: "Corsi di perfezionamento, master di I e II livello e percorsi di alta formazione professionale.",
                descriptionEn: "Advanced training courses, 1st and 2nd level masters, and high professional education.",
                href: "https://www.unime.it/didattica/post-laurea/master-e-corsi-di-perfezionamento",
                order: 2
            },
            {
                name: "Scuole di Specializzazione",
                nameEn: "Specialization Schools",
                description: "Accesso e informazioni sulle scuole di specializzazione dell'Ateneo.",
                descriptionEn: "Access and information on the university's specialization schools.",
                href: "https://www.unime.it/didattica/post-laurea/scuole-di-specializzazione",
                order: 3
            },
            {
                name: "Esami di Stato",
                nameEn: "State Exams",
                description: "Procedure e scadenze per l'abilitazione all'esercizio delle professioni.",
                descriptionEn: "Procedures and deadlines for professional practice qualification.",
                href: "https://www.unime.it/it/esami-stato/esami-di-stato",
                order: 4
            },
            {
                name: "Formazione Insegnanti",
                nameEn: "Teacher Training",
                description: "Percorsi formativi abilitanti e specializzazione per il sostegno (TFA).",
                descriptionEn: "Qualifying educational paths and specialization for support teaching (TFA).",
                href: "https://www.unime.it/didattica/post-laurea/formazione-insegnanti",
                order: 5
            },
            {
                name: "Orientamento e Placement",
                nameEn: "Guidance & Placement",
                description: "Career Service, AlmaLaurea e supporto nella scelta del corso di studi.",
                descriptionEn: "Career Service, AlmaLaurea, and support in choosing a course of study.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/orientamento-e-placement",
                order: 6
            },
            {
                name: "URP",
                nameEn: "URP",
                description: "Ufficio Relazioni con il Pubblico: sportello informativo per la trasparenza e l'ascolto.",
                descriptionEn: "Public Relations Office: information desk for transparency and customer care.",
                href: "http://www.unime.it/it/ateneo/ufficio-relazioni-con-il-pubblico",
                order: 7
            },
            {
                name: "Protocollo Generale",
                nameEn: "General Registry",
                description: "Consegna documenti ufficiali e recapiti PEC dell'Ateneo.",
                descriptionEn: "Submission of official documents and contact details for the university's certified email (PEC).",
                href: "https://www.unime.it/ateneo/amministrazione/protocollo-consegna-documenti",
                order: 8
            }
        ]
    },
    {
        id: "ersu",
        title: "2. Diritto allo Studio e Servizi ERSU",
        titleEn: "2. Right to Study & ERSU Services",
        icon: "Home",
        color: "orange",
        order: 1,
        items: [
            {
                name: "Agevolazioni Economiche",
                nameEn: "Financial Aid",
                description: "Borse di studio, contributi affitto e premi di laurea gestiti dall'ERSU.",
                descriptionEn: "Scholarships, rent contributions, and graduation awards managed by ERSU.",
                href: "https://www.ersumessina.it/borse-di-studio/",
                order: 0
            },
            {
                name: "Servizi Residenziali",
                nameEn: "Housing Services",
                description: "Posti alloggio presso le residenze universitarie (Annunziata, Castelli, Papardo).",
                descriptionEn: "Accommodations at student residences (Annunziata, Castelli, Papardo).",
                href: "https://www.ersumessina.it/servizi-residenziali/",
                order: 1
            },
            {
                name: "Servizio Ristorazione",
                nameEn: "Dining Services",
                description: "Accesso alle mense tramite APP ERSU. Orari e tariffe basate su fascia ISEE.",
                descriptionEn: "Access to canteens via ERSU APP. Hours and rates based on ISEE bracket.",
                href: "https://www.ersumessina.it/servizio-mensa/",
                order: 2
            }
        ]
    },
    {
        id: "biblioteche",
        title: "3. Servizi Bibliotecari (SBA)",
        titleEn: "3. Library Services (SBA)",
        icon: "BookOpen",
        color: "green",
        order: 2,
        items: [
            {
                name: "Portale SBA",
                nameEn: "SBA Portal",
                description: "Catalogo unico (OPAC), sale studio e servizi di prestito locale e interbibliotecario.",
                descriptionEn: "Single catalog (OPAC), study rooms, and local and interlibrary loan services.",
                href: "https://antonello.unime.it",
                order: 0
            },
            {
                name: "Biblioteca Digitale",
                nameEn: "Digital Library",
                description: "Accesso remoto a banche dati, periodici online e risorse scientifiche.",
                descriptionEn: "Remote access to databases, online journals, and scientific resources.",
                href: "https://antonello.unime.it/sottoscrizioni-attive-2/",
                order: 1
            }
        ]
    },
    {
        id: "inclusione",
        title: "4. Servizi per l'Inclusione",
        titleEn: "4. Inclusion Services",
        icon: "Heart",
        color: "red",
        order: 3,
        items: [
            {
                name: "Disabilità e DSA",
                nameEn: "Disabilities & Specific Learning Disabilities (SLD)",
                description: "Modulistica, tutorato didattico e misure compensative per lezioni ed esami.",
                descriptionEn: "Forms, academic tutoring, and compensatory measures for lectures and exams.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/servizi-disabilita-e-dsa",
                order: 0
            },
            {
                name: "Valutazione DSA (CeRIP)",
                nameEn: "SLD Evaluation (CeRIP)",
                description: "Prenotazione appuntamenti per valutazione DSA tramite il centro specializzato d'Ateneo.",
                descriptionEn: "Book appointments for SLD assessment via the university specialized center.",
                href: "https://www.unime.it/it/centri/cerip/appuntamento-valutazione-dsa",
                order: 1
            }
        ]
    },
    {
        id: "servizi-it",
        title: "5. Servizi IT e Connettività",
        titleEn: "5. IT & Connectivity Services",
        icon: "Wifi",
        color: "blue",
        order: 4,
        items: [
            {
                name: "Account Studenti",
                nameEn: "Student Accounts",
                description: "Attivazione e gestione delle credenziali per i servizi online di Ateneo.",
                descriptionEn: "Activation and management of credentials for university online services.",
                href: "https://www.unime.it/ciam/ict/account/studenti",
                order: 0
            },
            {
                name: "Posta Elettronica",
                nameEn: "E-mail",
                description: "Accesso alla mail istituzionale @studenti.unime.it.",
                descriptionEn: "Access to the institutional email @studenti.unime.it.",
                href: "https://www.unime.it/ciam/ict/account/posta",
                order: 1
            },
            {
                name: "Wi-Fi d'Ateneo",
                nameEn: "University Wi-Fi",
                description: "Istruzioni per l'accesso alla rete Wi-Fi nelle sedi universitarie.",
                descriptionEn: "Instructions for connecting to the Wi-Fi network at university venues.",
                href: "https://www.unime.it/ciam/ict/wifi",
                order: 2
            },
            {
                name: "Rete Eduroam",
                nameEn: "Eduroam Network",
                description: "Accesso alla rete Wi-Fi internazionale per la comunità scientifica.",
                descriptionEn: "Access to the international Wi-Fi network for the scientific community.",
                href: "https://www.unime.it/ciam/ict/eduroam",
                order: 3
            }
        ]
    },
    {
        id: "tutela",
        title: "6. Organi di Tutela e Garanzia",
        titleEn: "6. Protection & Guarantee Organs",
        icon: "ShieldCheck",
        color: "purple",
        order: 5,
        items: [
            {
                name: "Garante degli Studenti",
                nameEn: "Student Ombudsman",
                description: "Tutela da disfunzioni e abusi. Monitoraggio del rispetto dei diritti degli studenti.",
                descriptionEn: "Protection from dysfunctions and abuse. Monitoring compliance with student rights.",
                href: "https://www.unime.it/ateneo/organi/garante-degli-studenti",
                order: 0
            },
            {
                name: "Consulente di Fiducia",
                nameEn: "Confidential Counsellor",
                description: "Supporto in caso di molestie o discriminazioni all'interno dell'Ateneo.",
                descriptionEn: "Support in case of harassment or discrimination within the university.",
                href: "https://www.unime.it/ateneo/organi/consulente-di-fiducia",
                order: 1
            },
            {
                name: "Comitato Unico di Garanzia (CUG)",
                nameEn: "Single Guarantee Committee (CUG)",
                description: "Focalizzato sulla cultura delle pari opportunità e contrasto alle discriminazioni.",
                descriptionEn: "Focused on the culture of equal opportunities and countering discrimination.",
                href: "https://www.unime.it/cug",
                order: 2
            }
        ]
    },
    {
        id: "mobilita",
        title: "7. Mobilità e Trasporti",
        titleEn: "7. Mobility & Transports",
        icon: "Bus",
        color: "zinc",
        order: 6,
        items: [
            {
                name: "Student Mobility Card",
                nameEn: "Student Mobility Card",
                description: "Acquisto online tramite portale Esse3 (sezione Tasse) a tariffa agevolata di 30 euro.",
                descriptionEn: "Online purchase via the Esse3 portal (Fees section) at a discounted rate of 30 euros.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/trasporti",
                order: 0
            },
            {
                name: "Parcheggi",
                nameEn: "Parking",
                description: "Uso gratuito dei parcheggi di interscambio per gli abbonati studenti.",
                descriptionEn: "Free use of interchange parking lots for subscribed students.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/trasporti",
                order: 1
            }
        ]
    },
    {
        id: "bancari",
        title: "8. Servizi Bancari Agevolati",
        titleEn: "8. Partnered Banking Services",
        icon: "CreditCard",
        color: "emerald",
        order: 7,
        items: [
            {
                name: "Genius Card UNIME",
                nameEn: "Genius Card UNIME",
                description: "Carta prepagata UniCredit a canone azzerato per pagamenti e incassi universitari.",
                descriptionEn: "UniCredit prepaid card with no monthly fee for university payments and collections.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/genius-card",
                order: 0
            }
        ]
    }
]

const communityGroups = [
    {
        name: "Gruppo Generale",
        nameEn: "General Group",
        description: "Il punto di ritrovo principale per tutti gli studenti Morgana e Orum. News, avvisi e discussioni generali sull'Ateneo.",
        descriptionEn: "The main meeting point for all Morgana and Orum students. News, announcements, and general discussions on the University.",
        link: "https://chat.whatsapp.com/invite/generale-morgana-orum",
        icon: "Users",
        theme: "text-blue-500 bg-blue-50 border-blue-100 hover:border-blue-200 hover:bg-blue-50/70",
        category: "COMMUNITY",
        order: 0
    },
    {
        name: "Gruppo Cineforum",
        nameEn: "Cineforum Group",
        description: "Spazio dedicato agli amanti del cinema e cineforum delle associazioni. Recensioni, consigli e news.",
        descriptionEn: "Space dedicated to movie lovers and associations' cineforums. Reviews, recommendations, and news.",
        link: "https://chat.whatsapp.com/invite/cineforum-morgana-orum",
        icon: "Film",
        theme: "text-purple-500 bg-purple-50 border-purple-100 hover:border-purple-200 hover:bg-purple-50/70",
        category: "COMMUNITY",
        order: 1
    },
    {
        name: "Gruppo Affittacase",
        nameEn: "Renting Group",
        description: "Bacheca per studenti fuori sede. Cerca appartamenti in affitto, stanze libere o coinquilini a Messina.",
        descriptionEn: "Noticeboard for non-resident students. Search for apartments for rent, vacant rooms, or roommates in Messina.",
        link: "https://chat.whatsapp.com/invite/affittacase-morgana-orum",
        icon: "Home",
        theme: "text-amber-500 bg-amber-50 border-amber-100 hover:border-amber-200 hover:bg-amber-50/70",
        category: "COMMUNITY",
        order: 2
    }
]

const academicDepartmentsSeed = {
    "Dipartimento di Civiltà Antiche e Moderne (DICAM)": [
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
    "Dipartimento di Economia": [
        { name: "L18 Economia aziendale", link: "https://chat.whatsapp.com/D3nZVjwPtIU0eINj4NNGuA?mode=ac_t" },
        { name: "L18 Management d'impresa", link: "https://chat.whatsapp.com/LhzjbSuefoE8ujH54oJJWV?mode=ac_t" },
        { name: "L33 Economia, banca e finanza", link: "https://chat.whatsapp.com/ENi7JSkNUrGAmXW9wDLXnx?mode=ac_t" },
        { name: "LM56 Metodi Quantitativi per l'Economia e la Finanza", link: "https://chat.whatsapp.com/ITJfLrifRyo2ZJSWt9z96I?mode=ac_t" },
        { name: "LM77 Consulenza e gestione di impresa", link: "https://chat.whatsapp.com/CatVTLZigEQ0UIugFpX0Bq?mode=ac_t" },
        { name: "LM77 Digital Trasformation e Innovation Managment", link: "https://chat.whatsapp.com/JDkn5dgtrpI2CIWydG23Pw?mode=ac_t" }
    ],
    "Dipartimento di Giurisprudenza": [
        { name: "LMG01 Giurisprudenza", link: "https://chat.whatsapp.com/HLwJP2tBoNz1Q6RlZULQ2Z?mode=ac_t" },
        { name: "L14 Consulente del lavoro e scienze dei servizi giuridici", link: "https://chat.whatsapp.com/Hv10lQnAmHN5wXqRObWd0a?mode=ac_t" },
        { name: "L14 Transnational and European Legal Studies", link: "https://chat.whatsapp.com/HnILHdfXFsiE7t4hPVmhSy?mode=ac_t" },
        { name: "LM/SC-GIUR Diritto dell'Innovazione e della sostenibilità", link: "https://chat.whatsapp.com/G9wmtJAHL8o4epwCasYDlG?mode=ac_t" }
    ],
    "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)": [
        { name: "L14 Diritto delle Nuove Tecnologie", link: "https://chat.whatsapp.com/KfM3aE7JWV8LrR7HTfc5Ox" },
        { name: "L16 Scienze politiche, amministrazione e servizi", link: "https://chat.whatsapp.com/JiTMKoGv3tvGS1L5tUJ2pD" },
        { name: "L36 Scienze politiche e delle relazioni internazionali", link: "https://chat.whatsapp.com/IfWk5cm0ogUCMJix3UVK2z" },
        { name: "L39 Scienze del servizio sociale", link: "https://chat.whatsapp.com/FyoXN0yW4gjFvZkPsSKKrV" },
        { name: "LM52 Relazioni internazionali", link: "https://chat.whatsapp.com/DoLQytacGsR8HpBV5qVoef" },
        { name: "LM63 Scienze delle pubbliche amministrazioni", link: "https://chat.whatsapp.com/Hk2FeofTKJz27TQ30Bt6tn" }
    ],
    "Dipartimento di Ingegneria": [
        { name: "L7 Ingegneria civile", link: "https://chat.whatsapp.com/Cc1cX0tEaSrDO5MQfBeZ41?mode=ac_t" },
        { name: "L8 Ingegneria Biomedica", link: "https://chat.whatsapp.com/DSR00zzDeOEJ0zxYBlNr0H?mode=ac_t" },
        { name: "L8 Ingegneria elettronica e informatica", link: "https://chat.whatsapp.com/JghispA6VYF0iINYFIoYUo?mode=ac_t" },
        { name: "L9 Ingegneria Gestionale", link: "https://chat.whatsapp.com/HJxHEyNm9X8AEExao322P5?mode=ac_t" },
        { name: "L9 Ingegneria industriale", link: "https://chat.whatsapp.com/ElsnvJmil6kEfeNxv48QA5?mode=ac_t" },
        { name: "L28 Scienze e tecnologie della navigazione", link: "https://chat.whatsapp.com/KYVTrxWHKmwK45jU4Ee0oq?mode=ac_t" },
        { name: "LM21 Bioingegneria", link: "https://chat.whatsapp.com/GtjeUiVE9NYCaTjdhBnxbT?mode=ac_t" },
        { name: "LM33 Ingegneria meccanica", link: "https://chat.whatsapp.com/Fbf4fCcLDMg7lafwl1VZPx?mode=ac_t" }
    ],
    "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)": [
        { name: "L30 Fisica", link: "https://chat.whatsapp.com/GwtSTTDKKHmJUyrd2SWjuD?mode=r_t" },
        { name: "L31 Informatica", link: "https://chat.whatsapp.com/Lm7t8w5JerO1rXuNyogE8H?mode=r_t" },
        { name: "L31 Data Analysis", link: "https://chat.whatsapp.com/L2fUk14ojts5lRTmgYpKWj?mode=r_t" },
        { name: "L35 Matematica", link: "https://chat.whatsapp.com/FiSnMipRhm75dKKNrwPEdx?mode=r_t" },
        { name: "LMDATA Data Science", link: "https://chat.whatsapp.com/JWuCtnXmeOZ4hJbyCE3MNO?mode=r_t" },
        { name: "LM17 Fisica", link: "https://chat.whatsapp.com/Ftb4OeeY2RBLlPqO5BQxxz?mode=r_t" },
        { name: "LM17 Physics", link: "https://chat.whatsapp.com/Ftb4OeeY2RBLlPqO5BQxxz?mode=r_t" },
        { name: "LM40 Matematica", link: "https://chat.whatsapp.com/KBMu0K1da960HR9JxE6LbX?mode=r_t" },
        { name: "LM79 Geophysical Sciences", link: "https://chat.whatsapp.com/DvVKROn2P9uDTtdpQ9m1tC?mode=r_t" }
    ],
    "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)": [
        { name: "L2 Biotecnologie", link: "https://chat.whatsapp.com/EDZ7OEfLXaGCHqdDOEgCbj?mode=r_c" },
        { name: "LM9 Biotecnologie Mediche", link: "https://chat.whatsapp.com/LNzL0Cr3fQj7JmhlIuZCI0?mode=r_c" },
        { name: "LM46 Odontoiatria e protesi dentaria", link: "https://chat.whatsapp.com/IFjfZcBitC52KBvhcXUiZ9?mode=r_c" },
        { name: "L/SNT2 Ortottica ed assistenza in oftalmologia", link: "https://chat.whatsapp.com/GJA0vbMiTly31GLNMiopIi?mode=r_c" },
        { name: "L/SNT2 Tecnica della riabilitazione psichiatrica", link: "https://chat.whatsapp.com/DU7W5sMal8H99GY6mD9RWU?mode=r_c" },
        { name: "L/SNT3 Tecniche di laboratorio biomedico", link: "https://chat.whatsapp.com/K6Fve75weBUH0HVxfHymHx?mode=r_c" },
        { name: "L/SNT3 Tecniche di radiologia medica", link: "https://chat.whatsapp.com/BigGzFnbUjm6TFVzXk9Wyf?mode=r_c" },
        { name: "L/SNT4 Tecniche della prevenzione nell'ambiente", link: "https://chat.whatsapp.com/F0JH9CcAjoELS9F1bGGFl5?mode=r_c" },
        { name: "LM/SNT3 Scienze delle professioni sanitarie diagnostiche", link: "https://chat.whatsapp.com/FLucAeK0z0XELG9BqsLeev?mode=r_c" },
        { name: "L22 Scienze motorie, sport e salute", link: "https://chat.whatsapp.com/GHafECTtLF01yXmPKmnrZp?mode=r_c" },
        { name: "LM67 Scienze e tecniche attività motorie adattate", link: "https://chat.whatsapp.com/Kzqqak58NEf714b42XKKKp?mode=r_c" },
        { name: "L26 Scienze gastronomiche", link: "https://chat.whatsapp.com/BUOvXAMoyB5Azg4wksU6XU?mode=r_c" }
    ],
    "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)": [
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
    "Dipartimento di Medicina Clinica e Sperimentale (DIMED)": [
        { name: "LM41 Medicina e Chirugia (Ita / Eng / Bio)", link: "https://chat.whatsapp.com/FAcVNuwITmMITtBo6OzpPg?mode=ac_t" },
        { name: "L/SNT1 Infermieristica (e Pediatrica)", link: "https://chat.whatsapp.com/GJMvgAQZn30FPFh0cABIMW" },
        { name: "L/SNT2 Fisioterapia", link: "https://chat.whatsapp.com/F2NVlxqewHuJK5FP6dAmDx" },
        { name: "L/SNT3 Tecniche di neurofisiopatologia", link: "https://chat.whatsapp.com/CAITQ1K9JCzKaPSEsxeBsL" }
    ],
    "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"": [
        { name: "L/SNT1 Ostetricia", link: "https://chat.whatsapp.com/FYFLeuTthgqKqs9rUOlJBH?mode=ac_t" },
        { name: "L/SNT2 Logopedia", link: "https://chat.whatsapp.com/Bqp6i1c3d7EA0ccIEq5i2s?mode=ac_t" },
        { name: "L/SNT2 Terapia della neuro e della psicomotricità", link: "https://chat.whatsapp.com/I4ga2II1sreHhdfxRBdu8k?mode=ac_t" },
        { name: "L/SNT3 Tecniche audioprotesiche", link: "https://chat.whatsapp.com/EdW4Q5Qbf4U5k9LAgcgg4X?mode=ac_t" },
        { name: "LM/SNT1 Scienze infermieristiche e ostetriche", link: "https://chat.whatsapp.com/Ii5MmFlpgmOF9rNXUDbXRy?mode=ac_t" },
        { name: "LM/SNT2 Scienze riabilitative delle prof. sanitarie", link: "https://chat.whatsapp.com/HQXyZObz5K6Ai91XHJKmmK?mode=ac_t" }
    ],
    "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)": [
        { name: "L24 Scienze e Tecniche psicologiche", link: "https://chat.whatsapp.com/Fk7PDzERVHXI1k13BAEnnK" },
        { name: "LM51 Psicologia clinica", link: "https://chat.whatsapp.com/H3j8GLOeRz31q5LQNVLm9j" }
    ],
    "Dipartimento di Scienze Veterinarie": [
        { name: "LM42 Medicina veterinaria", link: "https://chat.whatsapp.com/FAcVNuwITmMITtBo6OzpPg?mode=ac_t" },
        { name: "L25 Scienze e Tecnologie Agrarie", link: "https://chat.whatsapp.com/DIxVM1HvFwh9ZRAczs9XRQ?mode=ac_t" },
        { name: "L38 Scienze, tecnologie e sicurezza prod. animali", link: "https://chat.whatsapp.com/LPiJ8Gdxwae5TXWmmlDoX7?mode=ac_t" },
        { name: "LM9 Biotecnologie Veterinarie", link: "https://chat.whatsapp.com/EYrUtbwBb9ZDAK12IjAlvM?mode=ac_t" },
        { name: "LM86 Sicurezza e Qualità delle Produzioni Animali", link: "https://chat.whatsapp.com/H0wdj8PcalOJ7WM0rlE1s0?mode=ac_t" }
    ]
}

const guidesSeed = [
    {
        id: "matricole",
        title: "Guida Matricole",
        titleEn: "Freshmen Guide",
        description: "La guida completa per orientarsi tra tasse, segreterie, iscrizioni e portale dello studente (ESSE3).",
        descriptionEn: "The complete guide to navigate fees, secretariats, enrollment, and student portal (ESSE3).",
        icon: "BookOpen",
        color: "blue",
        order: 0,
        hasCustomComponent: false,
        steps: [
            { title: "Registrazione su Esse3", titleEn: "Esse3 Registration", description: "Crea il tuo account sul portale Esse3 per gestire la tua carriera accademica.", descriptionEn: "Create your account on the Esse3 portal to manage your academic career.", order: 0 },
            { title: "Immatricolazione & Tasse", titleEn: "Enrollment & Fees", description: "Presenta la domanda online e paga la prima rata per confermare l'iscrizione.", descriptionEn: "Submit the application online and pay the first installment to confirm enrollment.", order: 1 },
            { title: "ISEE Università", titleEn: "University ISEE", description: "Richiedi l'ISEE-U entro la scadenza per calcolare le rate successive in base alla tua fascia.", descriptionEn: "Request the ISEE-U before the deadline to calculate subsequent installments based on your bracket.", order: 2 },
            { title: "Badge Digitale", titleEn: "Digital Badge", description: "Scarica l'app Unime per avere sempre con te il tesserino universitario virtuale.", descriptionEn: "Download the Unime app to always have your virtual student card with you.", order: 3 }
        ]
    },
    {
        id: "trasporti",
        title: "Trasporti & Mobilità",
        titleEn: "Transport & Mobility",
        description: "Tutte le informazioni su tram, autobus ATM e abbonamenti speciali a tariffa agevolata per studenti.",
        descriptionEn: "All information on trams, ATM buses, and special discounted student passes.",
        icon: "Bus",
        color: "orange",
        order: 1,
        hasCustomComponent: true,
        steps: [
            { title: "Abbonamento Studenti ATM", titleEn: "ATM Student Pass", description: "Abbonamento annuale bus + tram a soli 20€ all'anno per tutti gli iscritti Unime.", descriptionEn: "Annual bus + tram pass for only €20 per year for all enrolled Unime students.", order: 0 },
            { title: "Shuttle Papardo-Annunziata", titleEn: "Papardo-Annunziata Shuttle", description: "Navette ATM dedicate che collegano regolarmente i poli universitari periferici.", descriptionEn: "Dedicated ATM shuttles regularly connecting outlying university campus poles.", order: 1 },
            { title: "Parcheggi di Interscambio", titleEn: "Interchange Parking", description: "Usa i parcheggi ATM della città e muoviti in tram per raggiungere il centro.", descriptionEn: "Use the city's ATM parking lots and take the tram to reach the center.", order: 2 }
        ]
    },
    {
        id: "servizi",
        title: "Servizi & Diritto allo Studio",
        titleEn: "Services & Right to Study",
        description: "Borse di studio ERSU, alloggi universitari, mense e aule studio presenti in ogni dipartimento.",
        descriptionEn: "ERSU scholarships, university accommodation, canteens, and study rooms in each department.",
        icon: "Info",
        color: "emerald",
        order: 2,
        hasCustomComponent: true,
        steps: [
            { title: "Borse di studio ERSU", titleEn: "ERSU Scholarships", description: "Partecipa al bando annuale dell'ERSU per ottenere esenzioni e contributi monetari.", descriptionEn: "Participate in the annual ERSU call to obtain exemptions and monetary grants.", order: 0 },
            { title: "Mense Universitarie", titleEn: "University Canteens", description: "Pasti caldi a tariffe ridotte (o gratuiti per i borsisti) presso i punti ristoro autorizzati.", descriptionEn: "Hot meals at reduced rates (or free for scholarship recipients) at authorized food outlets.", order: 1 },
            { title: "Residenze Studentesche", titleEn: "Student Residences", description: "Alloggi a tariffa agevolata nei pressi dei poli universitari per studenti fuori sede.", descriptionEn: "Discounted rate accommodations near university centers for non-resident students.", order: 2 }
        ]
    },
    {
        id: "mappa",
        title: "Mappe dei Poli",
        titleEn: "Campus Maps",
        description: "Coordinate e indicazioni per raggiungere facilmente aule, segreterie e laboratori nei quattro poli cittadini.",
        descriptionEn: "Coordinates and directions to easily reach classrooms, secretariats, and labs in the four city campus poles.",
        icon: "MapPin",
        color: "purple",
        order: 3,
        hasCustomComponent: true,
        steps: [
            { title: "Polo Centrale (Rettorato/Giurisprudenza/Economia)", titleEn: "Central Pole", description: "Situato nel cuore di Messina, facilmente raggiungibile a piedi dalla stazione o in tram.", descriptionEn: "Located in the heart of Messina, easily reachable on foot from the station or by tram.", order: 0 },
            { title: "Polo Papardo (Scienze/MIFT/Ingegneria)", titleEn: "Papardo Pole", description: "Sulla collina nord di Ganzirri, servito dal bus linea 39 ATM.", descriptionEn: "On the north hill of Ganzirri, served by ATM bus line 39.", order: 1 },
            { title: "Polo Annunziata (Lettere/Veterinaria/Farmacia)", titleEn: "Annunziata Pole", description: "Lungo il viale Annunziata, servito dalle navette interne.", descriptionEn: "Along the Annunziata boulevard, served by internal shuttles.", order: 2 },
            { title: "Polo Policlinico (Medicina/Professioni Sanitarie)", titleEn: "Policlinico Pole", description: "Polo sud dell'Ateneo, situato all'interno del padiglione ospedaliero.", descriptionEn: "South pole of the University, located inside the hospital pavilion.", order: 3 }
        ]
    }
]

async function main() {
    console.log('⏳ Svuotando il database per evitare duplicati...')
    await prisma.registration.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.representative.deleteMany({})
    await prisma.news.deleteMany({})
    await prisma.organigrammaMember.deleteMany({})
    await prisma.serviceItem.deleteMany({})
    await prisma.serviceCategory.deleteMany({})
    await prisma.whatsAppGroup.deleteMany({})
    await prisma.guideStep.deleteMany({})
    await prisma.guide.deleteMany({})

    console.log('🚀 Inserimento Rappresentanti in corso...')
    for (const rep of representatives) {
        await prisma.representative.create({ data: rep })
    }

    console.log('💼 Inserimento Servizi in corso...')
    for (const cat of servicesData) {
        const { items, ...catData } = cat
        const createdCat = await prisma.serviceCategory.create({ data: catData })
        for (const item of items) {
            await prisma.serviceItem.create({
                data: {
                    ...item,
                    categoryId: createdCat.id
                }
            })
        }
    }

    console.log('📱 Inserimento Gruppi WhatsApp in corso...')
    for (const group of communityGroups) {
        await prisma.whatsAppGroup.create({
            data: {
                ...group,
                category: group.category as WhatsAppGroupCategory
            }
        })
    }
    let orderCounter = 0
    for (const [dept, groups] of Object.entries(academicDepartmentsSeed)) {
        for (const group of groups) {
            await prisma.whatsAppGroup.create({
                data: {
                    name: group.name,
                    link: group.link,
                    category: "ACADEMIC" as WhatsAppGroupCategory,
                    department: dept,
                    semester: "2025/2026",
                    order: orderCounter++
                }
            })
        }
    }

    console.log('📚 Inserimento Guide in corso...')
    for (const guide of guidesSeed) {
        const { steps, ...guideData } = guide
        const createdGuide = await prisma.guide.create({ data: guideData })
        for (const step of steps) {
            await prisma.guideStep.create({
                data: {
                    ...step,
                    guideId: createdGuide.id
                }
            })
        }
    }

    const repsCount = await prisma.representative.count()
    const categoriesCount = await prisma.serviceCategory.count()
    const itemsCount = await prisma.serviceItem.count()
    const groupsCount = await prisma.whatsAppGroup.count()
    const guidesCount = await prisma.guide.count()
    const stepsCount = await prisma.guideStep.count()
    console.log(`✅ Finito! Inseriti ${repsCount} rappresentanti, ${categoriesCount} categorie servizi, ${itemsCount} servizi, ${groupsCount} gruppi WhatsApp, ${guidesCount} guide e ${stepsCount} step.`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())