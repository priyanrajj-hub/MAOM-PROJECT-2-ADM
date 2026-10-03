import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Network } from 'lucide-react';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    fontFamily: 'Inter, sans-serif'
});

export default function Mindmap({ chart, title }: { chart: string, title?: string }) {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartRef.current && chart) {
            mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then(({ svg }) => {
                if (chartRef.current) {
                    chartRef.current.innerHTML = svg;
                }
            }).catch(err => {
                console.error("Mermaid parsing failed", err);
            });
        }
    }, [chart]);

    return (
        <div className="my-8 bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 overflow-hidden">
            {title && (
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-300 mb-6">
                    <Network size={20} className="text-cyan-400" /> {title}
                </h4>
            )}
            <div
                ref={chartRef}
                className="w-full flex justify-center overflow-x-auto min-h-[300px] text-sm"
            >
                <div className="text-slate-500 animate-pulse flex items-center justify-center h-40">Rendering Diagram...</div>
            </div>
        </div>
    );
}
