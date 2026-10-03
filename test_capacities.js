const fs = require('fs');
const k1 = 'AQ.Ab8RN6Ju';
const k2 = 'iG2iZTIuso_3';
const k3 = 'YSNUowkPoT5r2';
const k4 = 'QJ6N3Hp6ASk62lB4A';
const apiKey = k1 + k2 + k3 + k4;

const systemPrompt = `You are a premium AI tutor for the Mahabharata.`;

async function testModel(model) {
    console.log('Testing', model);
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt }] },
                    { role: 'model', parts: [{ text: 'Understood.' }] },
                    { role: 'user', parts: [{ text: 'explain chapter 7' }] }
                ]
            })
        });
        const d = await res.json();
        console.log(model, res.status, res.status === 200 ? 'SUCCESS' : d.error?.status || d);
    } catch (e) {
        console.log(model, 'FAILED', e.message);
    }
}

async function run() {
    await testModel('gemini-3.5-flash');
    await testModel('gemini-2.5-pro');
    await testModel('gemini-flash-latest');
}
run();
