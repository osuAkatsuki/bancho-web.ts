import { getModAcronyms } from "@/lib/mods";

interface ModBadgesProps {
  mods: number;
}

export function ModBadges({ mods }: ModBadgesProps) {
  const acronyms = getModAcronyms(mods);
  if (acronyms.length === 0) return null;

  return (
    <span className="inline-flex gap-1">
      {acronyms.map((acronym) => (
        <span
          key={acronym}
          className="rounded bg-surface-3 px-1.5 py-0.5 text-[11px] font-semibold text-slate-200"
        >
          {acronym}
        </span>
      ))}
    </span>
  );
}
