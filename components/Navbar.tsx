"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/categories", label: "Catégories" },
  { href: "/apprendre", label: "Apprendre" },
  { href: "/scenarios", label: "Scénarios" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-1.5 text-sm transition",
        active
          ? "text-zinc-900 bg-zinc-900/5"
          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-900/5",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900 text-white text-sm font-semibold">
            SC
          </span>
          <span className="font-semibold tracking-tight">SafeClicks</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
          {status !== "loading" && session && (
            <NavLink href="/dashboard" label="Dashboard" />
          )}
        </nav>

        <div className="flex items-center gap-2">
          {status === "loading" ? null : session ? (
            <>
              <Link
                href="/profil"
                className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-900/5"
              >
                {session.user?.email ?? "Profil"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-900/5"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>

      {/* mobile */}
      <div className="md:hidden border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-2 flex gap-2 overflow-x-auto">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
          {status !== "loading" && session && (
            <NavLink href="/dashboard" label="Dashboard" />
          )}
          <NavLink href="/profil" label="Profil" />
        </div>
      </div>
    </header>
  );
}
