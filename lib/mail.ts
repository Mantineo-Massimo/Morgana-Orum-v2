import nodemailer from "nodemailer"
import * as aws from "@aws-sdk/client-ses"

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    brand?: "morgana" | "orum"
}

export async function sendEmail({ to, subject, html, brand = "morgana" }: SendEmailOptions) {
    const isMorgana = brand === "morgana"
    const senderName = isMorgana ? "Associazione Morgana" : "Associazione O.R.U.M."
    // Prioritize SMTP_SENDER from .env, then SMTP_USER, then fallback
    const senderEmail = process.env.SMTP_SENDER || process.env.SMTP_USER || (isMorgana ? "associazionemorgana@gmail.com" : "orum_unime@gmail.com")

    // Create transporter based on available configuration
    let transporter: any

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // Use AWS SES
        const ses = new aws.SES({
            apiVersion: "2010-12-01",
            region: process.env.AWS_REGION || "eu-west-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        })
        transporter = nodemailer.createTransport({
            SES: { ses, aws },
        } as any)
    } else {
        // Fallback to SMTP (Brevo or other)
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
    }

    try {
        const info = await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to,
            subject,
            html,
        })

        console.log(`✅ Email inviata con successo a ${to}. ID: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("Error sending email:", error)
        return { success: false, error }
    }
}
