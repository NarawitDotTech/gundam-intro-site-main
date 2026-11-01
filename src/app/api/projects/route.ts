import { NextResponse } from "next/server";
import { checkPasscode, PASSCODE_HEADER, passcodeErrors } from "@/lib/server/auth";
import { loadProjects, saveProjects, StorageUnavailableError } from "@/lib/server/storage";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return NextResponse.json({ projects: await loadProjects() }, { headers: noStore });
  } catch {
    return NextResponse.json({ error: "Couldn’t read projects." }, { status: 500, headers: noStore });
  }
}

export async function PUT(request: Request) {
  const auth = checkPasscode(request.headers.get(PASSCODE_HEADER));
  if (auth !== "ok") {
    const { status, error } = passcodeErrors[auth];
    return NextResponse.json({ error }, { status, headers: noStore });
  }

  let body: { projects?: unknown };
  try {
    body = (await request.json()) as { projects?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400, headers: noStore });
  }

  try {
    const projects = await saveProjects(body.projects);
    return NextResponse.json({ projects }, { headers: noStore });
  } catch (error) {
    const message =
      error instanceof StorageUnavailableError ? error.message : "Couldn’t save projects.";
    return NextResponse.json({ error: message }, { status: 503, headers: noStore });
  }
}
