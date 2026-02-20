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
    { name: "Sbilordo Fabrizio", listName: "AZIONE", category: "NATIONAL", role: "CNSU (Consiglio Nazionale degli Studenti Universitari)", term: "2025-2028", roleDescription: `È il massimo organo di rappresentanza studentesca a livello statale.\nCosa fa: Funge da ponte tra gli studenti e il MUR (Ministero dell’Università e della Ricerca). Formula pareri obbligatori sui decreti che riguardano l'università, propone riforme e monitora la condizione studentesca in tutta Italia.\nComposizione: È formato da 28 studenti eletti ogni tre anni su base nazionale.` },

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

async function main() {
    console.log('⏳ Svuotando il database per evitare duplicati...')
    await prisma.registration.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.representative.deleteMany({})
    await prisma.news.deleteMany({})

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

    const repsCount = await prisma.representative.count()
    const newsCount = await prisma.news.count()
    const eventsCount = await prisma.event.count()
    console.log(`✅ Finito! Inseriti ${repsCount} rappresentanti, ${newsCount} news e ${eventsCount} eventi.`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())