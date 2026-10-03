import { Link } from 'react-router-dom';
import { BookOpen, Target, ChevronRight, CheckCircle2 } from 'lucide-react';
import chaptersData from '../data/chapters';

export default function Dashboard() {
    const chapters = chaptersData.chapters;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="space-y-2">
                <h1 className="text-3xl font-extrabold text-white">Course Curriculum</h1>
                <p className="text-slate-400">Master the Mahabharata concepts with adaptive learning.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((ch: any) => (
                    <div key={ch.chapter} className="bg-slate-800/60 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors overflow-hidden flex flex-col group shadow-md shadow-slate-900/20">
                        <div className="p-6 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 font-bold text-lg group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                    {ch.chapter}
                                </div>
                                {/* Dummy progress, later replace with IndexedDB */}
                                <span className="flex items-center text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                                    <CheckCircle2 size={12} className="mr-1 text-slate-500" /> 0% Mastery
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{ch.theme || `Chapter ${ch.chapter}`}</h3>
                                <p className="text-sm text-slate-400 line-clamp-2">{ch.abstract || "Description unavailable."}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-900/30 border-t border-slate-700/50 flex gap-2">
                            <Link to={`/lesson/${ch.chapter}`} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-all focus:ring-2 focus:ring-slate-500">
                                <BookOpen size={16} /> Study
                            </Link>
                            <Link to={`/quiz/${ch.chapter}`} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 focus:ring-2 focus:ring-indigo-400">
                                <Target size={16} /> Quiz <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                ))}
                {chapters.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        Loading chapters from pipeline framework...
                    </div>
                )}
            </div>
        </div>
    );
}
