export interface Question {
    id: string;
    chapter: number;
    difficulty: number;
    stem: string;
    options: string[];
    answer: string;
    explanation: string;
}

export interface QuizState {
    pool: Question[];
    currentIndex: number;
    score: number;
    history: { qId: string, correct: boolean }[];
    finished: boolean;
}

export class QuizEngine {
    state: QuizState;
    private initialQuestions: Question[];

    constructor(questions: Question[], length: number = 15) {
        this.initialQuestions = [...questions];
        this.state = {
            pool: this.selectQuestions(questions, length),
            currentIndex: 0,
            score: 0,
            history: [],
            finished: false
        };
    }

    private selectQuestions(questions: Question[], length: number): Question[] {
        // Robust random shuffler (Fisher-Yates) instead of Math.random() - 0.5
        const shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, length);
    }

    public getCurrentQuestion(): Question | null {
        if (this.state.finished || this.state.currentIndex >= this.state.pool.length) return null;
        return this.state.pool[this.state.currentIndex];
    }

    public answerQuestion(selected: string): boolean {
        const q = this.getCurrentQuestion();
        if (!q) return false;

        const isCorrect = selected === q.answer;
        if (isCorrect) this.state.score++;

        this.state.history.push({ qId: q.id, correct: isCorrect });

        return isCorrect;
    }

    public next(): boolean {
        if (this.state.currentIndex + 1 < this.state.pool.length) {
            this.state.currentIndex++;
            return true;
        } else {
            this.state.finished = true;
            return false;
        }
    }

    public getProgress(): number {
        return (this.state.currentIndex / this.state.pool.length) * 100;
    }

    public getPercentage(): number {
        return Math.round((this.state.score / this.state.pool.length) * 100);
    }
}
