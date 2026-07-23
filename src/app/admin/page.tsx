"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LoginGate } from "@/components/admin/login-gate";
import { ProjectEditor } from "@/components/admin/project-editor";
import { Toast, type ToastData } from "@/components/admin/toast";
import {
  AlertIcon,
  FolderIcon,
  HomeIcon,
  LogoMark,
  LogoutIcon,
  PlusIcon,
  ResetIcon,
  SaveIcon,
  SpinnerIcon,
} from "@/components/icons";
import { SiteBackground } from "@/components/site-background";
import {
  ADMIN_CODE,
  defaultProjects,
  normalizeProjects,
  updateProjects,
  type Project,
} from "@/lib/projects";
import { countCompleted } from "@/lib/site";

type Phase = "locked" | "loading" | "ready";

function createEmptyProject(): Project {
  return {
    id: `project-${Date.now()}`,
    name: "New Project",
    progress: "Planning",
    description: "Describe this project...",
    isCurrent: false,
  };
}

function cloneProjects(projects: Project[]): Project[] {
  return projects.map((project) => ({ ...project }));
}

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("locked");
  const [authError, setAuthError] = useState("");
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(defaultProjects));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resetArmed, setResetArmed] = useState(false);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(projects) !== snapshot, [projects, snapshot]);

  const currentProject = useMemo(
    () => projects.find((item) => item.isCurrent) ?? projects[0],
    [projects],
  );

  const showToast = (type: ToastData["type"], message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  /* Disarm the two-step delete confirm */
  useEffect(() => {
    if (!armedDeleteId) return;
    const timeoutId = window.setTimeout(() => setArmedDeleteId(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [armedDeleteId]);

  /* Disarm the two-step reset confirm */
  useEffect(() => {
    if (!resetArmed) return;
    const timeoutId = window.setTimeout(() => setResetArmed(false), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [resetArmed]);

  /* Warn before leaving with unsaved changes */
  useEffect(() => {
    if (!isDirty || phase !== "ready") return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, phase]);

  /* Scroll to and focus a freshly added project */
  useEffect(() => {
    if (!lastAddedId) return;
    document
      .getElementById(`project-card-${lastAddedId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    const input = document.getElementById(`project-name-${lastAddedId}`);
    if (input instanceof HTMLInputElement) {
      input.focus({ preventScroll: true });
      input.select();
    }
    setLastAddedId(null);
  }, [lastAddedId, projects]);

  const loadProjects = async (): Promise<void> => {
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      if (!response.ok) throw new Error("Request failed");
      const data = (await response.json()) as { projects?: unknown };
      const loaded = normalizeProjects(data.projects);
      setProjects(loaded);
      setSnapshot(JSON.stringify(loaded));
      setLoadError(null);
    } catch {
      const fallback = cloneProjects(defaultProjects);
      setProjects(fallback);
      setSnapshot(JSON.stringify(fallback));
      setLoadError("Couldn’t load saved projects — you’re seeing the default set.");
    }
  };

  const handleUnlock = async (code: string) => {
    if (code !== ADMIN_CODE) {
      setAuthError("Wrong code. Try again.");
      return;
    }

    setAuthError("");
    setPhase("loading");
    await loadProjects();
    setPhase("ready");
  };

  const retryLoad = async () => {
    setPhase("loading");
    await loadProjects();
    setPhase("ready");
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    );
  };

  const setCurrentProject = (id: string) => {
    setProjects((prev) =>
      prev.map((project) => ({ ...project, isCurrent: project.id === id })),
    );
  };

  const removeProject = (id: string) => {
    setArmedDeleteId(null);
    setProjects((prev) => {
      const next = prev.filter((project) => project.id !== id);
      if (next.length === 0) {
        return [{ ...createEmptyProject(), isCurrent: true }];
      }

      if (!next.some((project) => project.isCurrent)) {
        next[0].isCurrent = true;
      }

      return next;
    });
  };

  const addProject = () => {
    const project = createEmptyProject();
    setProjects((prev) => [...prev, project]);
    setLastAddedId(project.id);
  };

  const saveAll = async () => {
    setSaving(true);
    const success = await updateProjects(projects);
    setSaving(false);

    if (success) {
      setSnapshot(JSON.stringify(projects));
      showToast("success", "Changes published — live on the site.");
    } else {
      showToast("error", "Save failed. Please try again.");
    }
  };

  const resetDefaults = () => {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    setResetArmed(false);
    setProjects(cloneProjects(defaultProjects));
    showToast("success", "Restored the default project set.");
  };

  const lock = () => {
    setPhase("locked");
    setAuthError("");
    setLoadError(null);
    setToast(null);
  };

  const isLoading = phase === "loading";

  return (
    <>
      <SiteBackground />

      {phase === "locked" ? (
        <main className="relative z-10">
          <LoginGate
            isLoading={false}
            authError={authError}
            onUnlock={handleUnlock}
            onCodeChange={() => setAuthError("")}
          />
        </main>
      ) : (
        <div className="relative z-10 min-h-svh">
          {/* ---------- Command bar ---------- */}
          <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-3 px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex items-center gap-2 text-zinc-100">
                  <LogoMark className="h-6 w-6 shrink-0 text-accent-400" />
                  <span className="hidden text-sm font-bold tracking-[0.18em] uppercase sm:inline">
                    Admin
                  </span>
                </span>
                <span
                  className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase sm:inline-flex ${
                    isDirty
                      ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
                      : "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${isDirty ? "bg-amber-300" : "bg-emerald-300"}`}
                  />
                  {isDirty ? "Unsaved changes" : "All changes saved"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addProject}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-all hover:border-accent-400/40 hover:text-accent-200 disabled:opacity-40"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={saving || isLoading || !isDirty}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-400 px-4 py-2 text-xs font-bold text-ink-950 transition-all hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? <SpinnerIcon className="h-3.5 w-3.5" /> : <SaveIcon className="h-3.5 w-3.5" />}
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetDefaults}
                  disabled={isLoading}
                  title="Restore default projects"
                  aria-label="Restore default projects"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all disabled:opacity-40 ${
                    resetArmed
                      ? "border-rose-400/70 bg-rose-400/25 text-rose-100"
                      : "border-white/12 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-zinc-100"
                  }`}
                >
                  <ResetIcon className="h-3.5 w-3.5" />
                  {resetArmed ? <span className="hidden sm:inline">Confirm?</span> : null}
                </button>
                <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/10" />
                <Link
                  href="/"
                  title="View site"
                  aria-label="View site"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/5 text-zinc-400 transition-all hover:border-accent-400/40 hover:text-accent-200"
                >
                  <HomeIcon className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={lock}
                  title="Lock console"
                  aria-label="Lock console"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/5 text-zinc-400 transition-all hover:border-rose-300/40 hover:text-rose-300"
                >
                  <LogoutIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-4xl px-6 py-10 pb-24">
            {/* ---------- Heading ---------- */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-[0.3em] text-accent-300 uppercase">
                  Content manager
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50">
                  Projects
                </h1>
                <p className="mt-2 max-w-lg text-sm text-zinc-400">
                  Edit the projects shown on your site, then hit Save to publish
                  them globally.
                </p>
              </div>
            </div>

            {/* ---------- Stats ---------- */}
            <dl className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-4 backdrop-blur-sm">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  Total
                </dt>
                <dd className="mt-1.5 text-2xl font-bold text-zinc-100">
                  {isLoading ? "—" : projects.length}
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-4 backdrop-blur-sm">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  Current
                </dt>
                <dd className="mt-1.5 truncate text-sm leading-7 font-semibold text-accent-300">
                  {isLoading ? "—" : (currentProject?.name ?? "—")}
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-4 backdrop-blur-sm">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  Shipped
                </dt>
                <dd className="mt-1.5 text-2xl font-bold text-zinc-100">
                  {isLoading ? "—" : countCompleted(projects)}
                </dd>
              </div>
            </dl>

            {/* ---------- Load error banner ---------- */}
            {loadError ? (
              <div
                role="alert"
                className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/8 px-5 py-4"
              >
                <p className="flex items-center gap-2 text-sm text-amber-200">
                  <AlertIcon className="h-4 w-4 shrink-0" />
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={retryLoad}
                  className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-1.5 text-xs font-semibold text-amber-100 transition-all hover:bg-amber-300/20"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {/* ---------- Project list ---------- */}
            <div className="mt-8 space-y-4">
              {isLoading ? (
                [0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-white/10 bg-ink-900/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 rounded bg-white/10" />
                      <div className="h-6 w-32 rounded-full bg-white/10" />
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="h-10 rounded-lg bg-white/5" />
                      <div className="h-10 rounded-lg bg-white/5" />
                    </div>
                    <div className="mt-4 h-20 rounded-lg bg-white/5" />
                  </div>
                ))
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-ink-900/50 px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-500">
                    <FolderIcon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-zinc-100">No projects yet</h2>
                  <p className="mt-1 max-w-xs text-sm text-zinc-400">
                    Add your first project to show it on the site.
                  </p>
                  <button
                    type="button"
                    onClick={addProject}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent-400 px-5 py-2.5 text-sm font-bold text-ink-950 transition-all hover:bg-accent-300"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add project
                  </button>
                </div>
              ) : (
                projects.map((project, index) => (
                  <ProjectEditor
                    key={project.id}
                    project={project}
                    index={index}
                    isCurrent={currentProject?.id === project.id}
                    deleteArmed={armedDeleteId === project.id}
                    onUpdate={updateProject}
                    onSetCurrent={setCurrentProject}
                    onArmDelete={setArmedDeleteId}
                    onDelete={removeProject}
                  />
                ))
              )}
            </div>

            {/* ---------- Bottom actions ---------- */}
            {!isLoading && projects.length > 0 ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-white/5 pt-8">
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:border-accent-400/40 hover:text-accent-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add project
                </button>
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={saving || !isDirty}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-400 px-6 py-2.5 text-sm font-bold text-ink-950 transition-all hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? <SpinnerIcon className="h-4 w-4" /> : <SaveIcon className="h-4 w-4" />}
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            ) : null}
          </main>
        </div>
      )}

      {toast ? <Toast toast={toast} /> : null}
    </>
  );
}
