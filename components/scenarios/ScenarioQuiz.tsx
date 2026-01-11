"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Category = "EMAIL" | "SMS" | "SOCIAL";

type Question = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
};

type AnswerResponse = {
  ok: boolean;
  isCorrect: boolean;
  score: number;
  answered: number;
  completed: boolean;
  explanation?: string;
  error?: string;
};

function categoryLabel(cat: Category) {
  if (cat === "EMAIL") return "Email";
  if (cat === "SMS") return "SMS";
  return "Réseaux sociaux";
}

export default function ScenarioQuiz({ category }: { category: Category }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{
    shown: boolean;
    isCorrect?: boolean;
    explanation?: string;
  }>({ shown: false });

  // progression serveur renvoyée par /answer
  const [progress, setProgress] = useState<{
    answered: number;
    score: number;
    completed: boolean;
  }>({ answered: 0, score: 0, completed: false });

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/scenarios?category=${category}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { questions?: Question[]; error?: string };

        if (!res.ok || !data.questions) {
          console.error("Load questions error:", res.status, data);
          return;
        }
        if (!ignore) {
          setQuestions(data.questions);
          setIdx(0);
          setSelected(null);
          setFeedback({ shown: false });
          setProgress({ answered: 0, score: 0, completed: false });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [category]);

  const current = questions[idx];

  const total = useMemo(() => questions.length || 10, [questions.length]);
  const percent = total ? Math.round((progress.answered / total) * 100) : 0;

  async function submitAnswer() {
    if (!current || !selected || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/scenarios/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          questionId: current.id,
          optionId: selected,
        }),
      });

      const data = (await res.json()) as AnswerResponse;

      if (!res.ok || !data.ok) {
        console.error("Answer error:", res.status, data);
        setFeedback({
          shown: true,
          isCorrect: false,
          explanation: data.error ?? "Erreur lors de l’envoi de la réponse.",
        });
        return;
      }

      setFeedback({
        shown: true,
        isCorrect: data.isCorrect,
        explanation: data.explanation,
      });

      setProgress({
        answered: data.answered,
        score: data.score,
        completed: data.completed,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    setFeedback({ shown: false });
    setSelected(null);

    // si on est au dernier, on garde sur écran de fin
    if (idx < questions.length - 1) {
      setIdx((v) => v + 1);
    } else {
      // force affichage écran de fin
      setIdx(questions.length);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border bg-white p-6">
        <p className="text-slate-600">Chargement des scénarios...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="rounded-3xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Scénarios – {categoryLabel(category)}</h1>
        <p className="mt-2 text-slate-600">
          Aucune question disponible pour le moment.
        </p>
        <Link
          href="/categories"
          className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Retour catégories
        </Link>
      </div>
    );
  }

  const finished = idx >= questions.length || progress.completed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Scénarios – {categoryLabel(category)}
          </h1>
          <p className="mt-2 text-slate-600">
            Réponds à 10 questions. Ta progression est enregistrée.
          </p>
        </div>

        <div className="rounded-2xl border bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Progression</p>
          <p className="text-sm font-semibold text-slate-900">
            {progress.answered}/{total} • Score {progress.score}/{total}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-3xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Avancement</p>
          <p className="text-sm font-semibold text-slate-900">{percent}%</p>
        </div>
        <div className="mt-3 h-3 w-full rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-slate-900"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
      </div>

      {/* Content */}
      {!finished ? (
        <div className="rounded-3xl border bg-white p-6">
          <p className="text-xs text-slate-500">
            Question {Math.min(idx + 1, questions.length)} / {questions.length}
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {current.prompt}
          </h2>

          <div className="mt-6 space-y-3">
            {current.options.map((opt) => {
              const active = selected === opt.id;
              const disabled = feedback.shown || submitting;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected(opt.id)}
                  className={[
                    "w-full text-left rounded-2xl border px-4 py-4 transition",
                    active
                      ? "border-slate-900 bg-slate-50"
                      : "hover:bg-slate-50",
                    disabled ? "opacity-80" : "",
                  ].join(" ")}
                >
                  <span className="font-medium text-slate-900">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/categories"
              className="text-sm font-semibold text-slate-700 hover:underline"
            >
              ← Retour catégories
            </Link>

            {!feedback.shown ? (
              <button
                type="button"
                onClick={submitAnswer}
                disabled={!selected || submitting}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "Validation..." : "Valider"}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Suivant →
              </button>
            )}
          </div>

          {/* Feedback */}
          {feedback.shown && (
            <div
              className={[
                "mt-6 rounded-2xl border p-4",
                feedback.isCorrect
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200",
              ].join(" ")}
            >
              <p className="font-semibold">
                {feedback.isCorrect ? "✅ Bonne réponse" : "❌ Mauvaise réponse"}
              </p>
              {feedback.explanation && (
                <p className="mt-2 text-sm text-slate-700">{feedback.explanation}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Catégorie terminée 🎉</h2>
          <p className="mt-2 text-slate-600">
            Score : <span className="font-semibold">{progress.score}</span> / {total}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/profil"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Voir mon profil
            </Link>
            <Link
              href="/categories"
              className="rounded-full border bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Revenir aux catégories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}