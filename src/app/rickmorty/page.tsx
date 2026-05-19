import Image from "next/image";
import Link from "next/link";
import { ApiResponse, Character } from "@/types/rickmorty";
import SearchCharacters from "./SearchCharacters";

// SSR + SSG: fetch con cache forzado (force-cache = SSG behavior)
// Justificación: La lista de personajes no cambia frecuentemente,
// por lo que forzar caché evita peticiones repetidas al servidor.
async function getAllCharacters(): Promise<Character[]> {
  const allCharacters: Character[] = [];
  let url: string | null = "https://rickandmortyapi.com/api/character";

  while (url) {
    const res = await fetch(url, {
      cache: "force-cache", // SSG: cachear indefinidamente hasta revalidación
    });
    if (!res.ok) break;
    const data: ApiResponse = await res.json();
    allCharacters.push(...data.results);
    url = data.info.next;
  }

  return allCharacters;
}

const statusColor: Record<string, string> = {
  Alive: "bg-green-400",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default async function RickMortyPage() {
  const characters = await getAllCharacters();

  return (
    <main className="min-h-screen bg-[#0b0c10] text-white font-mono">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-[#1f9e3c]/30 bg-[#0b0c10]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1f9e3c22_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 text-center">
          <p className="text-[#1f9e3c] text-xs tracking-[0.4em] uppercase mb-3 animate-pulse">
            Wubba Lubba Dub Dub
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
            RICK & MORTY
          </h1>
          <p className="text-[#66fcf1] text-sm tracking-widest uppercase mt-2">
            Character Database — {characters.length} entries
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search component (CSR) */}
        <SearchCharacters />

        {/* Static grid (SSG) */}
        <section>
          <h2 className="text-[#66fcf1] text-xs tracking-[0.3em] uppercase mb-6 border-b border-[#66fcf1]/20 pb-2">
            All Characters — Static (SSG)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {characters.map((char) => (
              <Link
                key={char.id}
                href={`/rickmorty/${char.id}`}
                className="group relative bg-[#13151a] border border-white/5 rounded-xl overflow-hidden hover:border-[#1f9e3c]/60 hover:shadow-[0_0_20px_#1f9e3c22] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Lazy loading image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy" // Lazy loading bajo demanda
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Status badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusColor[char.status] ?? "bg-gray-400"}`}
                    />
                    <span className="text-[9px] text-white/80 font-medium">
                      {char.status}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-white text-xs font-bold truncate leading-tight">
                    {char.name}
                  </p>
                  <p className="text-white/40 text-[10px] truncate mt-0.5">
                    {char.species}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}