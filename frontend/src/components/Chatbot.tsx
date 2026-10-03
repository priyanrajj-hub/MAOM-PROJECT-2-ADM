import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, KeyRound, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
    const [isConfiguring, setIsConfiguring] = useState(!apiKey);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: 'Namaste! I am your AI assistant for the Mahabharata ADM Platform. How can I help you summarize or understand the material today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('GEMINI_API_KEY', apiKey);
        }
    }, [apiKey]);

    useEffect(() => {
        if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        setMessages(prev => [...prev, { role: 'user', text: input }]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // @ts-ignore - Bypass strict typing for browser safety flag if it exists in this SDK version
            const ai = new GoogleGenAI({ apiKey, dangerouslyAllowBrowser: true } as any);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: 'user', parts: [{ text: "You are a philosophical and empathetic tutor for a Mahabharata course. Keep answers extremely concise and insightful. User asks: " + currentInput }] }
                ]
            });

            const answer = response.text || "I am unable to formulate an answer right now.";
            setMessages(prev => [...prev, { role: 'model', text: answer }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${e.message}. (Is your API key valid? If you are facing rate limits, please wait.)` }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.5)] transition-all hover:scale-110 active:scale-95 z-50 flex items-center justify-center animate-bounce"
            >
                <Sparkles size={28} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300">

            <div className="bg-indigo-600 p-4 flex justify-between items-center shadow-md z-10">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <MessageSquare size={18} /> Mahabharata AI
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {isConfiguring ? (
                <div className="flex-1 p-6 flex flex-col justify-center space-y-4 bg-slate-800/50">
                    <div className="text-center space-y-2 mb-2">
                        <KeyRound size={40} className="mx-auto text-indigo-400" />
                        <h4 className="font-bold text-white text-lg">Configure AI Access</h4>
                        <p className="text-slate-400 text-sm">Provide your Gemini API Key directly in your browser. This is strictly local and never sent to our servers.</p>
                    </div>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        disabled={!apiKey}
                        onClick={() => setIsConfiguring(false)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Save & Start Chatting
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-800/20">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 px-4 ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                                    {m.role === 'model' ? (
                                        <div className="prose prose-invert prose-sm">
                                            <ReactMarkdown>{m.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        m.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl p-3 px-4 rounded-bl-none flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <div className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                        <button
                            onClick={() => setIsConfiguring(true)}
                            title="Configure API Key"
                            className="p-3 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-xl transition-colors border border-transparent hover:border-slate-700"
                        >
                            <KeyRound size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about a chapter..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
