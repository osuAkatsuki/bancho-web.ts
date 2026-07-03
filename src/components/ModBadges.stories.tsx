import type { Meta, StoryObj } from "@storybook/react";

import { ModBadges } from "@/components/ModBadges";
import { Mods } from "@/lib/mods";

const meta: Meta<typeof ModBadges> = {
  title: "osu!/ModBadges",
  component: ModBadges,
  argTypes: {
    mods: { control: { type: "number" } },
  },
};
export default meta;

type Story = StoryObj<typeof ModBadges>;

export const HiddenDoubleTime: Story = {
  args: { mods: Mods.HIDDEN | Mods.DOUBLETIME },
};

export const NightcoreImpliesDoubleTime: Story = {
  args: { mods: Mods.NIGHTCORE | Mods.DOUBLETIME | Mods.HIDDEN },
};

export const RelaxHardRockFlashlight: Story = {
  args: { mods: Mods.RELAX | Mods.HARDROCK | Mods.FLASHLIGHT },
};

export const NoMod: Story = {
  args: { mods: 0 },
};
