"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { CursorTrail } from "@/components/cursor-trail";
import { fieldLabel, inputClass, ProjectEditor } from "@/components/admin/project-editor";
import {
  normalizeProjects,
  updateProjects,
  verifyPasscode,
  type Project,
} from "@/lib/projects";

type Status = { tone: "neutral" | "success" | "error"; text: string } | null;

const button =
  "inline-flex h-11 items-center justify-center px-5 text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";
const primaryButton = `${button} bg-ink text-paper enabled:hover:bg-signal`;
const secondaryButton = `${button} border border-ink text-ink enabled:hover:border-signal enabled:hover:text-signal`;

function newProject(): Project {
  return {
    id: `project-${Date.now()}`,
    name: "",
    progress: "Planning",
    description: "",
    isCurrent: false,
  };
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState<string | null>(null);

  return (
    <>
      <CursorTrail />
      {passcode === null ? (
        <LoginScreen onUnlock={setPasscode} />
      ) : (
        <Editor passcode={passcode} onLock={() => setPasscode(null)} />
      )}
    </>
  );
}

function AdminHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-rule bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-[880px] items-center justify-between gap-4 px-5 sm:px-8">
        <p className="font-wide text-[15px] font-extrabold tracking-[0.02em] text-ink uppercase">
          Gundam <span className="font-mono text-xs font-normal tracking-[0.16em] text-muted">/ admin</span>
        </p>
        <div className="flex items-center gap-5">{children}</div>
      </div>
    </header>
  );
}

const headerLink = "text-[15px] text-muted transition-colors duration-150 hover:text-ink";

function LoginScreen({ onUnlock }: { onUnlock: (passcode: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const passcode = value.trim();
    if (!passcode) return;
    setChecking(true);
    const result = await verifyPasscode(passcode);
    setChecking(false);
    if (result.ok) onUnlock(passcode);
    else setError(result.error);
  };

  return (
    <>
      <AdminHeader>
        <Link href="/" className={headerLink}>
          View site
        </Link>
      </AdminHeader>
      <main className="mx-auto w-full max-w-[880px] px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
        <h1 className="font-wide text-[32px] leading-tight font-extrabold tracking-[-0.01em] text-ink">
          Sign in to edit projects
        </h1>
        <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted">
          Enter the admin passcode. It’s checked on the server and never stored in this browser.
        </p>
        <form onSubmit={submit} className="mt-10 max-w-sm border-t border-ink pt-8">
          <label htmlFor="passcode" className={fieldLabel}>
            Passcode
          </label>
          <input
            id="passcode"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "passcode-error" : undefined}
            className={inputClass}
          />
          {error ? (
            <p id="passcode-error" role="alert" className="mt-3 text-[15px] text-signal">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={checking || !value.trim()} className={`${primaryButton} mt-6 w-full`}>
            {checking ? "Checking…" : "Sign in"}
          </button>
        </form>
      </main>
    </>
  );
}

function Editor({ passcode, onLock }: { passcode: string; onLock: () => void }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [saved, setSaved] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const isDirty = useMemo(
    () => projects !== null && JSON.stringify(projects) !== saved,
    [projects, saved],
  );

  const load = async () => {
    setLoadError("");
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { projects?: unknown };
      const loaded = normalizeProjects(data.projects);
      setProjects(loaded);
      setSaved(JSON.stringify(loaded));
    } catch {
      setLoadError("Couldn’t load your projects from the server.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`project-row-${focusId}`)?.scrollIntoView({ block: "center" });
    document.getElementById(`name-${focusId}`)?.focus({ preventScroll: true });
    setFocusId(null);
  }, [focusId, projects]);

  const edit = (update: (current: Project[]) => Project[]) => {
    setProjects((current) => (current ? update(current) : current));
    setStatus(null);
  };

  const updateField = (id: string, field: "name" | "progress" | "description", value: string) =>
    edit((current) => current.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const setCurrent = (id: string) =>
    edit((current) => current.map((p) => ({ ...p, isCurrent: p.id === id })));

  const remove = (id: string) => {
    setArmedDeleteId(null);
    edit((current) => {
      const next = current.filter((p) => p.id !== id);
      if (next.length > 0 && !next.some((p) => p.isCurrent)) next[0] = { ...next[0], isCurrent: true };
      return next;
    });
  };

  const add = () => {
    const project = newProject();
    edit((current) => [...current, { ...project, isCurrent: current.length === 0 }]);
    setFocusId(project.id);
  };

  const save = async () => {
    if (!projects) return;
    const unnamed = projects.findIndex((p) => !p.name.trim());
    if (unnamed !== -1) {
      setStatus({ tone: "error", text: `Project ${unnamed + 1} needs a name before you can save.` });
      setFocusId(projects[unnamed].id);
      return;
    }

    setSaving(true);
    setStatus({ tone: "neutral", text: "Saving…" });
    const result = await updateProjects(projects, passcode);
    setSaving(false);

    if (result.ok) {
      setSaved(JSON.stringify(projects));
      setStatus({ tone: "success", text: "Saved. Your site now shows these projects." });
    } else {
      setStatus({ tone: "error", text: result.error });
    }
  };

  const statusColor =
    status?.tone === "error" ? "text-signal" : status?.tone === "success" ? "text-ink" : "text-muted";

  return (
    <>
      <AdminHeader>
        <Link href="/" className={headerLink}>
          View site
        </Link>
        <button type="button" onClick={onLock} className={headerLink}>
          Sign out
        </button>
      </AdminHeader>

      <main className="mx-auto w-full max-w-[880px] px-5 pt-12 pb-40 sm:px-8 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-wide text-[32px] leading-tight font-extrabold tracking-[-0.01em] text-ink">
              Projects
            </h1>
            <p className="mt-2 text-[17px] text-muted">
              These appear in the Work section of your site, in this order.
            </p>
          </div>
          {projects ? (
            <button type="button" onClick={add} className={secondaryButton}>
              Add project
            </button>
          ) : null}
        </div>

        {loadError ? (
          <div role="alert" className="mt-10 border-t border-ink pt-6">
            <p className="text-[17px] text-ink">{loadError}</p>
            <button type="button" onClick={() => void load()} className={`${secondaryButton} mt-4`}>
              Try again
            </button>
          </div>
        ) : projects === null ? (
          <p className="mt-10 border-t border-ink pt-6 text-[15px] text-muted">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="mt-10 border-t border-ink pt-6">
            <p className="text-[17px] text-ink">No projects yet. Your Work section will be empty.</p>
            <button type="button" onClick={add} className={`${primaryButton} mt-4`}>
              Add your first project
            </button>
          </div>
        ) : (
          <ol className="mt-10 border-t border-ink">
            {projects.map((project, index) => (
              <ProjectEditor
                key={project.id}
                project={project}
                index={index}
                deleteArmed={armedDeleteId === project.id}
                onUpdate={updateField}
                onSetCurrent={setCurrent}
                onArmDelete={setArmedDeleteId}
                onDelete={remove}
              />
            ))}
          </ol>
        )}
      </main>

      {projects ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-ink bg-paper">
          <div className="mx-auto flex min-h-16 w-full max-w-[880px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
            <p role="status" aria-live="polite" className={`text-[15px] ${statusColor}`}>
              {status?.text ?? (isDirty ? "You have unsaved changes." : "Everything is saved.")}
            </p>
            <button type="button" onClick={save} disabled={saving || !isDirty} className={primaryButton}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
