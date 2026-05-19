import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-white font-mono flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#1f9e3c] text-xs tracking-[0.4em] uppercase mb-4 animate-pulse">
          Portal gun malfunction
        </p>
        <h1 className="text-8xl font-black text-white mb-2">404</h1>
        <p className="text-[#66fcf1] text-lg mb-2">Character not found</p>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
          This dimension doesn&apos;t exist, or the character was eaten by a Cronenberg.
        </p>
        <Link
          href="/rickmorty"
          className="inline-flex items-center gap-2 bg-[#1f9e3c] text-black text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#25c24a] transition-colors tracking-wider"
        >
          ← Return to Database
        </Link>
      </div>
    </main>
  );
}