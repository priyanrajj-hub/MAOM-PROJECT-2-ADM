import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Quote, Bookmark, Target, AlertCircle, Users, Lightbulb, Zap } from 'lucide-react';
import Mindmap from '../components/Mindmap';

export default function Lesson() {
    const { chapterId } = useParams();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chapterId) return;
        const id = String(chapterId).padStart(2, '0');
        import(`../data/lessons/ch${id}.json`)
            .then(mod => setData(mod.default))
            .catch(err => setError(`Could not load Chapter ${chapterId}. (${err.message})`));
    }, [chapterId]);

    if (error) return (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-red-300">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 px-6 py-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500">Retry</button>
        </div>
    );

    if (!data) return (
        <div className="flex items-center justify-center py-24">
            <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>

            {/* Header */}
            <header className="space-y-5 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                        <BookOpen size={22} />
                    </div>
                    <span className="text-xs font-bold text-amber-400 border border-amber-400/20 bg-amber-400/5 px-3 py-1 rounded-full tracking-widest uppercase">Chapter {data.chapter}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white font-cinzel">{data.theme}</h1>
                <p className="text-slate-400 text-base leading-relaxed">{data.abstract}</p>
            </header>

            {/* Key Highlights */}
            {data.highlights && (
                <section className="bg-gradient-to-br from-slate-900 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2 mb-5">
                        <Zap size={14} /> Chapter Highlights
                    </h2>
                    <ul className="space-y-3">
                        {data.highlights.map((h: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                {h}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Learning Objectives */}
            {data.objectives && (
                <section className="bg-slate-900/80 rounded-2xl border border-indigo-500/20 p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-5">
                        <Target size={14} /> Learning Objectives
                    </h2>
                    <ul className="space-y-2.5">
                        {data.objectives.map((obj: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                                {obj}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Characters */}
            {data.characters && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                        <Users size={14} /> Character Spotlight
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {data.characters.map((c: any, i: number) => {
                            return (
                                <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
                                    <div className="font-bold text-white">{c.name}</div>
                                    <p className="text-xs text-slate-500">{c.role}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Mindmap */}
            <Mindmap title="Chapter Flow" chart={`graph TD\n  A["Ch.${data.chapter}: ${data.theme}"] --> B(Core Dilemma)\n  A --> C(Resolution)\n  B --> D[Personal Desire]\n  B --> E["Dharmic Duty"]\n  C --> F[Selfless Action]\n  C --> G[Universal Truth]\n  F --> H{Liberation}\n  G --> H`} />

            {/* Content Blocks */}
            <div className="space-y-8 text-slate-300 text-base leading-relaxed">
                {data.content_blocks?.map((block: any, idx: number) => {
                    if (block.type === 'paragraph') return (
                        <p key={idx}>{block.content}</p>
                    );
                    if (block.type === 'sloka_translation') return (
                        <div key={idx} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 p-8 shadow-xl shadow-indigo-500/5">
                            <Quote size={48} className="absolute -top-2 -left-2 text-indigo-500/10 rotate-180" />
                            {block.sanskrit && <p className="text-center font-bold text-xl text-indigo-200 mb-4 font-cinzel">{block.sanskrit}</p>}
                            {block.english_translation && <p className="text-center italic text-slate-300 text-lg">{block.english_translation}</p>}
                            {block.content && <p className="mt-4 text-xs text-slate-500 text-center">{block.content}</p>}
                        </div>
                    );
                    if (block.type === 'key_concept') return (
                        <div key={idx} className="flex gap-4 p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                            <Lightbulb size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Key Concept</p>
                                <p className="text-slate-300 text-sm">{block.content}</p>
                            </div>
                        </div>
                    );
                    return null;
                })}
            </div>

            {/* Glossary */}
            {data.glossary?.length > 0 && (
                <section className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2 mb-5">
                        <Bookmark size={14} /> Vedic Glossary
                    </h2>
                    <div className="space-y-4">
                        {data.glossary.map((item: any, i: number) => (
                            <div key={i} className="border-l-2 border-purple-500/40 pl-4">
                                <h4 className="font-bold text-purple-300 font-cinzel">{item.term}</h4>
                                <p className="text-sm text-slate-300">{item.definition}</p>
                                <p className="text-xs text-slate-500 italic mt-1">"{item.context}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#080b14]/95 backdrop-blur-xl border-t border-white/5 flex justify-center z-40">
                <Link to={`/quiz/${chapterId}`} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-black py-3.5 px-12 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
                    <Target size={18} /> Start Chapter {data.chapter} Quiz
                </Link>
            </div>
        </div>
    );
}
