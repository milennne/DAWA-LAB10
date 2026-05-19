import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Character } from "../../../types/rickmorty";

// ISR: la página se genera en la primera visita y se cachea 10 días.
// Sin generateStaticParams → sin pre-generación en build → sin rate limiting.
// dynamicParams = true (default) permite el renderizado on-demand en producción.
export const revalidate = 864000;

async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 }, // ISR: revalidar cada 10 días
  });

  if (!res.ok) notFound();
  return res.json();
}

const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
  Alive: { color: "text-green-400 border-green-400/30 bg-green-400/10", dot: "bg-green-400", label: "Alive" },
  Dead: { color: "text-red-400 border-red-400/30 bg-red-400/10", dot: "bg-red-500", label: "Dead" },
  unknown: { color: "text-gray-400 border-gray-400/30 bg-gray-400/10", dot: "bg-gray-400", label: "Unknown" },
};

const genderIcon: Record<string, string> = {
  Male: "♂",
  Female: "♀",
  Genderless: "⊘",
  unknown: "?",
};

interface Props {
  params: Promise<{ id: string }>;

}

export default async function CharacterPage({ params }: Props) {
  const { id } = await params;
  const char = await getCharacter(id);

  const status = statusConfig[char.status] ?? statusConfig["unknown"];
  const episodeCount = char.episode.length;
  const firstEpisodeNum = char.episode[0]?.split("/").pop();
  const lastEpisodeNum = char.episode[episodeCount - 1]?.split("/").pop();

  return (
    <main className="min-h-screen bg-[#0b0c10] text-white font-mono">
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          href="/rickmorty"
          className="inline-flex items-center gap-2 text-[#66fcf1] text-xs tracking-widest uppercase hover:text-white transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Database
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[340px_1fr] gap-8">
          {/* Left: image + status */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_#1f9e3c18]">
              <Image
                src={char.image}
                alt={char.name}
                width={600}
                height={600}
                className="w-full object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#0b0c10] to-transparent" />
            </div>

            {/* Status badge */}
            <div
              className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 ${status.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
              <span className="text-sm font-semibold tracking-wider">
                {status.label}
              </span>
            </div>

            {/* Episode count */}
            <div className="bg-[#13151a] border border-white/5 rounded-lg px-4 py-3">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
                Appearances
              </p>
              <p className="text-3xl font-black text-[#66fcf1]">{episodeCount}</p>
              <p className="text-white/40 text-xs mt-0.5">
                Ep. {firstEpisodeNum} → Ep. {lastEpisodeNum}
              </p>
            </div>
          </div>

          {/* Right: info */}
          <div className="space-y-6">
            {/* Name & ID */}
            <div>
              <p className="text-[#1f9e3c] text-xs tracking-[0.4em] uppercase mb-1">
                Character #{char.id}
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
                {char.name}
              </h1>
            </div>

            {/* Core fields grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Species", value: char.species },
                {
                  label: "Gender",
                  value: `${genderIcon[char.gender] ?? "?"} ${char.gender}`,
                },
                { label: "Type", value: char.type || "—" },
                {
                  label: "Created",
                  value: new Date(char.created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-[#13151a] border border-white/5 rounded-lg px-4 py-3 hover:border-[#1f9e3c]/30 transition-colors"
                >
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p className="text-white text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {/* Origin */}
            <div className="bg-[#13151a] border border-white/5 rounded-lg px-4 py-4 hover:border-[#66fcf1]/20 transition-colors">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">
                Origin
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[#66fcf1] text-lg">◎</span>
                <div>
                  <p className="text-white font-semibold">{char.origin.name}</p>
                  {char.origin.url && (
                    <p className="text-white/30 text-xs truncate">{char.origin.url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Last known location */}
            <div className="bg-[#13151a] border border-white/5 rounded-lg px-4 py-4 hover:border-[#66fcf1]/20 transition-colors">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">
                Last Known Location
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[#1f9e3c] text-lg">⌖</span>
                <div>
                  <p className="text-white font-semibold">{char.location.name}</p>
                  {char.location.url && (
                    <p className="text-white/30 text-xs truncate">{char.location.url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* API URL */}
            <div className="bg-[#13151a] border border-white/5 rounded-lg px-4 py-3">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
                API Resource
              </p>
              <p className="text-[#66fcf1]/60 text-xs break-all font-mono">{char.url}</p>
            </div>

            {/* Episodes list */}
            <div className="bg-[#13151a] border border-white/5 rounded-lg px-4 py-4">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">
                Episode URLs ({episodeCount} total)
              </p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {char.episode.map((epUrl) => {
                  const epNum = epUrl.split("/").pop();
                  return (
                    <a
                      key={epUrl}
                      href={epUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0b0c10] border border-white/10 text-[#1f9e3c] text-xs rounded px-2 py-0.5 hover:border-[#1f9e3c] transition-colors"
                    >
                      EP{epNum}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}