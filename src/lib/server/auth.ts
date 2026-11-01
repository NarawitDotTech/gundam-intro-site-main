import { readSetting } from "@/lib/server/storage";

export const PASSCODE_HEADER = "x-admin-passcode";

export type PasscodeCheck = "ok" | "wrong" | "not-configured";

/** Compare without leaking the match position through timing. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function checkPasscode(candidate: string | null | undefined): PasscodeCheck {
  const expected = readSetting("ADMIN_PASSCODE");
  if (!expected) return "not-configured";
  return candidate && safeEqual(candidate, expected) ? "ok" : "wrong";
}

export const passcodeErrors: Record<Exclude<PasscodeCheck, "ok">, { status: number; error: string }> = {
  wrong: { status: 401, error: "That passcode is wrong." },
  "not-configured": {
    status: 503,
    error: "Admin is not set up: add an ADMIN_PASSCODE secret to the server.",
  },
};
