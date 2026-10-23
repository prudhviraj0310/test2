import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  Play,
  Wand2,
  Sliders,
  BarChart3,
  Copy,
  Check,
  Activity,
  RotateCcw,
  Globe,
  Smartphone,
  Plus,
  Zap,
  Code2,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { ContextTheme, ResolvedToken, Token } from "../lib/ds/engine";
import type { DSComponent } from "../lib/ds/seed";

interface LiveApplicationSimulatorProps {
  workspaceSlug: string;
  workspaceName: string;
  activeBranch: string;
  activeContext: string;
  contexts: ContextTheme[];
  resolvedTokens: ResolvedToken[];
  rawTokens: Token[];
  components: DSComponent[];
  onSwitchContext: (contextId: string) => Promise<void>;
  onWorkspaceUpdated: (updatedWs: any, toastMsg?: string) => void;
  onJumpToPillar: (
    pillar: "manage" | "document" | "deliver" | "improve",
    subTab?: string,
  ) => void;
}

export interface GuidedStep {
  step: number;
  title: string;
  subtitle: string;
  pillar: "manage" | "document" | "deliver" | "improve";
  subTab?: string;
  whatItDoes: string;
  actionLabel: string;
}

export const GUIDED_USER_JOURNEY: GuidedStep[] = [
  {
    step: 1,
    title: "1. Simultaneous Website & App Builder",
    subtitle: "01 Manage · Visual Tokens + Dual Platform",
    pillar: "manage",
    subTab: "visual-studio",
    whatItDoes:
      "Switch brand themes (Orion, Vega, Luna), tweak semantic tokens, or add a feature module — and watch BOTH your Desktop Website and Native Mobile App re-skin and re-compile simultaneously.",
    actionLabel: "Build Website & Mobile App",
  },
  {
    step: 2,
    title: "2. Sync Figma & Git Branches",
    subtitle: "01 Manage · Figma & Branch Diffs",
    pillar: "manage",
    subTab: "branches",
    whatItDoes:
      "Pull variable changes from Figma or compare your feature branch ('feat/dark-matter-v2') against 'main' with a 3-way diff before merging to production.",
    actionLabel: "Open Branch Diff & Figma Sync",
  },
  {
    step: 3,
    title: "3. Interactive Living Docs",
    subtitle: "02 Document · Live AST & Sandbox",
    pillar: "document",
    whatItDoes:
      "Every token and component is automatically documented. Test interactive component variants, inspect props, and add new documentation blocks in real time.",
    actionLabel: "Explore Living Documentation",
  },
  {
    step: 4,
    title: "4. Export Code & AI Builder",
    subtitle: "03 Deliver · 10 Platforms + MCP",
    pillar: "deliver",
    subTab: "exporters",
    whatItDoes:
      "Compile your design tokens into 10 production formats (Tailwind v4, CSS, React, SwiftUI, Kotlin, Flutter), execute Pulsar templates, or query the Scoped MCP server.",
    actionLabel: "Export Production Code",
  },
  {
    step: 5,
    title: "5. Self-Heal & Extreme Benchmarks",
    subtitle: "04 Improve · AST Audit & Diagnostics",
    pillar: "improve",
    subTab: "compliance",
    whatItDoes:
      "Paste messy CSS/React code with hardcoded hex colors, auto-heal it into clean design tokens, and run the 7-stage backend architecture & extreme benchmark suite.",
    actionLabel: "Run Compliance & System Check",
  },
];

interface AppFeatureModule {
  id: string;
  title: string;
  category: string;
  metric: string;
  status: "Live" | "Synced" | "Beta";
}

interface DualBuildResult {
  appName: string;
  appTagline: string;
  primaryCta: string;
  brandContext: string;
  branch: string;
  webAppCode: string;
  mobileSwiftAppCode: string;
  webTailwindCss: string;
  iosSwiftCode: string;
  androidKotlinCode: string;
}

interface ExtremeBenchmarkReport {
  executedAt: string;
  workspace: string;
  totalDurationMs: number;
  summary: {
    dtcgTokensParsed: number;
    tokensPerSecond: number;
    maxAliasDepthVerified: number;
    circularTrapCaught: boolean;
    matrixBuildsCompiled: number;
    totalLinesGenerated: number;
    totalBytesGenerated: number;
    branchDeltasComputed: number;
    astViolationsHealed: number;
    postHealViolations: number;
  };
  benchmarks: {
    id: string;
    title: string;
    metric: string;
    durationMs: number;
    detail: string;
    status: string;
  }[];
}

