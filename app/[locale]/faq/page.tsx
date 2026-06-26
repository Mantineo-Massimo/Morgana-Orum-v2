import { Metadata } from "next"
import FAQPageClient from "./faq-client"

type Props = {
    params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const isEn = locale === "en"
    return {
        title: isEn ? "Frequently Asked Questions" : "Domande Frequenti",
        description: isEn
            ? "Find quick answers to common questions about university, enrollment, student representation, and services."
            : "Trova risposte rapide a tutte le domande comuni sull'università, le iscrizioni, la rappresentanza e i servizi dedicati."
    }
}

export default function FAQPage() {
    return <FAQPageClient />
}
