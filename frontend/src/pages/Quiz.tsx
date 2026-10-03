import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Activity } from 'lucide-react';

export default function Quiz() {
    const { chapterId } = useParams();
    const [data, setData] = useState<any>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        fetch(`/data/questions/questions_ch${chapterId?.padStart(2, '0')}.json`)
            .then(res => res.json())
            .then(json => {
                // Shuffle first 20 questions for a quick mixed review session.
                const pool = json.questions.slice(0, 20).sort(() => Math.random() - 0.5);
                setData({ ...json, activePool: pool });
            })
            .catch(err => console.error(err));
    }, [chapterId]);

    if (!data) return <div className="text-center p-12 text-slate-400">Loading Question Bank...</div>;

    const handleNext = () => {
        if (selected === q.answer) setScore(s => s + 1);

        if (currentIdx + 1 < data.activePool.length) {
            setCurrentIdx(i => i + 1);
            setSelected(null);
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6 mt-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 flex items-center justify-center rounded-full mx-auto border-4 border-green-500/30">
                    <Activity size={48} />
                </div>
                <h2 className="text-4xl font-bold text-white">Quiz Complete!</h2>
                <p className="text-xl text-slate-300">You scored {score} out of {data.activePool.length}.</p>
                <Link to="/" className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const q = data.activePool[currentIdx];
    const hasAnswered = selected !== null;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20 mt-8 animate-in fade-in duration-500">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400">
                <ArrowLeft size={16} className="mr-2" /> End Session
            </Link>

            <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-2">
                <span>Question {currentIdx + 1} of {data.activePool.length}</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Level {q.difficulty}</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 leading-snug">{q.stem}</h2>

                <div className="space-y-3">
                    {q.options.map((opt: string, i: number) => {
                        const isSelected = selected === opt;
                        const isCorrect = opt === q.answer;

                        let btnStyle = "bg-slate-900 border-slate-700 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800";
                        if (hasAnswered) {
                            if (isCorrect) btnStyle = "bg-green-900/30 border-green-500 text-green-300";
                            else if (isSelected) btnStyle = "bg-red-900/30 border-red-500 text-red-300";
                            else btnStyle = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
                        } else if (isSelected) {
                            btnStyle = "bg-indigo-900/50 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30";
                        }

                        return (
                            <button
                                key={i}
                                disabled={hasAnswered}
                                onClick={() => setSelected(opt)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${btnStyle}`}
                            >
                                <span>{opt}</span>
                                {hasAnswered && isCorrect && <CheckCircle2 size={20} className="text-green-500" />}
                                {hasAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                            </button>
                        );
                    })}
                </div>

                {hasAnswered && (
                    <div className="mt-8 p-4 bg-slate-900/80 rounded-xl border border-slate-700 animate-in slide-in-from-top-2">
                        <h4 className="font-bold text-indigo-400 mb-2 text-sm uppercase tracking-wider">Concept Explanation</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>

                        <button onClick={handleNext} className="mt-6 w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
                            Continue <ChevronRight size={20} className="ml-1" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
