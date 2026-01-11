"use client";

import { useState } from "react";

export default function AccountSettings({ currentEmail }: { currentEmail: string }) {
  // Email
  const [email, setEmail] = useState(currentEmail);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  async function updateEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailMsg(null);
    setLoadingEmail(true);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEmailMsg(data?.error ?? "Erreur lors de la mise à jour");
        return;
      }
      setEmailMsg("Email mis à jour ✅ (reconnecte-toi si besoin)");
    } finally {
      setLoadingEmail(false);
    }
  }

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwdMsg(null);
    setLoadingPwd(true);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwdMsg(data?.error ?? "Erreur lors de la mise à jour");
        return;
      }

      setPwdMsg("Mot de passe mis à jour ✅");
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setLoadingPwd(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Email */}
      <form onSubmit={updateEmail} className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Changer l’email</p>

        <input
          className="w-full rounded-xl border px-4 py-3"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Nouvel email"
        />

        <button
          disabled={loadingEmail}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loadingEmail ? "Mise à jour..." : "Enregistrer l’email"}
        </button>

        {emailMsg && <p className="text-sm text-slate-700">{emailMsg}</p>}
      </form>

      <div className="h-px bg-slate-100" />

      {/* Password */}
      <form onSubmit={updatePassword} className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Changer le mot de passe</p>

        <input
          className="w-full rounded-xl border px-4 py-3"
          type="password"
          value={currentPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCurrentPassword(e.target.value)
          }
          placeholder="Mot de passe actuel"
        />

        <input
          className="w-full rounded-xl border px-4 py-3"
          type="password"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
          placeholder="Nouveau mot de passe (min 6)"
        />

        <button
          disabled={loadingPwd}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loadingPwd ? "Mise à jour..." : "Enregistrer le mot de passe"}
        </button>

        {pwdMsg && <p className="text-sm text-slate-700">{pwdMsg}</p>}
      </form>
    </div>
  );
}