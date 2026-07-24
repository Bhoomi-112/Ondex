export const USER_ROLES = ["founder", "investor"] as const;
export type UserRole = (typeof USER_ROLES)[number];