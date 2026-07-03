import { PillTabs } from "@/components/ui/PillTabs";
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
 * Two-part game mode picker: base mode (osu!/taiko/catch/mania) plus
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
      <PillTabs
        variant="accent"
        tabs={BASE_MODES.map((mode) => ({
          value: mode.baseMode,
          label: mode.name,
        }))}
        value={baseMode}
        onChange={selectBaseMode}
      />
      <PillTabs
        tabs={SUBMODES.map((entry) => ({
          value: entry.submode,
          label: entry.name,
          disabled: toModeId(baseMode, entry.submode) === null,
        }))}
        value={submode}
        onChange={selectSubmode}
      />
    </div>
  );
}
