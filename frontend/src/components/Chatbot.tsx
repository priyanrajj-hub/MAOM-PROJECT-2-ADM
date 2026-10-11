import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, RotateCcw, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'model'; text: string };

const SUGGESTED_PROMPTS = [
    "Explain Bhīṣma's vow in Chapter 7",
    "What is the Two-Step ADM Framework?",
    "Why did Karṇa go wide of the mark?",
    "What are the core lessons of Vyādha Gītā?"
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Namaste! I am your AI tutor for the Mahabharata ADM Platform. Ask me anything about the chapters, ethical dilemmas, leadership lessons, or characters from the epic.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (customText?: string) => {
        const text = (customText || input).trim();
        if (!text || isLoading) return;
        if (text.length > 2000) {
            setError('Message too long (max 2000 characters).');
            return;
        }

        setMessages(prev => [...prev, { role: 'user', text }]);
        if (!customText) setInput('');
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

            const data = await responseToJson(res);
            setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        } catch (e: any) {
            const msg = e.message?.includes('Failed to fetch')
                ? 'Network connection issue. Please check your network.'
                : `Notice: ${e.message}`;
            setError(msg);
            setMessages(prev => [...prev, { role: 'model', text: '⚠️ ' + msg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const responseToJson = async (res: Response) => {
        return await res.json();
    };

    const handleReset = () => {
        setMessages([
            { role: 'model', text: 'Namaste! I am your AI tutor for the Mahabharata ADM Platform. Ask me anything about the chapters, ethical dilemmas, leadership lessons, or characters from the epic.' }
        ]);
        setError(null);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open AI tutor"
                className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] transition-all hover:scale-110 active:scale-95 z-50 flex items-center justify-center group"
            >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[410px] max-w-[calc(100vw-1.5rem)] h-[580px] bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-3 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <MessageSquare size={18} className="text-white" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-indigo-900 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-wide">Mahābhārata AI Tutor</h3>
                        <p className="text-[10px] text-indigo-200">Adaptive Decision Mastery • Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={handleReset} title="Reset Chat" aria-label="Reset chat" className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <RotateCcw size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[88%] rounded-2xl p-4 text-sm ${m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md font-medium'
                            : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none shadow-md'}`}>
                            {m.role === 'model' ? (
                                <div className="leading-relaxed whitespace-pre-wrap flex flex-col gap-2 prose prose-invert prose-sm max-w-none [&>h3]:text-amber-400 [&>h3]:font-bold [&>h4]:text-indigo-300 [&>p]:m-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:m-0 [&>li]:m-0">
                                    <ReactMarkdown>{m.text}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap">{m.text}</div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-3 px-4 flex items-center gap-1.5 shadow-md">
                            <span className="text-xs text-indigo-400 font-medium mr-1">Thinking</span>
                            {[0, 150, 300].map(d => (
                                <span key={d} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                            ))}
                        </div>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-2.5">
                        <AlertCircle size={14} className="flex-shrink-0" /> {error}
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Prompt Suggestions */}
            {messages.length <= 2 && !isLoading && (
                <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 w-full font-medium">
                        <Lightbulb size={10} className="text-amber-400" /> Suggested Prompts:
                    </span>
                    {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
                        <button
                            key={pIdx}
                            onClick={() => handleSend(prompt)}
                            className="text-[11px] bg-slate-800 hover:bg-indigo-600/30 text-indigo-200 hover:text-white border border-indigo-500/20 rounded-lg px-2.5 py-1 text-left transition-colors"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask about Dharma, vows, strategy…"
                    maxLength={2000}
                    disabled={isLoading}
                    className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors"
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="p-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl transition-all disabled:text-slate-500 hover:shadow-lg hover:shadow-indigo-500/20 disabled:cursor-not-allowed"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
