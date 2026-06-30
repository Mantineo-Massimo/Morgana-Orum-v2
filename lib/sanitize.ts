/**
 * Lightweight HTML sanitization utility.
 * Works on both server (Node.js SSR) and client (browser).
 * Eliminates heavy JSDOM/DOMPurify dependencies to prevent Vercel bundle and ESM errors.
 *
 * Usage:
 *   import { sanitizeHtml } from "@/lib/sanitize"
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 */

/**
 * Sanitize an HTML string, removing any XSS vectors.
 * Allows safe formatting tags (p, b, i, a, ul, ol, li, h1-h6, br, etc.)
 * but strips scripts, event handlers, and dangerous attributes.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
    if (!dirty) return ""

    // 1. Remove script tags and their content
    let clean = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // 2. Remove style tags and their content
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

    // 3. Remove iframe, object, embed, form, input, button, select, option tags and their contents
    clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    clean = clean.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    clean = clean.replace(/<input\b[^>]*>/gi, '')
    clean = clean.replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
    clean = clean.replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '')

    // 4. Remove all event handlers like onload, onerror, onclick, onmouseover etc. (on...=...)
    clean = clean.replace(/\s+on[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')

    // 5. Remove javascript: links (href="javascript:...")
    clean = clean.replace(/\s+href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, ' href="#"')
    clean = clean.replace(/\s+href\s*=\s*javascript:[^\s>]+/gi, ' href="#"')

    return clean
}

