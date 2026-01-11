"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Catégories", href: "/categories" },
  { label: "Apprendre", href: "/learn" },
  { label: "Scénarios", href: "/scenarios" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const username =
    session?.user?.name?.toString().trim() ||
    session?.user?.email?.split("@")[0] ||
    "";

  const avatarLetter = username ? username[0]?.toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/safeclick_logo.svg"
            alt="SafeClicks"
            className="h-14 w-auto"
          />
          <span className="font-semibold text-slate-900">SafeClick</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium",
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {status === "loading" ? null : session ? (
            <>
              {/* Profil (cliquable) */}
              <Link
                href="/profil"
                className="hidden sm:flex items-center gap-2 rounded-xl border bg-white px-3 py-2 transition hover:bg-slate-50 hover:shadow-sm"
                title="Voir mon profil"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {avatarLetter}
                </div>

                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">
                    {username}
                  </p>
                  <p className="text-xs text-slate-500">Voir mon profil</p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="mx-auto block max-w-6xl px-4 pb-3 md:hidden">
        <div className="mb-3">
          {status === "loading" ? null : session ? (
            <div className="flex items-center justify-between rounded-2xl border bg-white px-3 py-2">
              {/* Profil mobile cliquable */}
              <Link
                href="/profil"
                className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-slate-50"
                title="Voir mon profil"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {avatarLetter}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{username}</p>
                  <p className="text-xs text-slate-500">Voir mon profil</p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              >
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-3 py-1.5 text-sm",
                  active ? "bg-slate-100" : "bg-white hover:bg-slate-50",
                  "border text-slate-700",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
