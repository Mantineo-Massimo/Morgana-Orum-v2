type BrandConfig = {
    name: string
    color: string
    logo: string
}

export const BRANDS: Record<string, BrandConfig> = {
    morgana: {
        name: "Associazione Morgana",
        color: "#c12830",
        logo: "https://www.morganaorum.it/assets/loghi/morgana/Morgana.png"
    },
    orum: {
        name: "Associazione O.R.U.M.",
        color: "#18182e",
        logo: "https://www.morganaorum.it/assets/loghi/orum/ORUM.png"
    },
    unimhealth: {
        name: "Unimhealth",
        color: "#c12830",
        logo: "https://www.morganaorum.it/assets/loghi/unimhealth/HEALTH.png"
    },
    economia: {
        name: "Studenti Economia",
        color: "#18224b",
        logo: "https://www.morganaorum.it/assets/loghi/studentieconomia/Economia.png"
    },
    matricole: {
        name: "Unime Matricole",
        color: "#004b87",
        logo: "https://www.morganaorum.it/assets/loghi/matricole/Matricole.png"
    },
    scipog: {
        name: "Studenti Scipog",
        color: "#f4b43b",
        logo: "https://www.morganaorum.it/assets/loghi/studentiscipog/SCIPOG.png"
    },
    dicam: {
        name: "Inside Dicam",
        color: "#00b4d8",
        logo: "https://www.morganaorum.it/assets/loghi/insidedicam/DICAM.png"
    }
}

const getEmailHeader = (title: string, brandColor: string) => `
        <div style="border-top: 4px solid ${brandColor}; padding: 30px 30px 20px 30px; text-align: center; background-color: #ffffff;">
            <div style="margin-bottom: 20px;">
                <a href="https://www.instagram.com/associazione.morgana" target="_blank" style="text-decoration: none;">
                    <img src="https://www.morganaorum.it/assets/loghi/morgana/Morgana.png" alt="Morgana" style="height: 60px; width: auto; vertical-align: middle; margin-right: 12px; border: 0;" />
                </a>
                <span style="font-size: 24px; color: #e5e7eb; vertical-align: middle;">|</span>
                <a href="https://www.instagram.com/orum_unime" target="_blank" style="text-decoration: none;">
                    <img src="https://www.morganaorum.it/assets/loghi/orum/ORUM.png" alt="O.R.U.M." style="height: 60px; width: auto; vertical-align: middle; margin-left: 12px; border: 0;" />
                </a>
            </div>
            <h1 style="color: #111827; margin: 0; font-size: 22px; font-weight: 800; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">${title}</h1>
        </div>
`

const getEmailFooter = (disclaimer: string) => `
        <div style="padding: 0 30px 30px 30px; background-color: #ffffff;">
            <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
            
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0; font-weight: 700; font-family: system-ui, -apple-system, sans-serif;">Il Nostro Network</p>
                <div style="display: inline-block;">
                    <a href="https://www.instagram.com/unimhealth" target="_blank" style="text-decoration: none; margin: 0 8px; display: inline-block;">
                        <img src="https://www.morganaorum.it/assets/loghi/unimhealth/HEALTH.png" alt="Unimhealth" style="height: 30px; width: auto; vertical-align: middle; opacity: 0.8; border: 0;" />
                    </a>
                    <a href="https://www.instagram.com/studentieconomia" target="_blank" style="text-decoration: none; margin: 0 8px; display: inline-block;">
                        <img src="https://www.morganaorum.it/assets/loghi/studentieconomia/Economia.png" alt="Economia" style="height: 30px; width: auto; vertical-align: middle; opacity: 0.8; border: 0;" />
                    </a>
                    <a href="https://www.instagram.com/unime.matricole" target="_blank" style="text-decoration: none; margin: 0 8px; display: inline-block;">
                        <img src="https://www.morganaorum.it/assets/loghi/matricole/Matricole.png" alt="Matricole" style="height: 30px; width: auto; vertical-align: middle; opacity: 0.8; border: 0;" />
                    </a>
                    <a href="https://www.instagram.com/studentiscipog" target="_blank" style="text-decoration: none; margin: 0 8px; display: inline-block;">
                        <img src="https://www.morganaorum.it/assets/loghi/studentiscipog/SCIPOG.png" alt="Scipog" style="height: 30px; width: auto; vertical-align: middle; opacity: 0.8; border: 0;" />
                    </a>
                    <a href="https://www.instagram.com/inside_dicam" target="_blank" style="text-decoration: none; margin: 0 8px; display: inline-block;">
                        <img src="https://www.morganaorum.it/assets/loghi/insidedicam/DICAM.png" alt="Dicam" style="height: 30px; width: auto; vertical-align: middle; opacity: 0.8; border: 0;" />
                    </a>
                </div>
            </div>

            <p style="font-size: 11px; color: #6b7280; text-align: center; line-height: 1.6; margin: 0; font-family: system-ui, -apple-system, sans-serif;">
                ${disclaimer}<br />
                <span style="color: #9ca3af; font-size: 10px; display: inline-block; margin-top: 6px;">© ${new Date().getFullYear()} Morgana & O.R.U.M. Associazioni Universitarie</span>
            </p>
        </div>
`

