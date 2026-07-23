import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { defaultProjects, normalizeProjects } from "@/lib/projects";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "projects.json");

async function readProjectsFromFile() {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return normalizeProjects(JSON.parse(raw));
  } catch {
    const fallback = normalizeProjects(defaultProjects);
    await writeProjectsToFile(fallback);
    return fallback;
  }
}

async function writeProjectsToFile(projects: unknown) {
  const normalized = normalizeProjects(projects);
  await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

export async function GET() {
  const projects = await readProjectsFromFile();
  return NextResponse.json({ projects }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { projects?: unknown };
    const projects = await writeProjectsToFile(body.projects);
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
