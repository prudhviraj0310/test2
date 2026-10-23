import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Paperclip,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  ExternalLink,
  Terminal,
  GitBranch,
  Layers,
  BookOpen,
  Code2,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  Users,
  Building2,
  Zap,
  Search,
} from "lucide-react";
import { EXPORT_TARGETS, type ExportTarget, type ResolvedToken } from "../lib/ds/engine";
import type { DSComponent, SelfHealingIssue } from "../lib/ds/seed";

export type WebsitePageId =
  | "overview"
  | "management"
  | "documentation"
  | "for-ai"
  | "pricing"
  | "enterprise"
  | "customers"
  | "integrations"
  | "learn"
  | "auth";

interface SupernovaWebsiteProps {
  activePage: WebsitePageId;
  onSelectPage: (page: WebsitePageId) => void;
  onLaunchDemo: (initialPillar?: "manage" | "document" | "deliver" | "improve") => void;
  tokens: ResolvedToken[];
  components: DSComponent[];
  selfHealingIssues: SelfHealingIssue[];
  workspaceSlug: string;
}

// Official Supernova 3-Loop Clover / Knot Logo SVG
export const SupernovaCloverLogo: React.FC<{ className?: string }> = ({
  className = "h-6 w-6",
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 4C13.2 4 11 6.2 11 9C11 11.8 13.2 14 16 14C18.8 14 21 11.8 21 9C21 6.2 18.8 4 16 4ZM9 11C6.2 11 4 13.2 4 16C4 18.8 6.2 21 9 21C11.8 21 14 18.8 14 16C14 13.2 11.8 11 9 11ZM23 11C20.2 11 18 13.2 18 16C18 18.8 20.2 21 23 21C25.8 21 28 18.8 28 16C28 13.2 25.8 11 23 11ZM16 18C13.2 18 11 20.2 11 23C11 25.8 13.2 28 16 28C18.8 28 21 25.8 21 23C21 20.2 18.8 18 16 18Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="2.2" fill="currentColor" />
  </svg>
);

export const SupernovaLogo: React.FC<{ className?: string; showWordmark?: boolean }> = ({
  className = "h-5",
  showWordmark = true,
}) => (
  <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
    <SupernovaCloverLogo className="h-5 w-5" />
    {showWordmark && (
      <span className="font-semibold tracking-tight text-[19px] leading-none">
        supernova
      </span>
    )}
  </span>
);

const INTEGRATIONS_LIST = [
  {
    name: "Figma Variables & Styles",
    category: "Design",
    logo: "/static/images/integrations/figma/figma-logo.svg",
    desc: "Bi-directional sync with Figma Variables, styles, and multi-brand component libraries.",
  },
  {
    name: "Storybook CSF3",
    category: "Components",
    logo: "/static/images/integrations/storybook/storybook-logo.svg",
    desc: "Embed live CSF3 stories, props tables, and component parity statuses inside Living Docs.",
  },
  {
    name: "Tokens Studio",
    category: "Design",
    logo: "/static/images/integrations/tokens-studio/tokens-studio-icon.svg",
    desc: "Native W3C DTCG JSON import/export with 500-level alias chain resolution.",
  },
  {
    name: "Claude Code (MCP)",
    category: "AI Agents",
    logo: "/static/images/integrations/claude/claude-logo.svg",
    desc: "Scoped Model Context Protocol server feeding exact semantic tokens to Claude Code.",
  },
  {
    name: "Cursor IDE",
    category: "AI Agents",
    logo: "/static/images/integrations/cursor/cursor-logo.svg",
    desc: "Zero-hallucination UI generation in Cursor using scoped MCP rules and /llms.txt.",
  },
  {
    name: "VS Code",
    category: "IDEs",
    logo: "/static/images/integrations/vscode/vs-code-logo.svg",
    desc: "Inline token autocomplete, color swatches, and AST compliance diagnostics.",
  },
  {
    name: "GitHub Actions & PRs",
    category: "Code Delivery",
    logo: "/static/images/integrations/github/github-logo.svg",
    desc: "Automated Pull Requests whenever tokens or branches are published.",
  },
  {
    name: "GitLab CI",
    category: "Code Delivery",
    logo: "/static/images/integrations/gitlab/gitlab-logo.svg",
    desc: "Multi-repository merge request pipelines for web and mobile token packages.",
  },
  {
    name: "Bitbucket Pipelines",
    category: "Code Delivery",
    logo: "/static/images/integrations/bitbucket/bitbucket-logo.svg",
    desc: "Enterprise repository webhooks and automated token package delivery.",
  },
  {
    name: "Azure DevOps",
    category: "Code Delivery",
    logo: "/static/images/integrations/azure/azure-logo.svg",
    desc: "Automated build triggers and enterprise SSO integration with Azure AD.",
  },
  {
    name: "React & Tailwind v4",
    category: "Frameworks",
    logo: "/static/images/integrations/react/react-logo.svg",
    desc: "Deterministic @theme CSS variables and typed React token hooks via Pulsar.",
  },
  {
    name: "v0 by Vercel",
    category: "AI Agents",
    logo: "/static/images/integrations/v0/v0-logo.svg",
    desc: "Ground generative UI prototypes in your real Orion, Vega, and Luna brand tokens.",
  },
  {
    name: "Lovable",
    category: "AI Agents",
    logo: "/static/images/integrations/lovable/lovable-logo.svg",
    desc: "Connect your design system context directly to full-stack AI app builders.",
  },
  {
    name: "Raycast",
    category: "Productivity",
    logo: "/static/images/integrations/raycast/raycast-logo.svg",
    desc: "Instant command-bar lookup for any token, SVG icon, or documentation block.",
  },
  {
    name: "Lottie Animations",
    category: "Assets",
    logo: "/static/images/integrations/lottie/lottie-logo.svg",
    desc: "Manage and document motion tokens and interactive vector animations.",
  },
];

export const SupernovaWebsite: React.FC<SupernovaWebsiteProps> = ({
  activePage,
  onSelectPage,
  onLaunchDemo,
  tokens,
  components,
  selfHealingIssues,
  workspaceSlug,
}) => {
  // Interactive state for the Home & Product showcases
  const [openDropdown, setOpenDropdown] = useState<"product" | "resources" | null>(null);
  const [heroToggleOn, setHeroToggleOn] = useState(true);
  const [heroStep, setHeroStep] = useState<0 | 1 | 2>(0);
  const [selectedBrandCard, setSelectedBrandCard] = useState<"orion" | "vega" | "luna">("orion");
  const [activeDocTab, setActiveDocTab] = useState<"Overview" | "Styles" | "Code" | "Accessibility">("Styles");
  const [restoredSnapshot, setRestoredSnapshot] = useState("Sep 4, 11:33 AM · Anna Kowalski");
  const [selectedMcpFilter, setSelectedMcpFilter] = useState<"checkout" | "marketing" | "mobile">("mobile");
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineDone, setPipelineDone] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);
  const [integrationFilter, setIntegrationFilter] = useState("All");
  const [copiedMcp, setCopiedMcp] = useState(false);
  const [promptInputManage, setPromptInputManage] = useState(
    "Add Figma data, variables, storybook and code components...",
  );
  const [promptInputDoc, setPromptInputDoc] = useState(
    "Create a new page for Button component - Styles.",
  );
  const [promptInputHeal, setPromptInputHeal] = useState(
    "Suggest solutions for reported issues in Checkout Button and SurfaceCard...",
  );
  const [scrolledToLight, setScrolledToLight] = useState(false);
  const [activeScrollPillar, setActiveScrollPillar] = useState<0 | 1 | 2 | 3>(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolledToLight(y > 980);
      if (y > 2900) setActiveScrollPillar(3);
      else if (y > 2250) setActiveScrollPillar(2);
      else if (y > 1650) setActiveScrollPillar(1);
      else setActiveScrollPillar(0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDarkHeroPage = activePage === "overview" && !scrolledToLight;

  const brandPalette = {
    orion: {
      name: "Orion",
      primary: "#104FC6",
      accent: "#e05d26",
      radius: "10px",
      badge: "Flagship Dark Matter",
    },
    vega: {
      name: "Vega",
      primary: "#635bff",
      accent: "#3b82f6",
      radius: "14px",
      badge: "Consumer Violet",
    },
    luna: {
      name: "LUNA",
      primary: "#d97706",
      accent: "#0891b2",
      radius: "6px",
      badge: "Enterprise Warm",
    },
  }[selectedBrandCard];

  const handleTriggerPipeline = () => {
    setPipelineRunning(true);
    setPipelineDone(false);
    setTimeout(() => {
      setPipelineRunning(false);
      setPipelineDone(true);
    }, 900);
  };

  return (
    <div
      className="min-h-screen font-sans selection:bg-[#1055e5]/20 selection:text-[#1055e5]"
      onClick={() => setOpenDropdown(null)}
    >
      {/* ==================== STICKY SUPERNOVA NAVIGATION BAR ==================== */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          isDarkHeroPage
            ? "border-white/10 bg-[#040b24]/90 text-white backdrop-blur-md"
            : "border-[#dfe4ec] bg-[#f3f5f8]/95 text-[#0b1224] backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Official Supernova Clover Mark + Wordmark */}
          <button
            type="button"
            onClick={() => {
              onSelectPage("overview");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer shrink-0"
          >
            <SupernovaCloverLogo className="h-6 w-6" />
            <span className="text-lg font-semibold tracking-tight">supernova</span>
          </button>

          {/* Center: Product ▾, Resources ▾, Pricing, Enterprise, Customers */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((cur) => (cur === "product" ? null : "product"))
                }
                className={`inline-flex items-center gap-1 py-1 transition-opacity cursor-pointer ${
                  isDarkHeroPage
                    ? "text-white/90 hover:text-white"
                    : "text-[#0b1224] hover:text-[#1055e5]"
                }`}
              >
                <span>Product</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </button>

              {openDropdown === "product" && (
                <div className="absolute left-0 top-10 w-80 rounded-2xl border border-[#dfe4ec] bg-white p-2.5 text-[#0b1224] shadow-2xl">
                  {[
                    {
                      id: "management" as WebsitePageId,
                      num: "01",
                      title: "Design System Management",
                      desc: "Centralize tokens, Figma Variables & component health",
                    },
                    {
                      id: "documentation" as WebsitePageId,
                      num: "02",
                      title: "Living Documentation",
                      desc: "37-block AST editor, page history & Storybook embeds",
                    },
                    {
                      id: "for-ai" as WebsitePageId,
                      num: "03",
                      title: "For AI Agents (Scoped MCP)",
                      desc: "Deliver filtered context to Claude Code, Cursor & VS Code",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectPage(item.id);
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-start gap-3 rounded-xl p-3 text-left hover:bg-[#f3f5f8] transition-colors cursor-pointer"
                    >
                      <span className="mt-0.5 rounded bg-[#1055e5]/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#1055e5]">
                        {item.num}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0b1224]">{item.title}</div>
                        <div className="mt-0.5 text-[11px] text-[#5b667a]">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                  <div className="mt-1 border-t border-[#dfe4ec] pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onLaunchDemo("manage");
                      }}
                      className="flex w-full items-center justify-between rounded-xl bg-[#1055e5] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#0d47c2] cursor-pointer"
                    >
                      <span>Open Interactive Supernova Studio</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((cur) => (cur === "resources" ? null : "resources"))
                }
                className={`inline-flex items-center gap-1 py-1 transition-opacity cursor-pointer ${
                  isDarkHeroPage
                    ? "text-white/90 hover:text-white"
                    : "text-[#0b1224] hover:text-[#1055e5]"
                }`}
              >
                <span>Resources</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </button>

              {openDropdown === "resources" && (
                <div className="absolute left-0 top-10 w-72 rounded-2xl border border-[#dfe4ec] bg-white p-2.5 text-[#0b1224] shadow-2xl">
                  {[
                    {
                      id: "integrations" as WebsitePageId,
                      title: "Integrations Directory",
                      desc: "Figma, Storybook, GitHub, Claude, Cursor & 10+ more",
                    },
                    {
                      id: "learn" as WebsitePageId,
                      title: "Contexts 101 & Learn Hub",
                      desc: "Guides on W3C DTCG tokens, Pulsar & Scoped MCP",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectPage(item.id);
                        setOpenDropdown(null);
                      }}
                      className="block w-full rounded-xl p-3 text-left hover:bg-[#f3f5f8] transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold text-[#0b1224]">{item.title}</div>
                      <div className="mt-0.5 text-[11px] text-[#5b667a]">{item.desc}</div>
                    </button>
                  ))}
                  <a
                    href={`/llms.txt?workspace=${encodeURIComponent(workspaceSlug)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl p-3 text-xs font-mono font-semibold text-[#1055e5] hover:bg-[#f3f5f8]"
                  >
                    <span>/llms.txt Machine Index</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelectPage("integrations")}
              className={`cursor-pointer transition-colors ${
                activePage === "integrations"
                  ? "text-[#4785ff] font-semibold"
                  : isDarkHeroPage
                    ? "text-white/90 hover:text-white"
                    : "text-[#0b1224] hover:text-[#1055e5]"
              }`}
            >
              Integrations
            </button>
            <button
              type="button"
              onClick={() => onSelectPage("enterprise")}
              className={`cursor-pointer transition-colors ${
                activePage === "enterprise"
                  ? "text-[#4785ff] font-semibold"
                  : isDarkHeroPage
                    ? "text-white/90 hover:text-white"
                    : "text-[#0b1224] hover:text-[#1055e5]"
              }`}
            >
              Enterprise
            </button>
            <button
              type="button"
              onClick={() => onSelectPage("customers")}
              className={`cursor-pointer transition-colors ${
                activePage === "customers"
                  ? "text-[#4785ff] font-semibold"
                  : isDarkHeroPage
                    ? "text-white/90 hover:text-white"
                    : "text-[#0b1224] hover:text-[#1055e5]"
              }`}
            >
              Customers
            </button>
          </nav>

          {/* Right: Log in + Pill CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSelectPage("auth")}
              className={`text-sm font-medium cursor-pointer ${
                isDarkHeroPage
                  ? "text-white/90 hover:text-white"
                  : "text-[#0b1224] hover:text-[#1055e5]"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              data-testid="launch-live-demo-btn"
              onClick={() => onLaunchDemo("manage")}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                isDarkHeroPage
                  ? "bg-white text-[#040b24] hover:bg-white/90"
                  : "bg-[#1055e5] text-white hover:bg-[#0d47c2]"
              }`}
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== PAGE 1: HOME / OVERVIEW (EXACT SUPERNOVA.IO CLONE) ==================== */}
      {activePage === "overview" && (
        <div>
          {/* PART A: DEEP MIDNIGHT ROYAL BLUE HERO + ARCHITECTURAL GRID + CUSTOMER MATRIX */}
          <section
            className="relative overflow-hidden bg-[#040b24] text-white"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 24%, rgba(22, 86, 224, 0.36) 0%, rgba(4, 11, 36, 0) 68%),
                linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "100% 100%, 64px 64px, 64px 64px",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
              {/* Top Pill Banner */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onSelectPage("for-ai")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm hover:border-white/30 cursor-pointer"
                >
                  <span>Supernova Scoped MCP Server — Explore live agent context</span>
                  <span className="text-[#f59e0b]">⚡</span>
                </button>
              </div>

              {/* Hero Display Typography */}
              <div className="mx-auto mt-7 max-w-4xl text-center">
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-medium tracking-[-0.03em] leading-[1.05]">
                  <span className="block text-white">Get your design system</span>
                  <span className="block text-[#4785ff] font-semibold mt-1">
                    ready for the agents.
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                  Supernova holds your design and code data in one place — documented,
                  in sync, and handed straight to your teams and agents.
                </p>

                {/* Dual CTAs (White Pill + Ghost Link) */}
                <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => onLaunchDemo("manage")}
                    className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#040b24] shadow-lg hover:bg-white/90 transition-all cursor-pointer"
                  >
                    <span>Launch Live Demo</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPage("auth")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white cursor-pointer"
                  >
                    <span>Start for free</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Hero Showcase Stage (Matching the video/token stage in real-supernova-website.png) */}
              <div className="mt-14 rounded-2xl border border-white/15 bg-[#050d2a]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left: Floating Token Pill & Interactive Switch (From Hero Video Frame) */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="inline-flex items-center gap-3 rounded-xl border border-[#2b5cdd]/40 bg-[#091945] px-4 py-2.5 font-mono text-xs sm:text-sm text-white shadow-inner">
                      <span
                        className="h-4 w-4 rounded-sm shadow-sm transition-colors"
                        style={{
                          backgroundColor: heroToggleOn ? "#104FC6" : "#635bff",
                        }}
                      />
                      <span className="text-white/90">color.primary</span>
                      <span className="text-[#6ca0ff] font-semibold">
                        {heroToggleOn ? "#104FC6" : "#635BFF"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {heroStep === 0 && "1. Extract tokens & components from Figma and Storybook"}
                      {heroStep === 1 && "2. Auto-generate Living Documentation & multi-brand themes"}
                      {heroStep === 2 && "3. Stream scoped context to Claude Code, Cursor & GitHub PRs"}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Toggle the live component switch or step through the agentic pipeline below
                      to see how a single token mutation propagates across Figma Variables, React,
                      SwiftUI, and Scoped MCP servers.
                    </p>

                    {/* Interactive Toggle Switch from Hero Frame */}
                    <div className="flex items-center gap-4 pt-1">
                      <button
                        type="button"
                        onClick={() => setHeroToggleOn((v) => !v)}
                        className={`relative inline-flex h-11 w-20 items-center rounded-full border border-white/15 p-1 transition-colors cursor-pointer ${
                          heroToggleOn ? "bg-[#104FC6]" : "bg-[#1e293b]"
                        }`}
                        aria-label="Toggle primary brand token"
                      >
                        <span
                          className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                            heroToggleOn ? "translate-x-9" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <span className="font-mono text-xs text-white/75">
                        Interactive Switch ·{" "}
                        <strong className="text-white">
                          {heroToggleOn ? "Orion (#104FC6)" : "Vega (#635BFF)"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: Live Synced Agent & Code Output Preview */}
                  <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#03081c] p-5 font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                        <span className="text-white/80">
                          supernova-mcp-server · branch: main
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLaunchDemo("deliver")}
                        className="text-[#4785ff] hover:text-white cursor-pointer"
                      >
                        Open in Studio →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-white/10 bg-[#071130] p-3.5 space-y-1.5">
                        <div className="text-[10px] uppercase text-[#6ca0ff]">
                          Tailwind v4 @theme Output
                        </div>
                        <pre className="text-[11px] text-white/90 overflow-x-auto">
{`@theme {
  --color-primary: ${heroToggleOn ? "#104FC6" : "#635BFF"};
  --color-surface: #0e1117;
  --radius-button: 10px;
}`}
                        </pre>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-[#071130] p-3.5 space-y-1.5">
                        <div className="text-[10px] uppercase text-[#10b981]">
                          Claude Code / Cursor MCP Stream
                        </div>
                        <pre className="text-[11px] text-white/90 overflow-x-auto">
{`{
  "tool": "get_token",
  "path": "color.semantic.primary",
  "resolved": "${heroToggleOn ? "#104FC6" : "#635BFF"}",
  "health": "Healthy (98%)"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Video-Style Scrubber Bar (From real-supernova-website.png) */}
                <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setHeroStep((s) => ((s + 1) % 3) as 0 | 1 | 2)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/15 cursor-pointer"
                    title="Next pipeline step"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    {[
                      { idx: 0 as const, label: "01 Extract & Sync Figma" },
                      { idx: 1 as const, label: "02 Living Documentation AST" },
                      { idx: 2 as const, label: "03 Scoped MCP & Code PRs" },
                    ].map((st) => (
                      <button
                        key={st.idx}
                        type="button"
                        onClick={() => setHeroStep(st.idx)}
                        className={`flex-1 rounded-full py-1.5 text-center font-mono text-[11px] transition-all cursor-pointer ${
                          heroStep === st.idx
                            ? "bg-[#1055e5] text-white font-semibold"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchDemo("manage")}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80 hover:text-white cursor-pointer"
                  >
                    Interactive Mode
                  </button>
                </div>
              </div>

              {/* DESIGN SYSTEMS IN PRODUCTION AT LEADING BRANDS (4x2 Architectural Crosshair Grid) */}
              <div className="mt-24">
                <h2 className="text-center text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  Design systems in production at{" "}
                  <span className="text-[#4785ff] font-semibold">leading</span> brands
                </h2>

                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border border-white/10 bg-[#050d28]/60">
                  {[
                    {
                      name: "userlane",
                      logo: "/static/images/customers/userlane/logo-burrito.svg",
                      hasLink: true,
                    },
                    { name: "ABInBev", textLogo: "ABInBev", hasLink: false },
                    { name: "Biogen", textLogo: "Biogen.", hasLink: false },
                    {
                      name: "MEWS",
                      logo: "/static/images/customers/mews/logo-mews-design-system.svg",
                      hasLink: true,
                    },
                    { name: "Carrier", textLogo: "Carrier", hasLink: false },
                    {
                      name: "OneSignal",
                      logo: "/static/images/customers/onesignal/logo-beam.svg",
                      hasLink: false,
                    },
                    { name: "Paramount", textLogo: "Paramount", hasLink: false },
                    { name: "vmware", textLogo: "vmware®", hasLink: false },
                  ].map((brand, idx) => (
                    <button
                      key={brand.name}
                      type="button"
                      onClick={() => onSelectPage("customers")}
                      className="relative flex h-36 flex-col items-center justify-center border-b border-r border-white/10 p-6 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* Architectural + Crosshair at corner */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-2 -right-1.5 font-mono text-xs text-white/30"
                      >
                        +
                      </span>
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-6 w-auto opacity-80 group-hover:opacity-100 transition-opacity brightness-125"
                        />
                      ) : (
                        <span className="text-xl font-semibold tracking-tight text-white/75 group-hover:text-white transition-colors">
                          {brand.textLogo}
                        </span>
                      )}
                      {brand.hasLink && (
                        <span className="mt-3 font-mono text-xs text-white/40 group-hover:text-[#4785ff]">
                          ↗
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* PART B: SIGNATURE LIGHT ARCHITECTURAL BLUEPRINT SURFACE (01 MANAGE · 02 DOCUMENT · 03 DELIVER · 04 IMPROVE) */}
          <section className="bg-[#f3f5f8] text-[#0b1224]">
            {/* Sticky 4-Column Structural Pillar Bar (Exact match to real-home-scroll2.png) */}
            <div className="sticky top-16 z-30 border-y border-[#dfe4ec] bg-[#f3f5f8]/95 backdrop-blur-md">
              <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4 divide-x divide-[#dfe4ec]">
                {[
                  {
                    id: "pillar-01",
                    num: "01",
                    label: "Manage",
                    activeClass: "border-b-2 border-[#1055e5] text-[#1055e5] font-semibold",
                  },
                  {
                    id: "pillar-02",
                    num: "02",
                    label: "Document",
                    activeClass: "border-b-2 border-[#e05d26] text-[#e05d26] font-semibold",
                  },
                  {
                    id: "pillar-03",
                    num: "03",
                    label: "Deliver",
                    activeClass: "border-b-2 border-[#0891b2] text-[#0891b2] font-semibold",
                  },
                  {
                    id: "pillar-04",
                    num: "04",
                    label: "Improve",
                    activeClass: "border-b-2 border-[#6d28d9] text-[#6d28d9] font-semibold",
                  },
                ].map((tab, i) => (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={() => setActiveScrollPillar(i as 0 | 1 | 2 | 3)}
                    className={`flex items-baseline gap-2.5 px-6 py-4 text-sm sm:text-base font-medium transition-colors hover:bg-white/60 ${
                      activeScrollPillar === i ? tab.activeClass : "text-[#64748b]"
                    }`}
                  >
                    <span className="font-mono text-xs opacity-70">{tab.num}</span>
                    <span>{tab.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ==================== 01 MANAGE SECTION ==================== */}
            <div id="pillar-01" className="mx-auto max-w-7xl border-x border-[#dfe4ec]">
              {/* Headline Banner */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#dfe4ec] px-6 py-12 sm:px-10">
                <h2 className="max-w-2xl text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
                  <span className="text-[#1055e5] font-semibold">
                    Connect design and code data.
                  </span>{" "}
                  <span className="text-[#334155]">
                    Manage the source of truth that your teams and agents share.
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => onSelectPage("management")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1055e5] hover:underline shrink-0 cursor-pointer"
                >
                  <span>Explore more</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Interactive Prompt Box + Connected Sources Stage */}
              <div
                className="border-b border-[#dfe4ec] px-6 py-14 sm:px-10 flex flex-col items-center justify-center"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 75% 50%, rgba(16, 85, 229, 0.08) 0%, transparent 65%)",
                }}
              >
                <div className="w-full max-w-xl rounded-2xl border border-[#dfe4ec] bg-white p-5 shadow-lg">
                  <textarea
                    rows={2}
                    value={promptInputManage}
                    onChange={(e) => setPromptInputManage(e.target.value)}
                    className="w-full resize-none bg-transparent text-sm text-[#0b1224] focus:outline-none"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f3f5f8] px-2.5 py-1 font-mono text-[11px] text-[#475569]">
                        <img
                          src="/static/images/integrations/figma/figma-logo.svg"
                          alt="Figma"
                          className="h-3.5 w-3.5"
                        />
                        5 Figma files connected
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f3f5f8] px-2.5 py-1 font-mono text-[11px] text-[#475569]">
                        <img
                          src="/static/images/integrations/storybook/storybook-logo.svg"
                          alt="Storybook"
                          className="h-3.5 w-3.5"
                        />
                        Storybook CSF3
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-[#64748b]" />
                      <button
                        type="button"
                        onClick={() => onLaunchDemo("manage")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1055e5] text-white hover:bg-[#0d47c2] cursor-pointer"
                        title="Open in Supernova Studio"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Architectural Split: Component Health + Multi-Brand Orion/Vega/LUNA Diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#dfe4ec]">
                {/* Left: Component Health Card (From real-home-scroll3.png) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[380px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">
                      Component health & parity.
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      Track component health and keep tokens in sync between Figma and code.
                    </p>
                  </div>

                  <div className="my-8 mx-auto w-full max-w-sm space-y-3">
                    {components.slice(0, 3).map((comp) => (
                      <div
                        key={comp.id}
                        onClick={() => onLaunchDemo("manage")}
                        className="flex items-center justify-between rounded-xl border border-[#dfe4ec] bg-white px-4 py-3.5 shadow-sm hover:border-[#1055e5] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-6 w-8 items-center justify-center rounded text-white text-xs font-bold"
                            style={{ backgroundColor: brandPalette.primary }}
                          >
                            ▬
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#0b1224]">{comp.name}</div>
                            <div className="text-[11px] text-[#64748b]">{comp.category}</div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-medium ${
                            comp.health === "Healthy"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : "bg-[#fef3c7] text-[#b45309]"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {comp.health}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Multi-Brand Tree Diagram (Orion, Vega, LUNA from real-home-scroll3.png) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[380px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">
                      Multi-brand architecture.
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      In Supernova you can manage multiple brands under one roof — each keeps its
                      own look.
                    </p>
                  </div>

                  {/* Exact Supernova Hub → Orion / Vega / LUNA Tree */}
                  <div className="my-6 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1224] text-white shadow-md">
                      <SupernovaCloverLogo className="h-6 w-6" />
                    </div>
                    <div className="h-5 w-px bg-[#cbd5e1]" />
                    <div className="w-56 border-t border-[#cbd5e1]" />
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      {[
                        {
                          id: "orion" as const,
                          letter: "O",
                          label: "Orion",
                          border: "border-[#e11d48]",
                          text: "text-[#e11d48]",
                          serif: true,
                        },
                        {
                          id: "vega" as const,
                          letter: "V",
                          label: "Vega",
                          border: "border-[#4f46e5]",
                          text: "text-[#4f46e5]",
                          serif: false,
                        },
                        {
                          id: "luna" as const,
                          letter: "L",
                          label: "LUNA",
                          border: "border-[#d97706]",
                          text: "text-[#d97706]",
                          serif: false,
                        },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBrandCard(b.id)}
                          className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl border bg-white shadow-sm transition-all cursor-pointer ${
                            selectedBrandCard === b.id
                              ? `${b.border} ring-2 ring-offset-2 ring-[#1055e5]`
                              : "border-[#dfe4ec] hover:border-[#94a3b8]"
                          }`}
                        >
                          <span
                            className={`text-lg font-bold ${b.text} ${
                              b.serif ? "italic font-serif" : ""
                            }`}
                          >
                            {b.letter}
                          </span>
                          <span className={`mt-0.5 text-[11px] font-semibold ${b.text}`}>
                            {b.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 font-mono text-xs text-[#475569]">
                      Active Brand: <strong className="text-[#0b1224]">{brandPalette.name}</strong>{" "}
                      · Primary:{" "}
                      <span
                        className="font-bold"
                        style={{ color: brandPalette.primary }}
                      >
                        {brandPalette.primary}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 02 DOCUMENT SECTION ==================== */}
            <div id="pillar-02" className="mx-auto max-w-7xl border-x border-t border-[#dfe4ec]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#dfe4ec] px-6 py-12 sm:px-10">
                <h2 className="max-w-2xl text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
                  <span className="text-[#e05d26] font-semibold">
                    Write and publish the documentation.
                  </span>{" "}
                  <span className="text-[#334155]">
                    Guide your teams and agents with everything they need for product development.
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => onSelectPage("documentation")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e05d26] hover:underline shrink-0 cursor-pointer"
                >
                  <span>Explore more</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* 2-Column Split: Page History Snapshot Restore + Realtime Collaboration Cursors (From real-home-scroll4.png) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#dfe4ec]">
                {/* Left: Page History Card */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">Page history.</h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      Every edit is snapshotted — see who changed what, and restore any version.
                    </p>
                  </div>

                  <div className="my-6 mx-auto w-full max-w-md space-y-2.5">
                    {[
                      { time: "Sep 4, 11:33 AM", author: "Anna Kowalski" },
                      { time: "Sep 4, 09:15 AM", author: "Design System Agent" },
                    ].map((snap) => (
                      <div
                        key={snap.time}
                        className="flex items-center justify-between rounded-2xl border border-[#dfe4ec] bg-white px-5 py-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#1055e5]" />
                          <div>
                            <div className="text-xs font-bold text-[#0b1224]">{snap.time}</div>
                            <div className="text-[11px] text-[#64748b]">{snap.author}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRestoredSnapshot(`${snap.time} · ${snap.author}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe4ec] bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#0b1224] hover:border-[#1055e5] cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>
                            {restoredSnapshot.startsWith(snap.time) ? "Active" : "Restore"}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Realtime Collaboration Multi-Cursor Diagram (From real-home-scroll4.png) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">
                      Realtime collaboration.
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      Teams and agents can edit the documentation together, backed by a change log
                      and page history.
                    </p>
                  </div>

                  <div className="relative my-6 flex h-52 items-center justify-center">
                    {/* Designer Cursor */}
                    <div className="absolute left-10 top-3 flex items-center gap-1.5">
                      <span className="rounded-md bg-[#3b82f6] px-2.5 py-1 text-xs font-semibold text-white shadow">
                        Designer
                      </span>
                      <svg
                        viewBox="0 0 16 16"
                        className="h-4 w-4 text-[#3b82f6] fill-current translate-y-2"
                      >
                        <path d="M14 14L2 9l4.5-2.5L9 2l5 12z" />
                      </svg>
                    </div>

                    {/* Engineer Cursor */}
                    <div className="absolute right-10 top-3 flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-4 w-4 text-[#0b1224] fill-current translate-y-2"
                      >
                        <path d="M2 14l12-5-4.5-2.5L7 2 2 14z" />
                      </svg>
                      <span className="rounded-md bg-[#0b1224] px-2.5 py-1 text-xs font-semibold text-white shadow">
                        Engineer
                      </span>
                    </div>

                    {/* Center Publish Documentation Button */}
                    <button
                      type="button"
                      onClick={() => onLaunchDemo("document")}
                      className="rounded-xl bg-[#0b1224] px-6 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-[#1e293b] transition-colors cursor-pointer"
                    >
                      Publish documentation
                    </button>

                    {/* Agent Cursor */}
                    <div className="absolute bottom-3 right-16 flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-4 w-4 text-[#1055e5] fill-current -translate-y-2"
                      >
                        <path d="M2 2l12 5-4.5 2.5L7 14 2 2z" />
                      </svg>
                      <span className="rounded-md bg-[#1055e5] px-2.5 py-1 text-xs font-semibold text-white shadow">
                        Agent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 03 DELIVER SECTION ==================== */}
            <div id="pillar-03" className="mx-auto max-w-7xl border-x border-t border-[#dfe4ec]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#dfe4ec] px-6 py-12 sm:px-10">
                <h2 className="max-w-2xl text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
                  <span className="text-[#0891b2] font-semibold">
                    Deliver context to codebases and AI agents.
                  </span>{" "}
                  <span className="text-[#334155]">
                    Scoped MCP servers, 10-target exporters, and automated PR pipelines.
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => onSelectPage("for-ai")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0891b2] hover:underline shrink-0 cursor-pointer"
                >
                  <span>Explore Scoped MCP</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Scoped MCP Filter Cards (From real-home-scroll5.png) */}
              <div className="border-b border-[#dfe4ec] px-6 py-12 sm:px-10 bg-gradient-to-r from-[#ecfeff]/60 via-[#f3f5f8] to-[#f3f5f8]">
                <div className="mx-auto max-w-3xl flex flex-col md:flex-row items-center gap-8">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0b1224] text-white shadow-lg">
                    <SupernovaCloverLogo className="h-8 w-8" />
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    {[
                      {
                        id: "checkout" as const,
                        title: "Checkout team",
                        logo: "/static/images/integrations/claude/claude-logo.svg",
                      },
                      {
                        id: "marketing" as const,
                        title: "Marketing web",
                        logo: "/static/images/integrations/cursor/cursor-logo-ink.svg",
                      },
                      {
                        id: "mobile" as const,
                        title: "Mobile app",
                        logo: "/static/images/integrations/vscode/vs-code-logo.svg",
                      },
                    ].map((sc) => (
                      <div
                        key={sc.id}
                        onClick={() => setSelectedMcpFilter(sc.id)}
                        className={`flex items-center justify-between rounded-2xl border bg-white px-6 py-4 shadow-sm transition-all cursor-pointer ${
                          selectedMcpFilter === sc.id
                            ? "border-[#0891b2] ring-2 ring-[#0891b2]/20"
                            : "border-[#dfe4ec] hover:border-[#94a3b8]"
                        }`}
                      >
                        <div className="text-sm text-[#64748b]">
                          Filtered for{" "}
                          <strong className="font-semibold text-[#0b1224]">{sc.title}</strong>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe4ec] bg-[#f8fafc] p-2">
                          <img src={sc.logo} alt={sc.title} className="h-5 w-5 object-contain" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Code Automations + MCP Analytics (From real-home-scroll5.png) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#dfe4ec]">
                {/* Left: Code Automations Card */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[380px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">Code automations.</h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      Changes go straight to code — tokens export and a PR opens.
                    </p>
                  </div>

                  <div className="my-6 mx-auto w-full max-w-md space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-[#dfe4ec] bg-white px-5 py-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src="/static/images/integrations/figma/figma-logo.svg"
                          alt="Figma"
                          className="h-4 w-4"
                        />
                        <span className="h-3.5 w-3.5 rounded-sm bg-[#104FC6]" />
                        <span className="font-mono text-xs font-semibold text-[#0b1224]">
                          color.primary.hover
                        </span>
                      </div>
                      <span className="rounded-md bg-[#dbeafe] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#1d4ed8]">
                        Updated
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[#dfe4ec] bg-white px-5 py-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1224] text-white">
                          <SupernovaCloverLogo className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-[#0b1224]">Code pipeline</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleTriggerPipeline}
                        className="font-mono text-xs font-semibold text-[#1055e5] hover:underline cursor-pointer"
                      >
                        {pipelineRunning
                          ? "Exporting..."
                          : pipelineDone
                            ? "✓ PR #419 Opened"
                            : "Run Export →"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: MCP Analytics Table (From real-home-scroll5.png) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[380px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">MCP analytics.</h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      See who on the team is calling the system — reads, writes, and the people
                      driving adoption.
                    </p>
                  </div>

                  <div className="my-6 mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#dfe4ec] bg-white shadow-sm">
                    <div className="border-b border-[#dfe4ec] px-5 py-3 text-xs font-bold text-[#0b1224]">
                      Most active users
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#dfe4ec] bg-[#f8fafc] text-[11px] text-[#64748b]">
                        <tr>
                          <th className="py-2 px-5">User</th>
                          <th className="py-2 px-4 text-right">Reads</th>
                          <th className="py-2 px-5 text-right">Writes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dfe4ec]">
                        {[
                          { name: "Lena Ortiz", reads: 143, writes: 18 },
                          { name: "Noah Ellis", reads: 129, writes: 31 },
                          { name: "Amira Cole", reads: 108, writes: 24 },
                        ].map((u) => (
                          <tr key={u.name}>
                            <td className="py-2.5 px-5 font-semibold text-[#0b1224]">{u.name}</td>
                            <td className="py-2.5 px-4 text-right font-mono text-[#0b1224]">
                              {u.reads}
                            </td>
                            <td className="py-2.5 px-5 text-right font-mono text-[#0b1224]">
                              {u.writes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 04 IMPROVE SECTION ==================== */}
            <div id="pillar-04" className="mx-auto max-w-7xl border-x border-t border-b border-[#dfe4ec]">
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#dfe4ec]">
                {/* Left: Start the Self-Healing Loop (From real-home-scroll6.png) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">
                      Start the self-healing loop.
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      Gaps come back as suggested fixes instead of sitting in a backlog.
                    </p>
                  </div>

                  <div className="my-6 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2.5 rounded-2xl border border-[#dfe4ec] bg-white px-4 py-3 shadow-sm">
                      <img
                        src="/static/images/integrations/cursor/cursor-logo-ink.svg"
                        alt="Cursor"
                        className="h-5 w-5"
                      />
                      <img
                        src="/static/images/integrations/claude/claude-logo.svg"
                        alt="Claude"
                        className="h-5 w-5"
                      />
                    </div>
                    <div className="h-px w-12 border-t border-dashed border-[#94a3b8]" />
                    <button
                      type="button"
                      onClick={() => onLaunchDemo("improve")}
                      className="rounded-full border border-[#dfe4ec] bg-white px-3.5 py-1.5 font-mono text-[11px] font-semibold text-[#6d28d9] shadow-sm hover:border-[#6d28d9] cursor-pointer"
                    >
                      {selfHealingIssues.filter((i) => i.status === "open").length} issues
                      discovered →
                    </button>
                    <div className="h-px w-12 border-t border-dashed border-[#94a3b8]" />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1224] text-white shadow-md">
                      <SupernovaCloverLogo className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Right: Design System Adoption Analytics (From real-home-scroll6.png) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0b1224]">
                      Design system adoption analytics.
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm text-[#475569]">
                      See which tokens and components teams use, and where adoption is slipping.
                    </p>
                  </div>

                  <div className="my-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-[#dfe4ec] bg-white px-5 py-4 shadow-sm">
                      <span className="text-2xl font-bold text-[#0b1224]">232</span>{" "}
                      <span className="text-xs text-[#64748b]">Components</span>
                    </div>
                    <div className="rounded-2xl border border-[#dfe4ec] bg-white px-5 py-4 shadow-sm">
                      <span className="text-2xl font-bold text-[#0b1224]">81%</span>{" "}
                      <span className="text-xs text-[#64748b]">Used in code</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== PAGE 2: DESIGN SYSTEM MANAGEMENT (EXACT MATCH TO real-dsm.png) ==================== */}
      {activePage === "management" && (
        <section
          className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left 5 Cols: Manage your design system. */}
              <div className="lg:col-span-5 space-y-5">
                <h1 className="text-5xl sm:text-6xl font-medium tracking-tight leading-[1.06]">
                  <span className="text-[#1055e5] font-semibold">Manage</span> your
                  <br />
                  design system.
                </h1>
                <p className="text-base text-[#475569] leading-relaxed">
                  Centralize and manage your design and code data in one place. Provide your agents
                  with a structured single source of truth.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => onLaunchDemo("manage")}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1055e5] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#0d47c2] cursor-pointer"
                  >
                    <span>Open Token Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPage("auth")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0b1224] hover:text-[#1055e5] cursor-pointer"
                  >
                    <span>Get started for free</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: Component Status & Documentation Table + Tokens Inspector Card (Exact match to real-dsm.png) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 overflow-hidden rounded-2xl border border-[#dfe4ec] bg-white shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#dfe4ec] bg-[#f8fafc] text-[#64748b]">
                      <tr>
                        <th className="py-3.5 px-4">Component</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Documentation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dfe4ec]">
                      {[
                        { comp: "Primary Button", status: "Healthy", doc: "Doc - Button" },
                        { comp: "Secondary Button", status: "Healthy", doc: "Doc - Button" },
                        { comp: "Icon Button", status: "Known issue", doc: "Doc - Button" },
                        { comp: "Surface Card", status: "Known issue", doc: "Doc - Card" },
                        { comp: "Legacy Switch", status: "Deprecated", doc: "Doc - Switch" },
                        { comp: "User Avatar", status: "Healthy", doc: "Doc - Avatar" },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#f8fafc]">
                          <td className="py-3.5 px-4 font-medium text-[#0b1224]">{row.comp}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                                row.status === "Healthy"
                                  ? "bg-[#dcfce7] text-[#15803d]"
                                  : row.status === "Known issue"
                                    ? "bg-[#fef3c7] text-[#b45309]"
                                    : "bg-[#fee2e2] text-[#b91c1c]"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => onLaunchDemo("document")}
                              className="font-medium text-[#1055e5] underline cursor-pointer"
                            >
                              {row.doc}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right Floating Tokens Card */}
                <div className="sm:col-span-4 rounded-2xl border border-[#dfe4ec] bg-white shadow-xl overflow-hidden">
                  <div className="border-b border-[#dfe4ec] px-4 py-3 text-xs font-bold text-[#0b1224]">
                    Tokens
                  </div>
                  <div className="border-b border-[#dfe4ec] bg-[#f8fafc] px-4 py-2 text-[11px] text-[#64748b]">
                    Name
                  </div>
                  <div className="divide-y divide-[#dfe4ec] text-xs">
                    {[
                      { name: "Primary", color: "#1055e5" },
                      { name: "Primary Highlight", color: "#3b82f6" },
                      { name: "Primary Faded", color: "#dbeafe" },
                      { name: "Critical", color: "#ef4444" },
                      { name: "Warning", color: "#f59e0b" },
                      { name: "Warning Highlight", color: "#fef3c7" },
                    ].map((t) => (
                      <div key={t.name} className="flex items-center justify-between px-4 py-3">
                        <span className="font-medium text-[#475569]">{t.name}</span>
                        <span
                          className="h-3.5 w-3.5 rounded-sm border border-black/10"
                          style={{ backgroundColor: t.color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== PAGE 3: LIVING DOCUMENTATION (EXACT MATCH TO real-docs.png) ==================== */}
      {activePage === "documentation" && (
        <section
          className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-5">
                <h1 className="text-5xl sm:text-6xl font-medium tracking-tight leading-[1.06]">
                  <span className="text-[#1055e5] font-semibold">Document</span> your
                  <br />
                  design system...
                </h1>
                <p className="text-xl text-[#475569]">and everything else.</p>
                <div className="pt-2 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => onLaunchDemo("document")}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1055e5] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#0d47c2] cursor-pointer"
                  >
                    <span>Open Living Docs Editor</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPage("auth")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0b1224] hover:text-[#1055e5] cursor-pointer"
                  >
                    <span>Get started for free</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: Components > Button Interactive Spec Card (Exact match to real-docs.png) */}
              <div className="lg:col-span-7 rounded-2xl border border-[#dfe4ec] bg-white p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                  <span>Components</span>
                  <span>›</span>
                  <strong className="text-[#0b1224]">Button</strong>
                </div>

                {/* Tabs: Overview | Styles | Code | Accessibility */}
                <div className="flex items-center gap-6 border-b border-[#dfe4ec] text-xs font-medium">
                  {(["Overview", "Styles", "Code", "Accessibility"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveDocTab(tab)}
                      className={`pb-3 transition-colors cursor-pointer ${
                        activeDocTab === tab
                          ? "border-b-2 border-[#1055e5] text-[#1055e5] font-bold"
                          : "text-[#64748b] hover:text-[#0b1224]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="rounded-xl bg-[#f8fafc] p-5 border border-[#dfe4ec] text-xs text-[#334155] space-y-2">
                  {activeDocTab === "Styles" && (
                    <div>
                      <div className="font-bold text-[#0b1224]">
                        Bound Semantic Tokens (Button · Primary)
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-[#1055e5]">
                        background: var(--color-semantic-primary) · radius: var(--radius-md) ·
                        padding: var(--spacing-sm) var(--spacing-md)
                      </p>
                    </div>
                  )}
                  {activeDocTab === "Overview" && (
                    <div>
                      <div className="font-bold text-[#0b1224]">Component Anatomy & Usage</div>
                      <p className="mt-1">
                        Primary action trigger synced with Figma Dark Matter: Foundations and
                        Storybook CSF3 (98% parity).
                      </p>
                    </div>
                  )}
                  {activeDocTab === "Code" && (
                    <pre className="font-mono text-[11px] text-[#0b1224]">
                      {`<Button variant="primary" size="md">Publish Release</Button>`}
                    </pre>
                  )}
                  {activeDocTab === "Accessibility" && (
                    <div>
                      <div className="font-bold text-[#15803d]">WCAG AAA Verified</div>
                      <p className="mt-1">
                        Minimum 44×44px touch target, visible focus-ring token, and keyboard
                        activation.
                      </p>
                    </div>
                  )}
                </div>

                {/* Floating AI Prompt Composer Inside Docs Card */}
                <div className="mx-auto max-w-md rounded-2xl border border-[#dfe4ec] bg-white p-4 shadow-md">
                  <input
                    type="text"
                    value={promptInputDoc}
                    onChange={(e) => setPromptInputDoc(e.target.value)}
                    className="w-full text-xs font-medium text-[#0b1224] focus:outline-none"
                  />
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Paperclip className="h-4 w-4 text-[#64748b]" />
                    <button
                      type="button"
                      onClick={() => onLaunchDemo("document")}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1055e5] text-white hover:bg-[#0d47c2] cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== PAGE 4: FOR AI AGENTS (EXACT MATCH TO real-supernova-for-ai.png) ==================== */}
      {activePage === "for-ai" && (
        <section className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-normal tracking-tight text-[#0b1224]">
                For AI agents
              </h1>
              <p className="max-w-3xl text-base text-[#334155] leading-relaxed">
                Supernova.io is the agentic design system platform that turns your tokens,
                components, documentation, and code patterns into connected intelligence — so your
                team and their AI agents build from the same source of truth.
              </p>
              <p className="max-w-3xl text-sm text-[#475569] leading-relaxed">
                This page summarizes the most useful Supernova.io URLs for AI systems. For the
                machine-readable index, use{" "}
                <a
                  href={`/llms.txt?workspace=${encodeURIComponent(workspaceSlug)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-semibold text-[#1055e5] underline"
                >
                  llms.txt
                </a>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#dfe4ec] bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#0b1224]">Core Endpoints & Surfaces</h2>
                <div className="space-y-3 text-xs">
                  <div>
                    <button
                      type="button"
                      onClick={() => onLaunchDemo("deliver")}
                      className="font-bold text-[#1055e5] hover:underline cursor-pointer"
                    >
                      Scoped MCP Server Playground (/api/mcp/execute)
                    </button>
                    <p className="text-[#64748b] mt-0.5">
                      Execute all 8 Supernova MCP tools filtered for Checkout, Marketing, or Mobile
                      teams.
                    </p>
                  </div>
                  <div>
                    <a
                      href={`/llms.txt?workspace=${encodeURIComponent(workspaceSlug)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#1055e5] hover:underline"
                    >
                      Machine-Readable Index (/llms.txt)
                    </a>
                    <p className="text-[#64748b] mt-0.5">
                      Live W3C DTCG token summary and component specification index for LLMs.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => onLaunchDemo("deliver")}
                      className="font-bold text-[#1055e5] hover:underline cursor-pointer"
                    >
                      10-Platform Deterministic Exporters (/api/v1/tokens)
                    </button>
                    <p className="text-[#64748b] mt-0.5">
                      Tailwind v4, CSS, SCSS, TypeScript, Style Dictionary v4, SwiftUI, Kotlin,
                      Flutter, Android XML, and W3C JSON.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#dfe4ec] bg-[#0b1224] p-6 text-white shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#6ca0ff]">
                    claude_desktop_config.json
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/api/mcp/execute`,
                      );
                      setCopiedMcp(true);
                      setTimeout(() => setCopiedMcp(false), 1800);
                    }}
                    className="font-mono text-xs text-white/80 hover:text-white cursor-pointer"
                  >
                    {copiedMcp ? "✓ Copied URL" : "Copy MCP URL"}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-xs text-[#e2e8f0]">
{`{
  "mcpServers": {
    "supernova-os": {
      "url": "${window.location.origin}/api/mcp/execute",
      "workspace": "${workspaceSlug}",
      "scope": "checkout-team"
    }
  }
}`}
                </pre>
                <button
                  type="button"
                  onClick={() => onLaunchDemo("deliver")}
                  className="w-full rounded-xl bg-[#1055e5] py-2.5 text-xs font-semibold text-white hover:bg-[#0d47c2] cursor-pointer"
                >
                  Test Live MCP Tools in Studio →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing section removed per campus open-source distribution */}

      {/* ==================== PAGE 6: ENTERPRISE ==================== */}
      {activePage === "enterprise" && (
        <section className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-4">
              <span className="rounded-full bg-[#1055e5]/10 px-3 py-1 font-mono text-xs font-semibold text-[#1055e5]">
                SUPERNOVA ENTERPRISE
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Enterprise-grade security, multi-brand governance, and AI compliance.
              </h1>
              <p className="text-base text-[#475569]">
                Built for organizations scaling 10+ brands across hundreds of designers, engineers,
                and autonomous coding agents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lock,
                  title: "SOC 2 Type II & SAML SSO",
                  desc: "Enforce Okta, Azure AD, or Google Workspace SAML 2.0 authentication with PKCE and granular Role-Based Access Control.",
                },
                {
                  icon: Building2,
                  title: "Multi-Brand Token Governance",
                  desc: "Manage Orion, Vega, Luna, and regional sub-brands from a single W3C DTCG foundation with zero token duplication.",
                },
                {
                  icon: Zap,
                  title: "Scoped MCP & Audit Trails",
                  desc: "Control exactly which tokens and components AI coding agents can read or mutate, backed by an immutable audit log.",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-[#dfe4ec] bg-white p-6 shadow-sm space-y-3"
                  >
                    <Icon className="h-6 w-6 text-[#1055e5]" />
                    <h3 className="text-base font-bold text-[#0b1224]">{card.title}</h3>
                    <p className="text-xs text-[#475569] leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PAGE 7: CUSTOMERS ==================== */}
      {activePage === "customers" && (
        <section className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Design systems in production at leading brands.
              </h1>
              <p className="text-base text-[#475569]">
                See how Mews, OneSignal, Userlane, and global engineering teams ship faster with
                Supernova.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  company: "Mews Design System",
                  logo: "/static/images/customers/mews/logo-mews-design-system.svg",
                  quote:
                    "Supernova automated our entire Figma Variables to React and Swift token delivery pipeline across 40+ hospitality products.",
                  metric: "100% automated token PRs",
                },
                {
                  company: "OneSignal Beam",
                  logo: "/static/images/customers/onesignal/logo-beam.svg",
                  quote:
                    "Our engineers and Claude Code agents query the exact same Living Documentation and Scoped MCP server every day.",
                  metric: "3.4× faster UI delivery",
                },
                {
                  company: "Userlane Burrito DS",
                  logo: "/static/images/customers/userlane/logo-burrito.svg",
                  quote:
                    "Switching between brand themes and auditing accessibility parity across Storybook CSF3 happens in one place.",
                  metric: "98.2% codebase compliance",
                },
              ].map((story) => (
                <div
                  key={story.company}
                  className="rounded-2xl border border-[#dfe4ec] bg-white p-6 shadow-sm flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="inline-flex rounded-lg bg-[#0b1224] px-3 py-2">
                      <img src={story.logo} alt={story.company} className="h-5 w-auto" />
                    </div>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                  </div>
                  <div className="border-t border-[#dfe4ec] pt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1055e5]">{story.metric}</span>
                    <button
                      type="button"
                      onClick={() => onLaunchDemo("manage")}
                      className="font-medium text-[#0b1224] hover:text-[#1055e5] cursor-pointer"
                    >
                      Inspect Workspace →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PAGE 8: INTEGRATIONS DIRECTORY ==================== */}
      {activePage === "integrations" && (
        <section className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">
                  15 Native Integrations & 10 Code Exporters
                </h1>
                <p className="mt-2 text-sm text-[#475569]">
                  Connect Figma, Storybook, GitHub, Claude Code, Cursor, VS Code, and more.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Design", "AI Agents", "Code Delivery", "Components"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setIntegrationFilter(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
                      integrationFilter === cat
                        ? "bg-[#1055e5] text-white"
                        : "bg-white text-[#475569] border border-[#dfe4ec]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INTEGRATIONS_LIST.filter(
                (i) => integrationFilter === "All" || i.category === integrationFilter,
              ).map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#dfe4ec] bg-white p-5 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#dfe4ec] bg-[#0b1224] p-2.5">
                      <img src={item.logo} alt={item.name} className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#1055e5] font-bold">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#0b1224]">{item.name}</h3>
                      <p className="mt-1 text-xs text-[#475569] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchDemo("deliver")}
                    className="mt-4 pt-3 border-t border-[#dfe4ec] text-left text-xs font-semibold text-[#1055e5] hover:underline cursor-pointer"
                  >
                    Configure in Live Studio →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PAGE 9: LEARN / CONTEXTS 101 ==================== */}
      {activePage === "learn" && (
        <section className="min-h-screen bg-[#f3f5f8] text-[#0b1224] py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
            <h1 className="text-4xl font-semibold tracking-tight">
              Contexts 101 & Supernova Engineering Guides
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  tag: "GUIDE 01 · W3C DTCG",
                  title: "Structuring 11 Token Types & 500-Level Alias Chains",
                  desc: "How primitive palettes, semantic aliases, and fallback values ({token | fallback}) power multi-brand systems.",
                  pillar: "manage" as const,
                },
                {
                  tag: "GUIDE 02 · LIVING DOCS",
                  title: "Authoring with the 37-Block AST Documentation Engine",
                  desc: "Combine live resolved token tables, Storybook CSF3 sandboxes, and Do/Don't contracts.",
                  pillar: "document" as const,
                },
                {
                  tag: "GUIDE 03 · SCOPED MCP",
                  title: "Feeding Filtered Context to Claude Code & Cursor",
                  desc: "Prevent LLM hallucinations by scoping MCP endpoints per team (Checkout, Marketing, Mobile).",
                  pillar: "deliver" as const,
                },
                {
                  tag: "GUIDE 04 · SELF-HEALING",
                  title: "Automating Codebase AST Compliance & Drift Fixes",
                  desc: "Detect hardcoded hex codes and pixel drift automatically and resolve them in 1 click.",
                  pillar: "improve" as const,
                },
              ].map((g) => (
                <div
                  key={g.title}
                  className="rounded-2xl border border-[#dfe4ec] bg-white p-6 shadow-sm space-y-3"
                >
                  <span className="font-mono text-[11px] font-bold text-[#1055e5]">{g.tag}</span>
                  <h3 className="text-base font-bold text-[#0b1224]">{g.title}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{g.desc}</p>
                  <button
                    type="button"
                    onClick={() => onLaunchDemo(g.pillar)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1055e5] hover:underline cursor-pointer"
                  >
                    Try Interactive Walkthrough →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PAGE 10: CLOUD LOGIN / SIGN UP ==================== */}
      {activePage === "auth" && (
        <section className="min-h-[82vh] bg-[#040b24] text-white flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#081236] p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-2.5">
              <SupernovaCloverLogo className="h-6 w-6 text-[#4785ff]" />
              <span className="text-lg font-semibold">supernova cloud</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Sign in to your Design System OS</h1>
              <p className="mt-1 text-xs text-white/70">
                Continue with SSO or launch directly into the interactive Dark Matter demo session.
              </p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onLaunchDemo("manage")}
                className="w-full rounded-full bg-white py-2.5 text-xs font-semibold text-[#040b24] hover:bg-white/90 cursor-pointer"
              >
                Continue with Instant Demo Session →
              </button>
              <button
                type="button"
                onClick={() => onLaunchDemo("deliver")}
                className="w-full rounded-full border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
              >
                Sign in with GitHub / Google SAML SSO
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== OFFICIAL SUPERNOVA FOOTER ==================== */}
      <footer className="border-t border-[#dfe4ec] bg-white text-[#0b1224] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <SupernovaCloverLogo className="h-5 w-5 text-[#0b1224]" />
                <span className="text-base font-semibold">supernova</span>
              </div>
              <p className="text-[#64748b] leading-relaxed">
                The agentic design system and knowledge management platform.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[#0b1224]">Product</div>
              <button
                type="button"
                onClick={() => onSelectPage("management")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                Design System Management
              </button>
              <button
                type="button"
                onClick={() => onSelectPage("documentation")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                Living Documentation
              </button>
              <button
                type="button"
                onClick={() => onSelectPage("for-ai")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                Scoped MCP for AI
              </button>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[#0b1224]">Ecosystem</div>
              <button
                type="button"
                onClick={() => onSelectPage("integrations")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                15 Native Integrations
              </button>
              <button
                type="button"
                onClick={() => onLaunchDemo("deliver")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                10 Code Exporters
              </button>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="block font-mono text-[#1055e5] hover:underline"
              >
                /llms.txt
              </a>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[#0b1224]">Company</div>
              <button
                type="button"
                onClick={() => onSelectPage("customers")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                Customers
              </button>
              <button
                type="button"
                onClick={() => onSelectPage("enterprise")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                Enterprise Security
              </button>
              <button
                type="button"
                onClick={() => onSelectPage("learn")}
                className="block text-[#64748b] hover:text-[#1055e5] cursor-pointer"
              >
                Contexts 101 & Learn Hub
              </button>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[#0b1224]">Live Studio</div>
              <button
                type="button"
                onClick={() => onLaunchDemo("manage")}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1055e5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d47c2] cursor-pointer"
              >
                <span>Open Interactive Demo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
