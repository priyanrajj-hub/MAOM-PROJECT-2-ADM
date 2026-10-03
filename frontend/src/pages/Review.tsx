export default function Review() {
    return (
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            <h1 className="text-2xl font-bold mb-4">Spaced Repetition Review</h1>
            <p className="text-slate-400">
                Aggregates weak concepts directly from IndexedDB state across all 15 chapters and runs Anki-style review drills.
            </p>
        </div>
    );
}
