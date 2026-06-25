/**
 * Security Audit Tool for Morgana & O.R.U.M. v2
 * 
 * Tests headers, cookie configurations, and API authorization rules.
 * 
 * Usage:
 *   node scripts/test-security.js [target_url]
 * 
 * Examples:
 *   node scripts/test-security.js http://localhost:3000
 *   node scripts/test-security.js https://www.morganaorum.it
 */

const { URL } = require('url');

// Console Colors
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";

// Default Target
const defaultTarget = 'http://localhost:3000';
const target = process.argv[2] || defaultTarget;

console.log(`${BOLD}${CYAN}====================================================`);
console.log(`🛡️  SECURITY AUDIT TOOL — Morgana & O.R.U.M. v2`);
console.log(`Target: ${BOLD}${YELLOW}${target}${RESET}`);
console.log(`${BOLD}${CYAN}====================================================${RESET}\n`);

async function runAudit() {
    let passedTests = 0;
    let totalTests = 0;

    // 1. Clean and normalize targets
    const targetUrl = new URL(target);
    const mainPageUrl = `${targetUrl.origin}/it`; // Test localized homepage
    const uploadApiUrl = `${targetUrl.origin}/api/upload`;
    const cronApiUrl = `${targetUrl.origin}/api/cron/reminders`;

    // ----------------------------------------------------
    // TEST 1: Security Headers & Info Leakage
    // ----------------------------------------------------
    console.log(`${BOLD}${BLUE}[1/3] Verifica degli Header HTTP di Sicurezza...${RESET}`);
    try {
        const response = await fetch(mainPageUrl, { method: 'GET' });
        totalTests += 8;

        const headers = response.headers;

        // Helper to audit a single header
        const auditHeader = (name, expectedValue, desc, critical = false) => {
            const val = headers.get(name.toLowerCase());
            if (!val) {
                console.log(`  ${RED}❌ FAIL:${RESET} Header ${BOLD}${name}${RESET} mancante. (${desc})`);
                return false;
            }
            
            if (expectedValue instanceof RegExp) {
                if (expectedValue.test(val)) {
                    console.log(`  ${GREEN}✅ PASS:${RESET} ${name} presente: "${val}"`);
                    return true;
                }
            } else if (val.includes(expectedValue)) {
                console.log(`  ${GREEN}✅ PASS:${RESET} ${name} presente: "${val}"`);
                return true;
            }

            console.log(`  ${YELLOW}⚠️  WARN:${RESET} ${name} ha un valore non ottimale: "${val}". Atteso: "${expectedValue}"`);
            return true; // Partially passed
        };

        // CSP
        if (auditHeader('Content-Security-Policy', 'default-src', 'Previene XSS e iniezioni')) {
            passedTests++;
            const csp = headers.get('content-security-policy');
            if (csp.includes('unsafe-eval') && !target.includes('localhost')) {
                console.log(`     ${YELLOW}⚠️  CSP Alert: Contiene 'unsafe-eval' in produzione. Rimuoverlo appena possibile.${RESET}`);
            }
            if (csp.includes("frame-ancestors 'self'")) {
                console.log(`     ${GREEN}✨ CSP Clickjacking Protection: frame-ancestors configurato correttamente.${RESET}`);
                passedTests++;
            } else {
                console.log(`     ${YELLOW}⚠️  CSP Clickjacking Warning: frame-ancestors non trovato nella CSP.${RESET}`);
            }
        } else {
            totalTests++; // Offset for inner CSP check
        }

        // Clickjacking X-Frame-Options
        if (auditHeader('X-Frame-Options', 'SAMEORIGIN', 'Protezione clickjacking legacy')) passedTests++;
        
        // MIME Sniffing
        if (auditHeader('X-Content-Type-Options', 'nosniff', 'Previene XSS tramite file upload spoofing')) passedTests++;

        // HSTS (Only on HTTPS targets)
        if (targetUrl.protocol === 'https:') {
            if (auditHeader('Strict-Transport-Security', 'max-age=', 'Forza connessione HTTPS')) passedTests++;
        } else {
            console.log(`  ${YELLOW}➖ INFO:${RESET} HSTS bypassato (target HTTP/localhost).`);
            totalTests--;
        }

        // Referrer Policy
        if (auditHeader('Referrer-Policy', 'strict-origin-when-cross-origin', 'Tutela privacy referer')) passedTests++;

        // Permissions Policy
        if (auditHeader('Permissions-Policy', 'camera=', 'Disabilita sensori hardware')) passedTests++;

        // Information Leakage (X-Powered-By)
        const xPoweredBy = headers.get('x-powered-by');
        if (xPoweredBy) {
            console.log(`  ${RED}❌ FAIL:${RESET} Trovato header informativo ${BOLD}X-Powered-By: ${xPoweredBy}${RESET}. Rischio fingerprinting.`);
        } else {
            console.log(`  ${GREEN}✅ PASS:${RESET} Nessun header di fingerprinting X-Powered-By rilevato.`);
            passedTests++;
        }

        // Cookies Audit on Set-Cookie
        const setCookieHeaders = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
        if (setCookieHeaders.length > 0) {
            console.log(`\n  ${BOLD}Analisi dei Cookie di risposta:${RESET}`);
            for (const cookieStr of setCookieHeaders) {
                totalTests += 3;
                const isSecure = /secure/i.test(cookieStr);
                const isHttpOnly = /httponly/i.test(cookieStr);
                const sameSiteMatch = cookieStr.match(/samesite=(\w+)/i);
                const sameSite = sameSiteMatch ? sameSiteMatch[1] : 'Mancante';
                const name = cookieStr.split('=')[0];

                console.log(`   • Cookie: ${BOLD}${name}${RESET}`);
                if (isSecure) {
                    console.log(`     - Secure: ${GREEN}SÌ${RESET}`); passedTests++;
                } else {
                    console.log(`     - Secure: ${RED}NO (Rischio intercettazione)${RESET}`);
                }

                if (isHttpOnly) {
                    console.log(`     - HttpOnly: ${GREEN}SÌ${RESET}`); passedTests++;
                } else {
                    console.log(`     - HttpOnly: ${RED}NO (Vulnerabile a XSS reading)${RESET}`);
                }

                if (['lax', 'strict'].includes(sameSite.toLowerCase())) {
                    console.log(`     - SameSite: ${GREEN}${sameSite}${RESET}`); passedTests++;
                } else {
                    console.log(`     - SameSite: ${RED}${sameSite} (Rischio CSRF)${RESET}`);
                }
            }
        } else {
            console.log(`\n  ${YELLOW}➖ INFO:${RESET} Nessun cookie impostato dalla homepage.`);
        }

    } catch (error) {
        console.error(`  ${RED}Errore di rete durante la connessione alla homepage:${RESET}`, error.message);
    }

    // ----------------------------------------------------
    // TEST 2: Endpoint Protections (API Audit)
    // ----------------------------------------------------
    console.log(`\n${BOLD}${BLUE}[2/3] Verifica delle Protezioni degli Endpoint API...${RESET}`);

    // Test 2.1: Cron reminders Auth
    totalTests++;
    try {
        console.log(`  Tentativo di accesso a ${YELLOW}/api/cron/reminders${RESET} senza autenticazione...`);
        const response = await fetch(cronApiUrl, { method: 'GET' });
        
        if (response.status === 401) {
            console.log(`  ${GREEN}✅ PASS:${RESET} Cron Endpoint ha risposto con ${BOLD}401 Unauthorized${RESET}. Accesso protetto.`);
            passedTests++;
        } else {
            console.log(`  ${RED}❌ FAIL:${RESET} Cron Endpoint ha risposto con ${BOLD}${response.status}${RESET} (Atteso 401). Accesso pubblico!`);
        }
    } catch (error) {
        console.error(`  ${RED}Errore durante il test di Cron API:${RESET}`, error.message);
    }

    // Test 2.2: Upload Endpoint Auth
    totalTests++;
    try {
        console.log(`  Tentativo di caricamento file a ${YELLOW}/api/upload${RESET} senza sessione...`);
        
        // Build mock form data
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const body = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="file"; filename="malicious.php"',
            'Content-Type: text/plain',
            '',
            '<?php echo "Exploit Successful"; ?>',
            `--${boundary}--`
        ].join('\r\n');

        const response = await fetch(uploadApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });

        if (response.status === 401) {
            console.log(`  ${GREEN}✅ PASS:${RESET} Upload Endpoint ha risposto con ${BOLD}401 Unauthorized${RESET}. Accesso protetto.`);
            passedTests++;
        } else {
            console.log(`  ${RED}❌ FAIL:${RESET} Upload Endpoint ha risposto con ${BOLD}${response.status}${RESET} (Atteso 401). Caricamento anonimo consentito!`);
        }
    } catch (error) {
        console.error(`  ${RED}Errore durante il test di Upload API:${RESET}`, error.message);
    }

    // ----------------------------------------------------
    // TEST 3: SSL/TLS Connection Check (If production)
    // ----------------------------------------------------
    console.log(`\n${BOLD}${BLUE}[3/3] Controllo Configurazione TLS (se applicabile)...${RESET}`);
    if (targetUrl.protocol === 'https:') {
        totalTests++;
        try {
            const https = require('https');
            const agent = new https.Agent({ keepAlive: false });
            
            await new Promise((resolve) => {
                const req = https.get(targetUrl.href, { agent }, (res) => {
                    const socket = res.socket;
                    const cipher = socket.getCipher();
                    const protocol = socket.getProtocol();

                    console.log(`  Protocollo TLS: ${BOLD}${GREEN}${protocol}${RESET}`);
                    console.log(`  Algoritmo Cifratura: ${BOLD}${GREEN}${cipher.name} (${cipher.version})${RESET}`);
                    
                    if (protocol.includes('TLSv1.2') || protocol.includes('TLSv1.3')) {
                        console.log(`  ${GREEN}✅ PASS:${RESET} Protocollo crittografico moderno in uso.`);
                        passedTests++;
                    } else {
                        console.log(`  ${YELLOW}⚠️  WARN:${RESET} Protocollo TLS obsoleto rilevato: ${protocol}. Consigliato dismettere precedenti a TLS 1.2.`);
                    }
                    resolve();
                });
                req.on('error', (err) => {
                    console.log(`  ${RED}❌ FAIL:${RESET} Connessione SSL/TLS fallita o non sicura: ${err.message}`);
                    resolve();
                });
                req.end();
            });
        } catch (error) {
            console.error(`  ${RED}Errore nel test TLS:${RESET}`, error.message);
        }
    } else {
        console.log(`  ${YELLOW}➖ INFO:${RESET} Target HTTP non cifrato (localhost o HTTP ordinario). Saltato test SSL/TLS.`);
    }

    // ----------------------------------------------------
    // AUDIT SUMMARY
    // ----------------------------------------------------
    console.log(`\n${BOLD}${CYAN}====================================================`);
    console.log(`📊 STATISTICHE AUDIT DI SICUREZZA`);
    console.log(`${BOLD}${CYAN}====================================================${RESET}`);
    
    const percentage = Math.round((passedTests / totalTests) * 100);
    let ratingColor = RED;
    if (percentage >= 80) ratingColor = GREEN;
    else if (percentage >= 50) ratingColor = YELLOW;

    console.log(`  Test Superati: ${BOLD}${ratingColor}${passedTests} / ${totalTests} (${percentage}%)${RESET}`);
    
    if (percentage === 100) {
        console.log(`  Stato: ${BOLD}${GREEN}ECCELLENTE${RESET} 🛡️ (Tutti i check superati)`);
    } else if (percentage >= 80) {
        console.log(`  Stato: ${BOLD}${GREEN}SICURO${RESET} 👍 (I principali meccanismi sono robusti)`);
    } else if (percentage >= 50) {
        console.log(`  Stato: ${BOLD}${YELLOW}MEDIO${RESET} ⚠️ (Presenza di avvertenze o configurazioni non ottimali)`);
    } else {
        console.log(`  Stato: ${BOLD}${RED}VULNERABILE${RESET} 🚨 (Rilevate gravi falle di sicurezza o bypass)`);
    }
    console.log(`${BOLD}${CYAN}====================================================${RESET}\n`);
}

runAudit();
