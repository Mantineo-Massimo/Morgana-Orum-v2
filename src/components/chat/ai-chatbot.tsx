"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, ArrowLeft, Mail, Loader2, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { sendSupportMessage } from "@/app/actions/support"

interface UserSession {
    name: string
    surname: string
    email: string
}

interface AIChatbotProps {
    currentUser: UserSession | null
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export function AIChatbot({ currentUser }: AIChatbotProps) {
    const t = useTranslations("Chatbot")
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<"chat" | "contact">("chat")
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [unread, setUnread] = useState(true) // Show badge initially to attract attention

    // Contact form fields
    const [contactForm, setContactForm] = useState({
        name: currentUser ? `${currentUser.name} ${currentUser.surname}`.trim() : "",
        email: currentUser ? currentUser.email : "",
        subject: "",
        message: ""
    })
    const [formStatus, setFormStatus] = useState<{
        loading: boolean
        error?: string
        success?: boolean
    }>({ loading: false })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Populate contact form once currentUser changes (e.g. after login)
    useEffect(() => {
        if (currentUser) {
            setContactForm(prev => ({
                ...prev,
                name: `${currentUser.name} ${currentUser.surname}`.trim(),
                email: currentUser.email
            }))
        }
    }, [currentUser])

    // Scroll to bottom when messages or typing status updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    // Show initial welcome message if empty
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: t("welcome_msg")
                }
            ])
        }
    }, [messages, t])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || isTyping) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim()
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        try {
            // Keep only the conversation history, excluding the initial welcome message if possible,
            // or pass everything to preserve context.
            const history = messages.concat(userMsg).map(m => ({
                role: m.role,
                content: m.content
            }))

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Errore sconosciuto")
            }

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.response
                }
            ])
        } catch (error) {
            console.error("Chatbot API Call Error:", error)
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Si è verificato un errore di connessione. Riprova più tardi."
                }
            ])
        } finally {
            setIsTyping(false)
        }
    }

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
            setFormStatus({ loading: false, error: t("form_error_fields") })
            return
        }

        setFormStatus({ loading: true })

        try {
            const res = await sendSupportMessage({
                name: contactForm.name,
                email: contactForm.email,
                subject: contactForm.subject || "Contatto da Chatbot",
                message: contactForm.message
            })

            if (!res.success) {
                throw new Error(res.error)
            }

            setFormStatus({ loading: false, success: true })
            setContactForm(prev => ({ ...prev, subject: "", message: "" }))
            
            // Auto switch back to chat after showing success message
            setTimeout(() => {
                setStep("chat")
                setFormStatus({ loading: false })
            }, 3000)
        } catch (error) {
            console.error("Contact Form Error:", error)
            setFormStatus({ 
                loading: false, 
                error: error instanceof Error ? error.message : t("send_error") 
            })
        }
    }

    const renderMarkdown = (text: string) => {
        let escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")

        // Bold **text** -> <strong>text</strong>
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        // Link [text](url) -> <a> tag
        escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-85 font-semibold">$1</a>')

        // Bullet lists
        const lines = escaped.split("\n").map(line => {
            if (line.trim().startsWith("- ")) {
                return `<li class="ml-4 list-disc my-1">${line.trim().substring(2)}</li>`
            }
            return line
        })

        return (
            <div 
                dangerouslySetInnerHTML={{ __html: lines.join("<br />") }} 
                className="space-y-1 text-sm leading-relaxed" 
            />
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen)
                    setUnread(false)
                }}
                className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none bg-primary"
                style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--orum-navy)) 100%)"
                }}
                aria-label="Apri chatbot"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageSquare className="h-6 w-6" />
                )}
                {unread && !isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 rounded-full bg-red-500 ring-2 ring-white">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    </span>
                )}
            </button>

            {/* Chat Box Container */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:w-[380px]"
                    >
                        {/* Header */}
                        <div 
                            className="flex items-center justify-between p-4 text-white"
                            style={{
                                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--orum-navy)) 100%)"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">{t("title")}</h3>
                                    <p className="text-[11px] text-white/80">{t("subtitle")}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Banner for Quick Fallback Contact */}
                        {step === "chat" && (
                            <div className="flex items-center justify-between bg-orange-50 border-b border-orange-100 px-4 py-2 text-xs">
                                <span className="text-gray-600 font-medium">Hai bisogno della segreteria?</span>
                                <button
                                    onClick={() => setStep("contact")}
                                    className="flex items-center gap-1 text-primary font-bold hover:underline"
                                >
                                    <Mail className="h-3 w-3" />
                                    {t("contact_fallback_btn")}
                                </button>
                            </div>
                        )}

                        {/* Body Container */}
                        <div className="flex-1 overflow-hidden relative bg-gray-50 flex flex-col">
                            <AnimatePresence mode="wait">
                                {step === "chat" ? (
                                    <motion.div
                                        key="chat-window"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col"
                                    >
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                                                        msg.role === "user"
                                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                                            : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                                    }`}
                                                >
                                                    {renderMarkdown(msg.content)}
                                                </div>
                                            </div>
                                        ))}

                                                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                                    <span className="flex h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
                                                    <span className="flex h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
                                                    <span className="flex h-2 w-2 animate-bounce rounded-full bg-primary"></span>
                                                    <span className="text-xs text-gray-400 ml-1">{t("typing")}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="contact-form"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex-1 overflow-y-auto p-4 flex flex-col"
                                    >
                                        <button
                                            onClick={() => setStep("chat")}
                                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 mb-4 transition-colors font-medium self-start"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5" />
                                            {t("back_to_chat")}
                                        </button>

                                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-800">{t("contact_title")}</h4>
                                                <p className="text-xs text-gray-500">{t("contact_desc")}</p>
                                            </div>

                                            {formStatus.success ? (
                                                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-semibold text-center">
                                                    {t("send_success")}
                                                </div>
                                            ) : (
                                                <form onSubmit={handleContactSubmit} className="space-y-3">
                                                    {formStatus.error && (
                                                        <div className="bg-red-50 text-red-700 p-2.5 rounded-lg text-xs font-medium">
                                                            {formStatus.error}
                                                        </div>
                                                    )}

                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-gray-600 uppercase">{t("form_name")} *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder={t("form_name")}
                                                            value={contactForm.name}
                                                            onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                                            className="w-full text-xs rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                                            disabled={formStatus.loading}
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-gray-600 uppercase">{t("form_email")} *</label>
                                                        <input
                                                            type="email"
                                                            required
                                                            placeholder={t("form_email")}
                                                            value={contactForm.email}
                                                            onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                                            className="w-full text-xs rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                                            disabled={formStatus.loading || !!currentUser}
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-gray-600 uppercase">{t("form_subject")}</label>
                                                        <input
                                                            type="text"
                                                            placeholder={t("form_subject")}
                                                            value={contactForm.subject}
                                                            onChange={e => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                                                            className="w-full text-xs rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                                            disabled={formStatus.loading}
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-gray-600 uppercase">{t("form_message")} *</label>
                                                        <textarea
                                                            required
                                                            rows={3}
                                                            placeholder={t("form_message")}
                                                            value={contactForm.message}
                                                            onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                                            className="w-full text-xs rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                                                            disabled={formStatus.loading}
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={formStatus.loading}
                                                        className="w-full flex justify-center items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-4 shadow-md transition-all active:scale-98 disabled:opacity-50"
                                                    >
                                                        {formStatus.loading ? (
                                                            <>
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                {t("form_sending")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="h-3 w-3" />
                                                                {t("form_send")}
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input Area (Only for chat screen) */}
                        {step === "chat" && (
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
                            >
                                <input
                                    type="text"
                                    placeholder={t("placeholder")}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
                                    disabled={isTyping}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all focus:outline-none"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
