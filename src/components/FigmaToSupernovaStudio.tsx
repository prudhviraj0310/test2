import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  BookOpen,
  GitBranch,
  Code2,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Copy,
  Check,
  Download,
  RefreshCw,
  Smartphone,
  Globe,
  Sliders,
  Eye,
  RotateCcw,
  Wand2,
} from "lucide-react";
import {
  EXPORT_TARGETS,
  exportTokens,
  type ContextTheme,
  type ExportTarget,
  type ResolvedToken,
  type Token,
  type TokenBranch,
  type BranchDiffSummary,
} from "../lib/ds/engine";
import type { DSComponent, DocPage } from "../lib/ds/seed";

export interface CanvasBlock {
  id: string;
  type: "hero" | "id-card" | "metrics" | "schedule" | "form";
  layerName: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaLabel: string;
  metricValue?: string;
}

interface StarterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  appName: string;
  appTagline: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  radius: string;
  spacing: string;
  blocks: CanvasBlock[];
}

const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "university-portal",
    name: "University Student Portal",
    category: "Campus & Education",
    description: "Complete campus app with Digital Student ID, Course Schedule, and Academic GPA tracker.",
    appName: "Stanford / Nexus Campus Portal",
    appTagline: "Unified Student Web Portal & Mobile Companion App",
    primary: "#104fc6",
    accent: "#e0561b",
    background: "#0e1117",
    surface: "#161b22",
    text: "#f8fafc",
    radius: "12px",
    spacing: "16px",
    blocks: [
      {
        id: "layer-hero",
        type: "hero",
        layerName: "Hero / Welcome Banner",
        title: "Fall Semester Student Hub",
        subtitle: "Access your digital campus ID, lecture hall directions, and real-time lab availability.",
        badgeText: "Fall 2026 Verified",
        ctaLabel: "Open Digital Campus Pass",
        metricValue: "4.0 GPA Track",
      },
      {
        id: "layer-id-card",
        type: "id-card",
        layerName: "Card / Digital Student ID",
        title: "Prudhvi Naik · Computer Science",
        subtitle: "University Engineering Lab · Access Level: 24/7 Maker Space & Library",
        badgeText: "ACTIVE STUDENT ID",
        ctaLabel: "Scan NFC / QR Gate Pass",
        metricValue: "ID #9402-881",
      },
      {
        id: "layer-metrics",
        type: "metrics",
        layerName: "Grid / Academic Progress",
        title: "Enrolled Credits & Lab Milestones",
        subtitle: "Live sync across Registrar Web Portal and iOS/Android Student App.",
        badgeText: "18 Credits",
        ctaLabel: "View Full Transcript",
        metricValue: "96% Attendance",
      },
      {
        id: "layer-schedule",
        type: "schedule",
        layerName: "List / Today's Lectures",
        title: "CS-301 Design Systems & Software Architecture",
        subtitle: "10:30 AM · Gates Computer Science Bldg, Room 104",
        badgeText: "Starts in 15m",
        ctaLabel: "Check In to Lecture",
        metricValue: "Room 104",
      },
    ],
  },
  {
    id: "hackathon-event",
    name: "Campus Hackathon & Events",
    category: "Events & Clubs",
    description: "Event registration, live project submission timer, mentor queue, and QR check-in.",
    appName: "UniHack 2026 Live",
    appTagline: "36-Hour University Innovation & Design Sprint",
    primary: "#7c3aed",
    accent: "#06b6d4",
    background: "#0f1021",
    surface: "#1a1b36",
    text: "#f8fafc",
    radius: "16px",
    spacing: "16px",
    blocks: [
      {
        id: "layer-hero",
        type: "hero",
        layerName: "Hero / Hackathon Countdown",
        title: "UniHack 2026: Build the Future",
        subtitle: "Submit your team prototype, request mentor help, and claim meal vouchers.",
        badgeText: "18h 42m Remaining",
        ctaLabel: "Submit Project Repo",
        metricValue: "480 Hackers",
      },
      {
        id: "layer-id-card",
        type: "id-card",
        layerName: "Pass / Hacker VIP Badge",
        title: "Team Alpha · Table #42",
        subtitle: "Main Engineering Atrium · Hardware & AI Track",
        badgeText: "HACKER PASS",
        ctaLabel: "Show Meal & Swag QR",
        metricValue: "Track: AI + Design",
      },
      {
        id: "layer-metrics",
        type: "metrics",
        layerName: "Grid / Prize & Mentor Queue",
        title: "Live Mentor Queue &Judging Criteria",
        subtitle: "2 mentors available right now for Design Systems and Full-Stack Web.",
        badgeText: "Wait time: 4m",
        ctaLabel: "Request Mentor Visit",
        metricValue: "$25,000 Prizes",
      },
    ],
  },
  {
    id: "campus-bookstore",
    name: "Student Marketplace & Store",
    category: "E-Commerce",
    description: "Clean daylight storefront for textbooks, university hoodies, and lab electronics.",
    appName: "Campus Co-Op Store",
    appTagline: "Official University Textbooks, Tech & Apparel",
    primary: "#0d824b",
    accent: "#ea580c",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    radius: "10px",
    spacing: "16px",
    blocks: [
      {
        id: "layer-hero",
        type: "hero",
        layerName: "Hero / Semester Sale",
        title: "25% Student Discount on Lab Kits & Textbooks",
        subtitle: "Order online on the web or pick up in 15 minutes with the mobile app.",
        badgeText: "Verified .edu Offer",
        ctaLabel: "Browse Semester Bundles",
        metricValue: "Free Campus Pickup",
      },
      {
        id: "layer-metrics",
        type: "metrics",
        layerName: "Card / Featured Bundle",
        title: "Engineering Starter Pack (Arduino + Textbook)",
        subtitle: "Includes breadboard, microcontroller, and digital course manual.",
        badgeText: "In Stock · 14 left",
        ctaLabel: "Add to Student Cart — $49",
        metricValue: "$49.00",
      },
      {
        id: "layer-schedule",
        type: "schedule",
        layerName: "List / Order Pickup Status",
        title: "Pickup Locker #12 · Student Union Ground Floor",
        subtitle: "Your textbook rental order is ready for contactless unlock.",
        badgeText: "Ready for Pickup",
        ctaLabel: "Unlock Locker #12",
        metricValue: "Order #8821",
      },
    ],
  },
  {
    id: "wellness-fitness",
    name: "Student Rec & Fitness Tracker",
    category: "Health & Sports",
    description: "Live campus gym crowd meter, intramural sports schedule, and daily activity goals.",
    appName: "CampusRec Athletics",
    appTagline: "Live Gym Capacity, Intramural Leagues & Wellness",
    primary: "#0284c7",
    accent: "#10b981",
    background: "#090d16",
    surface: "#131c2e",
    text: "#f8fafc",
    radius: "20px",
    spacing: "20px",
    blocks: [
      {
        id: "layer-hero",
        type: "hero",
        layerName: "Hero / Rec Center Live Status",
        title: "Main Campus Gym Capacity: 38% (Not Busy)",
        subtitle: "Basketball courts 1-3 open · Olympic pool lanes available for lap swim.",
        badgeText: "Live Crowd Sensor",
        ctaLabel: "Reserve Court or Lane",
        metricValue: "38% Capacity",
      },
      {
        id: "layer-metrics",
        type: "metrics",
        layerName: "Grid / Daily Wellness Goal",
        title: "8,420 / 10,000 Campus Steps Today",
        subtitle: "Walk from Engineering Quad to Science Library completed.",
        badgeText: "5 Day Streak",
        ctaLabel: "Log Workout Session",
        metricValue: "84% Goal",
      },
    ],
  },
];

