import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Pagination } from "@/components/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "UI/Pagination",
  component: Pagination,
};
export default meta;

export const Interactive: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} hasNextPage={page < 5} onPageChange={setPage} />;
  },
};
