import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { PillTabs } from "@/components/ui/PillTabs";

const meta: Meta<typeof PillTabs> = {
  title: "UI/PillTabs",
  component: PillTabs,
};
export default meta;

type Story = StoryObj<typeof PillTabs>;

function Interactive(props: {
  variant?: "accent" | "neutral";
  grow?: boolean;
  withDisabled?: boolean;
}) {
  const [value, setValue] = useState("one");
  return (
    <div className="max-w-md">
      <PillTabs
        tabs={[
          { value: "one", label: "osu!" },
          { value: "two", label: "osu!taiko" },
          { value: "three", label: "osu!catch", disabled: props.withDisabled },
        ]}
        value={value}
        onChange={setValue}
        variant={props.variant}
        grow={props.grow}
      />
    </div>
  );
}

export const Accent: Story = {
  render: () => <Interactive variant="accent" />,
};

export const Neutral: Story = {
  render: () => <Interactive variant="neutral" />,
};

export const GrowWithDisabled: Story = {
  render: () => <Interactive variant="neutral" grow withDisabled />,
};
