export const USER_ROLES = ["founder", "jury", "investor"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** No role is self-selectable. Jury requires admin approval. Founder requires jury approval. Investor requires admin approval. */
export const SELF_SELECTABLE_ROLES = [] as const;
export type SelfSelectableRole = never;

export const ONBOARDING_STATUSES = [
  "role_selected",
  "profile_complete",
  "active",
] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

export const JURY_APPLICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;
export type JuryApplicationStatus = (typeof JURY_APPLICATION_STATUSES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

export function isSelfSelectableRole(
  value: unknown,
): value is SelfSelectableRole {
  return (
    typeof value === "string" &&
    (SELF_SELECTABLE_ROLES as readonly string[]).includes(value)
  );
}

export function isOnboardingStatus(value: unknown): value is OnboardingStatus {
  return (
    typeof value === "string" &&
    (ONBOARDING_STATUSES as readonly string[]).includes(value)
  );
}

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "founder":
      return "/startup";
    case "jury":
      return "/jury";
    case "investor":
      return "/investor";
  }
}
