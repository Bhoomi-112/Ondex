import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-teal-500");
  });

  it("renders with destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole("button", { name: /delete/i });
    expect(btn.className).toContain("bg-red-600");
  });

  it("renders with outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: /outline/i });
    expect(btn.className).toContain("border-zinc-700");
  });

  it("renders with sm size", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole("button", { name: /small/i });
    expect(btn.className).toContain("h-8");
  });

  it("renders as icon size", () => {
    render(<Button size="icon">Icon</Button>);
    const btn = screen.getByRole("button", { name: /icon/i });
    expect(btn.className).toContain("h-10");
    expect(btn.className).toContain("w-10");
  });

  it("passes through className", () => {
    render(<Button className="extra-class">Styled</Button>);
    const btn = screen.getByRole("button", { name: /styled/i });
    expect(btn.className).toContain("extra-class");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: /disabled/i });
    expect(btn).toBeDisabled();
  });
});
