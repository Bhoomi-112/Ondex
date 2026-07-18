import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("Card", () => {
  it("renders with children", () => {
    render(<Card data-testid="card">Content inside</Card>);
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Content inside");
  });

  it("CardHeader renders", () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("CardTitle renders as expected text", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("CardContent renders children", () => {
    render(<CardContent>Card body</CardContent>);
    expect(screen.getByText("Card body")).toBeInTheDocument();
  });
});
