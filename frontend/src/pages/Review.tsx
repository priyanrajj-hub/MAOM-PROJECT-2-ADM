import { useState } from 'react';
import { Target, CheckCircle2, RefreshCcw, ChevronRight, BrainCircuit, X } from 'lucide-react';

export default function Review() {
    const [cardState, setCardState] = useState<'question' | 'answer'>('question');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock data based on the epic's themes
    const flashcards = [
        {
            id: 1,
            chapter: "Ch 7: Dharma in Crisis",
            concept: "Dharma vs. Duty",
            question: "Why did Arjuna hesitate to fight although he was a Kshatriya (warrior)?",
            answer: "His personal duty (dharma as a family member) conflicted with his cosmic duty (dharma as a warrior to uphold justice). He faced a crisis of identifying which ethical framework superseded the other in a civil war context."
        },
        {
            id: 2,
            chapter: "Ch 6: The Bhagavad Gita Begins",
            concept: "Nishkama Karma",
            question: "What is the core principle of 'Nishkama Karma'?",
            answer: "Action without attachment to the fruits or results. Performing one's duty purely because it is the right thing to do, relinquishing ego and desire for reward."
        },
        {
            id: 3,
            chapter: "Ch 3: The Dice Game",
            concept: "Systemic Adharma",
            question: "How did the Dice Game illustrate systemic enabling of Adharma?",
            answer: "The elders (Bhishma, Drona, Dhritarashtra) remained silent bound by arbitrary rules and blind loyalty, allowing severe ethical violations to occur under the guise of legal or traditional protocol."
        }
    ];

    const currentCard = flashcards[currentIndex];

    const handleRating = () => {
        setCardState('question');
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white font-cinzel mb-2 flex items-center gap-3">
                        <RefreshCcw className="text-amber-500" />
                        Spaced Repetition
                    </h1>
                    <p className="text-slate-400">Scientifically drill your weakest concepts for long-term retention.</p>
                </div>
                <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-xl px-4 py-2 flex items-center gap-3 w-fit">
                    <BrainCircuit className="text-indigo-400" size={20} />
                    <span className="text-indigo-200 text-sm font-semibold">3 Cards Due Today</span>
                </div>
            </div>

            {/* Flashcard Area */}
            <div className="min-h-[400px] flex flex-col justify-center perspective-1000">
                <div className="relative w-full max-w-2xl mx-auto bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out">

                    {/* Top Accent line */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-indigo-500" />

                    <div className="p-8 md:p-12 space-y-8 min-h-[300px] flex flex-col">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-wider">
                            <span>{currentCard.chapter}</span>
                            <span className="bg-slate-800 px-3 py-1 rounded-full">{currentCard.concept}</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <h2 className="text-2xl md:text-3xl font-medium text-white text-center leading-snug">
                                {currentCard.question}
                            </h2>

                            {cardState === 'answer' && (
                                <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 animate-in slide-in-from-top-4">
                                    <p className="text-slate-200 text-lg leading-relaxed text-center">
                                        {currentCard.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="bg-slate-800/80 p-6 border-t border-slate-700 flex justify-center">
                        {cardState === 'question' ? (
                            <button
                                onClick={() => setCardState('answer')}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                            >
                                Reveal Answer <ChevronRight size={18} />
                            </button>
                        ) : (
                            <div className="flex gap-3 w-full max-w-md animate-in fade-in zoom-in-95">
                                <button onClick={handleRating} className="flex-1 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/30 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                    <X size={16} /> Hard
                                </button>
                                <button onClick={handleRating} className="flex-1 py-3 bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 border border-amber-500/30 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                    <Target size={16} /> Good
                                </button>
                                <button onClick={handleRating} className="flex-1 py-3 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-500/30 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle2 size={16} /> Easy
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-center text-slate-500 text-sm">
                * Note: Spaced repetition logic maps your quiz mistakes into daily flashcard reviews.
            </p>
        </div>
    );
}
