/**
 * HTML sanitization utility using isomorphic-dompurify.
 * Works on both server (Node.js SSR) and client (browser).
 *
 * Usage:
 *   import { sanitizeHtml } from "@/lib/sanitize"
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 */

import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitize an HTML string, removing any XSS vectors.
 * Allows safe formatting tags (p, b, i, a, ul, ol, li, h1-h6, br, etc.)
 * but strips scripts, event handlers, and dangerous attributes.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
    if (!dirty) return ""

    return DOMPurify.sanitize(dirty, {
        // Allow standard formatting tags used in rich-text editors
        ALLOWED_TAGS: [
            "p", "br", "b", "i", "em", "strong", "u", "s",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li",
            "a", "blockquote", "pre", "code",
            "table", "thead", "tbody", "tr", "th", "td",
            "img", "figure", "figcaption",
            "div", "span",
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel",   // links
            "src", "alt", "width", "height", // images
            "class",                          // styling
        ],
        // Force links to open safely
        ADD_ATTR: ["target"],
        // Strip any remaining dangerous content
        FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    })
}
