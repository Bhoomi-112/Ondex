export type UserRole = "founder" | "investor";

export type OnboardingStatus =
  | "role_selected"
  | "profile_complete"
  | "active";

export type AuthUser = {
  id: string;
  wallet: string | null;
  email: string | null;
  role: UserRole | null;
  onboardingStatus: OnboardingStatus;
  displayName: string | null;
  bio: string | null;
  dashboardPath: string | null;
};

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "founder":
      return "/startup";
    case "investor":
      return "/investor";
  }
}

export const ROLE_ROUTE_MAP: Record<UserRole, string> = {
  founder: "/startup",
  investor: "/investor",
};