import { Activity, Target, Zap, Clock, TrendingUp, TrendingDown, Award } from 'lucide-react';

export default function Analytics() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white font-cinzel mb-2 flex items-center gap-3">
                        <Activity className="text-indigo-400" />
                        Learning Analytics
                    </h1>
                    <p className="text-slate-400">Your cognitive breakdown and conceptual mastery across the epic.</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={<Target className="text-amber-400" />} title="Mastery Score" value="72%" trend="+4%" trendUp />
                <MetricCard icon={<Zap className="text-indigo-400" />} title="Quizzes Passed" value="12/15" />
                <MetricCard icon={<Clock className="text-emerald-400" />} title="Time Studied" value="4h 15m" trend="+1.5h" trendUp />
                <MetricCard icon={<TrendingUp className="text-rose-400" />} title="Longest Streak" value="5 Days" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Cognitive Strengths */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="text-amber-500" /> Dimensional Proficiency
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <ProgressBar label="Dharma & Ethics" percent={85} color="bg-emerald-500" />
                        <ProgressBar label="Strategic Leadership" percent={70} color="bg-indigo-500" />
                        <ProgressBar label="Karma & Action" percent={60} color="bg-amber-500" />
                        <ProgressBar label="Statecraft & Politics" percent={45} color="bg-rose-500" />
                    </div>
                </div>

                {/* Concept Weaknesses */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingDown className="text-red-400" /> Key Weaknesses
                    </h3>

                    <div className="space-y-4">
                        {[
                            { concept: "Systemic Adharma (Ch 3)", impact: "High Impact" },
                            { concept: "Cosmic Duty vs Family (Ch 7)", impact: "Med Impact" },
                            { concept: "Nishkama Karma (Ch 6)", impact: "Med Impact" },
                        ].map((w, i) => (
                            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <h4 className="font-bold text-slate-200">{w.concept}</h4>
                                <p className="text-xs text-red-400 mt-1 font-semibold">{w.impact} on overall score</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-center text-slate-500 text-sm mt-8">
                * Note: Analytics are simulated placeholders bridging the gap before a stateful database is attached.
            </p>
        </div>
    );
}

function MetricCard({ icon, title, value, trend, trendUp }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-xl">{icon}</div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h4 className="text-3xl font-black text-white">{value}</h4>
            </div>
        </div>
    );
}

function ProgressBar({ label, percent, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-400">{percent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
