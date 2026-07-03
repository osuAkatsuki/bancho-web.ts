import {
  BASE_MODES,
  SUBMODES,
  splitModeId,
  toModeId,
  type Submode,
} from "@/lib/gamemodes";

interface ModeSwitcherProps {
  modeId: number;
  onChange: (modeId: number) => void;
}

/**
 * Two-row game mode picker: base mode (osu!/taiko/catch/mania) plus
 * submode (Vanilla/Relax/Autopilot), hiding invalid combinations.
 */
export function ModeSwitcher({ modeId, onChange }: ModeSwitcherProps) {
  const { baseMode, submode } = splitModeId(modeId);

  function selectBaseMode(nextBaseMode: number) {
    // fall back to vanilla when the submode doesn't exist for the mode
    onChange(toModeId(nextBaseMode, submode) ?? nextBaseMode);
  }

  function selectSubmode(nextSubmode: Submode) {
    const nextModeId = toModeId(baseMode, nextSubmode);
    if (nextModeId !== null) onChange(nextModeId);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex rounded-xl bg-surface p-1">
        {BASE_MODES.map((mode) => (
          <button
            key={mode.baseMode}
            type="button"
            onClick={() => selectBaseMode(mode.baseMode)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              baseMode === mode.baseMode
                ? "bg-accent text-white"
                : "text-muted hover:text-slate-100"
            }`}
          >
            {mode.name}
          </button>
        ))}
      </div>

      <div className="flex rounded-xl bg-surface p-1">
        {SUBMODES.map((entry) => {
          const valid = toModeId(baseMode, entry.submode) !== null;
          return (
            <button
              key={entry.submode}
              type="button"
              disabled={!valid}
              onClick={() => selectSubmode(entry.submode)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                submode === entry.submode
                  ? "bg-surface-3 text-slate-100"
                  : valid
                    ? "text-muted hover:text-slate-100"
                    : "cursor-not-allowed text-muted/40"
              }`}
            >
              {entry.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
