import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { ModeSwitcher } from "@/components/ModeSwitcher";
import { modeName } from "@/lib/gamemodes";

const meta: Meta<typeof ModeSwitcher> = {
  title: "osu!/ModeSwitcher",
  component: ModeSwitcher,
};
export default meta;

export const Interactive: StoryObj<typeof ModeSwitcher> = {
  render: () => {
    const [modeId, setModeId] = useState(0);
    return (
      <div className="max-w-3xl space-y-4">
        <ModeSwitcher modeId={modeId} onChange={setModeId} />
        <p className="text-sm text-muted">
          selected: {modeName(modeId)} (mode id {modeId})
        </p>
      </div>
    );
  },
};
