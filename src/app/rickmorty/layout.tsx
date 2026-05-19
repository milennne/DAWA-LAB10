import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rick & Morty — Character Database",
  description: "Browse all Rick and Morty characters across the multiverse.",
};

export default function RickMortyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}