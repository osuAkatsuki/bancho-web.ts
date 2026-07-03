import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "@/components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Padded: Story = {
  args: {
    children: (
      <>
        <h2 className="text-lg font-bold">Standard card</h2>
        <p className="mt-1.5 text-sm text-muted">
          Uses the default px-6 py-5 padding. Most content sections use this.
        </p>
      </>
    ),
  },
};

export const EdgeToEdge: Story = {
  args: {
    padded: false,
    children: (
      <ul className="divide-y divide-line/50 text-sm">
        {["Edge-to-edge content", "clips to the rounded corners", "e.g. tables & media rows"].map(
          (label) => (
            <li key={label} className="px-6 py-3">
              {label}
            </li>
          ),
        )}
      </ul>
    ),
  },
};