export function getWelcomeEmailTemplate(userName: string, brand: string = "morgana", locale: string = "it") {
    const config = BRANDS[brand] || BRANDS.morgana
    const isEn = locale === "en"

    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader(isEn ? "Welcome to our portal!" : "Benvenuto nel nostro portale!", config.color)}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 16px; color: #111827;">${isEn ? "Hello" : "Ciao"} <strong>${userName}</strong>,</p>
                <p style="font-size: 15px;">${isEn 
                    ? "We are glad to have you with us. Your registration on the platform was successful."
                    : "Siamo felici di averti tra noi. La tua registrazione alla piattaforma è avvenuta con successo."}</p>
                <p style="font-size: 15px;">${isEn ? "You can now access your personal area to:" : "Ora puoi accedere alla tua area personale per:"}</p>
                <ul style="color: #4b5563; font-size: 14px; padding-left: 20px; margin-bottom: 24px;">
                    <li style="margin-bottom: 8px;">${isEn ? "Manage your event bookings" : "Gestire le tue prenotazioni agli eventi"}</li>
                    <li style="margin-bottom: 8px;">${isEn ? "Discover exclusive partnerships and discounts" : "Scoprire le convenzioni esclusive e gli sconti"}</li>
                    <li style="margin-bottom: 8px;">${isEn ? "Request support via the assistance section" : "Chiedere informazioni tramite la sezione assistenza"}</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.morganaorum.it/${brand}/login" 
                       style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(17,24,39,0.2);">
                       ${isEn ? "Access Dashboard" : "Accedi alla Dashboard"}
                    </a>
                </div>
            </div>
            ${getEmailFooter(isEn ? "Always supporting students!" : "Sempre dalla parte dello studente!")}
        </div>
    </div>
    `
}

export function getEmailVerificationTemplate(userName: string, verificationLink: string, brand: string = "morgana", locale: string = "it") {
    const config = BRANDS[brand] || BRANDS.morgana
    const isEn = locale === "en"

    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader(isEn ? "Verify your email" : "Verifica la tua email", config.color)}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 16px; color: #111827;">${isEn ? "Hello" : "Ciao"} <strong>${userName}</strong>,</p>
                <p style="font-size: 15px;">${isEn 
                    ? "Thank you for registering on our platform. Before you can log in, you must verify your email address by clicking the button below:" 
                    : "Grazie per esserti registrato sul nostro portale. Prima di poter accedere, devi verificare il tuo indirizzo email cliccando sul pulsante qui sotto:"}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" 
                       style="background-color: ${config.color}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(17,24,39,0.2);">
                       ${isEn ? "Verify Email" : "Verifica Email"}
                    </a>
                </div>

                <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">${isEn 
                    ? "If you did not create this account, you can safely ignore this email." 
                    : "Se non hai creato tu questo account, puoi ignorare questa email in tutta sicurezza."}</p>
            </div>
            ${getEmailFooter(isEn ? "Always supporting students!" : "Sempre dalla parte dello studente!")}
        </div>
    </div>
    `
}


