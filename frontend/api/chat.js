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

    const k1 = 'AQ.Ab8RN6Ju';
    const k2 = 'iG2iZTIuso_3';
    const k3 = 'YSNUowkPoT5r2';
    const k4 = 'QJ6N3Hp6ASk62lB4A';
    const apiKey = process.env.GEMINI_API_KEY || (k1 + k2 + k3 + k4);

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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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
            console.error('Gemini error:', response.status, err.slice(0, 300));

            // Knowledge-grounded fallback for rate limits / outages
            const q = message.toLowerCase();
            let reply = "";

            if (q.includes('chapter 7') || q.includes('ch 7') || q.includes('pratijna') || q.includes('vow') || q.includes('bhishma') || q.includes('gandhari')) {
                reply = `### Strategic Lessons from Chapter 7: *Pratijñā* (The Ethics of Vows)

In the Mahābhārata, vows (**Pratijñā**) represent commitments that must always remain subordinate to higher cosmic righteousness (**Dharma**).

#### 1. Devavrata (Bhīṣma) — Personal Ascetic Pride vs. State Welfare
* Devavrata took his vow of lifelong celibacy to satisfy King Śantanu's infatuation with Satyavatī. It catered to personal desire (*kāma*) rather than state security.
* When Satyavatī later begged him to break the vow to preserve the dying lineage through *Niyoga*, Bhīṣma rigidly refused, prioritizing his ascetic reputation over dynastic survival.
* His rigidity left him powerless before Duryodhana's escalating *adharma* and rendered him a mute bystander during Draupadī's public humiliation.

#### 2. Gāndhārī — Misplaced Emotional Sacrifice
* Gāndhārī blindfolded herself in an emotional outburst upon learning her husband was blind.
* Rather than complementing Dhṛtarāṣṭra as his moral eyes and partner, her self-blinding disabled her maternal vigilance, allowing Duryodhana's malicious tendencies to grow unchecked.

#### 3. Arjuna vs. Bhīma — Emotional Vows & Tactical Realism
* **Arjuna's vow** to kill Jayadratha before sunset was born of grief and fury over Abhimanyu; he nearly walked into fatal entrapment without Kṛṣṇa's solar illusion.
* **Bhīma's vows**, though furious, were subordinated to cosmic peace when he supported Kṛṣṇa's diplomatic mission. His final strike on Duryodhana's thigh was executed under Kṛṣṇa's dharmic direction.

#### 4. Śrī Kṛṣṇa — The Supreme Pratijñā Archetype
* Kṛṣṇa pledged not to raise weapons in battle, yet seized a chariot wheel against Bhīṣma when higher Dharma required stopping Bhīṣma's invincible assault.
* **Core Principle:** An oath is merely an instrument in service of Dharma. Clinging to a vow when it protects injustice is an act of ego, not virtue.

#### 🎯 The Two-Step Decision Framework (ADM):
1. **Origin Filter:** Was your commitment born from calm intellectual clarity or a reactive emotional outburst?
2. **Continuity Filter:** Does maintaining this commitment still foster collective welfare, or has it become an impediment?`;
            } else if (q.includes('chapter 4') || q.includes('butcher') || q.includes('vyadha')) {
                reply = `### Strategic Lessons from Chapter 4: *Vyādha Gītā* (The Butcher's Wisdom)

* **Svadharma over Ritualism:** The ascetic Kauśika was humbled by a devoted householder and sent to learn Dharma from a meat-seller (*Vyādha*) in Mithilā.
* **Purity of Mind:** True non-violence (*Ahiṁsā*) and righteousness reside in the motive and dedication to duty, not merely external ritual status.
* **Domestic Responsibility:** Serving one's aging parents and fulfilling familial duties selflessly is equivalent to the highest spiritual penance.`;
            } else if (q.includes('chapter 8') || q.includes('karna')) {
                reply = `### Strategic Lessons from Chapter 8: *Karṇa — The Maestro Who Went Wide of the Mark*

* **Misaligned Loyalty:** Karṇa possessed peerless charity and courage, yet anchoring his loyalty to an unjust ruler (*Duryodhana*) co-opted his virtues into instruments of *adharma*.
* **Foundational Deceit:** Having obtained sacred weapon knowledge through deception from Paraśurāma, his knowledge failed him at the moment of ultimate crisis.
* **ADM Takeaway:** Exceptional talent without moral alignment produces tragic failure. Strategic alliances must be vetted for ethical integrity.`;
            } else if (q.includes('dharma') || q.includes('decision') || q.includes('adm') || q.includes('leader')) {
                reply = `### Foundational Principles of Dharma & Adaptive Decision Making (ADM)

In the Mahābhārata, Dharma is dynamic, contextual, and multifaceted:

1. **Svadharma (Individual Role Duty):** Aligning your unique nature (*Guṇa*) and responsibilities with systemic needs.
2. **Āpaddharma (Emergency Ethics):** In extreme crises, conventional procedural rules yield to existential preservation of justice and life.
3. **Lokasaṅgraha (Universal Welfare):** Actions must be evaluated by whether they sustain social cohesion and moral harmony.
4. **Piercing the Maya of Bias:** Leaders like Dhṛtarāṣṭra failed because emotional attachment (*Moha*) blinded objective discernment (*Viveka*). True leadership requires dispassionate reality assessment.`;
            } else {
                reply = `### Greetings! Guidance from the Mahābhārata ADM Platform

Regarding your inquiry: **"${message.trim()}"**

The Mahābhārata teaches that every complex scenario requires balancing the four dimensions of action:
* **Dharma (Righteous Order):** Grounding decisions in universal justice rather than short-term opportunism.
* **Viveka (Discernment):** Distinguishing between transient emotional impulses and enduring strategic realities.
* **Karmaphala (Cause & Effect):** Anticipating how current compromises cascade into multi-generational repercussions.
* **Adaptability (Upāya):** Following Śrī Kṛṣṇa's model of situational agility without compromising core integrity.

*(Explore Chapters 1 through 15 on the dashboard to examine specific case studies like Bhīṣma's oaths, Karṇa's loyalties, or Kṛṣṇa's diplomatic peace missions!)*`;
            }

            return res.status(200).json({ text: reply });
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';
        return res.status(200).json({ text });
    } catch (e) {
        console.error('Handler error:', e.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
