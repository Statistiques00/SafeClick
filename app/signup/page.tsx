"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Captcha = { a: number; b: number };

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Captcha local (addition)
  const [captcha, setCaptcha] = useState<Captcha>(() => makeCaptcha());
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // Honeypot (doit rester vide)
  const [website, setWebsite] = useState("");

  // Anti-bot : timestamp d’ouverture du formulaire
  const startedAt = useMemo(() => Date.now(), []);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function refreshCaptcha() {
    setCaptcha(makeCaptcha());
    setCaptchaAnswer("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Honeypot : si rempli => bot
      if (website.trim().length > 0) {
        setError("Erreur lors de l'inscription.");
        return;
      }

      // Anti-bot : trop rapide (ex: < 800ms)
      if (Date.now() - startedAt < 800) {
        setError("Merci de réessayer (validation anti-bot).");
        refreshCaptcha();
        return;
      }

      // Captcha local
      const expected = captcha.a + captcha.b;
      const got = Number.parseInt(captchaAnswer, 10);
      if (!Number.isFinite(got) || got !== expected) {
        setError("Captcha incorrect.");
        refreshCaptcha();
        return;
      }

      // validations simples
      const cleanUsername = username.trim();
      const cleanEmail = email.trim().toLowerCase();
      if (cleanUsername.length < 3) {
        setError("Le nom d'utilisateur doit faire au moins 3 caractères.");
        return;
      }
      if (!cleanEmail.includes("@")) {
        setError("Email invalide.");
        return;
      }
      if (password.length < 6) {
        setError("Le mot de passe doit faire au moins 6 caractères.");
        return;
      }

      // 1) créer le compte
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          email: cleanEmail,
          password,
          captcha: { a: captcha.a, b: captcha.b, answer: got },
          // honeypot + timing envoyés aussi (optionnel mais utile)
          website,
          startedAt,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log("Signup API error:", res.status, data);
        setError(
          data?.error ??
            data?.message ??
            `Erreur lors de l'inscription (HTTP ${res.status})`
        );
        refreshCaptcha();
        return;
      }

      // 2) se connecter automatiquement
      const login = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (login?.error) {
        setError("Compte créé, mais connexion échouée. Va sur /login.");
        return;
      }

      // 3) aller au dashboard
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Inscription</h1>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Nom d’utilisateur"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          autoComplete="username"
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          autoComplete="email"
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Mot de passe (min 6)"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          autoComplete="new-password"
        />

        {/* Honeypot invisible (anti-bot) */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input
              value={website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWebsite(e.target.value)
              }
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {/* Captcha local */}
        <div className="rounded border p-3 space-y-2">
          <p className="text-sm text-gray-700">
            Vérification : combien font <b>{captcha.a}</b> + <b>{captcha.b}</b> ?
          </p>

          <div className="flex gap-2">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Réponse"
              inputMode="numeric"
              value={captchaAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCaptchaAnswer(e.target.value)
              }
            />
            <button
              type="button"
              onClick={refreshCaptcha}
              className="rounded border px-3 py-2 text-sm"
            >
              ↻
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer un compte"}
        </button>

        {error && <p className="text-red-600">{error}</p>}

        <p className="text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link className="underline" href="/login">
            Se connecter
          </Link>
        </p>
      </form>
    </main>
  );
}

function makeCaptcha(): Captcha {
  const a = Math.floor(Math.random() * 8) + 1; // 1..8
  const b = Math.floor(Math.random() * 8) + 1; // 1..8
  return { a, b };
}