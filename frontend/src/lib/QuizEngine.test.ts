import { describe, it, expect } from 'vitest';
import { QuizEngine, Question } from './QuizEngine';

const mockQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
    id: `q${i}`,
    chapter: 1,
    difficulty: Math.floor(i / 10) + 1,
    stem: `Question ${i}`,
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    explanation: 'Explanation'
}));

describe('QuizEngine', () => {
    it('initializes with correctly sized pool', () => {
        const engine = new QuizEngine(mockQuestions, 10);
        expect(engine.state.pool.length).toBe(10);
        expect(engine.state.currentIndex).toBe(0);
        expect(engine.state.score).toBe(0);
        expect(engine.state.finished).toBe(false);
    });

    it('shuffles questions (Fisher-Yates uniformity proxy)', () => {
        // Collect first item over 100 runs
        const firstItems: Record<string, number> = {};
        for (let i = 0; i < 100; i++) {
            const engine = new QuizEngine(mockQuestions, 10);
            const id = engine.getCurrentQuestion()!.id;
            firstItems[id] = (firstItems[id] || 0) + 1;
        }
        // If it was always the same, one key would have 100.
        // It's highly unlikely any single item appears > 30 times out of 30 options.
        const maxOccurrences = Math.max(...Object.values(firstItems));
        expect(maxOccurrences).toBeLessThan(40);
    });

    it('progresses through a quiz and scores correctly', () => {
        const engine = new QuizEngine(mockQuestions, 3);

        // Q1 - Correct
        const q1 = engine.getCurrentQuestion()!;
        expect(engine.answerQuestion(q1.answer)).toBe(true);
        expect(engine.state.score).toBe(1);
        expect(engine.next()).toBe(true);
        expect(engine.getProgress()).toBe(100 / 3); // 33.33%

        // Q2 - Incorrect
        expect(engine.answerQuestion('WrongAnswer')).toBe(false);
        expect(engine.state.score).toBe(1);
        expect(engine.next()).toBe(true);

        // Q3 - Correct
        const q3 = engine.getCurrentQuestion()!;
        engine.answerQuestion(q3.answer);
        expect(engine.state.score).toBe(2);

        // End quiz
        expect(engine.next()).toBe(false);
        expect(engine.state.finished).toBe(true);
        expect(engine.getPercentage()).toBe(67); // 2/3 = 66.6% -> 67%
        expect(engine.getCurrentQuestion()).toBeNull();
    });

    it('handles answering when finished', () => {
        const engine = new QuizEngine(mockQuestions, 1);
        engine.answerQuestion('A');
        engine.next();
        expect(engine.answerQuestion('A')).toBe(false); // Returns false, does not throw
    });
});
