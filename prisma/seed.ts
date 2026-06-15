import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const newsData = [
    {
        title: '9ª Edizione "Raccolta dei Giocattoli" – Un Natale per Tutti',
        description: 'Torna l\'iniziativa solidale promossa da Morgana e Orum in collaborazione con "Gli Invisibili Onlus" e l\'ACR Messina. Abbiamo raccolto e donato centinaia di giocattoli a Piazza Cairoli per i bambini meno fortunati della nostra città.',
        content: 'Per il nono anno consecutivo, Morgana e Orum hanno organizzato la tradizionale Raccolta dei Giocattoli in collaborazione con "Gli Invisibili Onlus" e l\'ACR Messina.\n\nL\'evento si è svolto a Piazza Cairoli, dove centinaia di studenti e cittadini hanno donato giocattoli nuovi e usati per i bambini meno fortunati della nostra città.\n\nGrazie alla generosità di tutti, siamo riusciti a raccogliere oltre 500 giocattoli che sono stati distribuiti alle famiglie bisognose durante il periodo natalizio.',
        category: "Solidarietà",
        tags: "#Solidarietà, #Messina, #Natale2025",
        date: new Date("2025-12-20"),
        published: true,
    },
    {
        title: "Vittoria alle Elezioni Universitarie: Morgana e Orum leader a UniMe",
        description: "Grazie al vostro voto, siamo la prima lista in 9 dipartimenti su 12. Con eletti in Senato Accademico e CdA, continuiamo a portare le vostre istanze ai vertici dell'Ateneo.",
        content: 'Le elezioni universitarie 2025 hanno confermato Morgana e Orum come la prima forza studentesca dell\'Università di Messina.\n\nSiamo la prima lista in 9 dipartimenti su 12, con eletti in posizioni strategiche:\n\n• Senato Accademico\n• Consiglio di Amministrazione\n• Consiglio degli Studenti\n\nQuesto risultato straordinario è merito della fiducia che gli studenti hanno riposto in noi. Continueremo a lavorare per portare le vostre istanze ai vertici dell\'Ateneo.',
        category: "Rappresentanza",
        tags: "#ElezioniUniMe, #Rappresentanza, #Risultati",
        date: new Date("2025-05-15"),
        published: true,
    },
    {
        title: 'Mostra "Popolo in Fuga" al Rettorato',
        description: "In collaborazione con UniMe, abbiamo ospitato l'esposizione dedicata alla storia delle Foibe e dell'esodo istriano. Un momento di riflessione profonda per sensibilizzare la comunità studentesca sulla storia del nostro Paese.",
        category: "Cultura",
        tags: "#Cultura, #UniMe, #Memoria",
        date: new Date("2026-02-10"),
        published: true,
    },
    {
        title: "Welcome Day 2025 – Benvenute Matricole!",
        description: "Abbiamo accolto i nuovi studenti nel cortile del Rettorato per fornire guida, supporto e i primi gadget associativi. Inizia il tuo percorso con il piede giusto.",
        category: "Vita Universitaria",
        tags: "#Matricole, #WelcomeDay, #UniMe",
        date: new Date("2025-10-01"),
        published: true,
    },
    {
        title: "Seminario: 'L'Intelligenza Artificiale nel Diritto'",
        description: "Un incontro formativo con esperti del settore per capire come l'IA sta cambiando le professioni legali. Riconoscimento di 1 CFU per gli studenti di Giurisprudenza.",
        category: "Cultura",
        tags: "#Formazione, #CFU, #Innovazione",
        date: new Date("2026-03-25"),
        published: true,
    },
    {
        title: "Raccolta Firme: 'Più Aule Studio in Centro'",
        description: "Stiamo raccogliendo le vostre adesioni per chiedere all'Ateneo l'apertura prolungata delle biblioteche e nuovi spazi studio nel polo centro.",
        category: "Rappresentanza",
        tags: "#Diritti, #Studio, #UniMe",
        date: new Date(),
        published: true,
    },
]