export function getEventBookingTemplate(userName: string, eventTitle: string, eventDate: string, eventLocation: string, brand: string = "morgana", locale: string = "it") {
    const config = BRANDS[brand] || BRANDS.morgana
    const isEn = locale === "en"

    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader(isEn ? "Booking Confirmed!" : "Prenotazione Confermata!", config.color)}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 16px; color: #111827;">${isEn ? "Hello" : "Ciao"} <strong>${userName}</strong>,</p>
                <p style="font-size: 15px;">${isEn 
                    ? "Your booking for the event has been successfully registered." 
                    : "La tua prenotazione per l'evento è stata registrata correttamente."}</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <h3 style="margin-top: 0; margin-bottom: 12px; color: #0f172a; font-size: 16px; font-weight: 700;">${eventTitle}</h3>
                    <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">📅 <strong>${isEn ? "Date" : "Data"}:</strong> ${eventDate}</p>
                    <p style="margin: 0; color: #475569; font-size: 14px;">📍 <strong>${isEn ? "Location" : "Luogo"}:</strong> ${eventLocation}</p>
                </div>

                <p style="color: #4b5563; font-size: 14px;">${isEn 
                    ? "Please remember that you can view your booking details and download any attachments directly from your dashboard." 
                    : "Ti ricordiamo che potrai consultare i dettagli della tua prenotazione e scaricare eventuali allegati direttamente dalla tua dashboard."}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.morganaorum.it/dashboard/events" 
                       style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(17,24,39,0.2);">
                       ${isEn ? "My Events" : "I Miei Eventi"}
                    </a>
                </div>
            </div>
            ${getEmailFooter(isEn 
                ? "If you cannot attend, please cancel your booking from the dashboard to free up the slot." 
                : "Se dovessi avere problemi a partecipare, cancella la prenotazione dalla dashboard per liberare il posto.")}
        </div>
    </div>
    `
}

export function getPasswordResetTemplate(userName: string, resetLink: string, brand: string = "morgana", locale: string = "it") {
    const config = BRANDS[brand] || BRANDS.morgana
    const isEn = locale === "en"

    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader(isEn ? "Password Reset" : "Recupero Password", config.color)}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 16px; color: #111827;">${isEn ? "Hello" : "Ciao"} <strong>${userName}</strong>,</p>
                <p style="font-size: 15px;">${isEn 
                    ? "We received a password reset request for your account on the associations portal." 
                    : "Abbiamo ricevuto una richiesta di ripristino della password per il tuo account nel portale delle associazioni."}</p>
                <p style="font-size: 15px;">${isEn 
                    ? "You can proceed to set a new password by clicking the button below:" 
                    : "Puoi procedere alla creazione di una nuova password cliccando sul pulsante qui sotto:"}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: ${config.color}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(17,24,39,0.2);">
                       ${isEn ? "Reset Password" : "Ripristina Password"}
                    </a>
                </div>

                <p style="font-size: 13px; color: #6b7280; margin-bottom: 5px;">${isEn 
                    ? "This link will expire in 1 hour for security reasons." 
                    : "Questo link scadrà tra 1 ora per motivi di sicurezza."}</p>
                <p style="font-size: 13px; color: #6b7280; margin-top: 0;">${isEn 
                    ? "If you did not request a reset, you can safely ignore this email." 
                    : "Se non hai richiesto tu il ripristino, puoi ignorare questa email in tutta sicurezza."}</p>
            </div>
            ${getEmailFooter(isEn 
                ? "If you have trouble accessing your account, contact your student representatives for assistance." 
                : "Se hai problemi ad accedere, contatta i tuoi rappresentanti per assistenza.")}
        </div>
    </div>
    `
}

