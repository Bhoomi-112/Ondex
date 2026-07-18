import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders a div", () => {
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId("skeleton");
    expect(el.tagName).toBe("DIV");
  });

  it("accepts custom className", () => {
    render(<Skeleton className="h-10 w-20" data-testid="skeleton" />);
    const el = screen.getByTestId("skeleton");
    expect(el.className).toContain("h-10");
    expect(el.className).toContain("w-20");
  });
});
