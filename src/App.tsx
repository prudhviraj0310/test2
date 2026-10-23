import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Layers,
  BookOpen,
  Code2,
  ShieldCheck,
  GitBranch,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Check,
  Terminal,
  ArrowLeft,
  Search,
  CheckCircle2,
  Send,
  Wand2,
  Download,
  ArrowRight,
  Compass,
} from "lucide-react";
import {
  EXPORT_TARGETS,
  SUPERNOVA_TOKEN_TYPES,
  DEFAULT_PULSAR_TEMPLATES,
  exportTokens,
  auditCode,
  autofixCode,
  type ContextTheme,
  type ExportTarget,
  type ResolvedToken,
  type Token,
  type TokenBranch,
  type TokenType,
  type BranchDiffSummary,
  type FigmaDiffItem,
} from "./lib/ds/engine";
import type {
  DSComponent,
  DocPage,
  SelfHealingIssue,
  VectorAsset,
} from "./lib/ds/seed";
import {
  SupernovaWebsite,
  SupernovaLogo,
  type WebsitePageId,
} from "./components/SupernovaWebsite";
import {
  LiveApplicationSimulator,
  GUIDED_USER_JOURNEY,
} from "./components/LiveApplicationSimulator";
import { FigmaToSupernovaStudio } from "./components/FigmaToSupernovaStudio";

interface WorkspaceSummary {
  id: string;
  slug: string;
  name: string;
  department: string;
  ownerName: string;
  apiKey: string;
  activeContext: string;
  activeBranch: string;
  tokenCount: number;
  releaseCount: number;
}

interface ReleaseItem {
  version: string;
  date: string;
  author: string;
  note: string;
  tokenCount: number;
  changes: { added: number; changed: number; removed: number };
}

interface WebhookItem {
  id: string;
  name: string;
  targetUrl: string;
  events: string[];
  lastStatus: string;
  lastTriggeredAt?: string;
}

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  category: string;
  details: string;
  timestamp: string;
}

interface WorkspacePayload {
  id: string;
  slug: string;
  name: string;
  department: string;
  ownerName: string;
  apiKey: string;
  activeContext: string;
  activeBranch: string;
  tokens: Token[];
  resolved: ResolvedToken[];
  branches: TokenBranch[];
  contexts: ContextTheme[];
  components: DSComponent[];
  docPages: DocPage[];
  vectorAssets: VectorAsset[];
  selfHealingIssues: SelfHealingIssue[];
  releases: ReleaseItem[];
  webhooks: WebhookItem[];
  auditLogs: AuditLogEntry[];
  pendingDiff: { added: number; changed: number; removed: number };
}

type StudioPillar = "manage" | "document" | "deliver" | "improve";
type ManageSubTab =
  | "visual-studio"
  | "tokens"
  | "branches"
  | "figma"
  | "components"
  | "assets";
type DeliverSubTab = "exporters" | "pulsar" | "mcp" | "releases";
type ImproveSubTab = "self-healing" | "compliance" | "telemetry";

const STUDIO_PILLARS: {
  id: StudioPillar;
  num: string;
  label: string;
  color: string;
  leadHighlight: string;
  leadBody: string;
}[] = [
  {
    id: "manage",
    num: "01",
    label: "Manage",
    color: "#104fc6",
    leadHighlight: "Connect design and code data.",
    leadBody: "Customize tokens visually, preview on a real connected app, sync Figma & diff Git branches.",
  },
  {
    id: "document",
    num: "02",
    label: "Document",
    color: "#e0561b",
    leadHighlight: "Write and publish the documentation.",
    leadBody: "37-Block Living Documentation AST synced with Storybook CSF3 & multi-brand tokens.",
  },
  {
    id: "deliver",
    num: "03",
    label: "Deliver",
    color: "#00a396",
    leadHighlight: "Connect with your agents.",
    leadBody: "Scoped MCP servers, /llms.txt, Pulsar (.pr) engine & 10 deterministic code exporters.",
  },
  {
    id: "improve",
    num: "04",
    label: "Improve",
    color: "#7c3aed",
    leadHighlight: "Keep your system healthy.",
    leadBody: "Self-healing drift queue, codebase AST compliance scanner & adoption telemetry.",
  },
];

