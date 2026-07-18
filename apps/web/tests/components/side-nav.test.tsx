import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SideNav } from "@/components/layout/side-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app/startup",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("SideNav", () => {
  it("shows startup nav items when role=startup", () => {
    render(<SideNav role="startup" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
    expect(screen.getByText("Identity")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("shows jury nav items when role=jury", () => {
    render(<SideNav role="jury" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Assigned Cases")).toBeInTheDocument();
    expect(screen.getByText("Voting History")).toBeInTheDocument();
    expect(screen.getByText("Stake")).toBeInTheDocument();
  });

  it("shows investor nav items when role=investor", () => {
    render(<SideNav role="investor" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Campaigns")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("highlights active route", () => {
    render(<SideNav role="startup" />);
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink?.className).toContain("text-teal-400");
    expect(dashboardLink?.className).toContain("bg-teal-500/10");
  });
});
