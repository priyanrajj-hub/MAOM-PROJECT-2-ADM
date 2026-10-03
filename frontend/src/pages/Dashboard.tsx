import { Link } from 'react-router-dom';
import { BookOpen, Target, ChevronRight, Zap, Star, Clock } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import chaptersData from '../data/chapters';

const themeColors = [
    'from-violet-500 to-purple-700',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-pink-700',
    'from-emerald-500 to-teal-600',
    'from-indigo-500 to-violet-700',
    'from-fuchsia-500 to-purple-600',
    'from-yellow-500 to-amber-600',
    'from-sky-500 to-blue-700',
    'from-red-500 to-rose-700',
];

export default function Dashboard() {
    const chapters = chaptersData.chapters;
    const featured = chapters[6]; // Chapter 7: Dharma in Crisis

    return (
        <div className="space-y-0 -mt-8 animate-in fade-in duration-700">

            {/* 3D Hero Section */}
            <section className="relative h-[420px] w-full overflow-hidden rounded-3xl mb-12 shadow-2xl">
                <HeroCanvas />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-10 max-w-xl">
                    <p className="text-amber-400 font-semibold text-sm tracking-[0.25em] uppercase mb-3">Mahabharata ADM Platform</p>
                    <h1 className="text-5xl font-black text-white leading-tight mb-4">
                        Master the<br />
                        <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">Epic of Ages</span>
                    </h1>
                    <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-sm">
                        15 chapters of structured learning — philosophy, Sanskrit, adaptive quizzing, and AI-powered tutoring.
                    </p>
                    <div className="flex gap-3">
                        <Link to="/lesson/7" className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30">
                            <Zap size={18} /> Start Learning
                        </Link>
                        <Link to="/quiz/7" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold rounded-xl border border-white/20 transition-all">
                            <Target size={18} /> Take Quiz
                        </Link>
                    </div>
                </div>
                {/* Decorative glows */}
                <div className="absolute top-1/2 right-16 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            </section>

            {/* Featured Chapter */}
            <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Star size={18} className="text-amber-400" /> Featured Chapter</h2>
                </div>
                <Link to={`/lesson/${featured.chapter}`} className="block group">
                    <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all hover:shadow-xl hover:shadow-amber-500/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
                        <div className="relative p-8 flex items-center justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">CHAPTER 7</span>
                                    <span className="text-xs text-slate-400">Pilot Chapter</span>
                                </div>
                                <h3 className="text-3xl font-black text-white">{featured.theme}</h3>
                                <p className="text-slate-400 max-w-lg">{featured.abstract}</p>
                                <div className="flex items-center gap-4 pt-2">
                                    <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={12} /> ~25 min read</span>
                                    <span className="flex items-center gap-1 text-xs text-slate-400"><Target size={12} /> 15 quiz questions</span>
                                </div>
                            </div>
                            <ChevronRight size={32} className="text-amber-400 group-hover:translate-x-2 transition-transform flex-shrink-0" />
                        </div>
                    </div>
                </Link>
            </section>

            {/* All Chapters Grid */}
            <section>
                <h2 className="text-xl font-bold text-white mb-5">Course Curriculum</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((ch: any, idx: number) => {
                        const gradient = themeColors[idx % themeColors.length];
                        return (
                            <div key={ch.chapter} className="group relative bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all duration-300 overflow-hidden hover:shadow-lg hover:-translate-y-0.5">
                                {/* Top gradient stripe */}
                                <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
                                <div className="p-5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md bg-gradient-to-r ${gradient} text-white`}>Ch. {ch.chapter}</span>
                                    </div>
                                    <h3 className="font-bold text-white text-base group-hover:text-slate-100 leading-snug">{ch.theme}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{ch.abstract}</p>
                                    <div className="flex gap-2 pt-1">
                                        <Link to={`/lesson/${ch.chapter}`} onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors">
                                            <BookOpen size={13} /> Study
                                        </Link>
                                        <Link to={`/quiz/${ch.chapter}`} onClick={e => e.stopPropagation()} className={`flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg text-xs font-semibold transition-all hover:opacity-90 hover:scale-105`}>
                                            <Target size={13} /> Quiz
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