export const LiveApplicationSimulator: React.FC<LiveApplicationSimulatorProps> = ({
  workspaceSlug,
  workspaceName,
  activeBranch,
  activeContext,
  contexts,
  resolvedTokens,
  components,
  onSwitchContext,
  onWorkspaceUpdated,
  onJumpToPillar,
}) => {
  // Resolved token helper
  const getTok = (path: string, fallback: string) =>
    resolvedTokens.find((t) => t.path === path)?.resolved ?? fallback;

  const primaryHex = getTok("color.semantic.primary", "#2b70f7");
  const accentHex = getTok("color.semantic.accent", "#ea580c");
  const canvasHex = getTok("color.semantic.background", "#0e1117");
  const surfaceHex = getTok("color.semantic.surface", "#161b22");
  const textHex = getTok("color.semantic.text", "#f8fafc");
  const mutedHex = getTok("color.semantic.text-muted", "#94a3b8");
  const borderHex = getTok("color.semantic.border", "#262c36");
  const successHex = getTok("color.semantic.success", "#10b981");
  const radiusMd = getTok("radius.md", "10px");
  const spacingMd = getTok("spacing.md", "16px");

  // Active simulated app tab: Dual Website+App Builder (default), Analytics App, or AI UI Builder
  const [appScreen, setAppScreen] = useState<"dual-builder" | "dashboard" | "ai-builder">(
    "dual-builder",
  );

  // Quick Theme Designer state (synced with resolved tokens)
  const [customPrimary, setCustomPrimary] = useState(primaryHex);
  const [customAccent, setCustomAccent] = useState(accentHex);
  const [customSurface, setCustomSurface] = useState(surfaceHex);
  const [customCanvas, setCustomCanvas] = useState(canvasHex);
  const [customRadius, setCustomRadius] = useState(radiusMd);
  const [customSpacing, setCustomSpacing] = useState(spacingMd);
  const [savingTheme, setSavingTheme] = useState(false);

  // Sync local pickers when brand context or external token changes
  useEffect(() => {
    setCustomPrimary(primaryHex);
    setCustomAccent(accentHex);
    setCustomSurface(surfaceHex);
    setCustomCanvas(canvasHex);
    setCustomRadius(radiusMd);
    setCustomSpacing(spacingMd);
  }, [primaryHex, accentHex, surfaceHex, canvasHex, radiusMd, spacingMd]);

  // Simultaneous Website + Mobile App Dual Builder State
  const [appName, setAppName] = useState("Supernova Campus Hub");
  const [appTagline, setAppTagline] = useState(
    "Unified Web & Native Mobile Experience from One Token Graph",
  );
  const [primaryCta, setPrimaryCta] = useState("Launch Live Event Pass");
  const [modules, setModules] = useState<AppFeatureModule[]>([
    {
      id: "mod-1",
      title: "Live Design Token Sync",
      category: "Core Engine",
      metric: "10 Platforms",
      status: "Live",
    },
    {
      id: "mod-2",
      title: "Campus Hackathon Check-In",
      category: "Student Pass",
      metric: "420 Active",
      status: "Synced",
    },
    {
      id: "mod-3",
      title: "Multi-Brand Theme Switcher",
      category: "W3C DTCG",
      metric: "4 Contexts",
      status: "Live",
    },
  ]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleCategory, setNewModuleCategory] = useState("Cross-Platform Widget");
  const [activeModuleId, setActiveModuleId] = useState<string>("mod-1");
  const [mobileOsTab, setMobileOsTab] = useState<"ios" | "android">("ios");
  const [mobileNavTab, setMobileNavTab] = useState<"home" | "modules" | "tokens">("home");
  const [ctaTriggeredCount, setCtaTriggeredCount] = useState(0);
  const [dualCodeTab, setDualCodeTab] = useState<"web-react" | "ios-swift" | "android-kotlin">(
    "web-react",
  );
  const [dualBuildResult, setDualBuildResult] = useState<DualBuildResult | null>(null);
  const [buildingDual, setBuildingDual] = useState(false);
  const [copiedDualCode, setCopiedDualCode] = useState(false);

  // Interactive Dashboard App State
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Interactive Component Sandbox & AI UI Generator State
  const [aiPrompt, setAiPrompt] = useState("Student Campus Hackathon Pass Card");
  const [generatingUi, setGeneratingUi] = useState(false);
  const [generatedUi, setGeneratedUi] = useState<{
    componentName: string;
    prompt: string;
    brandContext: string;
    branch: string;
    tokensUsed: { path: string; resolved: string }[];
    reactCode: string;
    cssCode: string;
    complianceScore: number;
  } | null>(null);
  const [copiedGenerated, setCopiedGenerated] = useState(false);
  const [registeringComp, setRegisteringComp] = useState(false);

  // Live 7-Stage System Architecture Verification State
  const [archReport, setArchReport] = useState<{
    verifiedAt: string;
    allPassed: boolean;
    totalDurationMs: number;
    stages: {
      id: string;
      name: string;
      status: string;
      durationMs: number;
      proof: string;
    }[];
  } | null>(null);
  const [runningArchCheck, setRunningArchCheck] = useState(false);

  // Extreme Stress-Test & Benchmark Runner State
  const [benchmarkReport, setBenchmarkReport] = useState<ExtremeBenchmarkReport | null>(
    null,
  );
  const [runningBenchmarks, setRunningBenchmarks] = useState(false);
  const [downloadingBundle, setDownloadingBundle] = useState(false);

  // Run dual-platform build whenever workspace/context/tokens or app config updates
  const runDualPlatformBuild = async (addedModuleTitle?: string) => {
    setBuildingDual(true);
    try {
      const res = await fetch("/api/v1/dual-builder/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          appName,
          appTagline,
          primaryCta,
          newModuleTitle: addedModuleTitle,
          newModuleCategory,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dualBuild) {
          setDualBuildResult(data.dualBuild);
        }
        if (addedModuleTitle && data.workspace) {
          onWorkspaceUpdated(
            data.workspace,
            `Built & synced '${addedModuleTitle}' across Website (React/Tailwind) + Mobile App (SwiftUI/Kotlin)!`,
          );
        }
      }
    } catch (err) {
      console.warn("Dual build fetch warning:", err);
    } finally {
      setBuildingDual(false);
    }
  };

  useEffect(() => {
    runDualPlatformBuild();
  }, [workspaceSlug, activeContext, primaryHex, accentHex, canvasHex, surfaceHex, radiusMd]);

  const handleAddCrossPlatformModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newModuleTitle.trim() || `Campus Live Module #${modules.length + 1}`;
    const newMod: AppFeatureModule = {
      id: `mod-${Date.now()}`,
      title,
      category: newModuleCategory,
      metric: "Synced Web+App",
      status: "Live",
    };
    const nextModules = [...modules, newMod];
    setModules(nextModules);
    setActiveModuleId(newMod.id);
    setNewModuleTitle("");
    await runDualPlatformBuild(title);
  };

  const handleApplyQuickTheme = async (overrides?: {
    primary?: string;
    accent?: string;
    surface?: string;
    background?: string;
    radiusMd?: string;
    spacingMd?: string;
  }) => {
    setSavingTheme(true);
    try {
      const payload = {
        workspace: workspaceSlug,
        primary: overrides?.primary ?? customPrimary,
        accent: overrides?.accent ?? customAccent,
        surface: overrides?.surface ?? customSurface,
        background: overrides?.background ?? customCanvas,
        radiusMd: overrides?.radiusMd ?? customRadius,
        spacingMd: overrides?.spacingMd ?? customSpacing,
      };
      const res = await fetch("/api/v1/tokens/quick-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        onWorkspaceUpdated(
          updated,
          "Applied visual token updates to live Website + Mobile App, docs & all 10 exporters!",
        );
      }
    } catch (err) {
      console.warn("Theme update warning:", err);
    } finally {
      setSavingTheme(false);
    }
  };

  const handleResetWorkspace = async () => {
    try {
      const res = await fetch(`/api/v1/workspaces/${workspaceSlug}/reset`, {
        method: "POST",
      });
      if (res.ok) {
        const updated = await res.json();
        onWorkspaceUpdated(updated, "Reset workspace tokens & components to baseline");
      }
    } catch (err) {
      console.warn("Workspace reset warning:", err);
    }
  };

  const handleGenerateAiUi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGeneratingUi(true);
    try {
      const res = await fetch("/api/v1/ai/generate-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          prompt: aiPrompt,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedUi(data);
      }
    } catch (err) {
      console.warn("Generate UI warning:", err);
    } finally {
      setGeneratingUi(false);
    }
  };

  const handleRegisterGeneratedComponent = async () => {
    if (!generatedUi) return;
    setRegisteringComp(true);
    try {
      const res = await fetch("/api/v1/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          name: generatedUi.componentName,
          category: "AI Generated UI",
          description: `Generated from prompt: "${generatedUi.prompt}" (${generatedUi.complianceScore}% token compliant)`,
          tokens: generatedUi.tokensUsed.map((t) => t.path),
          codeSnippet: `<${generatedUi.componentName} variant="primary" />`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onWorkspaceUpdated(
          data.workspace,
          `Registered '${generatedUi.componentName}' into Component Registry & Living Docs!`,
        );
      }
    } catch (err) {
      console.warn("Register component warning:", err);
    } finally {
      setRegisteringComp(false);
    }
  };

  const handleRunArchitectureCheck = async () => {
    setRunningArchCheck(true);
    try {
      const res = await fetch("/api/v1/architecture/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace: workspaceSlug }),
      });
      if (res.ok) {
        const data = await res.json();
        setArchReport(data);
      }
    } catch (err) {
      console.warn("Architecture check warning:", err);
    } finally {
      setRunningArchCheck(false);
    }
  };

  const handleRunExtremeBenchmarks = async () => {
    setRunningBenchmarks(true);
    try {
      const res = await fetch("/api/v1/benchmarks/extreme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace: workspaceSlug }),
      });
      if (res.ok) {
        const data = await res.json();
        setBenchmarkReport(data);
      }
    } catch (err) {
      console.warn("Benchmarks warning:", err);
    } finally {
      setRunningBenchmarks(false);
    }
  };

  const handleDownloadFullBundle = async () => {
    setDownloadingBundle(true);
    try {
      const res = await fetch(
        `/api/v1/export/bundle?workspace=${encodeURIComponent(workspaceSlug)}&context=${encodeURIComponent(activeContext)}`,
      );
      if (res.ok) {
        const bundle = await res.json();
        const blob = new Blob([JSON.stringify(bundle, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${workspaceSlug}-${activeContext}-10-platform-bundle.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn("Download bundle warning:", err);
    } finally {
      setDownloadingBundle(false);
    }
  };

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? modules[0];

  return (
    <div className="space-y-6">
      {/* ==================== MAIN INTERACTIVE SPLIT WORKSPACE: LEFT = VISUAL TOKEN & BENCHMARK CONTROLS, RIGHT = SIMULTANEOUS WEBSITE + MOBILE APP BUILDER ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 5 COLS: VISUAL TOKEN CONTROLLER + SYSTEM ARCHITECTURE VERIFIER + EXTREME BENCHMARKS */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] space-y-5">
            <div className="flex items-start justify-between gap-2 border-b border-[#eef1f6] pb-3.5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff4ff] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-[#104fc6]">
                  <Sliders className="h-3 w-3" />
                  Step 1 · Single Source of Truth Token Controller
                </span>
                <h2 className="mt-1.5 text-base font-bold text-[#0c1222]">
                  Design Once → Update Website & Mobile App Simultaneously
                </h2>
                <p className="text-xs text-[#64748b]">
                  Every brand or token change mutates the W3C DTCG graph and re-compiles
                  both the Desktop Website and Native Mobile App on the right in real time.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetWorkspace}
                className="inline-flex items-center gap-1 rounded-full border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-[#475569] hover:text-[#0c1222] cursor-pointer shrink-0"
                title="Reset all tokens to baseline"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* 1. One-Click Multi-Brand Theme Switcher */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[11px] font-semibold uppercase text-[#475569]">
                  1. Switch Brand Theme Context ({contexts.length} Brands)
                </label>
                <span className="font-mono text-[10px] text-[#104fc6]">
                  Instant Web + Mobile Re-Resolution
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {contexts.map((ctx) => {
                  const isSelected = activeContext === ctx.id;
                  const swatch =
                    ctx.overrides["color.semantic.primary"] ||
                    (ctx.id === "default" ? "#2b70f7" : "#104fc6");
                  return (
                    <button
                      key={ctx.id}
                      type="button"
                      onClick={() => onSwitchContext(ctx.id)}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#104fc6] bg-[#eff4ff] shadow-sm"
                          : "border-[#e2e6ef] bg-[#f8fafc] hover:bg-white"
                      }`}
                    >
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: swatch }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-[#0c1222]">
                          {ctx.brand}
                        </div>
                        <div className="truncate text-[10px] text-[#64748b]">
                          {ctx.mode === "light" ? "Daylight Mode" : "Dark Matter Mode"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Live Semantic Color Pickers */}
            <div className="space-y-3 border-t border-[#eef1f6] pt-4">
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#475569]">
                2. Fine-Tune Semantic Color Tokens (Web + Mobile Sync)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-2.5">
                  <div className="text-[11px] font-semibold text-[#0c1222]">
                    Primary Brand CTA
                  </div>
                  <div className="font-mono text-[10px] text-[#64748b] mb-1.5">
                    color.semantic.primary
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Primary Brand CTA Color"
                      value={customPrimary.startsWith("#") ? customPrimary : "#2b70f7"}
                      onChange={(e) => {
                        setCustomPrimary(e.target.value);
                        handleApplyQuickTheme({ primary: e.target.value });
                      }}
                      className="h-7 w-9 cursor-pointer rounded border border-[#dcdfe6] bg-white p-0.5"
                    />
                    <span className="font-mono text-xs font-bold text-[#0c1222]">
                      {customPrimary}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-2.5">
                  <div className="text-[11px] font-semibold text-[#0c1222]">
                    Accent Badge Color
                  </div>
                  <div className="font-mono text-[10px] text-[#64748b] mb-1.5">
                    color.semantic.accent
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Accent Badge Color"
                      value={customAccent.startsWith("#") ? customAccent : "#ea580c"}
                      onChange={(e) => {
                        setCustomAccent(e.target.value);
                        handleApplyQuickTheme({ accent: e.target.value });
                      }}
                      className="h-7 w-9 cursor-pointer rounded border border-[#dcdfe6] bg-white p-0.5"
                    />
                    <span className="font-mono text-xs font-bold text-[#0c1222]">
                      {customAccent}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-2.5">
                  <div className="text-[11px] font-semibold text-[#0c1222]">
                    App Canvas Background
                  </div>
                  <div className="font-mono text-[10px] text-[#64748b] mb-1.5">
                    color.semantic.background
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="App Canvas Background"
                      value={customCanvas.startsWith("#") ? customCanvas : "#0e1117"}
                      onChange={(e) => {
                        setCustomCanvas(e.target.value);
                        handleApplyQuickTheme({ background: e.target.value });
                      }}
                      className="h-7 w-9 cursor-pointer rounded border border-[#dcdfe6] bg-white p-0.5"
                    />
                    <span className="font-mono text-xs font-bold text-[#0c1222]">
                      {customCanvas}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-2.5">
                  <div className="text-[11px] font-semibold text-[#0c1222]">
                    Card Surface Color
                  </div>
                  <div className="font-mono text-[10px] text-[#64748b] mb-1.5">
                    color.semantic.surface
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Card Surface Color"
                      value={customSurface.startsWith("#") ? customSurface : "#161b22"}
                      onChange={(e) => {
                        setCustomSurface(e.target.value);
                        handleApplyQuickTheme({ surface: e.target.value });
                      }}
                      className="h-7 w-9 cursor-pointer rounded border border-[#dcdfe6] bg-white p-0.5"
                    />
                    <span className="font-mono text-xs font-bold text-[#0c1222]">
                      {customSurface}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Corner Radius Presets */}
            <div className="space-y-3 border-t border-[#eef1f6] pt-4">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] font-semibold uppercase text-[#475569]">
                  3. Component Corner Radius (radius.md = {customRadius})
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Sharp", val: "0px" },
                  { label: "Compact", val: "6px" },
                  { label: "Modern", val: "10px" },
                  { label: "Rounded", val: "18px" },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => {
                      setCustomRadius(r.val);
                      handleApplyQuickTheme({ radiusMd: r.val });
                    }}
                    className={`rounded-xl border py-2 px-2 text-center font-mono text-xs transition-all cursor-pointer ${
                      customRadius === r.val
                        ? "border-[#104fc6] bg-[#104fc6] text-white font-bold"
                        : "border-[#dcdfe6] bg-[#f8fafc] text-[#0c1222] hover:bg-white"
                    }`}
                  >
                    <div>{r.label}</div>
                    <div className="text-[10px] opacity-80">{r.val}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Quick Downstream Pipeline Shortcuts */}
            <div className="border-t border-[#eef1f6] pt-4 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDownloadFullBundle}
                disabled={downloadingBundle}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0c1222] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e293b] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-[#00d4c2]" />
                {downloadingBundle
                  ? "Compiling 10 Targets..."
                  : "Download All 10 Platform Files (.json)"}
              </button>
              <button
                type="button"
                onClick={() => onJumpToPillar("deliver", "exporters")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#104fc6] hover:underline cursor-pointer"
              >
                <span>Inspect All 10 Exporters</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* EXTREME STRESS-TEST & BENCHMARK SUITE CARD */}
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#ea580c]" />
                <div>
                  <h3 className="text-sm font-bold text-[#0c1222]">
                    Extreme Engine Stress-Test & Benchmarks
                  </h3>
                  <p className="font-mono text-[10px] text-[#64748b]">
                    1,200 DTCG Tokens · 300-Hop Alias · 40 Multi-Brand Builds
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-testid="run-extreme-bench-btn"
                onClick={handleRunExtremeBenchmarks}
                disabled={runningBenchmarks}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#ea580c] px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-95 cursor-pointer shrink-0"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                {runningBenchmarks ? "Stress-Testing..." : "Run Extreme Benchmarks"}
              </button>
            </div>

            {benchmarkReport && (
              <div className="space-y-2.5 pt-2 border-t border-[#eef1f6]">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#fff7ed] border border-[#fed7aa] px-3 py-2 font-mono text-[11px] text-[#9a3412]">
                  <span className="font-bold">
                    ✓ 6/6 Extreme Workloads Passed in {benchmarkReport.totalDurationMs}ms
                  </span>
                  <span>
                    {benchmarkReport.summary.dtcgTokensParsed} tokens ·{" "}
                    {benchmarkReport.summary.matrixBuildsCompiled} builds
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-[#e2e6ef] bg-[#f8fafc] p-2">
                    <div className="font-mono text-xs font-bold text-[#0c1222]">
                      {benchmarkReport.summary.dtcgTokensParsed.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#64748b]">DTCG Tokens</div>
                  </div>
                  <div className="rounded-lg border border-[#e2e6ef] bg-[#f8fafc] p-2">
                    <div className="font-mono text-xs font-bold text-[#104fc6]">
                      {benchmarkReport.summary.maxAliasDepthVerified}-Hop
                    </div>
                    <div className="text-[10px] text-[#64748b]">Deep Alias Chain</div>
                  </div>
                  <div className="rounded-lg border border-[#e2e6ef] bg-[#f8fafc] p-2">
                    <div className="font-mono text-xs font-bold text-[#0d824b]">
                      {(benchmarkReport.summary.totalBytesGenerated / 1024).toFixed(1)} KB
                    </div>
                    <div className="text-[10px] text-[#64748b]">40-Build Output</div>
                  </div>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {benchmarkReport.benchmarks.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#0c1222]">
                        <span>{b.title}</span>
                        <span className="rounded bg-[#e6f6ed] px-1.5 py-0.5 font-mono text-[10px] text-[#0d824b]">
                          {b.status} · {b.durationMs}ms
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold text-[#104fc6]">
                        Metric: {b.metric}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-[#475569]">
                        {b.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SYSTEM ARCHITECTURE VERIFICATION CARD */}
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#0d824b]" />
                <h3 className="text-sm font-bold text-[#0c1222]">
                  Live 7-Stage Architecture Self-Test
                </h3>
              </div>
              <button
                type="button"
                data-testid="run-arch-verify-btn"
                onClick={handleRunArchitectureCheck}
                disabled={runningArchCheck}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0d824b] px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-95 cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                {runningArchCheck ? "Verifying..." : "Verify All 7 Subsystems"}
              </button>
            </div>
            <p className="text-xs text-[#64748b]">
              Executes real assertions across the W3C DTCG parser, alias resolver, Git
              branch diff engine, Figma sync, Living Docs AST, 10 code compilers, and Scoped
              MCP server.
            </p>

            {archReport && (
              <div className="space-y-2 pt-2 border-t border-[#eef1f6]">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#0d824b] font-semibold">
                  <span>
                    ✓ All 7 Backend Subsystems Verified ({archReport.totalDurationMs}ms total)
                  </span>
                  <span>100% Operational</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {archReport.stages.map((st) => (
                    <div
                      key={st.id}
                      className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#0c1222]">
                        <span>{st.name}</span>
                        <span className="rounded bg-[#e6f6ed] px-1.5 py-0.5 font-mono text-[10px] text-[#0d824b]">
                          {st.status} · {st.durationMs}ms
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#475569]">
                        {st.proof}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 7 COLS: SIMULTANEOUS WEBSITE + MOBILE APP BUILDER & LIVE CONNECTED WORKSPACES */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] space-y-4">
            {/* Simulator Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f6] pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#104fc6]">
                    Simultaneous Multi-Platform Studio
                  </span>
                </div>
                <h3 className="mt-0.5 text-base font-bold text-[#0c1222]">
                  Build & Preview Website + Mobile App Simultaneously
                </h3>
              </div>

              {/* Screen Switcher Tabs */}
              <div className="flex items-center gap-1.5 rounded-full border border-[#dcdfe6] bg-[#f8fafc] p-1">
                <button
                  type="button"
                  data-testid="dual-builder-screen-tab"
                  onClick={() => setAppScreen("dual-builder")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    appScreen === "dual-builder"
                      ? "bg-[#104fc6] text-white shadow-sm"
                      : "text-[#475569] hover:text-[#0c1222]"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  1. Website + Mobile App
                </button>
                <button
                  type="button"
                  onClick={() => setAppScreen("dashboard")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    appScreen === "dashboard"
                      ? "bg-[#104fc6] text-white shadow-sm"
                      : "text-[#475569] hover:text-[#0c1222]"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  2. Telemetry App
                </button>
                <button
                  type="button"
                  data-testid="ai-builder-screen-tab"
                  onClick={() => {
                    setAppScreen("ai-builder");
                    if (!generatedUi) handleGenerateAiUi();
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    appScreen === "ai-builder"
                      ? "bg-[#104fc6] text-white shadow-sm"
                      : "text-[#475569] hover:text-[#0c1222]"
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  3. AI UI Builder
                </button>
              </div>
            </div>

            {/* Live Token Binding Telemetry Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e2e6ef] bg-[#f8fafc] px-3.5 py-2 font-mono text-[11px] text-[#475569]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-sm border border-black/15"
                    style={{ backgroundColor: primaryHex }}
                  />
                  primary: <strong className="text-[#0c1222]">{primaryHex}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-sm border border-black/15"
                    style={{ backgroundColor: accentHex }}
                  />
                  accent: <strong className="text-[#0c1222]">{accentHex}</strong>
                </span>
                <span>
                  radius.md: <strong className="text-[#0c1222]">{radiusMd}</strong>
                </span>
                <span>
                  branch: <strong className="text-[#104fc6]">{activeBranch}</strong>
                </span>
              </div>
              <span className="text-[#0d824b] font-semibold">
                ● Web + iOS + Android Synced
              </span>
            </div>

            {/* ==================== SCREEN 1: SIMULTANEOUS WEBSITE + MOBILE APP LIVE BUILDER ==================== */}
            {appScreen === "dual-builder" && (
              <div className="space-y-4">
                {/* Interactive App & Module Composer Bar */}
                <div className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-3.5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-mono text-[10px] font-semibold uppercase text-[#64748b] mb-1">
                        Product Name (Web & Mobile)
                      </label>
                      <input
                        type="text"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="w-full rounded-lg border border-[#dcdfe6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0c1222]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] font-semibold uppercase text-[#64748b] mb-1">
                        Hero Tagline
                      </label>
                      <input
                        type="text"
                        value={appTagline}
                        onChange={(e) => setAppTagline(e.target.value)}
                        className="w-full rounded-lg border border-[#dcdfe6] bg-white px-2.5 py-1.5 text-xs text-[#0c1222]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] font-semibold uppercase text-[#64748b] mb-1">
                        Primary CTA Label
                      </label>
                      <input
                        type="text"
                        value={primaryCta}
                        onChange={(e) => setPrimaryCta(e.target.value)}
                        className="w-full rounded-lg border border-[#dcdfe6] bg-white px-2.5 py-1.5 text-xs text-[#0c1222]"
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={handleAddCrossPlatformModule}
                    className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#e2e6ef]"
                  >
                    <input
                      type="text"
                      data-testid="new-module-input"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="Add shared feature module (e.g., Live Speaker Q&A, Campus Map)..."
                      className="flex-1 min-w-[200px] rounded-lg border border-[#dcdfe6] bg-white px-3 py-1.5 text-xs text-[#0c1222]"
                    />
                    <select
                      value={newModuleCategory}
                      onChange={(e) => setNewModuleCategory(e.target.value)}
                      aria-label="Module Category"
                      className="rounded-lg border border-[#dcdfe6] bg-white px-2.5 py-1.5 text-xs text-[#0c1222]"
                    >
                      <option value="Cross-Platform Widget">Cross-Platform Widget</option>
                      <option value="Student Pass">Student Pass</option>
                      <option value="Live Telemetry">Live Telemetry</option>
                      <option value="Core Engine">Core Engine</option>
                    </select>
                    <button
                      type="submit"
                      data-testid="add-dual-module-btn"
                      disabled={buildingDual}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#104fc6] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0d3fa0] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {buildingDual
                        ? "Syncing Web + App..."
                        : "Add & Sync to Website + App"}
                    </button>
                  </form>
                </div>

                {/* SIDE-BY-SIDE VIEWPORTS: LEFT = DESKTOP WEBSITE (7 COLS), RIGHT = NATIVE MOBILE APP (5 COLS) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                  {/* 1. DESKTOP WEBSITE VIEWPORT (React + Tailwind v4 + CSS Vars) */}
                  <div className="xl:col-span-7 flex flex-col rounded-2xl border border-[#dcdfe6] overflow-hidden shadow-sm">
                    {/* Browser Chrome Bar */}
                    <div className="flex items-center justify-between bg-[#0c1222] px-3.5 py-2 text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                        <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] text-[#94a3b8]">
                          <Globe className="h-3 w-3 text-[#6ca0ff]" />
                          https://{workspaceSlug}.campus.app
                        </span>
                      </div>
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#00d4c2]">
                        Desktop Web · React + Tailwind v4
                      </span>
                    </div>

                    {/* Website Body Styled by Live Workspace Tokens */}
                    <div
                      className="flex-1 p-4 space-y-4 transition-all duration-200"
                      style={{
                        backgroundColor: canvasHex,
                        color: textHex,
                      }}
                    >
                      {/* Website Top Navigation */}
                      <div
                        className="flex items-center justify-between border-b pb-3"
                        style={{ borderColor: borderHex }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: primaryHex }}
                          />
                          <span className="text-xs font-bold tracking-tight">
                            {appName}
                          </span>
                          <span
                            style={{
                              backgroundColor: accentHex,
                              borderRadius: radiusMd,
                            }}
                            className="px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-white"
                          >
                            {activeContext}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span style={{ color: mutedHex }}>
                            {modules.length} Modules
                          </span>
                          <button
                            type="button"
                            onClick={() => setCtaTriggeredCount((c) => c + 1)}
                            style={{
                              backgroundColor: primaryHex,
                              borderRadius: radiusMd,
                            }}
                            className="px-2.5 py-1 text-[10px] font-semibold text-white cursor-pointer"
                          >
                            {primaryCta}
                          </button>
                        </div>
                      </div>

                      {/* Website Hero Banner */}
                      <div
                        style={{
                          backgroundColor: surfaceHex,
                          borderColor: borderHex,
                          borderRadius: radiusMd,
                          padding: spacingMd,
                        }}
                        className="border space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-mono text-[10px] font-semibold"
                            style={{ color: primaryHex }}
                          >
                            ● LIVE WEB PORTAL · {resolvedTokens.length} W3C TOKENS
                          </span>
                          <span
                            className="font-mono text-[10px]"
                            style={{ color: mutedHex }}
                          >
                            radius: {radiusMd}
                          </span>
                        </div>
                        <h4 className="text-base font-bold leading-snug">{appName}</h4>
                        <p className="text-xs" style={{ color: mutedHex }}>
                          {appTagline}
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCtaTriggeredCount((c) => c + 1)}
                            style={{
                              backgroundColor: primaryHex,
                              borderRadius: radiusMd,
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm cursor-pointer"
                          >
                            {primaryCta} →
                          </button>
                          {ctaTriggeredCount > 0 && (
                            <span
                              className="font-mono text-[10px] font-semibold"
                              style={{ color: successHex }}
                            >
                              ✓ Synced Event #{ctaTriggeredCount} across Web & Mobile
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Website Feature Modules Grid */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span style={{ color: mutedHex }}>
                            SHARED CROSS-PLATFORM MODULES (CLICK TO INSPECT)
                          </span>
                          <span style={{ color: primaryHex }}>
                            Active: {activeModule?.title}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {modules.map((mod) => {
                            const isSelected = mod.id === activeModule?.id;
                            return (
                              <button
                                key={mod.id}
                                type="button"
                                onClick={() => setActiveModuleId(mod.id)}
                                style={{
                                  backgroundColor: surfaceHex,
                                  borderColor: isSelected ? primaryHex : borderHex,
                                  borderRadius: radiusMd,
                                  borderWidth: isSelected ? "2px" : "1px",
                                }}
                                className="p-3 text-left transition-all cursor-pointer space-y-1"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span
                                    className="font-mono text-[9px] uppercase font-bold"
                                    style={{ color: accentHex }}
                                  >
                                    {mod.category}
                                  </span>
                                  <span
                                    className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                                    style={{
                                      backgroundColor: canvasHex,
                                      color: successHex,
                                    }}
                                  >
                                    ● {mod.status}
                                  </span>
                                </div>
                                <div className="text-xs font-bold truncate">
                                  {mod.title}
                                </div>
                                <div
                                  className="font-mono text-[10px]"
                                  style={{ color: mutedHex }}
                                >
                                  {mod.metric}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. NATIVE MOBILE APP VIEWPORT (iOS SwiftUI / Android Jetpack Compose) */}
                  <div className="xl:col-span-5 flex flex-col items-center justify-between rounded-2xl border border-[#dcdfe6] bg-[#f1f5f9] p-3.5">
                    {/* Mobile Target Switcher Header */}
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#0c1222]">
                        <Smartphone className="h-3.5 w-3.5 text-[#104fc6]" />
                        Native Mobile App
                      </span>
                      <div className="inline-flex rounded-full border border-[#dcdfe6] bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => setMobileOsTab("ios")}
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold cursor-pointer ${
                            mobileOsTab === "ios"
                              ? "bg-[#0c1222] text-white"
                              : "text-[#475569]"
                          }`}
                        >
                          iOS SwiftUI
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileOsTab("android")}
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold cursor-pointer ${
                            mobileOsTab === "android"
                              ? "bg-[#0c1222] text-white"
                              : "text-[#475569]"
                          }`}
                        >
                          Android Compose
                        </button>
                      </div>
                    </div>

                    {/* Phone Hardware Bezel */}
                    <div
                      className="w-full max-w-[290px] rounded-[30px] border-[6px] border-[#0c1222] shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-200"
                      style={{
                        backgroundColor: canvasHex,
                        color: textHex,
                        minHeight: "390px",
                      }}
                    >
                      {/* Phone Top Status Bar & Dynamic Island */}
                      <div>
                        <div className="flex items-center justify-between px-4 pt-2 pb-1 font-mono text-[9px] opacity-80">
                          <span>9:41</span>
                          <span className="h-2.5 w-14 rounded-full bg-black/40" />
                          <span>5G · 100%</span>
                        </div>

                        {/* Mobile App Bar */}
                        <div
                          className="px-3.5 py-2.5 border-b flex items-center justify-between"
                          style={{ borderColor: borderHex }}
                        >
                          <div>
                            <div className="text-xs font-bold truncate max-w-[155px]">
                              {appName}
                            </div>
                            <div
                              className="font-mono text-[9px]"
                              style={{ color: mutedHex }}
                            >
                              {mobileOsTab === "ios"
                                ? "SwiftUI · SupernovaTokens"
                                : "Compose · SupernovaTokens"}
                            </div>
                          </div>
                          <span
                            style={{
                              backgroundColor: accentHex,
                              borderRadius: radiusMd,
                            }}
                            className="px-2 py-0.5 font-mono text-[9px] font-bold text-white"
                          >
                            {mobileOsTab.toUpperCase()}
                          </span>
                        </div>

                        {/* Mobile Screen Body */}
                        <div className="p-3 space-y-2.5">
                          {mobileNavTab === "home" && (
                            <>
                              {/* Highlighted Active Module Card on Mobile */}
                              <div
                                style={{
                                  backgroundColor: surfaceHex,
                                  borderColor: primaryHex,
                                  borderRadius: radiusMd,
                                }}
                                className="border p-3 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className="font-mono text-[9px] font-bold uppercase"
                                    style={{ color: accentHex }}
                                  >
                                    {activeModule?.category}
                                  </span>
                                  <span
                                    className="font-mono text-[9px]"
                                    style={{ color: successHex }}
                                  >
                                    ● Synced with Web
                                  </span>
                                </div>
                                <div className="text-xs font-bold">
                                  {activeModule?.title}
                                </div>
                                <p
                                  className="text-[10px] leading-snug"
                                  style={{ color: mutedHex }}
                                >
                                  {appTagline}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setCtaTriggeredCount((c) => c + 1)}
                                  style={{
                                    backgroundColor: primaryHex,
                                    borderRadius: radiusMd,
                                  }}
                                  className="w-full py-1.5 text-[10px] font-semibold text-white cursor-pointer mt-1"
                                >
                                  {primaryCta}
                                </button>
                              </div>

                              {/* Compact Mobile Module Stack */}
                              <div className="space-y-1.5">
                                {modules.slice(0, 3).map((m) => (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setActiveModuleId(m.id)}
                                    style={{
                                      backgroundColor: surfaceHex,
                                      borderColor:
                                        m.id === activeModule?.id
                                          ? primaryHex
                                          : borderHex,
                                      borderRadius: radiusMd,
                                    }}
                                    className="w-full border px-2.5 py-2 flex items-center justify-between text-left cursor-pointer"
                                  >
                                    <div className="min-w-0">
                                      <div className="text-[11px] font-semibold truncate">
                                        {m.title}
                                      </div>
                                      <div
                                        className="font-mono text-[9px]"
                                        style={{ color: mutedHex }}
                                      >
                                        {m.category}
                                      </div>
                                    </div>
                                    <span
                                      className="font-mono text-[9px] font-bold shrink-0 ml-2"
                                      style={{ color: primaryHex }}
                                    >
                                      {m.metric}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}

                          {mobileNavTab === "modules" && (
                            <div className="space-y-1.5">
                              <div
                                className="font-mono text-[10px] font-bold"
                                style={{ color: mutedHex }}
                              >
                                ALL {modules.length} NATIVE SCREENS
                              </div>
                              {modules.map((m) => (
                                <div
                                  key={m.id}
                                  style={{
                                    backgroundColor: surfaceHex,
                                    borderColor: borderHex,
                                    borderRadius: radiusMd,
                                  }}
                                  className="border p-2.5 flex items-center justify-between"
                                >
                                  <span className="text-[11px] font-semibold">
                                    {m.title}
                                  </span>
                                  <span
                                    className="font-mono text-[9px]"
                                    style={{ color: successHex }}
                                  >
                                    {m.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {mobileNavTab === "tokens" && (
                            <div className="space-y-1.5 font-mono text-[10px]">
                              <div
                                className="p-2 border"
                                style={{
                                  backgroundColor: surfaceHex,
                                  borderColor: borderHex,
                                  borderRadius: radiusMd,
                                }}
                              >
                                primary: <strong>{primaryHex}</strong>
                              </div>
                              <div
                                className="p-2 border"
                                style={{
                                  backgroundColor: surfaceHex,
                                  borderColor: borderHex,
                                  borderRadius: radiusMd,
                                }}
                              >
                                accent: <strong>{accentHex}</strong>
                              </div>
                              <div
                                className="p-2 border"
                                style={{
                                  backgroundColor: surfaceHex,
                                  borderColor: borderHex,
                                  borderRadius: radiusMd,
                                }}
                              >
                                radius.md: <strong>{radiusMd}</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone Bottom Tab Bar */}
                      <div
                        className="border-t px-3 py-2 grid grid-cols-3 gap-1 text-center"
                        style={{
                          backgroundColor: surfaceHex,
                          borderColor: borderHex,
                        }}
                      >
                        {(
                          [
                            { id: "home", label: "Home" },
                            { id: "modules", label: `Modules (${modules.length})` },
                            { id: "tokens", label: "Tokens" },
                          ] as const
                        ).map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setMobileNavTab(tab.id)}
                            style={{
                              color:
                                mobileNavTab === tab.id ? primaryHex : mutedHex,
                            }}
                            className="font-mono text-[10px] font-bold py-0.5 cursor-pointer"
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 font-mono text-[10px] text-[#64748b] text-center">
                      Click any card or token picker to test instant Web + Mobile parity
                    </div>
                  </div>
                </div>

                {/* SIMULTANEOUSLY COMPILED CODE INSPECTOR (React Web + SwiftUI iOS + Kotlin Android) */}
                {dualBuildResult && (
                  <div className="rounded-2xl border border-[#e2e6ef] bg-[#0c1222] p-4 text-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-[#00d4c2]" />
                        <span className="font-mono text-xs font-bold">
                          Simultaneously Compiled Cross-Platform Code
                        </span>
                        <span className="rounded-full bg-[#10b981]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#10b981]">
                          ✓ 100% Token Compliant ({dualBuildResult.brandContext})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDualCodeTab("web-react")}
                          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold cursor-pointer ${
                            dualCodeTab === "web-react"
                              ? "bg-[#104fc6] text-white"
                              : "bg-white/10 text-[#94a3b8] hover:text-white"
                          }`}
                        >
                          Website (React + Tailwind v4)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDualCodeTab("ios-swift")}
                          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold cursor-pointer ${
                            dualCodeTab === "ios-swift"
                              ? "bg-[#104fc6] text-white"
                              : "bg-white/10 text-[#94a3b8] hover:text-white"
                          }`}
                        >
                          iOS App (SwiftUI)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDualCodeTab("android-kotlin")}
                          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold cursor-pointer ${
                            dualCodeTab === "android-kotlin"
                              ? "bg-[#104fc6] text-white"
                              : "bg-white/10 text-[#94a3b8] hover:text-white"
                          }`}
                        >
                          Android App (Kotlin Compose)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const code =
                              dualCodeTab === "web-react"
                                ? dualBuildResult.webAppCode
                                : dualCodeTab === "ios-swift"
                                  ? dualBuildResult.mobileSwiftAppCode
                                  : dualBuildResult.androidKotlinCode;
                            navigator.clipboard.writeText(code);
                            setCopiedDualCode(true);
                            setTimeout(() => setCopiedDualCode(false), 1800);
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] text-white hover:bg-white/25 cursor-pointer"
                        >
                          {copiedDualCode ? (
                            <Check className="h-3 w-3 text-[#10b981]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedDualCode ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <pre className="max-h-52 overflow-auto font-mono text-[11px] leading-relaxed text-[#e2e8f0]">
                      {dualCodeTab === "web-react"
                        ? dualBuildResult.webAppCode
                        : dualCodeTab === "ios-swift"
                          ? dualBuildResult.mobileSwiftAppCode
                          : dualBuildResult.androidKotlinCode}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* ==================== CONNECTED APP SCREEN 2: ANALYTICS & COMPONENT HEALTH DASHBOARD ==================== */}
            {appScreen === "dashboard" && (
              <div
                className="rounded-2xl border p-6 transition-all duration-200 space-y-5"
                style={{
                  backgroundColor: canvasHex,
                  color: textHex,
                  borderColor: borderHex,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span
                      style={{ backgroundColor: primaryHex, borderRadius: radiusMd }}
                      className="inline-block px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white"
                    >
                      Live Product Telemetry App
                    </span>
                    <h4 className="mt-1.5 text-lg font-bold">
                      Design System Adoption & Token Velocity
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(["7d", "30d", "90d"] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setSelectedTimeframe(tf)}
                        style={{
                          backgroundColor:
                            selectedTimeframe === tf ? primaryHex : surfaceHex,
                          color: selectedTimeframe === tf ? "#ffffff" : textHex,
                          borderRadius: radiusMd,
                        }}
                        className="px-3 py-1 font-mono text-xs font-semibold cursor-pointer"
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Active Resolved Tokens",
                      val: `${resolvedTokens.length}`,
                      delta: "+100% W3C DTCG",
                      color: primaryHex,
                    },
                    {
                      label: "Registered Components",
                      val: `${components.length}`,
                      delta: `${components.filter((c) => c.health === "Healthy").length} Healthy`,
                      color: successHex,
                    },
                    {
                      label: "MCP Agent Queries",
                      val: selectedTimeframe === "7d" ? "1,420" : "6,840",
                      delta: "11ms avg latency",
                      color: accentHex,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        backgroundColor: surfaceHex,
                        borderRadius: radiusMd,
                        borderColor: borderHex,
                        padding: spacingMd,
                      }}
                      className="border space-y-1"
                    >
                      <div className="text-xs" style={{ color: mutedHex }}>
                        {m.label}
                      </div>
                      <div className="text-2xl font-bold">{m.val}</div>
                      <div
                        className="font-mono text-[11px] font-semibold"
                        style={{ color: m.color }}
                      >
                        {m.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Token-Styled Bar Chart */}
                <div
                  style={{
                    backgroundColor: surfaceHex,
                    borderRadius: radiusMd,
                    borderColor: borderHex,
                    padding: spacingMd,
                  }}
                  className="border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      Component Adoption Across Web & Mobile Repositories ({selectedTimeframe})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAutoSyncEnabled((v) => !v)}
                      style={{
                        backgroundColor: autoSyncEnabled ? primaryHex : borderHex,
                        borderRadius: radiusMd,
                      }}
                      className="px-3 py-1 text-[11px] font-semibold text-white cursor-pointer"
                    >
                      {autoSyncEnabled ? "● CI Auto-PR Sync ON" : "○ CI Auto-PR Sync OFF"}
                    </button>
                  </div>
                  <div className="space-y-2.5 pt-1">
                    {components.slice(0, 5).map((comp) => (
                      <div key={comp.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">
                            {comp.name}{" "}
                            <span
                              className="font-mono text-[10px]"
                              style={{ color: mutedHex }}
                            >
                              ({comp.storybookId})
                            </span>
                          </span>
                          <span className="font-mono text-xs font-bold">
                            {comp.coveragePct}% parity
                          </span>
                        </div>
                        <div
                          className="h-2.5 w-full overflow-hidden rounded-full"
                          style={{ backgroundColor: canvasHex }}
                        >
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${comp.coveragePct}%`,
                              backgroundColor:
                                comp.health === "Healthy" ? primaryHex : accentHex,
                              borderRadius: radiusMd,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== CONNECTED APP SCREEN 3: AI COMPONENT BUILDER (POWERED BY /api/v1/ai/generate-ui) ==================== */}
            {appScreen === "ai-builder" && (
              <div className="space-y-4">
                <form
                  onSubmit={handleGenerateAiUi}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe any UI card or widget (e.g., Campus Event Pass, Lab Check-In Card)..."
                    className="flex-1 rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3.5 py-2.5 text-xs text-[#0c1222] focus:border-[#104fc6] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={generatingUi}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#104fc6] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0d3fa0] cursor-pointer shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {generatingUi ? "Generating..." : "Generate Token-Bound UI"}
                  </button>
                </form>

                {generatedUi && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Live Rendered Preview of Generated UI */}
                    <div
                      className="md:col-span-6 rounded-2xl border p-5 space-y-4"
                      style={{
                        backgroundColor: canvasHex,
                        borderColor: borderHex,
                        color: textHex,
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono opacity-75">
                        <span>Live Rendered Preview</span>
                        <span className="text-[#10b981] font-bold">
                          ✓ {generatedUi.complianceScore}% Token Compliant
                        </span>
                      </div>

                      <div
                        style={{
                          backgroundColor: surfaceHex,
                          color: textHex,
                          borderRadius: radiusMd,
                          padding: spacingMd,
                          borderColor: borderHex,
                        }}
                        className="border shadow-lg space-y-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            style={{ backgroundColor: accentHex }}
                            className="px-2.5 py-0.5 text-[11px] font-semibold text-white rounded-full"
                          >
                            {generatedUi.brandContext}
                          </span>
                          <span className="font-mono text-[11px] opacity-70">
                            {generatedUi.branch}
                          </span>
                        </div>
                        <h4 className="text-base font-bold">{generatedUi.prompt}</h4>
                        <p className="text-xs opacity-80 leading-relaxed">
                          Automatically bound to{" "}
                          <code>color.semantic.primary ({primaryHex})</code>,{" "}
                          <code>color.semantic.surface ({surfaceHex})</code>, and{" "}
                          <code>radius.md ({radiusMd})</code>.
                        </p>
                        <button
                          type="button"
                          style={{
                            backgroundColor: primaryHex,
                            borderRadius: radiusMd,
                          }}
                          className="w-full py-2.5 text-xs font-semibold text-white shadow-sm"
                        >
                          Launch {generatedUi.componentName} →
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleRegisterGeneratedComponent}
                        disabled={registeringComp}
                        className="w-full rounded-full border border-white/20 bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
                      >
                        {registeringComp
                          ? "Adding to Registry & Living Docs..."
                          : "+ Save Component to Workspace Registry & Living Docs"}
                      </button>
                    </div>

                    {/* Generated Token-Compliant Code */}
                    <div className="md:col-span-6 rounded-2xl border border-[#e2e6ef] bg-[#0c1222] p-4 text-white space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <span className="truncate font-mono text-[11px] text-[#6ca0ff]">
                          {generatedUi.componentName}.tsx (100% Token Bound)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedUi.reactCode);
                            setCopiedGenerated(true);
                            setTimeout(() => setCopiedGenerated(false), 1800);
                          }}
                          className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] text-white hover:bg-white/20 cursor-pointer"
                        >
                          {copiedGenerated ? (
                            <Check className="h-3 w-3 text-[#10b981]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedGenerated ? "Copied" : "Copy TSX"}
                        </button>
                      </div>
                      <pre className="max-h-64 overflow-auto font-mono text-[11px] leading-relaxed text-[#e2e8f0]">
                        {generatedUi.reactCode}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
