import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Quote, Bookmark, Target, AlertCircle, Users, Lightbulb, Zap, Layers, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">ADM-V3.8</span>
                </div>
            </div>

            {/* Chapter Header */}
            <header className="space-y-5 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                        <BookOpen size={22} />
                    </div>
                    <span className="text-xs font-bold text-amber-400 border border-amber-400/20 bg-amber-400/5 px-3 py-1 rounded-full tracking-widest uppercase">Chapter {data.chapter}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white font-cinzel">{data.theme}</h1>
                <p className="text-slate-400 text-base leading-relaxed">{data.abstract}</p>
                {data.summary && (
                    <div className="mt-4 bg-slate-900/70 p-5 rounded-2xl border border-amber-500/20 shadow-lg">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider mb-2">
                            <Lightbulb size={16} /> Executive Summary
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                    </div>
                )}
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

            {/* Point-by-Point In-Depth Explanation */}
            {data.point_by_point_explanation && data.point_by_point_explanation.length > 0 ? (
                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                                <Layers size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white font-cinzel">Point-by-Point In-Depth Explanation</h2>
                                <p className="text-xs text-slate-400">Detailed philosophical breakdown, ethical dilemmas & strategic takeaways</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full">
                            {data.point_by_point_explanation.length} Sections
                        </span>
                    </div>

                    <div className="space-y-4">
                        {data.point_by_point_explanation.map((item: any, idx: number) => (
                            <div key={idx} className="bg-slate-900/90 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-colors p-6 shadow-xl space-y-4">
                                <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs flex items-center justify-center font-bold border border-indigo-500/30 flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span>{item.section_title}</span>
                                </h3>
                                <ul className="space-y-3 pl-2">
                                    {item.points?.map((pt: string, pIdx: number) => (
                                        <li key={pIdx} className="flex items-start gap-3 text-slate-200 text-sm leading-relaxed">
                                            <CheckCircle2 size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            ) : data.in_depth_explanation && (
                <section className="bg-slate-900/90 rounded-2xl border border-indigo-500/20 p-6 shadow-xl space-y-4">
                    <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                        <Layers size={18} /> In-Depth Explanation
                    </h2>
                    <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                        <ReactMarkdown>{data.in_depth_explanation}</ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Mindmap */}
            <Mindmap title="Chapter Flow" chart={data.mindmap_chart || `graph TD\n  A["Ch.${data.chapter}: ${data.theme}"] --> B(Core Dilemma)\n  A --> C(Resolution)\n  B --> D[Personal Desire]\n  B --> E["Dharmic Duty"]\n  C --> F[Selfless Action]\n  C --> G[Universal Truth]\n  F --> H{Liberation}\n  G --> H`} />

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

            {/* Chapter Navigation Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-8 pb-12">
                {Number(chapterId) > 1 ? (
                    <Link to={`/lesson/${Number(chapterId) - 1}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all hover:scale-105">
                        <ArrowLeft size={16} /> Previous: Chapter {Number(chapterId) - 1}
                    </Link>
                ) : <div />}

                {Number(chapterId) < 15 ? (
                    <Link to={`/lesson/${Number(chapterId) + 1}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all hover:scale-105">
                        Next: Chapter {Number(chapterId) + 1} <ArrowRight size={16} />
                    </Link>
                ) : <div />}
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#080b14]/95 backdrop-blur-xl border-t border-white/5 flex justify-center z-40">
                <Link to={`/quiz/${chapterId}`} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-black py-3.5 px-12 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
                    <Target size={18} /> Start Chapter {data.chapter} Quiz
                </Link>
            </div>
        </div>
    );
}
