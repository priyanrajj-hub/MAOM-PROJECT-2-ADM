# Mahabharata: Adaptive Digital Mastery (ADM) Platform

An end-to-end data pipeline and interactive learning application built with **Python**, **Gemini API**, and **Vite + React**.

## 1. Project Architecture

This project handles the complete ingestion of complex PDF manuscripts, processing it through an elaborate Computer Vision + Generative AI pipeline, and finally serving it through an interactive, static web application.

- **`scripts/`**: The Python pipeline to transcribe pages, process LLM context (Sanskrit/English extraction), generate structurally valid quizzes, and assemble unified chapters.
- **`data/`**: The pipeline outputs. (Note: currently contains mock data for Chapters 1-15 generated to bypass Gemini API limits for the Vercel Pilot deployment).
- **`frontend/`**: The React + Vite application tailored specifically for the generated datasets, featuring a Mermaid.js explainer engine and a client-side API Chatbot.

## 2. Setting Up the Pipeline for Production

During initial development, the **20-hour Tenacity Quote Exhaustion Limit** was triggered on the Gemini models. To proceed organically once your quota resets:

1. Obtain a fresh Google Gemini API Key.
2. In the root directory, create a `.env` file:

   ```env
   GEMINI_API_KEY="AIzaSy..."
   TEXT_MODEL="gemini-flash-latest"
   ```

3. Run the scripts sequentially:

   ```bash
   python scripts/05_lessons.py
   python scripts/06_concepts.py
   python scripts/07_questions.py
   python scripts/08_validate.py
   ```

4. The generation loop will overwrite the dummy chapters automatically.

## 3. Web UI Handover

The interface is ready on Vercel utilizing the mock generated framework. To update your Vercel deployment with real questions after running the pipeline, simply execute:

```bash
git add .
git commit -m "chore: updated pipeline outputs with generated data"
git push origin main
```

Vercel will detect the push and instantaneously rebuild the static site.

### Features Built

* Dynamic Routing (React Router DOM 6)
- Lucide-React aesthetics and glassmorphism Tailwind classes
- `mermaid.js` embedded visualizations dynamically populated per-chapter
- Global Floating AI Tutor utilizing the `@google/genai` library client-side.
