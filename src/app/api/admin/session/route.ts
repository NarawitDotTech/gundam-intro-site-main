import { NextResponse } from "next/server";
import { checkPasscode, passcodeErrors } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/** Verifies the admin passcode so the editor can unlock. Saving re-checks it on every request. */
export async function POST(request: Request) {
  let passcode: unknown;
  try {
    ({ passcode } = (await request.json()) as { passcode?: unknown });
  } catch {
    passcode = undefined;
  }

  const result = checkPasscode(typeof passcode === "string" ? passcode : undefined);
  if (result === "ok") return NextResponse.json({ ok: true });

  const { status, error } = passcodeErrors[result];
  return NextResponse.json({ error }, { status });
}