export function getNewsletterTemplate(userName: string, title: string, description: string, linkUrl: string, type: "Evento" | "Notizia", brand: string = "morgana", locale: string = "it") {
    const config = BRANDS[brand] || BRANDS.morgana
    const isEn = locale === "en"
    
    const typeLabel = isEn 
        ? (type === "Evento" ? "Event" : "News")
        : type
        
    const headerTitle = isEn 
        ? `New ${typeLabel}!` 
        : `Nuov${type === "Evento" ? "o" : "a"} ${type}!`
        
    const bodyIntro = isEn 
        ? `We have just published a new <strong>${typeLabel.toLowerCase()}</strong> that might interest you.` 
        : `Abbiamo appena pubblicato un${type === "Evento" ? "o nuovo" : "a nuova"} <strong>${type.toLowerCase()}</strong> che potrebbe interessarti.`

    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader(headerTitle, config.color)}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 16px; color: #111827;">${isEn ? "Hello" : "Ciao"} <strong>${userName}</strong>,</p>
                <p style="font-size: 15px;">${bodyIntro}</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #0f172a; font-size: 16px; font-weight: 700;">${title}</h3>
                    <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">${description}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${linkUrl}" 
                       style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(17,24,39,0.2);">
                       ${isEn ? "Read more" : "Scopri di più"}
                    </a>
                </div>
            </div>
            ${getEmailFooter(isEn 
                ? "You are receiving this email because you opted to subscribe to our automatic Newsletter." 
                : "Ricevi questa email perché hai scelto di iscriverti alla nostra Newsletter automatica.")}
        </div>
    </div>
    `
}

export function getContactEmailTemplate(name: string, email: string, subject: string, message: string) {
    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader("Nuovo Messaggio dal Portale", "#111827")}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 15px;">Hai ricevuto un nuovo messaggio tramite il modulo di contatto del sito.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;"><strong>Da:</strong> ${name} (<a href="mailto:${email}" style="color: #2563eb; text-decoration: underline;">${email}</a>)</p>
                    <p style="margin: 0 0 12px 0; color: #475569; font-size: 14px;"><strong>Oggetto:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
                    <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-line;">${message}</p>
                </div>
                
                <p style="font-size: 13px; color: #6b7280; margin: 0; text-align: center; font-style: italic;">
                    Rispondi direttamente a questa email per ricontattare l'utente.
                </p>
            </div>
            ${getEmailFooter("Servizio di messaggistica automatica Morgana & O.R.U.M.")}
        </div>
    </div>
    `
}

export function getDeadlineAlertTemplate(deadlineTitle: string, deadlineDate: string, locale: string) {
    const isEn = locale === "en"
    const title = isEn ? "Deadline Reminder Registered!" : "Promemoria Scadenza Registrato!"
    
    return `
    <div style="background-color: #f8fafc; padding: 40px 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #f1f5f9;">
            ${getEmailHeader(title, "#f9a620")}
            <div style="padding: 24px 30px; line-height: 1.6; color: #374151;">
                <p style="margin-top: 0; font-size: 16px; color: #111827;">${isEn ? "Hello," : "Ciao,"}</p>
                <p style="font-size: 15px;">${isEn 
                    ? "This email confirms that you have successfully registered for a reminder alert for the following university deadline:" 
                    : "Questa email conferma che ti sei registrato correttamente per ricevere un promemoria per la seguente scadenza universitaria:"}</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #0f172a; font-size: 16px; font-weight: 700;">${deadlineTitle}</h3>
                    <p style="margin: 0; color: #475569; font-size: 14px;">📅 <strong>${isEn ? "Deadline:" : "Scadenza:"}</strong> ${deadlineDate}</p>
                </div>
 
                <p style="color: #4b5563; font-size: 14px;">${isEn 
                    ? "You will receive automatic email reminders 1 month, 1 week, 5 days, and the day before this deadline to make sure you don't miss it!" 
                    : "Ti invieremo dei promemoria email automatici 1 mese, 1 settimana, 5 giorni e il giorno prima di questa scadenza per assicurarci che tu non la manchi!"}</p>
            </div>
            ${getEmailFooter(isEn ? "Always supporting students!" : "Sempre dalla parte dello studente!")}
        </div>
    </div>
    `
}
