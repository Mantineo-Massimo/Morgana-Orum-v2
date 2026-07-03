# Morgana & Orum - Portale Associazioni Studentesche (v2)

Un portale web moderno, bilingue e performante sviluppato per la gestione e la fornitura di servizi agli studenti delle associazioni studentesche **Morgana** e **O.R.U.M.** dell'Università degli Studi di Messina.

---

## 🚀 Caratteristiche Principali

Il portale offre un set completo di funzionalità sia per gli studenti sia per gli amministratori delle associazioni:

### Per gli Studenti
- 👤 **Autenticazione e Profilo Utente**: Registrazione sicura con email istituzionale/personale, matricola, dipartimento e corso di laurea. Gestione del profilo e della preferenza *fuorisede*.
- 📅 **Prenotazione Eventi**: Visualizzazione e prenotazione agli eventi organizzati dalle associazioni, con calcolo dei CFU associati per dipartimento. Generazione di biglietti/QR-Code per il check-in.
- 🎓 **Simulazione Voto di Laurea**: Strumento per calcolare la media ponderata (aritmetica e con lode pesata a 31), impostare i CFU target (es. 180 o 120), stimare i punti di tesi e visualizzare il voto di partenza stimato.
- 🤝 **Convenzioni Studentesche**: Mappa interattiva (Leaflet) e lista delle attività commerciali convenzionate con sconti dedicati agli associati.
- 💬 **Gruppi WhatsApp Accademici**: Elenco filtrabile per dipartimento e anno di corso di tutti i gruppi di studio e community su WhatsApp.
- ℹ️ **Organigramma e Rappresentanti**: Contatti e ruoli di tutti i rappresentanti eletti nei vari organi (Consiglio di Amministrazione, Senato Accademico, Dipartimenti, ERSU, CNSU, ecc.).
- 🎭 **Piazza dell'Arte**: Sezione speciale dedicata al festival dell'arte, comprensente profili degli artisti partecipanti, programma giornaliero e galleria media.

### Per gli Amministratori (Admin Dashboard)
- 📊 **Gestione Eventi & Prenotazioni**: Creazione, modifica e pubblicazione di eventi con gestione dei CFU per dipartimento. Monitoraggio in tempo reale degli iscritti e download della lista iscritti in formato Excel (XLSX) o PDF.
- 📰 **Gestione News**: Editor di testo per pubblicare articoli informativi e notizie per gli studenti.
- 👥 **Gestione Organigramma e Rappresentanti**: Interfaccia per inserire e aggiornare i membri dell'associazione e i rappresentanti degli studenti.
- 📁 **Libreria Media**: Upload di immagini e allegati (documenti PDF, moduli) tramite AWS S3/Cloudinary.
- 📧 **Newsletter & Comunicazioni**: Gestione degli iscritti alla newsletter e invio di email transazionali/conferme con branding dinamico (Morgana/Orum).

---

## 🛠️ Tech Stack

Il progetto è costruito con tecnologie moderne e robuste per garantire velocità, sicurezza e facilità di manutenzione:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & ORM**: PostgreSQL con [Prisma ORM](https://www.prisma.io/)
- **Stile & UI**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (animazioni fluide) + [Radix UI](https://www.radix-ui.com/)
- **Internazionalizzazione (i18n)**: [next-intl](https://next-intl-docs.vercel.app/) per il supporto bilingue (Italiano 🇮🇹 / Inglese 🇬🇧)
- **Invio Email**: AWS SES (Simple Email Service) / Nodemailer / Resend
- **Media Storage**: Cloudinary / Vercel Blob / AWS S3
- **Geolocalizzazione**: Leaflet (via React Leaflet) per la visualizzazione delle convenzioni
- **Export Dati**: SheetJS (xlsx) e jsPDF

---

## 📦 Struttura del Progetto

La struttura segue l'architettura standard di Next.js con la directory `src/`:

```text
├── documents/            # Documentazione varia e legale
├── prisma/               # Schema database, migrazioni e seed
│   ├── schema.prisma     # Definizione dei modelli di database
│   └── seed.ts           # Dati predefiniti per rappresentanti, servizi, ecc.
├── scripts/              # Script di utilità e manutenzione database
└── src/
    ├── app/              # Pagine e rotte API (App Router)
    ├── components/       # Componenti UI riutilizzabili
    ├── i18n/             # Configurazione internazionalizzazione
    ├── lib/              # Client Prisma, template email, utilità per mail e date
    ├── messages/         # Traduzioni JSON (it.json, en.json)
    └── middleware.ts     # Middleware di Next.js (gestione locale e sessione)
```

---

## ⚙️ Configurazione ed Installazione

### 1. Clonare il Repository
```bash
git clone <url-repository>
cd Morgana-Orum-v2
```

### 2. Installare le Dipendenze
```bash
npm install
```

### 3. Configurare le Variabili d'Ambiente
Crea un file `.env` nella root del progetto basandoti sul file `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
DIRECT_URL="postgresql://user:password@host:port/dbname?schema=public"

# AWS SES (Configurazione Mail)
AWS_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="tuo-access-key-id"
AWS_SECRET_ACCESS_KEY="tuo-secret-access-key"

# Cloudinary (Media upload)
CLOUDINARY_CLOUD_NAME="tuo-cloud-name"
CLOUDINARY_API_KEY="tua-api-key"
CLOUDINARY_API_SECRET="tua-api-secret"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Ambiente
NODE_ENV="development"
```

### 4. Setup del Database
Genera il client Prisma ed esegui il seeding iniziale per popolare il database con rappresentanti, servizi accademici, e gruppi WhatsApp standard:

```bash
npx prisma generate
npx prisma db push       # o npx prisma migrate dev
npm run postinstall      # per assicurare la rigenerazione del client
npx prisma db seed       # esegue prisma/seed.ts
```

### 5. Avviare il Server di Sviluppo
```bash
npm run dev
```
Il portale sarà accessibile localmente su [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Script di Manutenzione (`scripts/`)

Il progetto contiene diversi script Node/TypeScript per agevolare la gestione del database e l'importazione dei dati:

- **`import-eletti.ts`**: Importa i rappresentanti eletti a partire da file di configurazione o sorgenti esterne.
- **`format-phones.ts`**: Pulisce e formatta in modo uniforme i numeri di telefono dei rappresentanti.
- **`update-emails-and-roles.ts`**: Aggiorna gli indirizzi email istituzionali e assegna i ruoli corretti agli amministratori.
- **`check-biennium-configs.ts`**: Controlla e inizializza le configurazioni di visibilità del biennio dei rappresentanti.
- **`test-security.js`**: Esegue test di sicurezza per verificare la protezione delle rotte ed evitare fughe di dati.

Puoi eseguire qualsiasi script utilizzando `tsx` o `npx tsx`, ad esempio:
```bash
npx tsx scripts/check-biennium-configs.ts
```

---

## 🤝 Contribuire

1. Crea un branch per la tua feature (`git checkout -b feature/nuova-funzionalita`)
2. Esegui il commit delle modifiche (`git commit -m 'Aggiunta nuova funzionalità'`)
3. Esegui il push sul branch (`git push origin feature/nuova-funzionalita`)
4. Apri una Pull Request

---

## 📄 Licenza

Questo progetto è privato e ad uso esclusivo delle associazioni **Morgana** e **O.R.U.M.**.
