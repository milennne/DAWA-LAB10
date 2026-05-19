"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Character, ApiResponse } from "../../types/rickmorty";

const statusOptions = ["", "alive", "dead", "unknown"];
const genderOptions = ["", "female", "male", "genderless", "unknown"];

const statusColor: Record<string, string> = {
  Alive: "bg-green-400",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default function SearchCharacters() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // CSR: búsqueda en tiempo real con useEffect + fetch en el cliente
  useEffect(() => {
    const hasFilter = name || status || type || gender;
    if (!hasFilter) {
      setResults([]);
      setHasSearched(false);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      setHasSearched(true);

      try {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (status) params.append("status", status);
        if (type) params.append("type", type);
        if (gender) params.append("gender", gender);

        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${params.toString()}`
        );

        if (res.status === 404) {
          setResults([]);
          setError("No characters found for that search.");
        } else if (!res.ok) {
          throw new Error("API error");
        } else {
          const data: ApiResponse = await res.json();
          setResults(data.results);
        }
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(timer);
  }, [name, status, type, gender]);

  return (
    <section className="mb-12">
      <h2 className="text-[#66fcf1] text-xs tracking-[0.3em] uppercase mb-4 border-b border-[#66fcf1]/20 pb-2">
        Search Characters — Real Time (CSR)
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          placeholder="Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#13151a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 placeholder-white/30 focus:outline-none focus:border-[#1f9e3c] transition-colors"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#13151a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#1f9e3c] transition-colors"
        >
          <option value="">Status</option>
          {statusOptions.slice(1).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Type..."
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-[#13151a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 placeholder-white/30 focus:outline-none focus:border-[#1f9e3c] transition-colors"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="bg-[#13151a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#1f9e3c] transition-colors"
        >
          <option value="">Gender</option>
          {genderOptions.slice(1).map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center gap-2 text-[#1f9e3c] text-sm py-4">
          <span className="w-4 h-4 border-2 border-[#1f9e3c] border-t-transparent rounded-full animate-spin" />
          Scanning the multiverse...
        </div>
      )}

      {error && !loading && (
        <p className="text-red-400 text-sm py-4">{error}</p>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-white/40 text-xs mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((char) => (
              <Link
                key={char.id}
                href={`/rickmorty/${char.id}`}
                className="group bg-[#13151a] border border-[#1f9e3c]/30 rounded-xl overflow-hidden hover:border-[#1f9e3c] hover:shadow-[0_0_20px_#1f9e3c22] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusColor[char.status] ?? "bg-gray-400"}`}
                    />
                    <span className="text-[9px] text-white/80">{char.status}</span>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-white text-xs font-bold truncate">{char.name}</p>
                  <p className="text-white/40 text-[10px] truncate mt-0.5">{char.species}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {!loading && hasSearched && results.length === 0 && !error && (
        <p className="text-white/30 text-sm py-4">No results.</p>
      )}
    </section>
  );
}