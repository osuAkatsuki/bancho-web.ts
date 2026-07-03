import type { Meta, StoryObj } from "@storybook/react";

import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { ApiError } from "@/lib/api/http";

const meta: Meta = {
  title: "UI/States",
};
export default meta;

export const Loading: StoryObj = {
  render: () => <LoadingState label="Loading leaderboard..." />,
};

export const Error: StoryObj = {
  render: () => <ErrorState error={new ApiError("Player not found.", 404)} />,
};

export const Empty: StoryObj = {
  render: () => <EmptyState label="No ranked scores for this mode yet." />,
};
