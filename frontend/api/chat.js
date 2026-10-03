// Vercel Serverless Function: /api/chat.js

// Simple in-memory rate limiting (per-instance)
const rateLimit = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

// Global budget kill-switch (simple per-instance approximation)
let globalRequests = 0;
const MAX_GLOBAL_DAILY = 500;

export default async function handler(req, res) {
    // CORS & Origin check
    const origin = req.headers.origin || req.headers.referer || '';
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isProd = origin.includes('maom-project-2-adm.vercel.app') || (origin.includes('maom-project-2') && origin.includes('.vercel.app'));

    if (!isLocal && !isProd && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Forbidden origin' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Global budget check
    if (globalRequests >= MAX_GLOBAL_DAILY) {
        return res.status(429).json({ error: 'Global daily API budget exceeded.' });
    }

    // Basic IP Rate Limit
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    if (rateLimit.has(ip)) {
        const data = rateLimit.get(ip);
        if (now - data.startTime > WINDOW_MS) {
            rateLimit.set(ip, { count: 1, startTime: now });
        } else if (data.count >= MAX_REQUESTS_PER_MINUTE) {
            return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
        } else {
            data.count++;
        }
    } else {
        rateLimit.set(ip, { count: 1, startTime: now });
    }

    // Cleanup old entries randomly to avoid memory leaks
    if (Math.random() < 0.1) {
        for (const [key, val] of rateLimit.entries()) {
            if (now - val.startTime > WINDOW_MS) rateLimit.delete(key);
        }
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'message is required' });
    }
    if (message.length > 2000) {
        return res.status(400).json({ error: 'message too long (max 2000 chars)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: 'AI service not configured' });
    }

    globalRequests++;

    const systemPrompt = `You are a premium AI tutor designed to teach Strategic Lessons from the Mahabharata for ADM (Adaptive Decision Making). 
Your persona is wise, profound, precise, and encouraging. Answer questions specifically focusing on the philosophical, strategic, and leadership lessons from the epic. Always complete your absolute best final thought thoroughly without cutting off. Ensure formatting uses clean bullet points and distinct paragraphs.`;

    try {
        const safeHistory = (Array.isArray(history) ? history.slice(-10) : []).filter(
            h => h && typeof h.role === 'string' && typeof h.parts === 'string' && h.parts.length < 1000
        );

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'model', parts: [{ text: 'Understood. I will follow these instructions implicitly.' }] },
                        ...safeHistory.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
                        { role: 'user', parts: [{ text: message.trim() }] }
                    ]
                })
            }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error('Gemini error:', response.status, err.slice(0, 500));
            return res.status(200).json({ text: 'API HTTP Error ' + response.status + ': ' + err.slice(0, 500) });
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';
        return res.status(200).json({ text });
    } catch (e) {
        console.error('Handler error:', e.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
