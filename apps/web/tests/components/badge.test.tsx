import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders default variant", () => {
    render(<Badge>Active</Badge>);
    const badge = screen.getByText("Active");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-teal-500");
  });

  it("renders secondary variant", () => {
    render(<Badge variant="secondary">Pending</Badge>);
    const badge = screen.getByText("Pending");
    expect(badge.className).toContain("bg-zinc-700");
  });

  it("renders destructive variant", () => {
    render(<Badge variant="destructive">Failed</Badge>);
    const badge = screen.getByText("Failed");
    expect(badge.className).toContain("bg-red-600");
  });
});
