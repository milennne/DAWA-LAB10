"use client";

import Link from "next/link";
import { IoWarningOutline } from "react-icons/io5";
import { GiPortal } from "react-icons/gi";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-8">
        <GiPortal size={80} className="text-[#00ff64]/20" />
        <IoWarningOutline
          size={36}
          className="text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <p className="text-[#00ff64] font-mono text-xs tracking-widest mb-3">
        // ERROR DEL SISTEMA
      </p>
      <h1 className="text-4xl font-black text-white mb-3">
        Portal Colapsado
      </h1>
      <p className="text-white/40 font-mono text-sm mb-8 max-w-sm">
        Hubo un problema al conectar con la dimensión. Intenta de nuevo o vuelve al inicio.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-[#00ff64]/10 border border-[#00ff64]/30 text-[#00ff64] font-mono text-sm px-6 py-3 rounded-xl hover:bg-[#00ff64]/20 transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/rickmorty"
          className="bg-[#ffffff]/5 border border-[#ffffff]/10 text-white/70 font-mono text-sm px-6 py-3 rounded-xl hover:bg-[#ffffff]/10 transition-colors"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}