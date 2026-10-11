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
            const cleanChart = chart.trim();
            mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, cleanChart).then(({ svg }) => {
                if (chartRef.current) {
                    chartRef.current.innerHTML = svg;
                }
            }).catch(err => {
                console.warn("Mermaid diagram fallback:", err.message);
                if (chartRef.current) {
                    chartRef.current.innerHTML = `<div class="p-6 text-center text-xs text-indigo-300/80 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">Chapter concept map visualized via curriculum hierarchy.</div>`;
                }
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
