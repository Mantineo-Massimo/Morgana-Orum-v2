type BrandConfig = {
    name: string
    color: string
    logo: string
}

export const BRANDS: Record<string, BrandConfig> = {
    morgana: {
        name: "Associazione Morgana",
        color: "#18182b",
        logo: "https://morganaorum.vercel.app/assets/morgana.png"
    },
    orum: {
        name: "Associazione O.R.U.M.",
        color: "#18182b",
        logo: "https://morganaorum.vercel.app/assets/orum.png"
    },
    unimhealth: {
        name: "Unimhealth",
        color: "#c9041a",
        logo: "https://morganaorum.vercel.app/assets/unimhealth.png"
    },
    economia: {
        name: "Studenti Economia",
        color: "#202549",
        logo: "https://morganaorum.vercel.app/assets/studentieconomia.png"
    },
    matricole: {
        name: "Unime Matricole",
        color: "#0d6cab",
        logo: "https://morganaorum.vercel.app/assets/unimematricole.png"
    },
    scipog: {
        name: "Studenti Scipog",
        color: "#fbc363",
        logo: "https://morganaorum.vercel.app/assets/studentiscipog.png"
    },
    dicam: {
        name: "Inside Dicam",
        color: "#f34ab4",
        logo: "https://morganaorum.vercel.app/assets/insidedicam.png"
    }
}

const getEmailHeader = (title: string, bgColor: string) => `
        <div style="background-color: ${bgColor}; padding: 30px; text-align: center;">
            <div style="display: inline-block;">
                <img src="https://morganaorum.vercel.app/assets/morgana.png" alt="Morgana" style="height: 55px; width: auto; vertical-align: middle; margin-right: 15px;" />
                <span style="font-size: 30px; color: rgba(255,255,255,0.2); vertical-align: middle;">|</span>
                <img src="https://morganaorum.vercel.app/assets/orum.png" alt="O.R.U.M." style="height: 55px; width: auto; vertical-align: middle; margin-left: 15px;" />
            </div>
            <h1 style="color: white; margin-top: 25px; font-size: 24px; font-weight: 600;">${title}</h1>
        </div>
`

const getEmailFooter = (disclaimer: string) => `
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            
            <div style="text-align: center; margin-bottom: 25px;">
                <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; font-weight: bold;">Scopri il Nostro Network</p>
                <div style="display: inline-block;">
                    <img src="https://morganaorum.vercel.app/assets/unimhealth.png" alt="Unimhealth" style="height: 28px; width: auto; margin: 0 8px; vertical-align: middle; opacity: 0.8;" />
                    <img src="https://morganaorum.vercel.app/assets/studentieconomia.png" alt="Economia" style="height: 28px; width: auto; margin: 0 8px; vertical-align: middle; opacity: 0.8;" />
                    <img src="https://morganaorum.vercel.app/assets/unimematricole.png" alt="Matricole" style="height: 28px; width: auto; margin: 0 8px; vertical-align: middle; opacity: 0.8;" />
                    <img src="https://morganaorum.vercel.app/assets/studentiscipog.png" alt="Scipog" style="height: 28px; width: auto; margin: 0 8px; vertical-align: middle; opacity: 0.8;" />
                    <img src="https://morganaorum.vercel.app/assets/insidedicam.png" alt="Dicam" style="height: 28px; width: auto; margin: 0 8px; vertical-align: middle; opacity: 0.8;" />
                </div>
            </div>

            <p style="font-size: 11px; color: #888; text-align: center; line-height: 1.6;">
                ${disclaimer}<br />
                © ${new Date().getFullYear()} Morgana & O.R.U.M. Associazioni Universitarie
            </p>
`

