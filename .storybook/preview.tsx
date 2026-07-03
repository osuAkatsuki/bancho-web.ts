import type { Preview } from "@storybook/react";
import React from "react";

import "../src/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "base",
      values: [
        { name: "base", value: "#17131d" },
        { name: "surface", value: "#221c2b" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 font-sans text-slate-100 antialiased">
        <Story />
      </div>
    ),
  ],
};

export default preview;
