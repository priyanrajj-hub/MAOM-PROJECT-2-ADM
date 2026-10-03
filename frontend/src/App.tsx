import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Review from './pages/Review';
import Analytics from './pages/Analytics';
import Chatbot from './components/Chatbot';
import { LayoutDashboard, Activity, Clock, BookMarked } from 'lucide-react';

const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/review', icon: Clock, label: 'Spaced Review' },
    { to: '/analytics', icon: Activity, label: 'Analytics' },
];

function Navigation() {
    const location = useLocation();
    return (
        <nav className="border-b border-white/5 sticky top-0 z-50 bg-[#080b14]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 bg-amber-500 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity blur-sm" />
                            <div className="relative w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                <BookMarked size={18} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <span className="text-base font-black tracking-tight text-white font-cinzel">Mahabharata</span>
                            <span className="text-xs block text-amber-400 font-semibold tracking-[0.15em] uppercase -mt-0.5">ADM Platform</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-1">
                        {navLinks.map(({ to, icon: Icon, label }) => {
                            const active = location.pathname === to;
                            return (
                                <Link key={to} to={to} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${active
                                        ? 'text-white bg-white/10 border border-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}>
                                    <Icon size={15} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col selection:bg-indigo-500/30">
                <Navigation />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/lesson/:chapterId" element={<Lesson />} />
                        <Route path="/quiz/:chapterId" element={<Quiz />} />
                        <Route path="/review" element={<Review />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </main>
                <Chatbot />
            </div>
        </BrowserRouter>
    )
}

export default App;
