import seedProjects from "../../../data/projects.json";
import { normalizeProjects, type Project } from "@/lib/projects";

/**
 * Where projects are stored:
 * - On Cloudflare Workers: the KV namespace bound as `PROJECTS`.
 *   Without that binding the site still renders (from data/projects.json,
 *   bundled at build time) but saving is refused with a clear message.
 * - Anywhere else (local `next dev` / `next start`): data/projects.json on disk.
 */

const KV_KEY = "projects";
const DATA_FILE = "data/projects.json";

type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

export class StorageUnavailableError extends Error {
  constructor() {
    super(
      "Saving is not set up on Cloudflare yet: bind a KV namespace to this Worker with the variable name PROJECTS.",
    );
  }
}

/** The Worker `env` that @opennextjs/cloudflare stores on globalThis, if we are running on Cloudflare. */
function cloudflareEnv(): Record<string, unknown> | undefined {
  const context = (globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")] as
    | { env?: Record<string, unknown> }
    | undefined;
  return context?.env;
}

function projectsKV(): KVNamespace | undefined {
  const binding = cloudflareEnv()?.PROJECTS as Partial<KVNamespace> | undefined;
  return typeof binding?.get === "function" && typeof binding.put === "function"
    ? (binding as KVNamespace)
    : undefined;
}

/** Read a string setting from process.env or, on Cloudflare, the Worker env (secrets). */
export function readSetting(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;
  const fromWorker = cloudflareEnv()?.[name];
  return typeof fromWorker === "string" && fromWorker ? fromWorker : undefined;
}

export async function loadProjects(): Promise<Project[]> {
  if (cloudflareEnv()) {
    const raw = await projectsKV()?.get(KV_KEY);
    return normalizeProjects(raw ? JSON.parse(raw) : seedProjects);
  }

  try {
    const { readFile } = await import("node:fs/promises");
    return normalizeProjects(JSON.parse(await readFile(DATA_FILE, "utf-8")));
  } catch {
    return normalizeProjects(seedProjects);
  }
}

export async function saveProjects(projects: unknown): Promise<Project[]> {
  const normalized = normalizeProjects(projects);
  const json = JSON.stringify(normalized, null, 2);

  if (cloudflareEnv()) {
    const kv = projectsKV();
    if (!kv) throw new StorageUnavailableError();
    await kv.put(KV_KEY, json);
    return normalized;
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  await mkdir("data", { recursive: true });
  await writeFile(DATA_FILE, json + "\n", "utf-8");
  return normalized;
}
