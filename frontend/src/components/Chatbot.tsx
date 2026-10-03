import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'model'; text: string };

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Namaste! I am your AI tutor for the Mahabharata ADM Platform. Ask me anything about the chapters, characters, dharma, or the philosophical teachings of the epic.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;
        if (text.length > 2000) {
            setError('Message too long (max 2000 characters).');
            return;
        }

        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const history = messages.slice(-10).map(m => ({ role: m.role, parts: m.text }));
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ error: 'Server error' }));
                throw new Error(errData.error || `HTTP ${res.status}`);
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        } catch (e: any) {
            const msg = e.message?.includes('Failed to fetch')
                ? 'Network error — please check your connection.'
                : `Error: ${e.message}`;
            setError(msg);
            setMessages(prev => [...prev, { role: 'model', text: '⚠️ ' + msg }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open AI tutor"
                className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] transition-all hover:scale-110 active:scale-95 z-50 flex items-center justify-center"
            >
                <Sparkles size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <MessageSquare size={18} /> Mahabharata AI Tutor
                </h3>
                <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-indigo-200 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-800/20">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 px-4 text-sm ${m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                            {m.role === 'model' ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{m.text}</ReactMarkdown>
                                </div>
                            ) : m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-3 px-4 flex gap-1">
                            {[0, 150, 300].map(d => (
                                <span key={d} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                            ))}
                        </div>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-2">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask about a chapter…"
                    maxLength={2000}
                    disabled={isLoading}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
