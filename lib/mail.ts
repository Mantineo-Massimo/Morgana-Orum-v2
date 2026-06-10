import nodemailer from "nodemailer"
import * as aws from "@aws-sdk/client-sesv2"

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
            senderEmail = "orum.unime@gmail.com"
            break
        case "morgana":
            senderName = "Associazione Morgana"
            senderEmail = "associazione.morgana@gmail.com"
            break
        case "joint":
        default:
            senderName = "Morgana & ORUM News"
            senderEmail = process.env.SMTP_SENDER || "orum.unime@gmail.com"
            break
    }

    // Create transporter based on AWS configuration
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error("AWS SES Credentials missing. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.")
    }

    const ses = new aws.SESv2Client({
        region: process.env.AWS_REGION || "eu-west-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })

    const transporter = nodemailer.createTransport({
        SES: { sesClient: ses, SendEmailCommand: aws.SendEmailCommand },
    } as any)

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
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}