const QUICK_COLOR_THEMES = [
  {
    name: "University Blue",
    primary: "#104fc6",
    accent: "#e0561b",
    background: "#0e1117",
    surface: "#161b22",
    text: "#f8fafc",
  },
  {
    name: "Cyber Violet",
    primary: "#7c3aed",
    accent: "#06b6d4",
    background: "#0f1021",
    surface: "#1a1b36",
    text: "#f8fafc",
  },
  {
    name: "Daylight Clean",
    primary: "#1d4ed8",
    accent: "#ea580c",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
  },
  {
    name: "Emerald Lab",
    primary: "#059669",
    accent: "#f59e0b",
    background: "#061410",
    surface: "#0d261e",
    text: "#ecfdf5",
  },
  {
    name: "Crimson Pride",
    primary: "#dc2626",
    accent: "#f59e0b",
    background: "#140808",
    surface: "#241010",
    text: "#fef2f2",
  },
];

interface ReleaseItem {
  version: string;
  date: string;
  author: string;
  note: string;
  tokenCount: number;
  changes: { added: number; changed: number; removed: number };
}

interface FigmaToSupernovaStudioProps {
  workspaceSlug: string;
  workspaceName: string;
  activeBranch: string;
  activeContext: string;
  contexts: ContextTheme[];
  branches: TokenBranch[];
  resolvedTokens: ResolvedToken[];
  rawTokens: Token[];
  components: DSComponent[];
  docPages: DocPage[];
  releases: ReleaseItem[];
  branchDiff: BranchDiffSummary | null;
  onSwitchContext: (contextId: string) => Promise<void>;
  onWorkspaceUpdated: (updatedWs: any, toastMsg?: string) => void;
  onOpenAdvancedStudio: () => void;
}

