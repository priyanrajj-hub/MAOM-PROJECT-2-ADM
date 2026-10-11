import { useState } from 'react';
import { Target, CheckCircle2, RefreshCcw, ChevronRight, BrainCircuit, X } from 'lucide-react';

export default function Review() {
    const [cardState, setCardState] = useState<'question' | 'answer'>('question');
    const [currentIndex, setCurrentIndex] = useState(0);

    const flashcards = [
        {
            id: 1,
            chapter: "Ch 7: Pratijñā (The Ethics of Vows)",
            concept: "Teleological Ethics",
            question: "Why does the ADM framework classify Bhīṣma's vow of celibacy as an ethical failure rather than pure virtue?",
            answer: "Bhīṣma subordinated the welfare of the state (Loka-saṅgraha) to personal ascetic reputation and emotional filial devotion. By refusing Niyoga and political leadership, his vow created power vacuums that led directly to the Kuru civil war."
        },
        {
            id: 2,
            chapter: "Ch 4: Dharmic Insights of a Butcher",
            concept: "Svadharma vs. Ritual Purity",
            question: "Why did Sage Kauśika have to learn supreme Dharma from a meat-seller (Dharmavyādha) in Mithilā?",
            answer: "Kauśika possessed ascetic powers (tapas) but lacked compassion and abandoned his aging parents. Dharmavyādha demonstrated that fulfilling one's hereditary social duties with dedication, filial piety, and humility outweighs external ascetic austerity."
        },
        {
            id: 3,
            chapter: "Ch 8: Karṇa: The Maestro Wide of Mark",
            concept: "Toxic Loyalty & Moral Blindness",
            question: "How does the Mahābhārata analyze Karṇa's unconditional loyalty to Duryodhana?",
            answer: "Karṇa prioritized personal gratitude and ego validation over cosmic justice. Loyalty to an adharmic patron does not sanitize adharmic actions; it actively compounds systemic evil, leading to moral compromise and tragic downfall."
        },
        {
            id: 4,
            chapter: "Ch 14: Sanatsujātīya",
            concept: "Pramāda (Heedlessness)",
            question: "What is Sage Sanatsujāta's fundamental definition of Death in his discourse to Dhṛtarāṣṭra?",
            answer: "Sanatsujāta declares that physical death is an illusion; the true 'Death' is Pramāda (spiritual heedlessness and distraction of the senses). Overcoming ego and desire confers immortality."
        },
        {
            id: 5,
            chapter: "Ch 12: Extraordinary Peace Mission",
            concept: "Exhaustion of Recourse",
            question: "Why did Śrī Kṛṣṇa proceed on a peace mission to Hastināpura despite knowing war was inevitable?",
            answer: "To secure the moral high ground and establish that every peaceful diplomatic avenue was exhausted before lethal force. In righteous conflict, war must only be a last resort after unequivocal refusal of compromise by the aggressor."
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