export function getWelcomeEmailTemplate(userName: string, brand: string = "morgana") {
    const config = BRANDS[brand] || BRANDS.morgana

    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        ${getEmailHeader("Benvenuto nel nostro portale!", config.color)}
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            <p>Ciao <strong>${userName}</strong>,</p>
            <p>Siamo felici di averti tra noi. La tua registrazione alla piattaforma è avvenuta con successo.</p>
            <p>Ora puoi accedere alla tua area personale per:</p>
            <ul style="color: #555;">
                <li>Gestire le tue prenotazioni</li>
                <li>Scoprire le convenzioni esclusive e gli sconti</li>
                <li>Chiedere informazioni tramite la sezione assistenza</li>
            </ul>
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://morganaorum.vercel.app/${brand}/login" 
                   style="background-color: #18181b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                   Accedi alla Dashboard
                </a>
            </div>
            ${getEmailFooter("Sempre dalla parte dello studente!")}
        </div>
    </div>
    `
}

export function getEventBookingTemplate(userName: string, eventTitle: string, eventDate: string, eventLocation: string, brand: string = "morgana") {
    const config = BRANDS[brand] || BRANDS.morgana

    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        ${getEmailHeader("Prenotazione Confermata!", config.color)}
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            <p>Ciao <strong>${userName}</strong>,</p>
            <p>La tua prenotazione per l'evento è stata registrata correttamente.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
                <h3 style="margin-top: 0; margin-bottom: 15px; color: #111;">${eventTitle}</h3>
                <p style="margin-bottom: 8px; color: #444;">📅 <strong>Data:</strong> ${eventDate}</p>
                <p style="margin: 0; color: #444;">📍 <strong>Luogo:</strong> ${eventLocation}</p>
            </div>

            <p style="color: #555;">Ti ricordiamo che potrai consultare i dettagli della tua prenotazione e scaricare eventuali allegati direttamente dalla tua dashboard.</p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://morganaorum.vercel.app/dashboard/events" 
                   style="background-color: #18181b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                   I Miei Eventi
                </a>
            </div>

            ${getEmailFooter("Non mancare! Se dovessi avere problemi a partecipare, per favore cancella la prenotazione dalla dashboard per liberare il posto.")}
        </div>
    </div>
    `
}

export function getPasswordResetTemplate(userName: string, resetLink: string, brand: string = "morgana") {
    const config = BRANDS[brand] || BRANDS.morgana

    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        ${getEmailHeader("Recupero Password", config.color)}
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            <p>Ciao <strong>${userName}</strong>,</p>
            <p>Abbiamo ricevuto una richiesta di ripristino della password per il tuo account nel portale delle associazioni.</p>
            <p>Puoi procedere alla creazione di una nuova password cliccando sul pulsante qui sotto:</p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${resetLink}" 
                   style="background-color: #18182b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                   Ripristina Password
                </a>
            </div>

            <p style="font-size: 13px; color: #666; margin-bottom: 5px;">Questo link scadrà tra 1 ora per motivi di sicurezza.</p>
            <p style="font-size: 13px; color: #666; margin-top: 0;">Se non hai richiesto tu il ripristino, puoi ignorare questa email in tutta sicurezza.</p>

            ${getEmailFooter("Se hai problemi ad accedere, contatta i tuoi rappresentanti per assistenza.")}
        </div>
    </div>
    `
}

export function getNewsletterTemplate(userName: string, title: string, description: string, linkUrl: string, type: "Evento" | "Notizia", brand: string = "morgana") {
    const config = BRANDS[brand] || BRANDS.morgana

    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        ${getEmailHeader(`Nuov${type === "Evento" ? "o" : "a"} ${type}!`, config.color)}
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            <p>Ciao <strong>${userName}</strong>,</p>
            <p>Abbiamo appena pubblicato un${type === "Evento" ? "o nuovo" : "a nuova"} <strong>${type.toLowerCase()}</strong> che potrebbe interessarti.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
                <h3 style="margin-top: 0; margin-bottom: 10px; color: #111;">${title}</h3>
                <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.5;">${description}</p>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${linkUrl}" 
                   style="background-color: #18181b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                   Scopri di più
                </a>
            </div>

            ${getEmailFooter("Ricevi questa email perché hai scelto di iscriverti alla nostra Newsletter automatica in fase di registrazione.")}
        </div>
    </div>
    `
}

export function getContactEmailTemplate(name: string, email: string, subject: string, message: string) {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        ${getEmailHeader("Nuovo Messaggio dal Portale", "#18182b")}
        <div style="padding: 30px; line-height: 1.6; color: #333;">
            <p>Hai ricevuto un nuovo messaggio tramite il modulo di contatto del sito.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
                <p style="margin-bottom: 8px; color: #444;"><strong>Da:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                <p style="margin-bottom: 8px; color: #444;"><strong>Oggetto:</strong> ${subject}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
                <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.5; white-space: pre-line;">${message}</p>
            </div>
            
            <p style="font-size: 12px; color: #888; text-align: center;">
                Rispondi direttamente a questa email per ricontattare l'utente.
            </p>

            ${getEmailFooter("Servizio di messaggistica automatica Morgana & O.R.U.M.")}
        </div>
    </div>
    `
}