const representatives = [
    // --- ORGANI CENTRALI ---
    { name: "Gallo Dario", listName: "O.R.U.M.", category: "CENTRAL", role: "CdA (Consiglio di Amministrazione)", term: "2025-2027", roleDescription: `È il "braccio economico" e gestionale dell'università.\nCosa fa: Gestisce il budget, approva il bilancio, delibera sulle assunzioni del personale e decide gli investimenti per le infrastrutture (edifici, aule, laboratori).\nIn breve: È dove si decide come spendere i soldi dell'Ateneo.` },
    { name: "Consentino Veronica", listName: "O.R.U.M.", category: "CENTRAL", role: "SA (Senato Accademico)", term: "2025-2027", roleDescription: `Se l'università fosse uno Stato, il Senato sarebbe il suo Parlamento.\nCosa fa: Si occupa della didattica e della ricerca. Decide l'attivazione di nuovi corsi di laurea, approva i regolamenti interni e definisce le linee guida scientifiche dell'Ateneo.\nIn breve: È dove si decide cosa e come si studia.` },

    // --- DIPARTIMENTI (Tutti 2025-2027) ---
    // DICAM
    { name: "Nostro Gabriele", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },
    { name: "Sgroi Alda", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },
    { name: "Adamo Marta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },
    { name: "Bertuccio Enzo Antonino", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Civiltà Antiche e Moderne (DICAM)", term: "2025-2027" },

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
    { name: "Battaglia Francesca", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Micale Daniele", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Novarino Clara Elda", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Falcone Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Magro Roberta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Palmeri Luca Maria Carmelo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Iannello Siria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },
    { name: "Lucà Giorgia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Medicina Clinica e Sperimentale (DIMED)", term: "2025-2027" },

    // Patologia Umana
    { name: "Blanco Giorgia Maria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva", term: "2025-2027" },
    { name: "Sceusa Alessia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva", term: "2025-2027" },
    { name: "Cambria Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva", term: "2025-2027" },
    { name: "Gallo Dario", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva", term: "2025-2027" },

    // BIOMORF
    { name: "Purehashemi Hamed", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "Serio Giulia Maria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "Aliberti Filippo Mauro", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "Ricciari Roberta", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "La Mendola Gaia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "Aghayari Moghadam Arian", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "Khosravi Bakhtiari Rouzbeh", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },
    { name: "Fallico Valeria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)", term: "2025-2027" },

    // CHIBIOFARAM
    { name: "Costanzino Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Mastrolembo Ventura Fabio", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Zito Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Restuccia Gloria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Papisca Alessandro", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Taca Laura", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Messina Riccardo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Quercio Chiara", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Tavella Martina", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Ferrara Andrea Francesco", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Zuco Simona", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Iaria Mariachiara", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Messina Salvatore", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Strangio Giovanni", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Brunaccini Giuseppe", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Pelaia Maia Valeria", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Rizzo Elena", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Fruci Luciano", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Vita Matteo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Guerrisi Giada", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Favata Salvatore", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },
    { name: "Fiumara Roberto", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)", term: "2025-2027" },

    // COSPECS
    { name: "Aretino Zaira", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Silvestro Gioele Salvatore", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Calabrò Giada", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Ventrice Ilenia", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Tranchida Antonio Valerio", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)", term: "2025-2027" },
    { name: "Albanese Aylin", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)", term: "2025-2027" },

    // MIFT
    { name: "Mantineo Massimo", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Angioletti Angela", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Marzullo Simona", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Puglisi Emanuele", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Msadak Youssef", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },
    { name: "Anas Muhammad", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)", term: "2025-2027" },

    // SCIPOG
    { name: "Cosentino Maria Giovanna", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Hallajian Nasim", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Mandracchia Sophia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Karunanayaka Rishin Sasith Kavinga Silva", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Scarfì Medrano Erica Jane", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Iellamo Paolo Antonio", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Sciabà Giovanni Pio", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Maimone Andrea", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Stanzione Mattia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },
    { name: "Lazzaro Maria Sara", listName: "O.R.U.M.", category: "DEPARTMENT", department: "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)", term: "2025-2027" },

    // VET
    { name: "Scauzzo Taragnino Giovanni Giacomo", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Virga Alessandro", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Patti Giuseppe Placido", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Arsuffi Alice", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Barbaro Sofia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Brusca Simona", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Klinkov Vittoria", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Orfanello Silvia", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Pellegrino Francesco", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Longi Dèsirèe", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Evola Carola", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },
    { name: "Romano Salvatore", listName: "MORGANA", category: "DEPARTMENT", department: "Dipartimento Scienze Veterinarie (VET)", term: "2025-2027" },

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

const eventsData = [
    {
        title: "Il Diritto d'Autore nell'Era Digitale",
        description: "Un seminario di approfondimento sulle nuove normative europee e l'impatto sull'industria creativa.",
        details: "Il seminario, organizzato in collaborazione con il Dipartimento di Giurisprudenza, affronterà i seguenti temi:\n\n• Le nuove direttive europee sul copyright digitale\n• L'impatto sulle piattaforme di streaming e social media\n• Casi studio: YouTube, Spotify e il diritto d'autore\n• Tavola rotonda con avvocati del settore\n\nOspiti d'eccezione dal mondo accademico e forense. Al termine del seminario sarà rilasciato un attestato di partecipazione.",
        date: new Date("2026-02-24T15:30:00"),
        location: "Aula Magna – Rettorato UniMe",
        cfuValue: "1",
        cfuType: "DIPARTIMENTO",
        cfuDepartments: "Giurisprudenza",
        category: "Seminari CFU",
        bookingOpen: true,
        bookingStart: new Date("2026-02-10T00:00:00"),
        bookingEnd: new Date("2026-02-23T23:59:00"),
    },
    {
        title: "Torneo Universitario di Calcetto",
        description: "La grande sfida sportiva tra i dipartimenti dell'Ateneo! Iscriviti con la tua squadra e vinci il trofeo della prima edizione.",
        details: "Regolamento:\n• Squadre da 5 giocatori + 2 riserve\n• Fase a gironi + eliminazione diretta\n• Arbitri ufficiali FIGC\n\nPremi:\n🥇 Trofeo + buoni Amazon per il team\n🥈 Gadget esclusivi\n🥉 T-shirt commemorative\n\nPranzo offerto per tutti i partecipanti.",
        date: new Date("2026-03-08T10:00:00"),
        endDate: new Date("2026-03-09T18:00:00"),
        location: "Impianti Sportivi CUS Messina",
        category: "Sociale",
        bookingOpen: true,
        bookingStart: new Date("2026-02-15T00:00:00"),
        bookingEnd: new Date("2026-03-05T23:59:00"),
    },
    {
        title: "Workshop: CV e Colloquio di Lavoro",
        description: "Impara a costruire un curriculum efficace e ad affrontare i colloqui con sicurezza. A cura di esperti HR e recruiter.",
        details: "Programma del workshop:\n\n14:00 – Introduzione e ice-breaking\n14:30 – Come scrivere un CV efficace (con template)\n15:30 – Coffee break\n15:45 – Simulazione colloquio di lavoro\n16:45 – Q&A con recruiter aziendali\n17:30 – Networking\n\nOgni partecipante riceverà un template CV professionale e una checklist per i colloqui.",
        date: new Date("2026-03-15T14:00:00"),
        location: "Aula 1 – Dip. Economia",
        cfuValue: "1",
        cfuType: "SENATO",
        category: "Seminari CFU",
        bookingOpen: true,
        bookingStart: new Date("2026-03-01T00:00:00"),
        bookingEnd: new Date("2026-03-14T18:00:00"),
    },
    {
        title: "Cineforum: 'La Meglio Gioventù'",
        description: "Proiezione integrale del capolavoro di Marco Tullio Giordana, seguita da un dibattito con il Prof. Ferrara.",
        details: "Prima parte (18:00 – 20:00): Proiezione del film – Parte I\nPausa cena (20:00 – 20:30)\nSeconda parte (20:30 – 22:30): Proiezione del film – Parte II\nDibattito (22:30 – 23:00): con il Prof. Ferrara sulla rappresentazione della storia italiana nel cinema contemporaneo.\n\nIngresso libero fino ad esaurimento posti.",
        date: new Date("2026-03-20T18:00:00"),
        location: "Aula Magna – DICAM",
        category: "Cultura",
        bookingOpen: false,
    },
    {
        title: "Aperitivo di Primavera",
        description: "Il tradizionale aperitivo di inizio primavera per tutti i soci! Musica dal vivo, cocktail e la possibilità di conoscere i nuovi rappresentanti eletti.",
        details: "Programma serata:\n\n19:30 – Apertura e welcome drink\n20:00 – Presentazione nuovi rappresentanti eletti\n20:30 – Musica dal vivo con la band \"I Ciclopi\"\n21:30 – DJ set\n\nDress code: Smart casual\nIngresso riservato ai tesserati con tessera valida.",
        date: new Date("2026-03-22T19:30:00"),
        location: "Lido di Mortelle – Beach Club",
        category: "Sociale",
        bookingOpen: true,
        bookingStart: new Date("2026-03-10T00:00:00"),
        bookingEnd: new Date("2026-03-21T20:00:00"),
    },
    {
        title: "Seminario: Intelligenza Artificiale e Medicina",
        description: "Come l'IA sta rivoluzionando la diagnostica e la ricerca medica. Dimostrazioni pratiche di AI applicata all'imaging biomedico.",
        details: "Intervengono:\n• Prof. Battaglia (DIMED) – \"AI nella diagnostica per immagini\"\n• Dott. Micale – \"Machine Learning per la ricerca oncologica\"\n• Dott.ssa Novarino – \"Etica e AI in ambito sanitario\"\n\nDurante il seminario verranno mostrate demo live di modelli di AI applicati a:\n- Analisi di radiografie\n- Screening dermatologico\n- Predizione rischio cardiovascolare",
        date: new Date("2026-04-05T09:30:00"),
        location: "Aula Magna – Policlinico Universitario",
        cfuValue: "2",
        cfuType: "DIPARTIMENTO",
        cfuDepartments: "Medicina Clinica e Sperimentale (DIMED),Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)",
        category: "Seminari CFU",
        bookingOpen: true,
        bookingStart: new Date("2026-03-15T00:00:00"),
        bookingEnd: new Date("2026-04-04T18:00:00"),
    },
]

const organigrammaMembers = [
    // MORGANA
    { name: "Francesco Salvo", role: "Presidente", roleEn: "President", email: "presidenza.morgana@gmail.com", association: "MORGANA", section: "PRESIDENCY", order: 0 },
    { name: "Elena Crisafulli", role: "Vice Presidente", roleEn: "Vice President", email: "vicepresidenza.morgana@gmail.com", association: "MORGANA", section: "PRESIDENCY", order: 1 },
    { name: "Alessandro Trimarchi", role: "Segretario Generale", roleEn: "Secretary General", association: "MORGANA", section: "BOARD", order: 0 },
    { name: "Sofia D'Amico", role: "Tesoriere", roleEn: "Treasurer", association: "MORGANA", section: "BOARD", order: 1 },
    { name: "Valerio Puglisi", role: "Coordinatore Rappresentanti", roleEn: "Representatives Coordinator", association: "MORGANA", section: "BOARD", order: 2 },
    { name: "Giorgio Messina", role: "Dipartimento Attività Culturali", roleEn: "Department of Cultural Activities", association: "MORGANA", section: "DEPARTMENT", order: 0 },
    { name: "Marta Alibrandi", role: "Dipartimento Comunicazione & Web", roleEn: "Communication & Web Department", association: "MORGANA", section: "DEPARTMENT", order: 1 },
    { name: "Claudio Vinci", role: "Dipartimento Orientamento Matricole", roleEn: "Freshmen Orientation Department", association: "MORGANA", section: "DEPARTMENT", order: 2 },

    // ORUM
    { name: "Giuseppe Campolo", role: "Presidente", roleEn: "President", email: "presidenza.orum@gmail.com", association: "ORUM", section: "PRESIDENCY", order: 0 },
    { name: "Federica Smiroldo", role: "Vice Presidente", roleEn: "Vice President", email: "vicepresidenza.orum@gmail.com", association: "ORUM", section: "PRESIDENCY", order: 1 },
    { name: "Domenico Barbaro", role: "Segretario", roleEn: "Secretary", association: "ORUM", section: "BOARD", order: 0 },
    { name: "Chiara Ruggeri", role: "Tesoriere", roleEn: "Treasurer", association: "ORUM", section: "BOARD", order: 1 },
    { name: "Matteo Pappalardo", role: "Responsabile Organizzativo", roleEn: "Organizational Manager", association: "ORUM", section: "BOARD", order: 2 },
    { name: "Simona Castorina", role: "Dipartimento Didattica & Diritto allo Studio", roleEn: "Department of Didactics & Right to Study", association: "ORUM", section: "DEPARTMENT", order: 0 },
    { name: "Luca Arena", role: "Dipartimento Grafica & Social Media", roleEn: "Graphics & Social Media Department", association: "ORUM", section: "DEPARTMENT", order: 1 },
    { name: "Antonio Bruno", role: "Dipartimento Relazioni Esterne & Convenzioni", roleEn: "External Relations & Conventions Department", association: "ORUM", section: "DEPARTMENT", order: 2 }
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

async function main() {
    console.log('⏳ Svuotando il database per evitare duplicati...')
    await prisma.registration.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.representative.deleteMany({})
    await prisma.news.deleteMany({})
    await prisma.organigrammaMember.deleteMany({})
    await prisma.serviceItem.deleteMany({})
    await prisma.serviceCategory.deleteMany({})

    console.log('🚀 Inserimento Rappresentanti in corso...')
    for (const rep of representatives) {
        await prisma.representative.create({ data: rep })
    }

    console.log('📰 Inserimento News in corso...')
    for (const item of newsData) {
        await prisma.news.create({ data: item })
    }

    console.log('📅 Inserimento Eventi in corso...')
    for (const item of eventsData) {
        await prisma.event.create({ data: item })
    }

    console.log('👥 Inserimento Organigramma in corso...')
    for (const member of organigrammaMembers) {
        await prisma.organigrammaMember.create({ data: member })
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

    const repsCount = await prisma.representative.count()
    const newsCount = await prisma.news.count()
    const eventsCount = await prisma.event.count()
    const organigrammaCount = await prisma.organigrammaMember.count()
    const categoriesCount = await prisma.serviceCategory.count()
    const itemsCount = await prisma.serviceItem.count()
    console.log(`✅ Finito! Inseriti ${repsCount} rappresentanti, ${newsCount} news, ${eventsCount} eventi, ${organigrammaCount} membri organigramma, ${categoriesCount} categorie servizi e ${itemsCount} servizi.`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())