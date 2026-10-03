import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Review from './pages/Review';
import Analytics from './pages/Analytics';
import Chatbot from './components/Chatbot';
import { Book, LayoutDashboard, Activity, Clock } from 'lucide-react';

function Navigation() {
    return (
        <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                            <Book className="text-indigo-400" size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
                            Mahabharata ADM
                        </span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all flex items-center gap-2">
                            <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link to="/review" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all flex items-center gap-2">
                            <Clock size={16} /> Spaced Review
                        </Link>
                        <Link to="/analytics" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all flex items-center gap-2">
                            <Activity size={16} /> Analytics
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
                <Navigation />
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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
