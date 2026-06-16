import { Resend } from "resend"

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    brand?: "morgana" | "orum" | "joint"
    noreply?: boolean
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ Resend API Key missing. Please set RESEND_API_KEY.")
        return { success: false, error: "Resend API Key missing. Please set RESEND_API_KEY." }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const defaultSenderName = "Morgana & O.R.U.M."
    const sender = process.env.RESEND_SENDER_NOREPLY || "noreply@morganaorum.it"

    const fromAddress = sender.includes("<") && sender.includes(">")
        ? sender
        : `"${defaultSenderName}" <${sender}>`

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
