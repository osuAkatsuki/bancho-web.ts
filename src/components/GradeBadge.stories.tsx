import type { Meta, StoryObj } from "@storybook/react";

import { GradeBadge } from "@/components/GradeBadge";

const meta: Meta<typeof GradeBadge> = {
  title: "osu!/GradeBadge",
  component: GradeBadge,
};
export default meta;

export const AllGrades: StoryObj<typeof GradeBadge> = {
  render: () => (
    <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-6 py-5">
      {["XH", "X", "SH", "S", "A", "B", "C", "D", "F"].map((grade) => (
        <GradeBadge key={grade} grade={grade} />
      ))}
    </div>
  ),
};