export function FigmaToSupernovaStudio({
  workspaceSlug,
  workspaceName,
  activeBranch,
  activeContext,
  contexts,
  branches,
  resolvedTokens,
  rawTokens,
  components,
  docPages,
  releases,
  branchDiff,
  onSwitchContext,
  onWorkspaceUpdated,
  onOpenAdvancedStudio,
}: FigmaToSupernovaStudioProps) {
  // 4-Step Pipeline Navigation:
  // 1: Figma Design Architecture Canvas
  // 2: Auto-Generated Living Documentation
  // 3: Automatic Supernova Version Control & Diffs
  // 4: Production Code & Multi-Platform Export
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Resolve current workspace token values
  const getTok = (path: string, fallback: string) =>
    resolvedTokens.find((t) => t.path === path)?.resolved ?? fallback;

  // Step 1: Figma Canvas State
  const [selectedTemplateId, setSelectedTemplateId] = useState("university-portal");
  const [appName, setAppName] = useState("Stanford / Nexus Campus Portal");
  const [appTagline, setAppTagline] = useState(
    "Unified Student Web Portal & Mobile Companion App",
  );
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>(
    STARTER_TEMPLATES[0]!.blocks,
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string>("layer-hero");
  const [artboardView, setArtboardView] = useState<"both" | "web" | "mobile">("both");
  const [canvasZoom, setCanvasZoom] = useState<number>(100);
  const [mobilePreviewOs, setMobilePreviewOs] = useState<"ios" | "android">("ios");

  // Design Token Visual State bound to the Figma Canvas
  const [primaryColor, setPrimaryColor] = useState(() =>
    getTok("color.semantic.primary", "#104fc6"),
  );
  const [accentColor, setAccentColor] = useState(() =>
    getTok("color.semantic.accent", "#e0561b"),
  );
  const [bgColor, setBgColor] = useState(() =>
    getTok("color.semantic.background", "#0e1117"),
  );
  const [surfaceColor, setSurfaceColor] = useState(() =>
    getTok("color.semantic.surface", "#161b22"),
  );
  const [textColor, setTextColor] = useState(() =>
    getTok("color.semantic.text", "#f8fafc"),
  );
  const [cornerRadius, setCornerRadius] = useState(() =>
    getTok("radius.md", "12px"),
  );
  const [layoutSpacing, setLayoutSpacing] = useState(() =>
    getTok("spacing.md", "16px"),
  );

  // Sync local visual controls when workspace context changes externally
  useEffect(() => {
    setPrimaryColor(getTok("color.semantic.primary", "#104fc6"));
    setAccentColor(getTok("color.semantic.accent", "#e0561b"));
    setBgColor(getTok("color.semantic.background", "#0e1117"));
    setSurfaceColor(getTok("color.semantic.surface", "#161b22"));
    setTextColor(getTok("color.semantic.text", "#f8fafc"));
    setCornerRadius(getTok("radius.md", "12px"));
    setLayoutSpacing(getTok("spacing.md", "16px"));
  }, [activeContext, resolvedTokens]);

  // Automated Pipeline Sync State
  const [isSyncingPipeline, setIsSyncingPipeline] = useState(false);
  const [pipelineStageStatus, setPipelineStageStatus] = useState<{
    tokensSynced: boolean;
    componentsSynced: boolean;
    docsGenerated: boolean;
    versionCreated: boolean;
    codeCompiled: boolean;
    lastSyncedVersion?: string;
  } | null>(null);

  // Dual Platform Compiled Code State
  const [dualBuild, setDualBuild] = useState<{
    webAppCode: string;
    mobileSwiftAppCode: string;
    webTailwindCss: string;
    iosSwiftCode: string;
    androidKotlinCode: string;
  } | null>(null);

  // Step 3: Version Control State
  const [versionNote, setVersionNote] = useState(
    "Synced visual Figma canvas architecture to production",
  );
  const [versionBump, setVersionBump] = useState<"patch" | "minor" | "major">("minor");
  const [publishingVersion, setPublishingVersion] = useState(false);

  // Step 4: Exporter & Copy State
  const [selectedCodePlatform, setSelectedCodePlatform] = useState<
    "web-react" | "ios-swift" | "android-kotlin" | ExportTarget
  >("web-react");
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadingBundle, setDownloadingBundle] = useState(false);

  const selectedBlock =
    canvasBlocks.find((b) => b.id === selectedBlockId) ?? canvasBlocks[0];

  // Fetch initial dual-platform code build silently
  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/dual-builder/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: workspaceSlug,
        appName,
        appTagline,
        primaryCta: selectedBlock?.ctaLabel || "Launch App",
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.dualBuild) {
          setDualBuild(d.dualBuild);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [workspaceSlug, activeContext]);

  // Apply a 1-click starter template onto the Figma Canvas
  const handleSelectStarterTemplate = async (tpl: StarterTemplate) => {
    setSelectedTemplateId(tpl.id);
    setAppName(tpl.appName);
    setAppTagline(tpl.appTagline);
    setCanvasBlocks(tpl.blocks.map((b) => ({ ...b })));
    setSelectedBlockId(tpl.blocks[0]?.id ?? "");
    setPrimaryColor(tpl.primary);
    setAccentColor(tpl.accent);
    setBgColor(tpl.background);
    setSurfaceColor(tpl.surface);
    setTextColor(tpl.text);
    setCornerRadius(tpl.radius);
    setLayoutSpacing(tpl.spacing);

    // Persist visual tokens immediately to backend so docs & exporters stay in sync
    try {
      const res = await fetch("/api/v1/tokens/quick-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          primary: tpl.primary,
          accent: tpl.accent,
          background: tpl.background,
          surface: tpl.surface,
          text: tpl.text,
          radiusMd: tpl.radius,
          spacingMd: tpl.spacing,
          actor: "Figma Canvas Studio",
        }),
      });
      if (res.ok) {
        const updatedWs = await res.json();
        onWorkspaceUpdated(
          updatedWs,
          `Loaded '${tpl.name}' onto the Figma Canvas & updated design tokens!`,
        );
      }
    } catch {
      // Ignore network hiccup
    }
  };

  // Add a new visual layer block onto the Figma Canvas
  const handleAddBlockToCanvas = (type: CanvasBlock["type"]) => {
    const presets: Record<CanvasBlock["type"], Omit<CanvasBlock, "id">> = {
      hero: {
        type: "hero",
        layerName: "Hero / Announcement Banner",
        title: "New Campus Feature Announcement",
        subtitle: "Designed visually on the Figma Canvas and synced across Web & Mobile.",
        badgeText: "NEW MODULE",
        ctaLabel: "Explore Now",
        metricValue: "100% Synced",
      },
      "id-card": {
        type: "id-card",
        layerName: "Card / Digital Campus Pass",
        title: "Student Engineering Lab Pass",
        subtitle: "Tap phone at door reader or display QR code on web dashboard.",
        badgeText: "VERIFIED ACCESS",
        ctaLabel: "Activate Pass",
        metricValue: "24/7 Access",
      },
      metrics: {
        type: "metrics",
        layerName: "Widget / Live Metric Card",
        title: "Project Milestone Tracker",
        subtitle: "Real-time progress synced with Supernova design tokens.",
        badgeText: "On Track",
        ctaLabel: "View Analytics",
        metricValue: "98.4% Score",
      },
      schedule: {
        type: "schedule",
        layerName: "List / Upcoming Schedule",
        title: "Design Systems Review & Demo",
        subtitle: "2:00 PM · Main University Auditorium",
        badgeText: "Upcoming",
        ctaLabel: "Add to Calendar",
        metricValue: "Auditorium A",
      },
      form: {
        type: "form",
        layerName: "Form / Quick Student Feedback",
        title: "Submit Project or Course Feedback",
        subtitle: "Direct submission to department faculty and project leads.",
        badgeText: "Quick Form",
        ctaLabel: "Send Submission",
        metricValue: "Instant Sync",
      },
    };

    const spec = presets[type];
    const newBlock: CanvasBlock = {
      ...spec,
      id: `layer-${type}-${Date.now()}`,
    };
    setCanvasBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Update the currently selected block's content
  const handleUpdateSelectedBlock = (patch: Partial<CanvasBlock>) => {
    if (!selectedBlock) return;
    setCanvasBlocks((prev) =>
      prev.map((b) => (b.id === selectedBlock.id ? { ...b, ...patch } : b)),
    );
  };

  // Delete a layer block
  const handleDeleteBlock = (id: string) => {
    if (canvasBlocks.length <= 1) return;
    const filtered = canvasBlocks.filter((b) => b.id !== id);
    setCanvasBlocks(filtered);
    if (selectedBlockId === id && filtered[0]) {
      setSelectedBlockId(filtered[0].id);
    }
  };

  // Move layer up or down in the Figma layer stack
  const handleMoveLayer = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= canvasBlocks.length) return;
    const copy = [...canvasBlocks];
    const temp = copy[index]!;
    copy[index] = copy[targetIdx]!;
    copy[targetIdx] = temp;
    setCanvasBlocks(copy);
  };

  // THE CORE AUTOMATION ENGINE:
  // Takes the student's visual Figma Canvas design and automatically:
  // 1. Saves W3C Design Tokens
  // 2. Registers Components & Living Documentation
  // 3. Compiles Production Website + Mobile App Code
  // 4. Publishes a Version Control Snapshot
  const handlePushFigmaToProductionPipeline = async (autoAdvanceToStep?: 2 | 3 | 4) => {
    setIsSyncingPipeline(true);
    try {
      // Stage 1: Persist visual design tokens from Figma Canvas
      const themeRes = await fetch("/api/v1/tokens/quick-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          primary: primaryColor,
          accent: accentColor,
          background: bgColor,
          surface: surfaceColor,
          text: textColor,
          radiusMd: cornerRadius,
          spacingMd: layoutSpacing,
          actor: "Figma Canvas Architecture",
        }),
      });
      let latestWs = themeRes.ok ? await themeRes.json() : null;

      // Stage 2: Compile Simultaneous Website (React/Tailwind) + Mobile App (SwiftUI/Kotlin) + Register Component
      const buildRes = await fetch("/api/v1/dual-builder/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          appName,
          appTagline,
          primaryCta: selectedBlock?.ctaLabel || "Launch App",
          newModuleTitle: selectedBlock?.title || appName,
          newModuleCategory: "Surfaces",
        }),
      });
      if (buildRes.ok) {
        const buildData = await buildRes.json();
        if (buildData.dualBuild) setDualBuild(buildData.dualBuild);
        if (buildData.workspace) latestWs = buildData.workspace;
      }

      // Stage 3: Publish an automatic Version Control Snapshot so the student sees Git/Version history immediately
      const relRes = await fetch("/api/v1/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          bump: "patch",
          note: `Auto-synced from Figma Canvas: ${appName} (${canvasBlocks.length} layers)`,
          actor: "University Student Designer",
        }),
      });
      let syncedVersion = releases[0]?.version ?? "2.5.0";
      if (relRes.ok) {
        const relData = await relRes.json();
        if (relData.release?.version) syncedVersion = relData.release.version;
        if (relData.workspace) latestWs = relData.workspace;
      }

      setPipelineStageStatus({
        tokensSynced: true,
        componentsSynced: true,
        docsGenerated: true,
        versionCreated: true,
        codeCompiled: true,
        lastSyncedVersion: syncedVersion,
      });

      if (latestWs) {
        onWorkspaceUpdated(
          latestWs,
          `Figma Canvas synced! Auto-generated Documentation, Version v${syncedVersion} & Production Web/Mobile Code.`,
        );
      }

      if (autoAdvanceToStep) {
        setActiveStep(autoAdvanceToStep);
      }
    } catch (err) {
      console.warn("Pipeline sync warning:", err);
    } finally {
      setIsSyncingPipeline(false);
    }
  };

  // Publish manual version snapshot in Step 3
  const handlePublishVersionInStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishingVersion(true);
    try {
      const res = await fetch("/api/v1/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          bump: versionBump,
          note: versionNote.trim() || `Canvas update for ${appName}`,
          actor: "Student Lead",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.workspace) {
          onWorkspaceUpdated(
            data.workspace,
            `Published Version v${data.release.version} to Supernova Version Control!`,
          );
        }
        setVersionNote("");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setPublishingVersion(false);
    }
  };

  // Restore a previous version snapshot in Step 3
  const handleRestoreVersionSnapshot = async (version: string) => {
    try {
      const res = await fetch("/api/v1/releases/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace: workspaceSlug,
          version,
          actor: "Student Lead",
        }),
      });
      if (res.ok) {
        const updatedWs = await res.json();
        onWorkspaceUpdated(
          updatedWs,
          `Rolled back design architecture to Version v${version}!`,
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Download all 10 platform files in Step 4
  const handleDownloadAll10Platforms = async () => {
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
        a.download = `${workspaceSlug}-production-code-bundle.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloadingBundle(false);
    }
  };

  // Compute displayed code in Step 4
  const activeCtxObj = contexts.find((c) => c.id === activeContext) ?? contexts[0];
  const displayedProductionCode = (() => {
    if (selectedCodePlatform === "web-react") {
      return (
        dualBuild?.webAppCode ||
        `// React + Tailwind CSS Website Build for ${appName}\nexport function App() {\n  return <div style={{ background: "${bgColor}", color: "${textColor}" }}>${appName}</div>;\n}`
      );
    }
    if (selectedCodePlatform === "ios-swift") {
      return (
        dualBuild?.mobileSwiftAppCode ||
        exportTokens(rawTokens, "swift", activeCtxObj?.overrides, activeContext)
      );
    }
    if (selectedCodePlatform === "android-kotlin") {
      return (
        dualBuild?.androidKotlinCode ||
        exportTokens(rawTokens, "kotlin", activeCtxObj?.overrides, activeContext)
      );
    }
    return exportTokens(
      rawTokens,
      selectedCodePlatform,
      activeCtxObj?.overrides,
      activeContext,
    );
  })();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayedProductionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ==================== TOP STUDENT-FRIENDLY 4-STEP PIPELINE BAR ==================== */}
      <div className="rounded-2xl border border-[#dce2ee] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eef1f6]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#104fc6]">
              <span>UNIVERSITY EDITION · ZERO-EXPERIENCE WORKFLOW</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#475569] font-normal">
                Design once in the built-in Figma Canvas → Automatically generate Docs, Versions & Code
              </span>
            </div>
            <h1 className="mt-1 text-lg sm:text-xl font-bold text-[#0c1222]">
              Integrated Figma Architecture → Supernova Production Pipeline
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handlePushFigmaToProductionPipeline()}
              disabled={isSyncingPipeline}
              className="inline-flex items-center gap-2 rounded-xl bg-[#104fc6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0d3fa0] transition-colors cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isSyncingPipeline
                ? "Syncing Canvas to Production..."
                : "Sync Figma Canvas to Production Pipeline"}
            </button>
            <button
              type="button"
              onClick={onOpenAdvancedStudio}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3.5 py-2.5 text-xs font-semibold text-[#334155] hover:bg-[#eef2f6] transition-colors cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-[#104fc6]" />
              Advanced Engine (MCP / Pulsar / Benchmarks)
            </button>
          </div>
        </div>

        {/* 4 PIPELINE STEP TABS */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: 1 as const,
              title: "1. Figma Design Canvas",
              subtitle: "Visually design Website & Mobile App frames",
              icon: Layers,
              accent: "#104fc6",
              done: true,
            },
            {
              step: 2 as const,
              title: "2. Auto-Documentation",
              subtitle: `Living styleguide & ${components.length} component rules`,
              icon: BookOpen,
              accent: "#e0561b",
              done: Boolean(pipelineStageStatus?.docsGenerated),
            },
            {
              step: 3 as const,
              title: "3. Version Control & Diffs",
              subtitle: `Git snapshots (${releases[0]?.version ? `v${releases[0].version}` : "v2.4.0"}) & rollback`,
              icon: GitBranch,
              accent: "#7c3aed",
              done: Boolean(pipelineStageStatus?.versionCreated),
            },
            {
              step: 4 as const,
              title: "4. Production Code",
              subtitle: "React Web + iOS SwiftUI + Android + 10 formats",
              icon: Code2,
              accent: "#00a396",
              done: Boolean(pipelineStageStatus?.codeCompiled),
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(item.step)}
                className={`group text-left rounded-xl p-3.5 transition-all border cursor-pointer flex items-start justify-between gap-3 ${
                  isActive
                    ? "border-[#104fc6] bg-[#eff4ff]/70 shadow-sm"
                    : "border-[#e2e6ef] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white font-bold text-xs"
                    style={{ backgroundColor: item.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0c1222] truncate">
                      {item.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#64748b] line-clamp-1">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                {item.done && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0d824b] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* AUTOMATED PIPELINE COMPLETION BANNER */}
        {pipelineStageStatus && (
          <div className="mt-4 rounded-xl border border-[#0d824b]/30 bg-[#e6f6ed]/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#064e3b]">
              <CheckCircle2 className="h-4 w-4 text-[#0d824b] shrink-0" />
              <span>
                <strong>Production Pipeline Synced!</strong> Your Figma Canvas automatically updated{" "}
                <strong>{resolvedTokens.length} Design Tokens</strong>, generated{" "}
                <strong>Living Documentation</strong>, published{" "}
                <strong>Version v{pipelineStageStatus.lastSyncedVersion}</strong>, and compiled{" "}
                <strong>Web + Mobile Code</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0c1222] border border-[#0d824b]/30 hover:bg-[#f8fafc] cursor-pointer"
              >
                View Step 2: Docs →
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0c1222] border border-[#0d824b]/30 hover:bg-[#f8fafc] cursor-pointer"
              >
                View Step 3: Versions →
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="rounded-lg bg-[#0d824b] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95 cursor-pointer"
              >
                View Step 4: Code →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===============================================================================================
          STEP 1: BUILT-IN FIGMA DESIGN ARCHITECTURE CANVAS (NO EXTERNAL FIGMA NEEDED)
         =============================================================================================== */}
      {activeStep === 1 && (
        <div className="space-y-5">
          {/* BEGINNER STARTER TEMPLATES BAR */}
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold text-[#0c1222]">
                  New to App Design? Pick a Starter Architecture Template (1-Click):
                </span>
                <span className="ml-2 text-xs text-[#64748b]">
                  Loads complete Website + Mobile App frames, colors, and layers onto the canvas below.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STARTER_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectStarterTemplate(tpl)}
                    className={`text-left rounded-xl p-3.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#104fc6] bg-[#eff4ff]/60 shadow-sm"
                        : "border-[#e2e6ef] bg-[#f8fafc] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0c1222]">
                        {tpl.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="h-3 w-3 rounded-full border border-black/15"
                          style={{ backgroundColor: tpl.primary }}
                        />
                        <span
                          className="h-3 w-3 rounded-full border border-black/15"
                          style={{ backgroundColor: tpl.accent }}
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-[#64748b] line-clamp-2">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-COLUMN FIGMA STUDIO WORKSPACE: LEFT = LAYERS & ADD BLOCKS | CENTER = ARTBOARD CANVAS | RIGHT = INSPECTOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT PANEL (3 COLS): FIGMA FRAMES, LAYERS & 1-CLICK ADD BLOCKS */}
            <div className="lg:col-span-3 rounded-2xl border border-[#e2e6ef] bg-white p-4 shadow-sm space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0c1222]">
                    Figma Layers & Frames
                  </span>
                  <span className="font-mono text-[11px] text-[#64748b]">
                    {canvasBlocks.length} layers
                  </span>
                </div>

                {/* Artboard Frame Filter */}
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#f1f5f9] p-1 text-[11px] font-semibold">
                  {[
                    { id: "both" as const, label: "Web + App" },
                    { id: "web" as const, label: "Website" },
                    { id: "mobile" as const, label: "Mobile" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setArtboardView(mode.id)}
                      className={`rounded-lg py-1.5 transition-colors cursor-pointer ${
                        artboardView === mode.id
                          ? "bg-white text-[#0c1222] shadow-sm"
                          : "text-[#64748b] hover:text-[#0c1222]"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer Hierarchy List */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#64748b] px-1">
                  Click any layer to inspect & edit:
                </div>
                {canvasBlocks.map((block, idx) => {
                  const isSelected = block.id === selectedBlock?.id;
                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs transition-all cursor-pointer border ${
                        isSelected
                          ? "border-[#0d99ff] bg-[#eff8ff] text-[#0c1222] font-semibold"
                          : "border-transparent bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: isSelected ? "#0d99ff" : "#94a3b8",
                          }}
                        />
                        <span className="truncate">{block.layerName}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLayer(idx, -1);
                          }}
                          disabled={idx === 0}
                          title="Move layer up"
                          className="px-1 text-[10px] hover:text-[#0c1222] disabled:opacity-30 cursor-pointer"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLayer(idx, 1);
                          }}
                          disabled={idx === canvasBlocks.length - 1}
                          title="Move layer down"
                          className="px-1 text-[10px] hover:text-[#0c1222] disabled:opacity-30 cursor-pointer"
                        >
                          ↓
                        </button>
                        {canvasBlocks.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id);
                            }}
                            title="Remove layer"
                            className="p-0.5 text-[#dc2626] hover:bg-[#fee2e2] rounded cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 1-Click Add UI Block to Canvas */}
              <div className="pt-3 border-t border-[#eef1f6] space-y-2">
                <div className="text-xs font-bold text-[#0c1222]">
                  + Add UI Component to Canvas
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { type: "hero" as const, label: "+ Hero Banner" },
                    { type: "id-card" as const, label: "+ Student Digital ID Pass" },
                    { type: "metrics" as const, label: "+ Metric / Stats Card" },
                    { type: "schedule" as const, label: "+ Course / Event Schedule" },
                    { type: "form" as const, label: "+ Interactive Action Form" },
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => handleAddBlockToCanvas(btn.type)}
                      className="w-full text-left rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-2 text-xs font-semibold text-[#1e293b] hover:border-[#0d99ff] hover:bg-[#eff8ff] transition-colors cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER PANEL (6 COLS): INTERACTIVE FIGMA INFINITE ARTBOARD CANVAS */}
            <div className="lg:col-span-6 rounded-2xl border border-[#cbd5e1] bg-[#e5e9f0] p-4 shadow-inner space-y-4">
              {/* Figma Canvas Top Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#1e293b] px-3.5 py-2 text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0d99ff]" />
                  <span className="font-semibold">Figma Design Architecture Canvas</span>
                  <span className="text-white/50">·</span>
                  <span className="font-mono text-[11px] text-[#38bdf8]">
                    Click any element on the canvas to edit
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[85, 100, 110].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setCanvasZoom(z)}
                      className={`rounded px-2 py-0.5 font-mono text-[10px] cursor-pointer ${
                        canvasZoom === z
                          ? "bg-[#0d99ff] text-white font-bold"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {z}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Artboards Container */}
              <div
                className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start transition-transform origin-top"
                style={{
                  transform: canvasZoom !== 100 ? `scale(${canvasZoom / 100})` : undefined,
                }}
              >
                {/* ARTBOARD 1: DESKTOP WEBSITE FRAME */}
                {(artboardView === "both" || artboardView === "web") && (
                  <div
                    className={
                      artboardView === "both" ? "xl:col-span-7" : "xl:col-span-12"
                    }
                  >
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-semibold text-[#0d99ff]">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        Frame 1 · Desktop Website (1280 × 800)
                      </span>
                      <span>Auto-Tokenized</span>
                    </div>

                    <div
                      className="rounded-xl border-2 border-[#0d99ff] shadow-lg overflow-hidden transition-colors"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      {/* Website Top Navigation Bar */}
                      <div
                        className="px-4 py-3 border-b border-white/10 flex items-center justify-between"
                        style={{ backgroundColor: surfaceColor }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3.5 w-3.5 rounded"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <span className="text-xs font-bold tracking-tight">
                            {appName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-1 text-[10px] font-semibold text-white"
                            style={{
                              backgroundColor: primaryColor,
                              borderRadius: cornerRadius,
                            }}
                          >
                            Student Portal
                          </span>
                        </div>
                      </div>

                      {/* Website Canvas Layers */}
                      <div
                        className="p-4 space-y-3"
                        style={{ gap: layoutSpacing }}
                      >
                        {canvasBlocks.map((block) => {
                          const isSelected = block.id === selectedBlock?.id;
                          return (
                            <div
                              key={block.id}
                              onClick={() => setSelectedBlockId(block.id)}
                              className={`relative transition-all cursor-pointer ${
                                isSelected
                                  ? "ring-2 ring-[#0d99ff] ring-offset-2 ring-offset-transparent"
                                  : "hover:ring-1 hover:ring-[#0d99ff]/60"
                              }`}
                              style={{
                                backgroundColor:
                                  block.type === "hero" ? primaryColor : surfaceColor,
                                borderRadius: cornerRadius,
                                padding: layoutSpacing,
                              }}
                            >
                              {/* Figma Selection Tag when active */}
                              {isSelected && (
                                <div className=" -top-2.5 right-2 inline-flex items-center gap-1 bg-[#0d99ff] px-2 py-0.5 font-mono text-[9px] font-bold text-white rounded shadow">
                                  <span>{block.layerName}</span>
                                  <span>·</span>
                                  <span>r: {cornerRadius}</span>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span
                                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-white"
                                  style={{
                                    backgroundColor:
                                      block.type === "hero"
                                        ? "rgba(0,0,0,0.28)"
                                        : accentColor,
                                    borderRadius: cornerRadius,
                                  }}
                                >
                                  {block.badgeText}
                                </span>
                                {block.metricValue && (
                                  <span className="font-mono text-xs font-bold opacity-90">
                                    {block.metricValue}
                                  </span>
                                )}
                              </div>

                              <h3
                                className="mt-2 text-sm font-bold"
                                style={{
                                  color: block.type === "hero" ? "#ffffff" : textColor,
                                }}
                              >
                                {block.title}
                              </h3>
                              <p
                                className="mt-1 text-xs opacity-80 leading-relaxed"
                                style={{
                                  color: block.type === "hero" ? "#f8fafc" : textColor,
                                }}
                              >
                                {block.subtitle}
                              </p>

                              <div className="mt-3 flex items-center justify-between">
                                <span
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                                  style={{
                                    backgroundColor:
                                      block.type === "hero" ? accentColor : primaryColor,
                                    borderRadius: cornerRadius,
                                  }}
                                >
                                  {block.ctaLabel} →
                                </span>
                                <span className="font-mono text-[10px] opacity-60">
                                  {block.type}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ARTBOARD 2: NATIVE MOBILE APP FRAME (iOS / ANDROID) */}
                {(artboardView === "both" || artboardView === "mobile") && (
                  <div
                    className={
                      artboardView === "both" ? "xl:col-span-5" : "xl:col-span-12 max-w-sm mx-auto w-full"
                    }
                  >
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-semibold text-[#0d99ff]">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5" />
                        Frame 2 · Mobile App (390 × 844)
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setMobilePreviewOs("ios")}
                          className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                            mobilePreviewOs === "ios"
                              ? "bg-[#0d99ff] text-white"
                              : "text-[#475569]"
                          }`}
                        >
                          iOS
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobilePreviewOs("android")}
                          className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                            mobilePreviewOs === "android"
                              ? "bg-[#0d99ff] text-white"
                              : "text-[#475569]"
                          }`}
                        >
                          Android
                        </button>
                      </div>
                    </div>

                    {/* Phone Bezel Frame */}
                    <div
                      className="rounded-[28px] border-4 border-[#1e293b] shadow-xl overflow-hidden transition-colors"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      {/* Phone Status Bar */}
                      <div className="px-5 pt-2 pb-1 flex items-center justify-between text-[10px] font-mono opacity-75">
                        <span>9:41</span>
                        <span className="h-2.5 w-16 rounded-full bg-black/30" />
                        <span>{mobilePreviewOs === "ios" ? "5G · 100%" : "LTE · 100%"}</span>
                      </div>

                      {/* Mobile App Header */}
                      <div
                        className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between"
                        style={{ backgroundColor: surfaceColor }}
                      >
                        <span className="text-xs font-bold truncate">{appName}</span>
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: accentColor }}
                        />
                      </div>

                      {/* Mobile App Layers (Synchronized with Website Frame!) */}
                      <div className="p-3 space-y-2.5 max-h-[420px] overflow-y-auto">
                        {canvasBlocks.map((block) => {
                          const isSelected = block.id === selectedBlock?.id;
                          return (
                            <div
                              key={block.id}
                              onClick={() => setSelectedBlockId(block.id)}
                              className={`p-3 transition-all cursor-pointer ${
                                isSelected
                                  ? "ring-2 ring-[#0d99ff]"
                                  : "hover:ring-1 hover:ring-[#0d99ff]/50"
                              }`}
                              style={{
                                backgroundColor:
                                  block.type === "hero" ? primaryColor : surfaceColor,
                                borderRadius: cornerRadius,
                              }}
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold uppercase opacity-90">
                                  {block.badgeText}
                                </span>
                                <span className="font-mono opacity-75">
                                  {block.metricValue}
                                </span>
                              </div>
                              <div
                                className="mt-1 text-xs font-bold"
                                style={{
                                  color: block.type === "hero" ? "#ffffff" : textColor,
                                }}
                              >
                                {block.title}
                              </div>
                              <div
                                className="mt-1 text-[11px] opacity-80 line-clamp-2"
                                style={{
                                  color: block.type === "hero" ? "#f8fafc" : textColor,
                                }}
                              >
                                {block.subtitle}
                              </div>
                              <div
                                className="mt-2.5 w-full py-1.5 text-center text-[11px] font-semibold text-white"
                                style={{
                                  backgroundColor:
                                    block.type === "hero" ? accentColor : primaryColor,
                                  borderRadius: cornerRadius,
                                }}
                              >
                                {block.ctaLabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile Bottom Tab Bar */}
                      <div
                        className="px-4 py-2 border-t border-white/10 grid grid-cols-3 text-center text-[10px] font-semibold"
                        style={{ backgroundColor: surfaceColor }}
                      >
                        <span style={{ color: primaryColor }}>● Home</span>
                        <span className="opacity-60">Pass</span>
                        <span className="opacity-60">Profile</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL (3 COLS): FIGMA PROPERTIES & DESIGN TOKEN INSPECTOR */}
            <div className="lg:col-span-3 rounded-2xl border border-[#e2e6ef] bg-white p-4 shadow-sm space-y-5">
              {/* Section A: Selected Layer Content Editor */}
              {selectedBlock && (
                <div className="space-y-3 pb-4 border-b border-[#eef1f6]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0d99ff]">
                      Selected Layer Inspector
                    </span>
                    <span className="font-mono text-[10px] text-[#64748b]">
                      {selectedBlock.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Heading / Title Text
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.title}
                      onChange={(e) =>
                        handleUpdateSelectedBlock({ title: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#0c1222]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Description / Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={selectedBlock.subtitle}
                      onChange={(e) =>
                        handleUpdateSelectedBlock({ subtitle: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#0c1222]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Badge / Status
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.badgeText}
                        onChange={(e) =>
                          handleUpdateSelectedBlock({ badgeText: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1.5 text-xs text-[#0c1222]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.ctaLabel}
                        onChange={(e) =>
                          handleUpdateSelectedBlock({ ctaLabel: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1.5 text-xs text-[#0c1222]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section B: Visual Design System Tokens (Colors, Radius, Spacing) */}
              <div className="space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#0c1222]">
                  Global Design System Style
                </div>

                {/* Quick 1-Click Color Palettes */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1.5">
                    1-Click Color Theme Presets
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_COLOR_THEMES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setAccentColor(preset.accent);
                          setBgColor(preset.background);
                          setSurfaceColor(preset.surface);
                          setTextColor(preset.text);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#dcdfe6] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-medium text-[#0c1222] hover:bg-white cursor-pointer"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-[#64748b] mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2 py-1">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-5 w-5 cursor-pointer border-0 bg-transparent"
                      />
                      <span className="font-mono text-xs text-[#0c1222]">
                        {primaryColor}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#64748b] mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2 py-1">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-5 w-5 cursor-pointer border-0 bg-transparent"
                      />
                      <span className="font-mono text-xs text-[#0c1222]">
                        {accentColor}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#64748b] mb-1">
                      Canvas Background
                    </label>
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2 py-1">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-5 w-5 cursor-pointer border-0 bg-transparent"
                      />
                      <span className="font-mono text-xs text-[#0c1222]">{bgColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#64748b] mb-1">
                      Card Surface
                    </label>
                    <div className="flex items-center gap-1.5 rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-2 py-1">
                      <input
                        type="color"
                        value={surfaceColor}
                        onChange={(e) => setSurfaceColor(e.target.value)}
                        className="h-5 w-5 cursor-pointer border-0 bg-transparent"
                      />
                      <span className="font-mono text-xs text-[#0c1222]">
                        {surfaceColor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corner Roundness Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Corner Roundness (radius.md: {cornerRadius})
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["4px", "10px", "16px", "24px"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCornerRadius(r)}
                        className={`rounded-lg py-1.5 font-mono text-xs border cursor-pointer ${
                          cornerRadius === r
                            ? "border-[#104fc6] bg-[#eff4ff] text-[#104fc6] font-bold"
                            : "border-[#dcdfe6] bg-[#f8fafc] text-[#475569]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Layout Padding (spacing.md: {layoutSpacing})
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["12px", "16px", "24px"].map((sp) => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => setLayoutSpacing(sp)}
                        className={`rounded-lg py-1.5 font-mono text-xs border cursor-pointer ${
                          layoutSpacing === sp
                            ? "border-[#104fc6] bg-[#eff4ff] text-[#104fc6] font-bold"
                            : "border-[#dcdfe6] bg-[#f8fafc] text-[#475569]"
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary CTA: Push to Next Production Level */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => handlePushFigmaToProductionPipeline(2)}
                    disabled={isSyncingPipeline}
                    className="w-full rounded-xl bg-[#104fc6] py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-[#0d3fa0] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {isSyncingPipeline
                        ? "Syncing to Supernova..."
                        : "Save & Go to Step 2: Auto-Docs →"}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-[#64748b]">
                    Automatically extracts tokens, builds docs, commits a version & compiles code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================================================
          STEP 2: AUTOMATIC LIVING DOCUMENTATION (GENERATED FROM YOUR FIGMA CANVAS)
         =============================================================================================== */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eef1f6] pb-4">
              <div>
                <div className="text-xs font-semibold text-[#e0561b]">
                  STEP 2 OF 4 · AUTOMATIC LIVING DOCUMENTATION PORTAL
                </div>
                <h2 className="mt-1 text-xl font-bold text-[#0c1222]">
                  {appName} — Design System Documentation
                </h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  This documentation is automatically generated from the colors, shapes, and components you designed in Step 1.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-white cursor-pointer"
                >
                  ← Back to Figma Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="rounded-xl bg-[#7c3aed] px-4 py-2 text-xs font-semibold text-white hover:opacity-95 cursor-pointer"
                >
                  Next: Step 3 Version Control →
                </button>
              </div>
            </div>

            {/* 1. AUTO-GENERATED COLOR TOKENS SWATCH TABLE */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0c1222]">
                1. Brand & Semantic Color Architecture (Synced from Canvas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  {
                    token: "color.semantic.primary",
                    label: "Primary Brand",
                    hex: primaryColor,
                    usage: "Primary buttons, active states, links",
                  },
                  {
                    token: "color.semantic.accent",
                    label: "Highlight Accent",
                    hex: accentColor,
                    usage: "Status badges, notifications, highlights",
                  },
                  {
                    token: "color.semantic.background",
                    label: "Canvas Background",
                    hex: bgColor,
                    usage: "Page and mobile screen root background",
                  },
                  {
                    token: "color.semantic.surface",
                    label: "Elevated Surface",
                    hex: surfaceColor,
                    usage: "Cards, navigation bars, modals",
                  },
                  {
                    token: "color.semantic.text",
                    label: "Primary Text Ink",
                    hex: textColor,
                    usage: "Headings and high-contrast body copy",
                  },
                ].map((swatch) => (
                  <div
                    key={swatch.token}
                    className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] overflow-hidden"
                  >
                    <div
                      className="h-16 w-full border-b border-black/10"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-[#0c1222]">
                        {swatch.label}
                      </div>
                      <div className="font-mono text-[11px] font-semibold text-[#104fc6]">
                        {swatch.hex}
                      </div>
                      <div className="font-mono text-[10px] text-[#64748b] truncate">
                        {swatch.token}
                      </div>
                      <p className="text-[11px] text-[#475569] pt-1">
                        {swatch.usage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. AUTO-GENERATED CANVAS COMPONENT SPECIFICATIONS */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#0c1222]">
                2. Canvas Component Specifications & Live Sandbox ({canvasBlocks.length} Canvas Layers)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canvasBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0c1222]">
                        {block.layerName}
                      </span>
                      <span className="font-mono text-[11px] text-[#0d824b] font-semibold">
                        ● 100% Token Bound
                      </span>
                    </div>

                    {/* Live Mini Component Render */}
                    <div
                      className="p-3.5 shadow-sm"
                      style={{
                        backgroundColor:
                          block.type === "hero" ? primaryColor : surfaceColor,
                        color: block.type === "hero" ? "#ffffff" : textColor,
                        borderRadius: cornerRadius,
                      }}
                    >
                      <div className="text-[10px] font-bold uppercase opacity-80">
                        {block.badgeText}
                      </div>
                      <div className="mt-1 text-xs font-bold">{block.title}</div>
                      <div className="mt-1 text-[11px] opacity-80">
                        {block.subtitle}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-[#e6f6ed]/70 p-2.5 text-[#064e3b]">
                        <strong>✓ DO:</strong> Bind to{" "}
                        <code className="font-mono">color.semantic.primary</code> and{" "}
                        <code className="font-mono">radius.md ({cornerRadius})</code>.
                      </div>
                      <div className="rounded-lg bg-[#fee2e2]/70 p-2.5 text-[#7f1d1d]">
                        <strong>✕ DON&apos;T:</strong> Hardcode raw pixel values or unapproved hex codes.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================================================
          STEP 3: AUTOMATIC SUPERNOVA VERSION CONTROL, BRANCHING & DIFFS
         =============================================================================================== */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eef1f6] pb-4">
              <div>
                <div className="text-xs font-semibold text-[#7c3aed]">
                  STEP 3 OF 4 · AUTOMATIC DESIGN VERSION CONTROL & DIFFS
                </div>
                <h2 className="mt-1 text-xl font-bold text-[#0c1222]">
                  Git-Style Version History, Change Diffs & Rollback
                </h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  Every change you make on the Figma Canvas is tracked. Publish immutable snapshots or roll back anytime.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-white cursor-pointer"
                >
                  ← Back to Docs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="rounded-xl bg-[#00a396] px-4 py-2 text-xs font-semibold text-white hover:opacity-95 cursor-pointer"
                >
                  Next: Step 4 Production Code →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Publish New Snapshot */}
              <form
                onSubmit={handlePublishVersionInStep3}
                className="lg:col-span-5 rounded-xl border border-[#e2e6ef] bg-[#f8fafc] p-5 space-y-4"
              >
                <h3 className="text-sm font-bold text-[#0c1222]">
                  Create New Design Version Snapshot
                </h3>
                <p className="text-xs text-[#64748b]">
                  Save your current Figma Canvas colors, spacing, and components as an official version release.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Version Increment Type
                  </label>
                  <select
                    value={versionBump}
                    onChange={(e) => setVersionBump(e.target.value as any)}
                    className="w-full rounded-xl border border-[#dcdfe6] bg-white px-3 py-2 text-xs text-[#0c1222]"
                  >
                    <option value="patch">Patch Update (Small color / text tweak)</option>
                    <option value="minor">Minor Release (New canvas section or theme)</option>
                    <option value="major">Major Release (Complete redesign)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    What did you change? (Changelog Note)
                  </label>
                  <input
                    type="text"
                    value={versionNote}
                    onChange={(e) => setVersionNote(e.target.value)}
                    placeholder="e.g., Updated university portal primary blue and ID card"
                    className="w-full rounded-xl border border-[#dcdfe6] bg-white px-3 py-2 text-xs text-[#0c1222]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishingVersion}
                  className="w-full rounded-xl bg-[#7c3aed] py-2.5 text-xs font-bold text-white hover:opacity-95 cursor-pointer disabled:opacity-50"
                >
                  {publishingVersion
                    ? "Publishing Snapshot..."
                    : "Publish Immutable Version Snapshot"}
                </button>
              </form>

              {/* Right 7 Cols: Version History & 1-Click Rollback */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-bold text-[#0c1222]">
                  Published Version History ({releases.length} Snapshots)
                </h3>
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {releases.map((rel, idx) => (
                    <div
                      key={rel.version}
                      className="rounded-xl border border-[#e2e6ef] bg-white p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#0c1222]">
                            v{rel.version}
                          </span>
                          {idx === 0 && (
                            <span className="text-[11px] font-semibold text-[#0d824b]">
                              · Latest Active Release
                            </span>
                          )}
                          <span className="text-xs text-[#64748b]">
                            · by {rel.author}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#475569]">{rel.note}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#64748b]">
                          {rel.tokenCount} tokens
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRestoreVersionSnapshot(rel.version)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#dcdfe6] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#0c1222] hover:bg-[#eef2f6] cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore v{rel.version}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================================================
          STEP 4: PRODUCTION CODE & MULTI-PLATFORM EXPORT (WEBSITE + MOBILE APP)
         =============================================================================================== */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#e2e6ef] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eef1f6] pb-4">
              <div>
                <div className="text-xs font-semibold text-[#00a396]">
                  STEP 4 OF 4 · AUTOMATIC PRODUCTION CODE GENERATION
                </div>
                <h2 className="mt-1 text-xl font-bold text-[#0c1222]">
                  Ready-to-Run Website & Mobile App Code ({appName})
                </h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  Your Figma Canvas design is automatically compiled into React, iOS SwiftUI, Android Kotlin, and 10 design token formats.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="rounded-xl border border-[#dcdfe6] bg-[#f8fafc] px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-white cursor-pointer"
                >
                  ← Edit Figma Canvas
                </button>
                <button
                  type="button"
                  onClick={handleDownloadAll10Platforms}
                  disabled={downloadingBundle}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00a396] px-4 py-2 text-xs font-semibold text-white hover:opacity-95 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloadingBundle
                    ? "Packaging 10 Files..."
                    : "Download All 10 Platform Files (.json)"}
                </button>
              </div>
            </div>

            {/* Platform Target Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "web-react" as const, label: "Website (React + Tailwind)" },
                { id: "ios-swift" as const, label: "iOS Mobile App (SwiftUI)" },
                { id: "android-kotlin" as const, label: "Android App (Jetpack Compose)" },
                { id: "css" as const, label: "CSS Variables (tokens.css)" },
                { id: "tailwind" as const, label: "Tailwind v4 (@theme)" },
                { id: "flutter" as const, label: "Flutter (Dart)" },
                { id: "json" as const, label: "W3C DTCG Tokens (.json)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCodePlatform(tab.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer border ${
                    selectedCodePlatform === tab.id
                      ? "border-[#00a396] bg-[#00a396] text-white shadow-sm"
                      : "border-[#dcdfe6] bg-[#f8fafc] text-[#475569] hover:text-[#0c1222]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Output Viewer */}
            <div className="rounded-2xl bg-[#0c1222] p-5 text-white space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-[#38bdf8]">
                  Compiled from Figma Canvas · {appName} · Version v{releases[0]?.version ?? "2.4.0"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#10b981]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="max-h-[420px] overflow-auto font-mono text-xs text-[#e2e8f0] leading-relaxed">
                {displayedProductionCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
