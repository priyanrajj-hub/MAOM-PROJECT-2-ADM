import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Activity, AlertCircle } from 'lucide-react';
import { QuizEngine } from '../lib/QuizEngine';

export default function Quiz() {
    const { chapterId } = useParams();
    const [engine, setEngine] = useState<QuizEngine | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Force re-render trick since engine mutates internally
    const [, setTick] = useState(0);

    useEffect(() => {
        if (!chapterId) return;
        const id = String(chapterId).padStart(2, '0');
        import(`../data/questions/ch${id}.json`)
            .then(mod => {
                setEngine(new QuizEngine(mod.default.questions, 15));
            })
            .catch(err => setError(`Could not load questions for Chapter ${chapterId}. (${err.message})`));
    }, [chapterId]);

    if (error) return (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-red-300">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 px-6 py-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500">Retry</button>
        </div>
    );

    if (!engine) return (
        <div className="flex items-center justify-center py-24">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
    );

    const handleNext = () => {
        engine.next();
        setSelected(null);
        setTick(t => t + 1);
    };

    if (engine.state.finished) {
        const pct = engine.getPercentage();
        const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Work!' : 'Keep Practising';
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6 mt-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 flex items-center justify-center rounded-full mx-auto border-4 border-green-500/30">
                    <Activity size={48} />
                </div>
                <h2 className="text-4xl font-bold text-white">Quiz Complete!</h2>
                <p className="text-2xl text-indigo-300 font-bold">{pct}% — {grade}</p>
                <p className="text-xl text-slate-300">You scored {engine.state.score} out of {engine.state.pool.length}.</p>
                <div className="flex gap-4 justify-center mt-8">
                    <Link to={`/lesson/${chapterId}`} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all">Review Lesson</Link>
                    <Link to="/" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">Dashboard</Link>
                </div>
            </div>
        );
    }

    const q = engine.getCurrentQuestion();
    if (!q) return null;

    const hasAnswered = selected !== null;
    const progress = engine.getProgress();

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20 mt-8 animate-in fade-in duration-500">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400">
                <ArrowLeft size={16} className="mr-2" /> End Session
            </Link>

            <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-sm font-bold text-slate-400">
                <span>Question {engine.state.currentIndex + 1} of {engine.state.pool.length}</span>
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
                            <button key={i} disabled={hasAnswered} onClick={() => {
                                setSelected(opt);
                                engine.answerQuestion(opt);
                                setTick(t => t + 1);
                            }}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${btnStyle}`}>
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