export default function App() {
  const [appMode, setAppMode] = useState<"website" | "studio">(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("view") === "website" ? "website" : "studio";
  });
  const [websitePage, setWebsitePage] = useState<WebsitePageId>("overview");
  const [studioExperience, setStudioExperience] = useState<"figma-pipeline" | "advanced">(
    "figma-pipeline",
  );

  // Studio Navigation State
  const [activePillar, setActivePillar] = useState<StudioPillar>("manage");
  const [manageTab, setManageTab] = useState<ManageSubTab>("visual-studio");
  const [deliverTab, setDeliverTab] = useState<DeliverSubTab>("exporters");
  const [improveTab, setImproveTab] = useState<ImproveSubTab>("self-healing");
  const [guidedStepIdx, setGuidedStepIdx] = useState<number>(0);
  const [showGuidedJourney, setShowGuidedJourney] = useState<boolean>(true);

  // Backend Data State
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [ws, setWs] = useState<WorkspacePayload | null>(null);
  const [archComparison, setArchComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // 01 Manage: Token Editor State
  const [tokenSearch, setTokenSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [formPath, setFormPath] = useState("color.semantic.focus-ring");
  const [formType, setFormType] = useState<TokenType>("color");
  const [formValue, setFormValue] = useState("{color.primitive.blue.400}");
  const [formPlain, setFormPlain] = useState("High-visibility keyboard focus ring");
  const [dtcgImportText, setDtcgImportText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // 01 Manage: Branching State
  const [newBranchName, setNewBranchName] = useState("");
  const [branchDiff, setBranchDiff] = useState<BranchDiffSummary | null>(null);
  const [diffSourceBranch, setDiffSourceBranch] = useState("feat/dark-matter-v2");
  const [diffTargetBranch, setDiffTargetBranch] = useState("main");

  // 01 Manage: Figma Sync State
  const [figmaFileKey] = useState("Dark Matter: Foundations");
  const [figmaDiffs, setFigmaDiffs] = useState<FigmaDiffItem[]>([]);
  const [figmaSourceLabel, setFigmaSourceLabel] = useState("Dark Matter: Foundations");

  // 02 Document: Living Docs State
  const [selectedDocPageId, setSelectedDocPageId] = useState("doc-color-architecture");
  const [newBlockType, setNewBlockType] = useState<
    "callout" | "token-group" | "component-preview" | "code-export"
  >("token-group");
  const [newBlockTitle, setNewBlockTitle] = useState("");

  // 03 Deliver: Exporters, Pulsar, MCP & Releases State
  const [selectedExporter, setSelectedExporter] = useState<ExportTarget>("tailwind");
  const [copiedCode, setCopiedCode] = useState(false);
  const [pulsarTemplate, setPulsarTemplate] = useState(
    DEFAULT_PULSAR_TEMPLATES[0]!.template,
  );
  const [pulsarOutput, setPulsarOutput] = useState("");
  const [pulsarStats, setPulsarStats] = useState<{
    tokensProcessed: number;
    linesGenerated: number;
    executionMs: number;
  } | null>(null);

  const [mcpScope, setMcpScope] = useState("checkout-team");
  const [selectedMcpTool, setSelectedMcpTool] = useState("get_tokens");
  const [mcpArgsText, setMcpArgsText] = useState(
    JSON.stringify({ group: "color", scope: "checkout-team" }, null, 2),
  );
  const [mcpResponse, setMcpResponse] = useState<string>("");

  const [releaseNote, setReleaseNote] = useState("");
  const [releaseBump, setReleaseBump] = useState<"patch" | "minor" | "major">("minor");

  // 04 Improve: Compliance & Self-Healing State
  const [sampleCodeToAudit, setSampleCodeToAudit] = useState(
    `.checkout-cta {\n  background-color: #2b70f7;\n  color: #f8fafc;\n  padding: 16px 24px;\n  border-radius: 10px;\n  border: 1px solid #262c36;\n}`,
  );

  // AI Context Agent Drawer
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Connected to **Supernova · Dark Matter OS** via Scoped MCP. Ask me about token alias chains, Orion/Vega/Luna brand overrides, or Storybook component contracts.",
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // New Workspace Provisioning Modal
  const [showNewWsModal, setShowNewWsModal] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsDept, setNewWsDept] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 3200);
  };

  const fetchBootstrap = async (slug?: string) => {
    try {
      const q = slug ? `?workspace=${encodeURIComponent(slug)}` : "";
      const res = await fetch(`/api/v1/bootstrap${q}`);
      const data = await res.json();
      setWorkspaces(data.workspaces ?? []);
      setWs(data.activeWorkspace ?? null);
      setArchComparison(data.architectureComparison ?? []);
    } catch (err) {
      console.error("Bootstrap error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootstrap();
  }, []);

  useEffect(() => {
    if (!ws) return;
    fetch(
      `/api/v1/branches/diff?workspace=${encodeURIComponent(ws.slug)}&source=${encodeURIComponent(
        diffSourceBranch,
      )}&target=${encodeURIComponent(diffTargetBranch)}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && !d.error) setBranchDiff(d);
      })
      .catch(() => {});
  }, [ws?.slug, ws?.activeBranch, ws?.tokens, diffSourceBranch, diffTargetBranch]);

  useEffect(() => {
    if (!ws) return;
    fetch("/api/v1/pulsar/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        template: pulsarTemplate,
        contextId: ws.activeContext,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setPulsarOutput(d.output ?? "");
        setPulsarStats({
          tokensProcessed: d.tokensProcessed ?? 0,
          linesGenerated: d.linesGenerated ?? 0,
          executionMs: d.executionMs ?? 1,
        });
      })
      .catch(() => {});

    fetch("/api/v1/figma/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace: ws.slug, fileKey: figmaFileKey }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.diffs) {
          setFigmaDiffs(d.diffs);
          setFigmaSourceLabel(d.sourceLabel || "Dark Matter: Foundations");
        }
      })
      .catch(() => {});
  }, [ws?.slug, ws?.activeContext]);

  const activeContextObj = useMemo(() => {
    if (!ws) return null;
    return ws.contexts.find((c) => c.id === ws.activeContext) ?? ws.contexts[0] ?? null;
  }, [ws]);

  const filteredTokens = useMemo(() => {
    if (!ws) return [];
    return ws.resolved.filter((t) => {
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const q = tokenSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.path.toLowerCase().includes(q) ||
        (t.plain ?? "").toLowerCase().includes(q) ||
        (t.resolved ?? "").toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [ws, typeFilter, tokenSearch]);

  const compiledExporterOutput = useMemo(() => {
    if (!ws || !activeContextObj) return "";
    return exportTokens(
      ws.tokens,
      selectedExporter,
      activeContextObj.overrides,
      activeContextObj.id,
    );
  }, [ws, activeContextObj, selectedExporter]);

  const liveAuditIssues = useMemo(() => {
    if (!ws) return [];
    return auditCode(sampleCodeToAudit, ws.tokens);
  }, [ws, sampleCodeToAudit]);

  const handleSwitchContext = async (contextId: string) => {
    if (!ws) return;
    const res = await fetch(`/api/v1/workspaces/${ws.slug}/context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contextId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setWs(updated);
      showToast(`Switched brand context to ${contextId}`);
    }
  };

  const handleSwitchBranch = async (branchName: string) => {
    if (!ws) return;
    const res = await fetch("/api/v1/branches/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace: ws.slug, branchName }),
    });
    if (res.ok) {
      const updated = await res.json();
      setWs(updated);
      showToast(`Checked out token branch '${branchName}'`);
    }
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;
    const res = await fetch("/api/v1/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        originalPath: editingPath ?? undefined,
        token: {
          path: formPath,
          type: formType,
          value: formValue,
          plain: formPlain,
          description: formPlain,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Failed to save token");
      return;
    }
    setWs(data);
    setEditingPath(null);
    showToast(`Saved token '${formPath}' on branch '${data.activeBranch}'`);
  };

  const handleDeleteToken = async (path: string) => {
    if (!ws) return;
    const res = await fetch(
      `/api/v1/tokens?workspace=${encodeURIComponent(ws.slug)}&path=${encodeURIComponent(path)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      const data = await res.json();
      setWs(data);
      showToast(`Deleted token '${path}'`);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws || !newBranchName.trim()) return;
    const res = await fetch("/api/v1/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        name: newBranchName,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Could not create branch");
      return;
    }
    setWs(data);
    setDiffSourceBranch(data.activeBranch);
    setNewBranchName("");
    showToast(`Created and checked out branch '${data.activeBranch}'`);
  };

  const handleMergeBranches = async () => {
    if (!ws) return;
    const res = await fetch("/api/v1/branches/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        sourceBranch: diffSourceBranch,
        targetBranch: diffTargetBranch,
      }),
    });
    const data = await res.json();
    if (res.ok && data.workspace) {
      setWs(data.workspace);
      showToast(
        `Merged '${diffSourceBranch}' into '${diffTargetBranch}' (${data.diff.totalChanges} changes)`,
      );
    }
  };

  const handleApplyFigmaDiff = async () => {
    if (!ws) return;
    const res = await fetch("/api/v1/figma/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        fileKey: figmaFileKey,
        diffs: figmaDiffs,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setWs(updated);
      showToast(`Synced ${figmaDiffs.length} Figma Variable changes into '${updated.activeBranch}'`);
    }
  };

  const handleAddDocBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;
    const res = await fetch(`/api/v1/docs/${selectedDocPageId}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        type: newBlockType,
        title: newBlockTitle || `Live ${newBlockType.toUpperCase()} AST Block`,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setWs(updated);
      setNewBlockTitle("");
      showToast(`Appended '${newBlockType}' block to Living Documentation`);
    }
  };

  const handleRunPulsar = async () => {
    if (!ws) return;
    const res = await fetch("/api/v1/pulsar/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        template: pulsarTemplate,
        contextId: ws.activeContext,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setPulsarOutput(data.output ?? "");
      setPulsarStats({
        tokensProcessed: data.tokensProcessed,
        linesGenerated: data.linesGenerated,
        executionMs: data.executionMs,
      });
      showToast(`Pulsar compiled ${data.tokensProcessed} tokens in ${data.executionMs}ms`);
    }
  };

  const handleExecuteMcpTool = async () => {
    if (!ws) return;
    let parsedArgs: any = {};
    try {
      parsedArgs = JSON.parse(mcpArgsText || "{}");
    } catch {
      showToast("Invalid JSON in MCP arguments");
      return;
    }
    parsedArgs.scope = mcpScope;
    const res = await fetch("/api/mcp/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        tool: selectedMcpTool,
        args: parsedArgs,
      }),
    });
    const data = await res.json();
    setMcpResponse(JSON.stringify(data, null, 2));
    if (selectedMcpTool === "propose_token_changes") {
      fetchBootstrap(ws.slug);
    }
    showToast(`Executed Scoped MCP tool '${selectedMcpTool}'`);
  };

  const handlePublishRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;
    const res = await fetch("/api/v1/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: ws.slug,
        bump: releaseBump,
        note: releaseNote || "Dark Matter token & component synchronization",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setWs(data.workspace);
      setReleaseNote("");
      showToast(`Published release v${data.release.version} & triggered GitHub PR pipeline`);
    }
  };

  const handleResolveSelfHealing = async (issueId: string) => {
    if (!ws) return;
    const res = await fetch(`/api/v1/self-healing/${issueId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace: ws.slug }),
    });
    if (res.ok) {
      const updated = await res.json();
      setWs(updated);
      showToast("Self-Healing Agent resolved drift & updated component parity");
    }
  };

  const handleAskAiAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws || !aiQuestion.trim()) return;
    const nextMsgs = [...aiMessages, { role: "user" as const, content: aiQuestion.trim() }];
    setAiMessages(nextMsgs);
    setAiQuestion("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: ws.slug,
          messages: nextMsgs,
        }),
      });
      const data = await res.json();
      setAiMessages([
        ...nextMsgs,
        { role: "assistant", content: data.reply || "Context resolved." },
      ]);
    } catch {
      setAiMessages([
        ...nextMsgs,
        { role: "assistant", content: "Could not reach Supernova Context Engine." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleProvisionWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    const res = await fetch("/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newWsName,
        department: newWsDept || "Product & Design Systems",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setWorkspaces(data.workspaces);
      setWs(data.workspace);
      setShowNewWsModal(false);
      setNewWsName("");
      setNewWsDept("");
      showToast(`Provisioned workspace '${data.workspace.name}'`);
    }
  };

  if (loading || !ws) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#04091a] text-white">
        <div className="flex items-center gap-3 font-mono text-sm text-white/80">
          <Sparkles className="h-5 w-5 animate-pulse text-[#4785ff]" />
          Loading Supernova Design System OS...
        </div>
      </div>
    );
  }

  // Render Mode 1: Official Supernova.io Website
  if (appMode === "website") {
    return (
      <SupernovaWebsite
        activePage={websitePage}
        onSelectPage={setWebsitePage}
        onLaunchDemo={(pillar) => {
          if (pillar) setActivePillar(pillar);
          setAppMode("studio");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        tokens={ws.resolved}
        components={ws.components}
        selfHealingIssues={ws.selfHealingIssues}
        workspaceSlug={ws.slug}
      />
    );
  }

  // Resolve active brand preview colors for Component Sandbox
  const primaryHex =
    ws.resolved.find((t) => t.path === "color.semantic.primary")?.resolved ?? "#104fc6";
  const surfaceHex =
    ws.resolved.find((t) => t.path === "color.semantic.surface")?.resolved ?? "#161b22";
  const canvasHex =
    ws.resolved.find((t) => t.path === "color.semantic.background")?.resolved ?? "#0e1117";
  const textHex =
    ws.resolved.find((t) => t.path === "color.semantic.text")?.resolved ?? "#f8fafc";
  const radiusMdVal =
    ws.resolved.find((t) => t.path === "radius.md")?.resolved ?? "10px";

  const selectedDocPage =
    ws.docPages.find((p) => p.id === selectedDocPageId) ?? ws.docPages[0]!;
  const currentPillarMeta =
    STUDIO_PILLARS.find((p) => p.id === activePillar) ?? STUDIO_PILLARS[0]!;

  // Render Mode 2: Interactive Supernova Cloud Studio (Daylight Architectural Grid matching real-dsm.png & real-docs.png)
  return (
    <div className="min-h-screen bg-[#f3f5f8] text-[#0c1222] flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[#104fc6]/30 bg-[#04091a] px-4 py-2.5 text-xs font-medium text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Studio Header Bar — Midnight Cobalt Bar + 4-Column Architectural Pillar Grid */}
      <header className="sticky top-0 z-30 border-b border-[#dcdfe6] bg-[#04091a] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setAppMode("website")}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Website
            </button>

            <div className="shrink-0 pl-1 pr-2">
              <SupernovaLogo />
            </div>

            {/* Active Workspace Switcher */}
            <div className="flex items-center gap-1.5 shrink-0">
              <select
                aria-label="Select Workspace"
                value={ws.slug}
                onChange={(e) => fetchBootstrap(e.target.value)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white focus:border-[#4785ff] focus:outline-none"
              >
                {workspaces.map((w) => (
                  <option key={w.slug} value={w.slug} className="bg-[#04091a] text-white">
                    {w.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewWsModal(true)}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-[#4785ff] hover:text-white cursor-pointer"
                title="Provision New Workspace"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </button>
            </div>

            {/* Active Token Branch Switcher */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 shrink-0">
              <GitBranch className="h-3.5 w-3.5 text-[#f59e0b]" />
              <span className="font-mono text-[11px] text-white/60">branch:</span>
              <select
                aria-label="Select Token Branch"
                value={ws.activeBranch}
                onChange={(e) => handleSwitchBranch(e.target.value)}
                className="bg-transparent font-mono text-xs font-semibold text-white focus:outline-none"
              >
                {ws.branches.map((b) => (
                  <option key={b.name} value={b.name} className="bg-[#04091a] text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Multi-Brand Context Switcher */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 shrink-0">
              <Layers className="h-3.5 w-3.5 text-[#4785ff]" />
              <span className="font-mono text-[11px] text-white/60">brand:</span>
              <select
                aria-label="Select Brand Context"
                value={ws.activeContext}
                onChange={(e) => handleSwitchContext(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none pr-1"
              >
                {ws.contexts.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#04091a] text-white">
                    {c.brand} ({c.mode === "light" ? "Light" : "Dark"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mode Switcher: Easy Figma-to-Production vs Advanced 4-Pillar Console */}
            <div className="flex items-center rounded-full bg-white/10 p-0.5 border border-white/15">
              <button
                type="button"
                onClick={() => setStudioExperience("figma-pipeline")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  studioExperience === "figma-pipeline"
                    ? "bg-[#4785ff] text-white shadow-xs"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Figma Canvas → Production
              </button>
              <button
                type="button"
                onClick={() => setStudioExperience("advanced")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  studioExperience === "advanced"
                    ? "bg-[#4785ff] text-white shadow-xs"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Advanced 4-Pillar Console
              </button>
            </div>

            <a
              href={`/llms.txt?workspace=${encodeURIComponent(ws.slug)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 hover:text-white"
            >
              <Terminal className="h-3.5 w-3.5 text-[#00d4c2]" />
              /llms.txt
            </a>
            <button
              type="button"
              onClick={() => setShowAiDrawer((v) => !v)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#04091a] hover:bg-[#e8f0ff] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#104fc6]" />
              Context Agent
            </button>
          </div>
        </div>

        {/* Signature 4-Column Architectural Pillar Bar (Only shown in Advanced 4-Pillar Console mode) */}
        {studioExperience === "advanced" && (
          <div className="border-t border-[#dcdfe6] bg-[#f3f5f8] text-[#0c1222]">
            <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#dcdfe6]">
              {STUDIO_PILLARS.map((pillar) => {
                const active = activePillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    data-testid={`pillar-${pillar.id}`}
                    onClick={() => setActivePillar(pillar.id)}
                    style={{
                      borderBottomWidth: "3px",
                      borderBottomColor: active ? pillar.color : "transparent",
                    }}
                    className="flex items-baseline justify-between px-6 py-4 text-left transition-colors hover:bg-white/70 cursor-pointer"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: active ? pillar.color : "#64748b" }}
                      >
                        {pillar.num}
                      </span>
                      <span
                        className="text-lg font-medium tracking-tight"
                        style={{ color: active ? pillar.color : "#475569" }}
                      >
                        {pillar.label}
                      </span>
                    </div>
                    <span className="hidden sm:inline font-mono text-[10px] text-[#64748b]">
                      {pillar.id === "manage" && `${ws.tokens.length} tokens`}
                      {pillar.id === "document" && `${ws.docPages.length} AST pages`}
                      {pillar.id === "deliver" && "10 exporters"}
                      {pillar.id === "improve" &&
                        `${ws.selfHealingIssues.filter((i) => i.status === "open").length} open`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Active Pillar Editorial Banner + Guided User Journey Toggle (Advanced Mode Only) */}
      {studioExperience === "advanced" && (
        <div className="border-b border-[#dcdfe6] bg-[#f3f5f8]">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-medium tracking-tight">
                <span style={{ color: currentPillarMeta.color }} className="font-semibold">
                  {currentPillarMeta.leadHighlight}
                </span>{" "}
                <span className="text-[#4b5563]">{currentPillarMeta.leadBody}</span>
              </h1>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setStudioExperience("figma-pipeline")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#104fc6] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0d3fa0] cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5" />
                  ← Back to Figma Canvas Pipeline
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuidedJourney((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#104fc6]/30 bg-[#eff4ff] px-3.5 py-1.5 text-xs font-semibold text-[#104fc6] hover:bg-[#dbeafe] cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5" />
                  {showGuidedJourney ? "Hide 5-Step User Guide" : "Show 5-Step User Guide"}
                </button>
              </div>
            </div>

            {showGuidedJourney && (
              <div className="rounded-2xl border border-[#cfd8ea] bg-white p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#104fc6] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
                      Interactive Walkthrough
                    </span>
                    <span className="text-xs font-bold text-[#0c1222]">
                      How Supernova Works End-to-End — Click any step below to experience the live workflow:
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748b]">
                    Step {guidedStepIdx + 1} of {GUIDED_USER_JOURNEY.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {GUIDED_USER_JOURNEY.map((g, idx) => {
                    const isCurrent = guidedStepIdx === idx;
                    return (
                      <button
                        key={g.step}
                        type="button"
                        onClick={() => {
                          setGuidedStepIdx(idx);
                          setActivePillar(g.pillar);
                          if (g.pillar === "manage" && g.subTab) {
                            setManageTab(g.subTab as ManageSubTab);
                          } else if (g.pillar === "deliver" && g.subTab) {
                            setDeliverTab(g.subTab as DeliverSubTab);
                          } else if (g.pillar === "improve" && g.subTab) {
                            setImproveTab(g.subTab as ImproveSubTab);
                          }
                        }}
                        className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          isCurrent
                            ? "border-[#104fc6] bg-[#eff4ff] shadow-sm"
                            : "border-[#e2e6ef] bg-[#f8fafc] hover:bg-white"
                        }`}
                      >
                        <div className="text-xs font-bold text-[#0c1222]">{g.title}</div>
                        <div className="mt-0.5 font-mono text-[10px] text-[#104fc6]">
                          {g.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Studio Blueprint Grid Canvas */}
      <div
        className="flex-1 py-6"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e4e7ee 1px, transparent 1px),
            linear-gradient(to bottom, #e4e7ee 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {studioExperience === "figma-pipeline" ? (
            <FigmaToSupernovaStudio
              workspaceSlug={ws.slug}
              workspaceName={ws.name}
              activeBranch={ws.activeBranch}
              activeContext={ws.activeContext}
              contexts={ws.contexts}
              resolvedTokens={ws.resolved}
              rawTokens={ws.tokens}
              branches={ws.branches}
              components={ws.components}
              docPages={ws.docPages}
              releases={ws.releases}
              branchDiff={branchDiff}
              onSwitchContext={handleSwitchContext}
              onWorkspaceUpdated={(updatedWs, toastMsg) => {
                setWs(updatedWs);
                if (toastMsg) showToast(toastMsg);
              }}
              onOpenAdvancedStudio={() => setStudioExperience("advanced")}
            />
          ) : (
            <>
              {/* ==================== PILLAR 01: MANAGE ==================== */}
              {activePillar === "manage" && (
            <div className="space-y-6">
              {/* Sub-navigation for 01 Manage */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      {
                        id: "visual-studio",
                        label: "⚡ Visual Studio & Live App (Start Here)",
                      },
                      { id: "tokens", label: `All W3C DTCG Tokens (${ws.tokens.length})` },
                      { id: "branches", label: `Git Branches & Diff (${ws.branches.length})` },
                      { id: "figma", label: "Figma Variables Sync" },
                      { id: "components", label: `Storybook Components (${ws.components.length})` },
                      { id: "assets", label: `Vector Assets (${ws.vectorAssets.length})` },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setManageTab(t.id)}
                      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        manageTab === t.id
                          ? "bg-[#104fc6] text-white shadow-sm"
                          : "bg-white text-[#475569] hover:text-[#0c1222] border border-[#dcdfe6]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#dcdfe6] bg-white px-4 py-1.5 text-xs font-semibold text-[#0c1222] hover:border-[#104fc6] shadow-sm cursor-pointer"
                >
                  Import W3C DTCG JSON
                </button>
              </div>

              {/* SUB-TAB 1-0: VISUAL STUDIO & LIVE CONNECTED APPLICATION PREVIEW */}
              {manageTab === "visual-studio" && (
                <LiveApplicationSimulator
                  workspaceSlug={ws.slug}
                  workspaceName={ws.name}
                  activeBranch={ws.activeBranch}
                  activeContext={ws.activeContext}
                  contexts={ws.contexts}
                  resolvedTokens={ws.resolved}
                  rawTokens={ws.tokens}
                  components={ws.components}
                  onSwitchContext={handleSwitchContext}
                  onWorkspaceUpdated={(updatedWs, msg) => {
                    setWs(updatedWs);
                    if (msg) showToast(msg);
                  }}
                  onJumpToPillar={(pillar, subTab) => {
                    setActivePillar(pillar);
                    if (pillar === "deliver" && subTab) {
                      setDeliverTab(subTab as DeliverSubTab);
                    } else if (pillar === "improve" && subTab) {
                      setImproveTab(subTab as ImproveSubTab);
                    }
                  }}
                />
              )}

              {/* SUB-TAB 1A: TOKENS & ALL 11 SUPERNOVA TYPES */}
              {manageTab === "tokens" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 8 Cols: Porcelain Token Table Card */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-[#64748b]" />
                        <input
                          type="text"
                          value={tokenSearch}
                          onChange={(e) => setTokenSearch(e.target.value)}
                          placeholder="Filter by token path, alias, or hex value..."
                          className="w-full rounded-xl border border-[#dcdfe6] bg-white pl-10 pr-3 py-2 text-xs text-[#0c1222] placeholder-[#64748b] shadow-sm focus:border-[#104fc6] focus:outline-none"
                        />
                      </div>
                      <select
                        aria-label="Filter by Token Type"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-xl border border-[#dcdfe6] bg-white px-3.5 py-2 text-xs font-semibold text-[#0c1222] shadow-sm focus:border-[#104fc6] focus:outline-none"
                      >
                        <option value="all">All 11 Token Types ({ws.resolved.length})</option>
                        {SUPERNOVA_TOKEN_TYPES.map((tt) => (
                          <option key={tt.id} value={tt.id}>
                            {tt.label} ({tt.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#e2e6ef] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-[#eef1f6] bg-[#fafbfc] font-mono text-[11px] uppercase text-[#64748b]">
                            <tr>
                              <th className="py-3 px-4">Token Path</th>
                              <th className="py-3 px-4">Type</th>
                              <th className="py-3 px-4">Value / Alias</th>
                              <th className="py-3 px-4">Resolved ({activeContextObj?.brand})</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eef1f6]">
                            {filteredTokens.map((tok) => (
                              <tr key={tok.path} className="hover:bg-[#f8fafd]">
                                <td className="py-3 px-4">
                                  <div className="font-mono font-semibold text-[#0c1222]">
                                    {tok.path}
                                  </div>
                                  <div className="text-[11px] text-[#64748b]">{tok.plain}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="rounded-md bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#104fc6]">
                                    {tok.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-[#64748b]">
                                  {tok.value}
                                  {tok.overriddenByContext && (
                                    <span className="ml-1.5 rounded bg-[#fff7ed] px-1.5 py-0.5 text-[10px] font-semibold text-[#ea580c]">
                                      override
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-mono text-xs">
                                  <div className="flex items-center gap-2">
                                    {tok.type === "color" && tok.resolved && (
                                      <span
                                        className="h-4 w-4 shrink-0 rounded border border-black/15"
                                        style={{ backgroundColor: tok.resolved }}
                                      />
                                    )}
                                    <span className="font-semibold text-[#0c1222]">
                                      {tok.resolved ?? tok.error}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPath(tok.path);
                                      setFormPath(tok.path);
                                      setFormType(tok.type);
                                      setFormValue(tok.value);
                                      setFormPlain(tok.plain || "");
                                    }}
                                    className="mr-2.5 font-semibold text-[11px] text-[#104fc6] hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteToken(tok.path)}
                                    className="text-[#94a3b8] hover:text-[#ef4444] cursor-pointer"
                                    title="Delete Token"
                                  >
                                    <Trash2 className="inline h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right 4 Cols: Token Authoring & Live Brand Theme Preview */}
                  <div className="lg:col-span-4 space-y-5">
                    <form
                      onSubmit={handleSaveToken}
                      className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] space-y-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#0c1222]">
                          {editingPath ? `Edit Token: ${editingPath}` : "Create W3C DTCG Token"}
                        </h3>
                        {editingPath && (
                          <button
                            type="button"
                            onClick={() => setEditingPath(null)}
                            className="text-xs text-[#64748b] hover:text-[#0c1222]"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#64748b] mb-1">
                          Token Path (dot notation)
                        </label>
                        <input
                          type="text"
                          value={formPath}
                          onChange={(e) => setFormPath(e.target.value)}
                          className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 font-mono text-xs text-[#0c1222] focus:border-[#104fc6] focus:bg-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block whitespace-nowrap font-mono text-[11px] text-[#64748b] mb-1">
                            Token Type (11 Types)
                          </label>
                          <select
                            value={formType}
                            onChange={(e) => {
                              const nextType = e.target.value as TokenType;
                              setFormType(nextType);
                              const preset = SUPERNOVA_TOKEN_TYPES.find((x) => x.id === nextType);
                              if (preset && !editingPath) setFormValue(preset.sampleValue);
                            }}
                            className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-2 text-xs text-[#0c1222] focus:border-[#104fc6] focus:outline-none"
                          >
                            {SUPERNOVA_TOKEN_TYPES.map((tt) => (
                              <option key={tt.id} value={tt.id}>
                                {tt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block whitespace-nowrap font-mono text-[11px] text-[#64748b] mb-1">
                            Value / {"{alias}"}
                          </label>
                          <input
                            type="text"
                            value={formValue}
                            onChange={(e) => setFormValue(e.target.value)}
                            className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 font-mono text-xs text-[#0c1222] focus:border-[#104fc6] focus:bg-white focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] text-[#64748b] mb-1">
                          Semantic Description
                        </label>
                        <input
                          type="text"
                          value={formPlain}
                          onChange={(e) => setFormPlain(e.target.value)}
                          className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222] focus:border-[#104fc6] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-full bg-[#104fc6] py-2.5 text-xs font-semibold text-white hover:bg-[#0d3fa0] shadow-sm transition-colors cursor-pointer"
                      >
                        {editingPath ? "Update Token on Active Branch" : "Commit Token to Branch"}
                      </button>
                    </form>

                    {/* Live Brand Theme Preview Card */}
                    <div
                      className="rounded-2xl border p-5 space-y-3 shadow-md transition-all"
                      style={{
                        backgroundColor: canvasHex,
                        borderColor: "#dcdfe6",
                        color: textHex,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider opacity-75">
                          Live Multi-Brand Surface
                        </span>
                        <span className="whitespace-nowrap rounded-full bg-[#104fc6]/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#5c95ff]">
                          {activeContextObj?.name.replace(" (Default)", "")}
                        </span>
                      </div>
                      <div
                        className="rounded-xl border p-4 space-y-3"
                        style={{
                          backgroundColor: surfaceHex,
                          borderColor: "rgba(148, 163, 184, 0.22)",
                          borderRadius: radiusMdVal,
                        }}
                      >
                        <div className="text-sm font-bold"> Orion / Vega / Luna Preview</div>
                        <p className="text-xs opacity-80">
                          Switching brands in the top bar re-resolves semantic tokens across Orion,
                          Vega, and Luna instantaneously.
                        </p>
                        <button
                          type="button"
                          style={{
                            backgroundColor: primaryHex,
                            borderRadius: radiusMdVal,
                          }}
                          className="px-4 py-2 text-xs font-semibold text-white shadow-sm"
                        >
                          Primary Action ({primaryHex})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 1B: TOKEN BRANCHES & THREE-WAY DIFF */}
              {manageTab === "branches" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-4">
                    <form
                      onSubmit={handleCreateBranch}
                      className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3"
                    >
                      <h3 className="text-sm font-bold text-[#0c1222]">Fork New Token Branch</h3>
                      <p className="text-xs text-[#64748b]">
                        Clones all {ws.tokens.length} tokens from{" "}
                        <code className="font-semibold text-[#0c1222]">{ws.activeBranch}</code>.
                      </p>
                      <input
                        type="text"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        placeholder="e.g. feat/luna-contrast-v3"
                        className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 font-mono text-xs text-[#0c1222]"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full rounded-full bg-[#104fc6] py-2 text-xs font-semibold text-white hover:bg-[#0d3fa0] cursor-pointer"
                      >
                        Create & Checkout Branch
                      </button>
                    </form>

                    <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-mono uppercase text-[#64748b]">
                        Active Workspace Branches
                      </h4>
                      {ws.branches.map((b) => (
                        <div
                          key={b.name}
                          className={`rounded-xl border p-3 flex items-center justify-between ${
                            ws.activeBranch === b.name
                              ? "border-[#104fc6] bg-[#eff4ff]"
                              : "border-[#e2e6ef] bg-[#f8fafc]"
                          }`}
                        >
                          <div>
                            <div className="font-mono text-xs font-bold text-[#0c1222]">
                              {b.name}
                            </div>
                            <div className="text-[11px] text-[#64748b]">{b.description}</div>
                          </div>
                          {ws.activeBranch !== b.name ? (
                            <button
                              type="button"
                              onClick={() => handleSwitchBranch(b.name)}
                              className="rounded-full bg-white border border-[#dcdfe6] px-3 py-1 text-[11px] font-semibold text-[#104fc6] cursor-pointer"
                            >
                              Checkout
                            </button>
                          ) : (
                            <span className="rounded-md bg-[#e6f6ed] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0d824b]">
                              Active
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-8 rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f6] pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-[#0c1222]">
                          Three-Way Token Branch Diff & Merge
                        </h3>
                        <p className="text-xs text-[#64748b]">
                          Compare token mutations between branches before merging into production.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={diffSourceBranch}
                          onChange={(e) => setDiffSourceBranch(e.target.value)}
                          className="rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1.5 font-mono text-xs text-[#0c1222]"
                        >
                          {ws.branches.map((b) => (
                            <option key={b.name} value={b.name}>
                              Source: {b.name}
                            </option>
                          ))}
                        </select>
                        <span className="font-mono text-xs text-[#64748b]">→</span>
                        <select
                          value={diffTargetBranch}
                          onChange={(e) => setDiffTargetBranch(e.target.value)}
                          className="rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1.5 font-mono text-xs text-[#0c1222]"
                        >
                          {ws.branches.map((b) => (
                            <option key={b.name} value={b.name}>
                              Target: {b.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleMergeBranches}
                          className="rounded-full bg-[#104fc6] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0d3fa0] cursor-pointer"
                        >
                          Merge Branch
                        </button>
                      </div>
                    </div>

                    {branchDiff && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 font-mono text-xs">
                          <span className="text-[#0d824b] font-semibold">
                            +{branchDiff.addedCount} Added
                          </span>
                          <span className="text-[#b45309] font-semibold">
                            ~{branchDiff.modifiedCount} Modified
                          </span>
                          <span className="text-[#b91c1c] font-semibold">
                            -{branchDiff.deletedCount} Deleted
                          </span>
                          <span className="text-[#64748b]">
                            {branchDiff.unchangedCount} Unchanged
                          </span>
                        </div>
                        <div className="divide-y divide-[#eef1f6] rounded-xl border border-[#e2e6ef] bg-[#fafbfc]">
                          {branchDiff.changes.length === 0 ? (
                            <div className="p-4 text-xs text-[#64748b]">
                              Branches are identical — 0 token differences.
                            </div>
                          ) : (
                            branchDiff.changes.map((ch) => (
                              <div
                                key={ch.path}
                                className="flex items-center justify-between px-4 py-3 font-mono text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                      ch.changeType === "added"
                                        ? "bg-[#e6f6ed] text-[#0d824b]"
                                        : ch.changeType === "modified"
                                          ? "bg-[#fef3c7] text-[#b45309]"
                                          : "bg-[#fee2e2] text-[#b91c1c]"
                                    }`}
                                  >
                                    {ch.changeType}
                                  </span>
                                  <span className="font-semibold text-[#0c1222]">{ch.path}</span>
                                </div>
                                <div className="text-[#64748b]">
                                  {ch.targetValue ? `${ch.targetValue} → ` : ""}
                                  <span className="font-semibold text-[#0c1222]">
                                    {ch.sourceValue ?? "deleted"}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-TAB 1C: FIGMA VARIABLES SYNC */}
              {manageTab === "figma" && (
                <div className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/static/images/integrations/figma/figma-logo.svg"
                        alt="Figma"
                        className="h-6 w-6"
                      />
                      <div>
                        <h3 className="text-base font-bold text-[#0c1222]">
                          Bi-Directional Figma Variables Synchronization
                        </h3>
                        <p className="text-xs text-[#64748b]">
                          Connected source:{" "}
                          <strong className="text-[#0c1222]">{figmaSourceLabel}</strong> · Target
                          branch: <code className="text-[#104fc6]">{ws.activeBranch}</code>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyFigmaDiff}
                      className="inline-flex items-center gap-2 rounded-full bg-[#104fc6] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0d3fa0] cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Apply {figmaDiffs.length} Figma Variable Changes
                    </button>
                  </div>

                  <div className="divide-y divide-[#eef1f6] rounded-xl border border-[#e2e6ef] bg-[#fafbfc]">
                    {figmaDiffs.map((d) => (
                      <div
                        key={d.path}
                        className="flex items-center justify-between px-4 py-3 font-mono text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                              d.kind === "Added"
                                ? "bg-[#e6f6ed] text-[#0d824b]"
                                : d.kind === "Changed"
                                  ? "bg-[#fef3c7] text-[#b45309]"
                                  : "bg-[#fee2e2] text-[#b91c1c]"
                            }`}
                          >
                            {d.kind}
                          </span>
                          <span className="text-[#0c1222] font-semibold">{d.path}</span>
                          <span className="text-[#64748b] font-sans">{d.plain}</span>
                        </div>
                        <div>
                          <span className="text-[#64748b]">{d.from}</span>
                          <span className="mx-2 text-[#104fc6]">→</span>
                          <span className="text-[#0c1222] font-semibold">{d.to}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 1D: STORYBOOK CSF3 COMPONENTS & HEALTH */}
              {manageTab === "components" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ws.components.map((comp) => (
                    <div
                      key={comp.id}
                      className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-[10px] uppercase font-semibold text-[#104fc6]">
                              {comp.category} · v{comp.version}
                            </span>
                            <h3 className="text-base font-bold text-[#0c1222]">{comp.name}</h3>
                          </div>
                          <span
                            className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                              comp.health === "Healthy"
                                ? "bg-[#e6f6ed] text-[#0d824b]"
                                : "bg-[#fef3c7] text-[#b45309]"
                            }`}
                          >
                            {comp.health} · {comp.coveragePct}% parity
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[#64748b]">{comp.description}</p>
                        <div className="mt-3 font-mono text-[11px] text-[#64748b]">
                          <div>Figma: {comp.figmaNode}</div>
                          <div>Storybook CSF3: {comp.storybookId}</div>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#0c1222] p-3 font-mono text-[11px] text-[#e2e8f0] overflow-x-auto">
                        {comp.codeSnippet}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-TAB 1E: VECTOR ASSETS REGISTRY */}
              {manageTab === "assets" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ws.vectorAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#eef1f6] bg-[#f8fafc]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke={primaryHex}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d={asset.svgPath} />
                          </svg>
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold text-[#0c1222]">
                            {asset.name}
                          </div>
                          <div className="text-[11px] text-[#64748b]">
                            {asset.figmaSource} · {asset.dimensions}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `<svg viewBox="0 0 24 24"><path d="${asset.svgPath}" /></svg>`,
                          );
                          showToast(`Copied SVG for '${asset.name}'`);
                        }}
                        className="rounded-full border border-[#dcdfe6] bg-[#f8fafc] px-3 py-1 font-mono text-[11px] font-semibold text-[#104fc6] hover:bg-[#eff4ff] cursor-pointer"
                      >
                        Copy SVG
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== PILLAR 02: DOCUMENT ==================== */}
          {activePillar === "document" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar: Documentation Page Tree & Block Authoring */}
              <div className="lg:col-span-4 space-y-5">
                <div className="rounded-2xl border border-[#e2e6ef] bg-white p-4 shadow-sm space-y-2">
                  <div className="font-mono text-[11px] uppercase text-[#64748b] mb-2">
                    Living Documentation Pages
                  </div>
                  {ws.docPages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setSelectedDocPageId(page.id)}
                      className={`w-full rounded-xl p-3 text-left transition-colors cursor-pointer ${
                        selectedDocPage.id === page.id
                          ? "bg-[#e0561b] text-white shadow-sm"
                          : "bg-[#f8fafc] text-[#475569] hover:text-[#0c1222] border border-[#eef1f6]"
                      }`}
                    >
                      <div className="font-mono text-[10px] uppercase opacity-80">
                        {page.category} · {page.version}
                      </div>
                      <div className="text-xs font-bold mt-0.5">{page.title}</div>
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={handleAddDocBlock}
                  className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="text-xs font-bold text-[#0c1222]">
                    + Append Living AST Block (37-Block Engine)
                  </div>
                  <select
                    value={newBlockType}
                    onChange={(e) => setNewBlockType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
                  >
                    <option value="token-group">Live Token Group Swatch Table</option>
                    <option value="component-preview">Interactive Component Sandbox</option>
                    <option value="callout">WCAG / Architecture Callout Banner</option>
                    <option value="code-export">Live Compiled Exporter Code Block</option>
                  </select>
                  <input
                    type="text"
                    value={newBlockTitle}
                    onChange={(e) => setNewBlockTitle(e.target.value)}
                    placeholder="Block section title..."
                    className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#e0561b] py-2 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                  >
                    Insert AST Block
                  </button>
                </form>
              </div>

              {/* Right 8 Cols: Live AST Page Renderer */}
              <div className="lg:col-span-8 rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.05)] space-y-6">
                <div className="border-b border-[#eef1f6] pb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#e0561b]">
                      /{selectedDocPage.slug} · {selectedDocPage.version}
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-[#0c1222]">
                      {selectedDocPage.title}
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748b]">
                    {selectedDocPage.updatedAt}
                  </span>
                </div>

                <div className="space-y-5">
                  {selectedDocPage.blocks.map((block) => {
                    if (block.type === "heading") {
                      return (
                        <div key={block.id} className="space-y-1.5">
                          <h3 className="text-lg font-bold text-[#0c1222]">{block.title}</h3>
                          <p className="text-sm text-[#475569] leading-relaxed">{block.content}</p>
                        </div>
                      );
                    }
                    if (block.type === "callout") {
                      return (
                        <div
                          key={block.id}
                          className="rounded-xl border border-[#104fc6]/25 bg-[#eff4ff] p-4 space-y-1"
                        >
                          <div className="text-xs font-bold text-[#104fc6]">{block.title}</div>
                          <p className="text-xs text-[#1e293b]">{block.content}</p>
                        </div>
                      );
                    }
                    if (block.type === "token-group") {
                      const groupTokens = ws.resolved.filter((t) =>
                        t.path.startsWith(block.tokenFilter || "color.semantic"),
                      );
                      return (
                        <div key={block.id} className="space-y-2">
                          <div className="font-mono text-xs font-semibold text-[#0c1222]">
                            {block.title} ({groupTokens.length} live tokens)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {groupTokens.map((t) => (
                              <div
                                key={t.path}
                                className="flex items-center justify-between rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-3 font-mono text-xs"
                              >
                                <div>
                                  <div className="text-[#0c1222] font-semibold">{t.path}</div>
                                  <div className="text-[10px] text-[#64748b]">{t.plain}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {t.type === "color" && t.resolved && (
                                    <span
                                      className="h-4 w-4 rounded border border-black/15"
                                      style={{ backgroundColor: t.resolved }}
                                    />
                                  )}
                                  <span className="font-semibold text-[#104fc6]">{t.resolved}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (
                      block.type === "component-health" ||
                      block.type === "component-preview" ||
                      block.type === "do-dont" ||
                      block.type === "props-table"
                    ) {
                      const comp =
                        ws.components.find((c) => c.id === block.componentId) ?? ws.components[0]!;
                      if (block.type === "component-health") {
                        return (
                          <div
                            key={block.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-4 font-mono text-xs"
                          >
                            <span>
                              Storybook: <strong className="text-[#0c1222]">{comp.storybookId}</strong>
                            </span>
                            <span>
                              Figma: <strong className="text-[#0c1222]">{comp.figmaNode}</strong>
                            </span>
                            <span className="rounded-md bg-[#e6f6ed] px-2.5 py-0.5 text-[#0d824b] font-bold">
                              ● {comp.health} ({comp.coveragePct}% parity)
                            </span>
                          </div>
                        );
                      }
                      if (block.type === "component-preview") {
                        return (
                          <div
                            key={block.id}
                            className="rounded-xl border border-[#e2e6ef] p-6 flex flex-col items-center justify-center gap-4"
                            style={{ backgroundColor: canvasHex }}
                          >
                            <div className="font-mono text-[11px] text-white/75">
                              {block.title} · Active Context: {activeContextObj?.name}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                style={{
                                  backgroundColor: primaryHex,
                                  borderRadius: radiusMdVal,
                                }}
                                className="px-4 py-2 text-xs font-semibold text-white shadow"
                              >
                                Primary {comp.name}
                              </button>
                              <button
                                type="button"
                                style={{
                                  backgroundColor: surfaceHex,
                                  borderRadius: radiusMdVal,
                                  color: textHex,
                                }}
                                className="border border-white/15 px-4 py-2 text-xs font-semibold"
                              >
                                Secondary {comp.name}
                              </button>
                            </div>
                          </div>
                        );
                      }
                      if (block.type === "do-dont") {
                        return (
                          <div key={block.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-[#0d824b]/30 bg-[#e6f6ed]/60 p-4 space-y-2">
                              <div className="font-mono text-xs font-bold text-[#0d824b]">
                                ✓ DO (Recommended)
                              </div>
                              <ul className="space-y-1.5 text-xs text-[#0c1222] list-disc pl-4">
                                {comp.dos.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl border border-[#b91c1c]/30 bg-[#fee2e2]/60 p-4 space-y-2">
                              <div className="font-mono text-xs font-bold text-[#b91c1c]">
                                ✕ DON&apos;T (Anti-Pattern)
                              </div>
                              <ul className="space-y-1.5 text-xs text-[#0c1222] list-disc pl-4">
                                {comp.donts.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={block.id}
                          className="overflow-hidden rounded-xl border border-[#e2e6ef] bg-white"
                        >
                          <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#eef1f6] bg-[#fafbfc] font-mono text-[11px] text-[#64748b]">
                              <tr>
                                <th className="py-2.5 px-3">Prop</th>
                                <th className="py-2.5 px-3">Type</th>
                                <th className="py-2.5 px-3">Default</th>
                                <th className="py-2.5 px-3">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef1f6]">
                              {comp.props.map((p) => (
                                <tr key={p.name}>
                                  <td className="py-2.5 px-3 font-mono font-bold text-[#0c1222]">
                                    {p.name}
                                  </td>
                                  <td className="py-2.5 px-3 font-mono text-[#104fc6]">{p.type}</td>
                                  <td className="py-2.5 px-3 font-mono text-[#64748b]">
                                    {p.defaultValue}
                                  </td>
                                  <td className="py-2.5 px-3 text-[#475569]">{p.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    if (block.type === "code-export") {
                      const target = (block.exportTarget as ExportTarget) || "css";
                      const snippet = exportTokens(
                        ws.tokens,
                        target,
                        activeContextObj?.overrides,
                        activeContextObj?.id,
                      );
                      return (
                        <div
                          key={block.id}
                          className="rounded-xl bg-[#0c1222] p-4 space-y-2 text-white"
                        >
                          <div className="font-mono text-xs text-white/70">{block.title}</div>
                          <pre className="max-h-56 overflow-y-auto font-mono text-[11px] text-[#e2e8f0]">
                            {snippet}
                          </pre>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================== PILLAR 03: DELIVER ==================== */}
          {activePillar === "deliver" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "exporters", label: "10 Multi-Platform Exporters" },
                    { id: "pulsar", label: "Pulsar (.pr) Template Engine" },
                    { id: "mcp", label: "Scoped MCP Server & /llms.txt" },
                    { id: "releases", label: `Releases & GitHub PRs (${ws.releases.length})` },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDeliverTab(t.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      deliverTab === t.id
                        ? "bg-[#00a396] text-white shadow-sm"
                        : "bg-white text-[#475569] hover:text-[#0c1222] border border-[#dcdfe6]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* SUB-TAB 3A: ALL 10 OFFICIAL SUPERNOVA EXPORTERS */}
              {deliverTab === "exporters" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-4 space-y-2">
                    {EXPORT_TARGETS.map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setSelectedExporter(exp.id)}
                        className={`w-full rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                          selectedExporter === exp.id
                            ? "border-[#00a396] bg-[#00a396]/10 text-[#0c1222] shadow-sm"
                            : "border-[#e2e6ef] bg-white text-[#475569] hover:text-[#0c1222]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0c1222]">{exp.label}</span>
                          <span className="font-mono text-[10px] font-semibold text-[#00a396]">
                            {exp.file}
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-[#64748b]">
                          {exp.exporterPackage}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="lg:col-span-8 rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef1f6] pb-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-[#0c1222]">
                          {EXPORT_TARGETS.find((e) => e.id === selectedExporter)?.file} · Context:{" "}
                          {activeContextObj?.name}
                        </div>
                        <div className="font-mono text-[11px] text-[#64748b]">
                          Direct CDN Endpoint: /api/v1/tokens?format={selectedExporter}&workspace=
                          {ws.slug}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const fileName =
                              EXPORT_TARGETS.find((e) => e.id === selectedExporter)?.file ||
                              `tokens.${selectedExporter}`;
                            const blob = new Blob([compiledExporterOutput], {
                              type: "text/plain;charset=utf-8",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                            showToast(`Downloaded ${fileName}`);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdfe6] bg-[#f8fafc] px-3.5 py-1.5 text-xs font-semibold text-[#0c1222] hover:bg-white cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5 text-[#00a396]" />
                          Download File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(compiledExporterOutput);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 1800);
                            showToast(`Copied ${selectedExporter} output to clipboard`);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#00a396] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                        >
                          {copiedCode ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          {copiedCode ? "Copied" : "Copy Output"}
                        </button>
                      </div>
                    </div>
                    <pre className="max-h-[460px] overflow-auto rounded-xl bg-[#0c1222] p-4 font-mono text-xs leading-relaxed text-[#e2e8f0]">
                      {compiledExporterOutput}
                    </pre>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3B: PULSAR (.PR) TEMPLATE ENGINE */}
              {deliverTab === "pulsar" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#0c1222]">
                        Pulsar (.pr) Custom Exporter Blueprint
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {DEFAULT_PULSAR_TEMPLATES.map((preset, idx) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setPulsarTemplate(preset.template)}
                            className="rounded-full border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#00a396] cursor-pointer"
                          >
                            Preset {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={12}
                      value={pulsarTemplate}
                      onChange={(e) => setPulsarTemplate(e.target.value)}
                      className="w-full rounded-xl border border-[#dcdfe6] bg-[#0c1222] p-3 font-mono text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRunPulsar}
                      className="w-full rounded-full bg-[#00a396] py-2.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                    >
                      Compile Pulsar (.pr) Blueprint
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#0c1222]">Compiled Pulsar Artifact</h3>
                      {pulsarStats && (
                        <span className="font-mono text-[11px] font-semibold text-[#0d824b]">
                          {pulsarStats.tokensProcessed} tokens · {pulsarStats.linesGenerated} lines ·{" "}
                          {pulsarStats.executionMs}ms
                        </span>
                      )}
                    </div>
                    <pre className="max-h-[340px] overflow-auto rounded-xl bg-[#0c1222] p-4 font-mono text-xs text-[#e2e8f0]">
                      {pulsarOutput}
                    </pre>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3C: SCOPED MCP SERVER PLAYGROUND */}
              {deliverTab === "mcp" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#0c1222]">
                      Scoped MCP Server Playground (MCP 2025-06-18)
                    </h3>
                    <div>
                      <label className="block font-mono text-[11px] text-[#64748b] mb-1">
                        Team Context Scope Filter
                      </label>
                      <select
                        value={mcpScope}
                        onChange={(e) => setMcpScope(e.target.value)}
                        className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
                      >
                        <option value="checkout-team">Filtered for Checkout Team</option>
                        <option value="marketing-web">Filtered for Marketing Web</option>
                        <option value="mobile-app">Filtered for Mobile App (iOS/Android)</option>
                        <option value="full-system">Unfiltered Full Design System</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-[#64748b] mb-1">
                        MCP Tool (8 Registered Tools)
                      </label>
                      <select
                        value={selectedMcpTool}
                        onChange={(e) => setSelectedMcpTool(e.target.value)}
                        className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 font-mono text-xs text-[#0c1222]"
                      >
                        <option value="get_tokens">get_tokens (Scoped DTCG Tokens)</option>
                        <option value="get_token">get_token (Single Alias Inspection)</option>
                        <option value="check_compliance">check_compliance (AST Self-Healing)</option>
                        <option value="generate_code">generate_code (10-Target Compiler)</option>
                        <option value="list_components">list_components (Storybook Registry)</option>
                        <option value="import_figma_variables">import_figma_variables (Diff)</option>
                        <option value="propose_token_changes">propose_token_changes (Write)</option>
                        <option value="get_design_system">get_design_system (Full Manifest)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-[#64748b] mb-1">
                        JSON Arguments Payload
                      </label>
                      <textarea
                        rows={5}
                        value={mcpArgsText}
                        onChange={(e) => setMcpArgsText(e.target.value)}
                        className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] p-3 font-mono text-xs text-[#0c1222]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleExecuteMcpTool}
                      className="w-full rounded-full bg-[#00a396] py-2.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                    >
                      Execute POST /api/mcp/execute
                    </button>
                  </div>

                  <div className="lg:col-span-7 rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0c1222]">
                        Live MCP JSON-RPC Response
                      </span>
                      <a
                        href={`/llms.txt?workspace=${encodeURIComponent(ws.slug)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs font-semibold text-[#00a396] hover:underline"
                      >
                        Open /llms.txt ↗
                      </a>
                    </div>
                    <pre className="max-h-[420px] overflow-auto rounded-xl bg-[#0c1222] p-4 font-mono text-xs text-[#00d4c2]">
                      {mcpResponse ||
                        "// Click 'Execute POST /api/mcp/execute' to inspect live Scoped MCP response"}
                    </pre>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3D: RELEASES & GITHUB PR PIPELINES */}
              {deliverTab === "releases" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handlePublishRelease}
                    className="lg:col-span-4 rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3"
                  >
                    <h3 className="text-sm font-bold text-[#0c1222]">
                      Publish Immutable Snapshot & Trigger PR
                    </h3>
                    <select
                      value={releaseBump}
                      onChange={(e) => setReleaseBump(e.target.value as any)}
                      className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
                    >
                      <option value="patch">Patch Bump (Bugfix / Contrast tweak)</option>
                      <option value="minor">Minor Bump (New semantic tokens)</option>
                      <option value="major">Major Bump (Breaking multi-brand update)</option>
                    </select>
                    <input
                      type="text"
                      value={releaseNote}
                      onChange={(e) => setReleaseNote(e.target.value)}
                      placeholder="Release changelog note..."
                      className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#00a396] py-2.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                    >
                      Publish Release & Dispatch GitHub PR
                    </button>
                  </form>

                  <div className="lg:col-span-8 space-y-3">
                    {ws.releases.map((rel) => (
                      <div
                        key={rel.version}
                        className="rounded-2xl border border-[#e2e6ef] bg-white p-4 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#0c1222]">
                              v{rel.version}
                            </span>
                            <span className="font-mono text-[11px] text-[#64748b]">
                              by {rel.author}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#64748b]">{rel.note}</p>
                        </div>
                        <span className="rounded-md bg-[#e6f6ed] px-2.5 py-1 font-mono text-xs font-semibold text-[#0d824b]">
                          {rel.tokenCount} tokens
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== PILLAR 04: IMPROVE ==================== */}
          {activePillar === "improve" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    {
                      id: "self-healing",
                      label: `Self-Healing Drift Queue (${ws.selfHealingIssues.length})`,
                    },
                    { id: "compliance", label: "Codebase AST Compliance Scanner" },
                    { id: "telemetry", label: "Adoption & REA Verification Matrix" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setImproveTab(t.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      improveTab === t.id
                        ? "bg-[#7c3aed] text-white shadow-sm"
                        : "bg-white text-[#475569] hover:text-[#0c1222] border border-[#dcdfe6]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* SUB-TAB 4A: SELF-HEALING AGENT QUEUE */}
              {improveTab === "self-healing" && (
                <div className="space-y-4">
                  {ws.selfHealingIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-md px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                                issue.status === "resolved"
                                  ? "bg-[#e6f6ed] text-[#0d824b]"
                                  : "bg-[#fef3c7] text-[#b45309]"
                              }`}
                            >
                              {issue.status}
                            </span>
                            <h3 className="text-sm font-bold text-[#0c1222]">{issue.title}</h3>
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-[#64748b]">
                            {issue.source} · {issue.detectedAt}
                          </div>
                        </div>
                        {issue.status === "open" && (
                          <button
                            type="button"
                            onClick={() => handleResolveSelfHealing(issue.id)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#7c3aed] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6d28d9] cursor-pointer"
                          >
                            <Wand2 className="h-3.5 w-3.5" />
                            Run Self-Healing Fix
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                        <div className="rounded-xl border border-[#fee2e2] bg-[#fff5f5] p-3.5">
                          <div className="text-[10px] font-bold text-[#b91c1c] mb-1">
                            − Violating Source Code
                          </div>
                          <pre className="text-[#0c1222] whitespace-pre-wrap">
                            {issue.violatingCode}
                          </pre>
                        </div>
                        <div className="rounded-xl border border-[#e6f6ed] bg-[#f2fbf6] p-3.5">
                          <div className="text-[10px] font-bold text-[#0d824b] mb-1">
                            + Self-Healing Agent Patch ({issue.tokenPath})
                          </div>
                          <pre className="text-[#0c1222] whitespace-pre-wrap">
                            {issue.suggestedFix}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-TAB 4B: INTERACTIVE AST COMPLIANCE SCANNER */}
              {improveTab === "compliance" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#0c1222]">
                        Source Code AST Scanner (CSS / TSX)
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const res = autofixCode(sampleCodeToAudit, ws.tokens);
                          setSampleCodeToAudit(res.fixedCode);
                          showToast(
                            `Self-healed ${res.replacedCount} hardcoded literals to CSS variables`,
                          );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#7c3aed] px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        Auto-Heal to Token Variables
                      </button>
                    </div>
                    <textarea
                      rows={10}
                      value={sampleCodeToAudit}
                      onChange={(e) => setSampleCodeToAudit(e.target.value)}
                      className="w-full rounded-xl bg-[#0c1222] p-3.5 font-mono text-xs text-white"
                    />
                  </div>

                  <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-[#0c1222]">
                      Detected Token Violations ({liveAuditIssues.length})
                    </h3>
                    {liveAuditIssues.length === 0 ? (
                      <div className="rounded-xl border border-[#0d824b]/30 bg-[#e6f6ed] p-4 text-xs font-semibold text-[#0d824b]">
                        ✓ 100% Compliant! Zero hardcoded hex colors or pixel spacing literals found.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {liveAuditIssues.map((iss, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-3 flex items-center justify-between font-mono text-xs"
                          >
                            <div>
                              <span className="text-[#b45309] font-semibold">Line {iss.line}:</span>{" "}
                              <span className="text-[#0c1222] font-bold">{iss.match}</span> (
                              {iss.message})
                            </div>
                            <div className="text-[#0d824b] font-semibold">
                              {iss.cssVar ? `→ ${iss.cssVar}` : "No matching token"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4C: ADOPTION, LIVE AUDIT LOG & REA ARCHITECTURE TELEMETRY */}
              {improveTab === "telemetry" && (
                <div className="space-y-6">
                  {/* Live Backend Audit Log Stream */}
                  <div className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#0c1222]">
                          Live Backend Activity & Immutable Audit Log ({ws.auditLogs.length} Events)
                        </h3>
                        <p className="text-xs text-[#64748b]">
                          Every token edit, visual theme change, branch merge, Figma sync, and MCP
                          agent execution persisted in <code>.data/supernova-os-db-v2.json</code>.
                        </p>
                      </div>
                      <span className="rounded-full bg-[#e6f6ed] px-3 py-1 font-mono text-[11px] font-semibold text-[#0d824b]">
                        ● Persistent Backend Active
                      </span>
                    </div>
                    <div className="divide-y divide-[#eef1f6] rounded-xl border border-[#e2e6ef] bg-[#fafbfc] max-h-72 overflow-y-auto">
                      {ws.auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#104fc6]">
                                {log.category}
                              </span>
                              <span className="font-bold text-[#0c1222]">{log.action}</span>
                            </div>
                            <div className="mt-1 font-mono text-[11px] text-[#64748b]">
                              {log.details} · by <strong>{log.actor}</strong>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-[#64748b] shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#0c1222]">
                      Supernova REA Dossier & Architecture Verification Matrix
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-[#eef1f6] font-mono text-[11px] text-[#64748b]">
                          <tr>
                            <th className="py-3 px-4">Supernova Pillar / Subsystem</th>
                            <th className="py-3 px-4">Implemented Supernova OS Capability</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eef1f6]">
                          {archComparison.map((row, i) => (
                            <tr key={i}>
                              <td className="py-3.5 px-4 font-semibold text-[#0c1222]">
                                {row.subsystem}
                              </td>
                              <td className="py-3.5 px-4 text-[#475569]">
                                {row.unifiedCampusArchitecture}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="rounded-md bg-[#e6f6ed] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0d824b]">
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* W3C DTCG JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0c1222]">Import W3C DTCG JSON Payload</h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-xs text-[#64748b] hover:text-[#0c1222]"
              >
                Close
              </button>
            </div>
            <textarea
              rows={8}
              value={dtcgImportText}
              onChange={(e) => setDtcgImportText(e.target.value)}
              placeholder='{"color": {"$type": "color", "brand": {"hero": {"$value": "#104fc6"}}}}'
              className="w-full rounded-xl border border-[#dcdfe6] bg-[#0c1222] p-3 font-mono text-xs text-white"
            />
            <button
              type="button"
              onClick={async () => {
                const res = await fetch("/api/v1/tokens/import", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ workspace: ws.slug, dtcgJson: dtcgImportText }),
                });
                const data = await res.json();
                if (res.ok && data.workspace) {
                  setWs(data.workspace);
                  setShowImportModal(false);
                  setDtcgImportText("");
                  showToast(`Imported ${data.importedCount} W3C DTCG tokens`);
                } else {
                  showToast(data.error || "Invalid JSON");
                }
              }}
              className="w-full rounded-full bg-[#104fc6] py-2.5 text-xs font-semibold text-white"
            >
              Merge Tokens into Active Branch
            </button>
          </div>
        </div>
      )}

      {/* Provision New Workspace Modal */}
      {showNewWsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleProvisionWorkspace}
            className="w-full max-w-md rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0c1222]">
                Provision New Supernova Workspace
              </h3>
              <button
                type="button"
                onClick={() => setShowNewWsModal(false)}
                className="text-xs text-[#64748b] hover:text-[#0c1222]"
              >
                Close
              </button>
            </div>
            <input
              type="text"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              placeholder="Workspace Name (e.g. Acme Design System)"
              className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
              required
            />
            <input
              type="text"
              value={newWsDept}
              onChange={(e) => setNewWsDept(e.target.value)}
              placeholder="Team / Department"
              className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs text-[#0c1222]"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#104fc6] py-2.5 text-xs font-semibold text-white cursor-pointer"
            >
              Create Workspace & Generate API Key
            </button>
          </form>
        </div>
      )}

      {/* Slide-Over Supernova Context Agent Drawer */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#dcdfe6] bg-white p-5 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#eef1f6] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#104fc6]" />
              <span className="text-sm font-bold text-[#0c1222]">Supernova Context Agent</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiDrawer(false)}
              className="text-xs text-[#64748b] hover:text-[#0c1222]"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {aiMessages.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#104fc6] text-white ml-8"
                    : "border border-[#e2e6ef] bg-[#f8fafc] text-[#0c1222] mr-4"
                }`}
              >
                {m.content}
              </div>
            ))}
            {aiLoading && (
              <div className="text-xs font-mono text-[#64748b]">
                Resolving workspace token graph...
              </div>
            )}
          </div>

          <form
            onSubmit={handleAskAiAgent}
            className="flex items-center gap-2 pt-3 border-t border-[#eef1f6]"
          >
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask about Orion/Vega tokens or Button props..."
              className="flex-1 rounded-full border border-[#dcdfe6] bg-[#f8fafc] px-4 py-2 text-xs text-[#0c1222]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#104fc6] p-2 text-white cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
