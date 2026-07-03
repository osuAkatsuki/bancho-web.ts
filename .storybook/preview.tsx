import type { Preview } from "@storybook/react";
import React from "react";

import "../src/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#0d0e12" },
        { name: "surface", value: "#15161c" },
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
