import { Link } from 'react-router-dom';
import { AlertTriangle, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8">
                <AlertTriangle size={40} className="text-amber-400" />
            </div>
            <p className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-3">404 — Not Found</p>
            <h1 className="text-4xl font-black text-white font-cinzel mb-4">Page Not Found</h1>
            <p className="text-slate-400 max-w-md mb-10">
                This path does not exist in the kingdom. Like a warrior without a guide,
                you may need to return to the Dashboard.
            </p>
            <div className="flex gap-3">
                <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all hover:scale-105">
                    <Home size={18} /> Dashboard
                </Link>
                <Link to="/lesson/7" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all">
                    <BookOpen size={18} /> Start Chapter 7
                </Link>
            </div>
        </div>
    );
}
