# Technical Documentation: Secure Lead Generation Architecture

## 1. Overview

This document outlines a professional, multi-layered security framework designed to protect sensitive contact information (specifically phone numbers) from automated web scrapers, malicious bots, and spamming activities. By leveraging **Next.js Server Actions** and infrastructure-level tools, this architecture ensures that sensitive data is never exposed to the client-side environment.

## 2. Architecture Layers

### A. Perimeter Defense (Infrastructure)

- **Cloudflare Bot Management:** Acts as the first line of defense. By enabling "Bot Fight Mode," the infrastructure identifies and challenges automated scripts before they can interact with the application.
    
- **Edge Encryption:** Utilizes Cloudflare's ability to obfuscate emails and phone numbers dynamically at the edge.
    

### B. Client-Side Integrity (Honeypots)

- **Mechanism:** Implementation of "Honeypot" fields—form inputs that are invisible to human users via CSS but remain visible to bots.
    
- **Logic:** If a request is received where a honeypot field is populated, the system identifies the requester as a bot and terminates the session immediately without processing the redirect.
    

### C. Server-Side Encapsulation

- **Environment Variables (`.env`):** Contact numbers are stored exclusively in server-side environment variables. This prevents the data from being indexed by search engines or extracted from bundled JavaScript files (`main.js` or `chunks`).
    
- **Server Actions:** The redirection logic is handled via a `"use server"` function. The browser only sends a trigger; the server retrieves the number and executes the `redirect()` command internally.
    

### D. Rate Limiting & Resilience (Redis)

- **Distributed Limiting:** Uses **Upstash/Redis** to track request frequency per IP address (e.g., maximum 3 requests per minute).
    
- **Fail-safe (Fallback) Implementation:** * The rate limiter is wrapped in a `try-catch` block.
    
    - **Logic:** If the Redis service is unavailable or encounters an error, the system enters a "Fail-Open" state, allowing the user to proceed to ensure no legitimate business leads are lost.
        

### E. Data Integrity (URL Encoding)

- **Protocol:** All predefined WhatsApp messages are processed through `encodeURIComponent()`.
    
- **Purpose:** This guarantees that Arabic text, emojis, and special characters are correctly formatted for the URL, preventing broken links or encoding errors during the transition to the WhatsApp API.
    

## 3. Implementation Flow

1. **User Action:** User clicks the "Contact via WhatsApp" button.
    
2. **Bot Check:** The system verifies the Honeypot field (must be empty).
    
3. **Traffic Control:** The Server Action checks the Redis store for the requester's IP rate limit.
    
4. **Environment Access:** Upon success (or Redis fallback), the server fetches the phone number from `.env`.
    
5. **Secure Redirect:** The server constructs the encoded URL and triggers a server-side redirect to the WhatsApp application.
    

## 4. Environment Configuration (`.env.example`)

```
# The phone number in international format (without + or 00)
WHATSAPP_NUMBER=201012345678

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=[https://your-db-name.upstash.io](https://your-db-name.upstash.io)
UPSTASH_REDIS_REST_TOKEN=your_secret_token
```