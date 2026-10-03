import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Quote, Bookmark, Target } from 'lucide-react';
import Mindmap from '../components/Mindmap';

export default function Lesson() {
    const { chapterId } = useParams();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch(`/data/lessons/lesson_ch${chapterId?.padStart(2, '0')}.json`)
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error(err));
    }, [chapterId]);

    if (!data) return <div className="text-center p-12 text-slate-400">Loading lesson {chapterId}...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>

            <header className="space-y-4 border-b border-slate-700/50 pb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 border border-indigo-500/30">
                        <BookOpen size={24} />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Chapter {data.chapter}: {data.theme}</h1>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">{data.abstract}</p>

                {data.objectives && (
                    <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 mt-6 shadow-sm">
                        <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                            <Target size={18} className="text-amber-400" /> Learning Objectives
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 ml-1">
                            {data.objectives.map((obj: string, i: number) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>

            <Mindmap
                title="Chapter Architectural Flow"
                chart={`graph TD
                    A[Chapter ${data.chapter}: ${data.theme}] --> B(Core Dilemma)
                    A --> C(Philosophical Resolution)
                    B --> D[Personal Attachments]
                    B --> E[Social Duty (Dharma)]
                    C --> F[Action without Attachment]
                    C --> G[Universal Truth]
                    F --> H{Self-Mastery}
                    G --> H`}
            />

            <div className="space-y-8 text-slate-200 text-lg leading-relaxed font-serif">
                {data.content_blocks?.map((block: any, idx: number) => {
                    if (block.type === 'paragraph') {
                        return <p key={idx} className="tracking-wide">{block.content}</p>;
                    }
                    if (block.type === 'sloka_translation') {
                        return (
                            <div key={idx} className="my-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-800/80 border border-indigo-500/20 p-8 shadow-inner">
                                <Quote size={40} className="absolute -top-2 -left-2 text-indigo-500/10 rotate-180" />
                                {block.sanskrit && (
                                    <p className="text-center font-bold text-xl text-indigo-200 mb-4">{block.sanskrit}</p>
                                )}
                                {block.english_translation && (
                                    <p className="text-center italic text-slate-300">{block.english_translation}</p>
                                )}
                                {block.content && (
                                    <p className="mt-4 text-sm text-slate-400 text-center">{block.content}</p>
                                )}
                            </div>
                        );
                    }
                    if (block.type === 'key_concept' || block.type === 'breakout_box') {
                        return (
                            <div key={idx} className="my-6 border-l-4 border-cyan-500 pl-6 py-2">
                                <p className="font-bold text-cyan-400 mb-2">{block.type === 'key_concept' ? 'Key Concept' : 'Insight'}</p>
                                <p>{block.content}</p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {data.glossary && data.glossary.length > 0 && (
                <section className="mt-16 bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                        <Bookmark size={24} className="text-purple-400" />
                        Vedic Glossary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.glossary.map((item: any, i: number) => (
                            <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <h4 className="font-bold text-indigo-300 mb-1">{item.term}</h4>
                                <p className="text-sm text-slate-300 mb-2">{item.definition}</p>
                                <p className="text-xs text-slate-500 italic">"{item.context}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
                <Link to={`/quiz/${chapterId}`} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-12 rounded-xl shadow-lg shadow-indigo-500/25 transition-all focus:ring-4 focus:ring-indigo-500/50 hover:scale-105 active:scale-95 flex items-center gap-2">
                    <Target size={20} />
                    Start Chapter {data.chapter} Quiz
                </Link>
            </div>
        </div>
    );
}
