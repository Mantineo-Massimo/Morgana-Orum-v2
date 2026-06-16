import { Resend } from "resend"

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    brand?: "morgana" | "orum" | "joint"
}

export async function sendEmail({ to, subject, html, brand = "joint" }: SendEmailOptions) {
    let senderName: string
    let senderEmail: string

    switch (brand) {
        case "orum":
            senderName = "Associazione O.R.U.M."
            senderEmail = process.env.RESEND_SENDER_ORUM || "orum.unime@gmail.com"
            break
        case "morgana":
            senderName = "Associazione Morgana"
            senderEmail = process.env.RESEND_SENDER_MORGANA || "associazione.morgana@gmail.com"
            break
        case "joint":
        default:
            senderName = "Morgana & ORUM News"
            senderEmail = process.env.RESEND_SENDER_JOINT || process.env.SMTP_SENDER || "orum.unime@gmail.com"
            break
    }

    if (!process.env.RESEND_API_KEY) {
        console.error("❌ Resend API Key missing. Please set RESEND_API_KEY.")
        return { success: false, error: "Resend API Key missing. Please set RESEND_API_KEY." }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const fromAddress = senderEmail.includes("<") && senderEmail.includes(">")
        ? senderEmail
        : `"${senderName}" <${senderEmail}>`

    try {
        const data = await resend.emails.send({
            from: fromAddress,
            to,
            subject,
            html,
        })

        if (data.error) {
            console.error("❌ Resend error:", data.error)
            return { success: false, error: data.error.message }
        }

        console.log(`✅ Email inviata con successo a ${to}. ID: ${data.data?.id}`)
        return { success: true, messageId: data.data?.id }
    } catch (error) {
        console.error("Error sending email via Resend:", error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}
