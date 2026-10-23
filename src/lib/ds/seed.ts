import { parseDTCG, type ContextTheme, type Token } from "./engine";

// Official Supernova Dark Matter Design System W3C DTCG Seed
// Matches SUPERNOVA_REA_EVIDENCE_DOSSIER.md (--dm-color-primary-500: #2b70f7, Dark Matter: Foundations, All 11 Token Types)
export const SEED_DTCG = {
  color: {
    $type: "color",
    primitive: {
      blue: {
        400: { $value: "#5c95ff", $plain: "Dark Matter Electric Blue 400" },
        500: { $value: "#2b70f7", $plain: "Supernova Primary Blue 500" },
        600: { $value: "#1a5ee5", $plain: "Deep Royal Blue 600" },
      },
      orange: {
        400: { $value: "#fb923c", $plain: "Supernova Solar Orange 400" },
        500: { $value: "#ea580c", $plain: "Supernova Accent Orange 500" },
      },
      neutral: {
        50: { $value: "#f8fafc", $plain: "Daylight Alabaster 50" },
        100: { $value: "#eef2f6", $plain: "Daylight Surface 100" },
        200: { $value: "#d0d7de", $plain: "Subtle Hairline 200" },
        400: { $value: "#8b949e", $plain: "Muted Secondary Slate 400" },
        700: { $value: "#262c36", $plain: "Dark Matter Border 700" },
        800: { $value: "#161b22", $plain: "Dark Matter Elevated Surface 800" },
        900: { $value: "#0e1117", $plain: "Dark Matter Canvas 900" },
      },
      emerald: {
        500: { $value: "#10b981", $plain: "Healthy Status Emerald 500" },
      },
      amber: {
        500: { $value: "#f59e0b", $plain: "Warning Amber 500" },
      },
      rose: {
        500: { $value: "#ef4444", $plain: "Critical Danger Rose 500" },
      },
      violet: {
        500: { $value: "#8b5cf6", $plain: "Vega Brand Violet 500" },
      },
      cyan: {
        500: { $value: "#06b6d4", $plain: "Luna Brand Cyan 500" },
      },
      legacy: {
        pink: {
          $value: "#f472b6",
          $plain: "Deprecated v1 Pink (Retiring)",
          $deprecated: true,
        },
      },
    },
    semantic: {
      background: {
        $value: "{color.primitive.neutral.900}",
        $description: "Primary Dark Matter canvas background (--dm-color-background-canvas)",
        $plain: "Canvas Background",
      },
      surface: {
        $value: "{color.primitive.neutral.800}",
        $description: "Elevated cards, drawers, and inspector panels (--dm-color-surface-elevated)",
        $plain: "Elevated Surface",
      },
      border: {
        $value: "{color.primitive.neutral.700}",
        $description: "1px structural hairline border token",
        $plain: "Structural Border",
      },
      text: {
        $value: "{color.primitive.neutral.50}",
        $description: "High-contrast primary typography copy",
        $plain: "Primary Ink",
      },
      "text-muted": {
        $value: "{color.primitive.neutral.400}",
        $description: "Secondary metadata, token paths, and captions",
        $plain: "Muted Metadata Ink",
      },
      primary: {
        $value: "{color.primitive.blue.500}",
        $description: "Primary interactive CTA & active state (--dm-color-primary-500)",
        $plain: "Brand Primary",
      },
      accent: {
        $value: "{color.primitive.orange.500}",
        $description: "AI agent highlights, Pulsar triggers & MCP badges",
        $plain: "Brand Accent",
      },
      success: {
        $value: "{color.primitive.emerald.500}",
        $description: "Healthy component parity & passing CI checks",
        $plain: "Semantic Success",
      },
      warning: {
        $value: "{color.primitive.amber.500}",
        $description: "Drift alerts & known component issues",
        $plain: "Semantic Warning",
      },
      danger: {
        $value: "{color.primitive.rose.500}",
        $description: "Breaking token removals & compliance violations",
        $plain: "Semantic Danger",
      },
    },
  },
  spacing: {
    $type: "dimension",
    xs: { $value: "4px", $plain: "Micro gap (4px)" },
    sm: { $value: "8px", $plain: "Compact gap (8px)" },
    md: { $value: "16px", $plain: "Base rhythm unit (16px)" },
    lg: { $value: "24px", $plain: "Section padding (24px)" },
    xl: { $value: "40px", $plain: "Hero container spacing (40px)" },
  },
  radius: {
    $type: "radius",
    sm: { $value: "6px", $plain: "Compact control radius (6px)" },
    md: { $value: "10px", $plain: "Standard card & input radius (10px)" },
    lg: { $value: "16px", $plain: "Modal & bento panel radius (16px)" },
    pill: { $value: "999px", $plain: "Full pill badge radius (999px)" },
  },
  typography: {
    $type: "typography",
    heading: {
      xl: { $value: "700 36px/42px Manrope", $plain: "Display Headline XL" },
      md: { $value: "600 20px/28px Manrope", $plain: "Section Title MD" },
    },
    body: {
      base: { $value: "400 15px/24px Manrope", $plain: "Standard Editorial Body" },
      code: { $value: "500 13px/20px JetBrains Mono", $plain: "Token & AST Monospace" },
    },
  },
  font: {
    family: {
      $type: "font",
      sans: { $value: "Manrope, sans-serif", $plain: "Primary UI & Editorial Sans" },
      mono: { $value: "JetBrains Mono, monospace", $plain: "Code, Token & Diff Mono" },
    },
  },
  shadow: {
    $type: "shadow",
    elevated: {
      $value: "0 12px 32px -4px rgba(0, 0, 0, 0.48)",
      $plain: "Dark Matter Floating Panel Shadow",
    },
  },
  border: {
    $type: "border",
    hairline: {
      $value: "1px solid #262c36",
      $plain: "1px Dark Matter Structural Hairline",
    },
  },
  gradient: {
    $type: "gradient",
    supernova: {
      $value: "linear-gradient(135deg, #2b70f7 0%, #ea580c 100%)",
      $plain: "Supernova Ray Signature Gradient",
    },
  },
  blur: {
    $type: "blur",
    glass: {
      $value: "16px",
      $plain: "Command Bar Glass Backdrop Blur",
    },
  },
  text: {
    $type: "text",
    systemName: {
      $value: "Dark Matter Design System",
      $plain: "Canonical Design System Title Token",
    },
  },
  motion: {
    $type: "generic",
    snappy: {
      $value: "180ms cubic-bezier(0.16, 1, 0.3, 1)",
      $plain: "Micro-interaction spring curve",
    },
  },
};

export const SEED_TOKENS: Token[] = parseDTCG(SEED_DTCG);

export const SEED_CONTEXTS: ContextTheme[] = [
  {
    id: "default",
    name: "Orion · Dark Matter (Default)",
    brand: "Orion",
    mode: "dark",
    description: "Supernova's flagship Dark Matter foundation (#0e1117 canvas, #2b70f7 primary).",
    badge: "Flagship",
    overrides: {},
  },
  {
    id: "orion-light",
    name: "Orion · Daylight High-Contrast",
    brand: "Orion",
    mode: "light",
    description: "Crisp daylight documentation & enterprise dashboard surface (#f8fafc canvas).",
    badge: "Light Mode",
    overrides: {
      "color.semantic.background": "{color.primitive.neutral.50}",
      "color.semantic.surface": "#ffffff",
      "color.semantic.border": "{color.primitive.neutral.200}",
      "color.semantic.text": "{color.primitive.neutral.900}",
      "color.semantic.text-muted": "#475569",
      "color.semantic.primary": "{color.primitive.blue.600}",
    },
  },
  {
    id: "vega-brand",
    name: "Vega · Consumer Brand Theme",
    brand: "Vega",
    mode: "dark",
    description: "Multi-brand override mapping semantic primary to Vega Electric Violet (#8b5cf6).",
    badge: "Multi-Brand",
    overrides: {
      "color.semantic.primary": "{color.primitive.violet.500}",
      "color.semantic.accent": "{color.primitive.blue.400}",
      "radius.md": "14px",
    },
  },
  {
    id: "luna-brand",
    name: "Luna · Enterprise Suite Theme",
    brand: "Luna",
    mode: "dark",
    description: "Multi-brand override mapping semantic primary to Luna Cyan (#06b6d4) with compact corners.",
    badge: "Multi-Brand",
    overrides: {
      "color.semantic.primary": "{color.primitive.cyan.500}",
      "radius.sm": "4px",
      "radius.md": "6px",
    },
  },
];

export interface DSComponentProp {
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
  description: string;
}

export interface DSComponent {
  id: string;
  name: string;
  category: "Actions" | "Forms" | "Feedback" | "Surfaces" | "Navigation" | (string & {});
  status: "stable" | "beta" | "deprecated";
  health: "Healthy" | "Known issue" | "Deprecated";
  version: string;
  a11y: string;
  figmaNode: string;
  storybookId: string;
  usageCount: number;
  coveragePct: number;
  description: string;
  tokens: string[];
  codeSnippet: string;
  dos: string[];
  donts: string[];
  props: DSComponentProp[];
}

export const SEED_COMPONENTS: DSComponent[] = [
  {
    id: "button",
    name: "Button",
    category: "Actions",
    status: "stable",
    health: "Healthy",
    version: "3.4.0",
    a11y: "WCAG AAA · 44px hit target · keyboard focus ring",
    figmaNode: "Dark Matter: Foundations → 104:882",
    storybookId: "actions-button--primary",
    usageCount: 342,
    coveragePct: 98,
    description:
      "Primary interactive trigger used across product flows, dialogs, and form submissions. Consumes semantic primary, radius, and spacing tokens.",
    tokens: [
      "color.semantic.primary",
      "color.semantic.text",
      "radius.md",
      "spacing.md",
      "spacing.sm",
    ],
    codeSnippet: `<Button variant="primary" size="md">\n  Sync with Figma\n</Button>`,
    dos: [
      "Use sentence case and concise action verbs (e.g., 'Publish release', 'Sync variables').",
      "Limit primary buttons to one principal action per viewport surface.",
    ],
    donts: [
      "Never hardcode hex colors like #1a5ee5; always bind to color.semantic.primary.",
      "Do not stack two primary buttons side-by-side without visual hierarchy.",
    ],
    props: [
      {
        name: "variant",
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        defaultValue: "'primary'",
        required: false,
        description: "Visual emphasis mapped to Dark Matter semantic tokens.",
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        required: false,
        description: "Controls height (32px, 38px, 44px) and horizontal padding.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        required: false,
        description: "Replaces label icon with an inline spinner and disables repeat clicks.",
      },
    ],
  },
  {
    id: "input",
    name: "TextInput",
    category: "Forms",
    status: "stable",
    health: "Healthy",
    version: "2.8.0",
    a11y: "WCAG AA · aria-invalid & aria-describedby bound",
    figmaNode: "Dark Matter: Foundations → 118:420",
    storybookId: "forms-textinput--default",
    usageCount: 218,
    coveragePct: 95,
    description:
      "Single-line form control with prefix/suffix slots, validation states, and monospace token mode.",
    tokens: [
      "color.semantic.surface",
      "color.semantic.border",
      "color.semantic.text",
      "radius.md",
      "spacing.sm",
    ],
    codeSnippet: `<TextInput label="Token path" placeholder="color.semantic.primary" mono />`,
    dos: [
      "Always pair inputs with a visible label and clear helper or validation copy.",
      "Use monospace font token (font.family.mono) for token paths, API keys, and SHA hashes.",
    ],
    donts: [
      "Do not rely on placeholder text as a substitute for a persistent field label.",
      "Avoid custom border radii; inherit radius.md from the active brand context.",
    ],
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: "—",
        required: true,
        description: "Accessible field label rendered above the input.",
      },
      {
        name: "state",
        type: "'default' | 'error' | 'success'",
        defaultValue: "'default'",
        required: false,
        description: "Maps border stroke to semantic border, danger, or success tokens.",
      },
    ],
  },
  {
    id: "card",
    name: "SurfaceCard",
    category: "Surfaces",
    status: "stable",
    health: "Healthy",
    version: "2.5.0",
    a11y: "Semantic <section> / <article> landmark",
    figmaNode: "Dark Matter: Foundations → 142:190",
    storybookId: "surfaces-card--elevated",
    usageCount: 289,
    coveragePct: 96,
    description:
      "Elevated Dark Matter container for token tables, telemetry metrics, and living documentation blocks.",
    tokens: [
      "color.semantic.surface",
      "color.semantic.border",
      "radius.lg",
      "spacing.lg",
      "shadow.elevated",
    ],
    codeSnippet: `<SurfaceCard elevation="raised" padding="lg">\n  <TokenTable group="color" />\n</SurfaceCard>`,
    dos: [
      "Keep card density scannable with a maximum of 3 data points per card.",
      "Use 1px solid color.semantic.border for crisp Dark Matter separation.",
    ],
    donts: [
      "Do not nest elevated cards inside other elevated cards.",
      "Never override internal padding with arbitrary pixel values.",
    ],
    props: [
      {
        name: "elevation",
        type: "'flat' | 'raised' | 'floating'",
        defaultValue: "'raised'",
        required: false,
        description: "Controls background surface token and shadow.elevated application.",
      },
    ],
  },
  {
    id: "badge",
    name: "StatusBadge",
    category: "Feedback",
    status: "stable",
    health: "Healthy",
    version: "1.9.0",
    a11y: "WCAG AA · Status dot + explicit text label",
    figmaNode: "Dark Matter: Foundations → 156:310",
    storybookId: "feedback-statusbadge--healthy",
    usageCount: 412,
    coveragePct: 100,
    description:
      "Compact semantic indicator for component health (Healthy, Known issue, Deprecated) and CI pipeline status.",
    tokens: ["color.semantic.success", "color.semantic.warning", "radius.pill", "spacing.xs"],
    codeSnippet: `<StatusBadge status="healthy" label="Healthy · 98% parity" />`,
    dos: [
      "Pair status color with an unambiguous text label for color-vision accessibility.",
      "Keep badge copy to 1–3 words maximum.",
    ],
    donts: [
      "Do not make StatusBadges interactive buttons; use a filter chip or button instead.",
    ],
    props: [
      {
        name: "status",
        type: "'healthy' | 'warning' | 'danger' | 'neutral'",
        defaultValue: "'healthy'",
        required: true,
        description: "Selects semantic color token and status indicator icon.",
      },
    ],
  },
  {
    id: "callout",
    name: "CalloutBanner",
    category: "Feedback",
    status: "beta",
    health: "Known issue",
    version: "1.4.2",
    a11y: "role='status' · Missing dark-light high-contrast doc note",
    figmaNode: "Dark Matter: Foundations → 198:512",
    storybookId: "feedback-callout--warning",
    usageCount: 94,
    coveragePct: 84,
    description:
      "Contextual inline alert block used inside Living Documentation and PR delivery summaries.",
    tokens: [
      "color.semantic.warning",
      "color.semantic.surface",
      "radius.md",
      "spacing.md",
    ],
    codeSnippet: `<CalloutBanner intent="warning" title="Token Drift Detected">\n  2 components use hardcoded hex values.\n</CalloutBanner>`,
    dos: [
      "Place callout banners immediately above the relevant code or token table.",
    ],
    donts: [
      "Avoid stacking multiple warning banners on the same documentation page.",
    ],
    props: [
      {
        name: "intent",
        type: "'info' | 'success' | 'warning' | 'danger'",
        defaultValue: "'info'",
        required: false,
        description: "Determines accent bar and icon semantic token.",
      },
    ],
  },
  {
    id: "modal",
    name: "DialogModal",
    category: "Surfaces",
    status: "stable",
    health: "Healthy",
    version: "2.1.0",
    a11y: "Focus trap · Escape dismissal · aria-modal='true'",
    figmaNode: "Dark Matter: Foundations → 215:604",
    storybookId: "surfaces-dialogmodal--default",
    usageCount: 76,
    coveragePct: 92,
    description:
      "Accessible overlay dialog for branch merges, release publishing, and Figma variable diff approval.",
    tokens: [
      "color.semantic.surface",
      "color.semantic.primary",
      "radius.lg",
      "spacing.lg",
      "blur.glass",
    ],
    codeSnippet: `<DialogModal open={isOpen} title="Approve Figma Sync Diff">...</DialogModal>`,
    dos: [
      "Provide an explicit Cancel action alongside the primary confirmation button.",
    ],
    donts: [
      "Do not trigger destructive merges without showing the token diff summary first.",
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "false",
        required: true,
        description: "Controls modal visibility and focus trap activation.",
      },
    ],
  },
];

// Living Documentation Pages (37-Block AST System from supernovaclone)
export interface DocBlock {
  id: string;
  type:
    | "heading"
    | "paragraph"
    | "callout"
    | "token-group"
    | "component-preview"
    | "component-health"
    | "do-dont"
    | "props-table"
    | "code-export"
    | "mcp-context";
  title?: string;
  content?: string;
  intent?: "info" | "warning" | "success";
  tokenFilter?: string;
  componentId?: string;
  exportTarget?: string;
}

export interface DocPage {
  id: string;
  slug: string;
  title: string;
  category: "Foundations" | "Components" | "AI & Delivery";
  updatedAt: string;
  author: string;
  version: string;
  blocks: DocBlock[];
}

export const SEED_DOC_PAGES: DocPage[] = [
  {
    id: "doc-color-architecture",
    slug: "foundations/color-architecture",
    title: "Color Architecture & Multi-Brand Themes",
    category: "Foundations",
    updatedAt: "Updated 12 mins ago by Design Agent",
    author: "Jiri Trecak · Core Architect",
    version: "v2.4",
    blocks: [
      {
        id: "b-1",
        type: "heading",
        title: "Three-Tier W3C DTCG Color Hierarchy",
        content:
          "Supernova Dark Matter separates raw primitive palettes from semantic intent tokens so Orion, Vega, and Luna brands resolve automatically without touching component code.",
      },
      {
        id: "b-2",
        type: "callout",
        intent: "info",
        title: "Live Figma Variables Sync Active",
        content:
          "Connected to Dark Matter: Foundations (Figma). Any change to semantic aliases automatically updates this documentation table and triggers your scoped MCP servers.",
      },
      {
        id: "b-3",
        type: "token-group",
        title: "Semantic Color Tokens (Live Resolved)",
        tokenFilter: "color.semantic",
      },
      {
        id: "b-4",
        type: "code-export",
        title: "Live Compiled CSS Custom Properties",
        exportTarget: "css",
      },
    ],
  },
  {
    id: "doc-button-spec",
    slug: "components/button",
    title: "Button — Component Specification & Anatomy",
    category: "Components",
    updatedAt: "Updated 4 mins ago by Self-Healing Agent",
    author: "Vaclavach · Design Ops",
    version: "v3.4.0",
    blocks: [
      {
        id: "b-10",
        type: "component-health",
        componentId: "button",
      },
      {
        id: "b-11",
        type: "component-preview",
        title: "Interactive Live Component Sandbox",
        componentId: "button",
      },
      {
        id: "b-12",
        type: "do-dont",
        title: "Usage Guidelines (Do & Don't)",
        componentId: "button",
      },
      {
        id: "b-13",
        type: "props-table",
        title: "Component API & Bound Tokens",
        componentId: "button",
      },
    ],
  },
  {
    id: "doc-mcp-delivery",
    slug: "delivery/scoped-mcp-servers",
    title: "Scoped MCP Servers & AI Agent Delivery",
    category: "AI & Delivery",
    updatedAt: "Synced with /llms.txt",
    author: "Supernova AI Engine",
    version: "MCP 2025-06-18",
    blocks: [
      {
        id: "b-20",
        type: "heading",
        title: "Filtered Context for Claude Code, Cursor & VS Code",
        content:
          "Instead of dumping 10,000 raw variables into an LLM context window, Supernova scopes MCP endpoints per product surface (Checkout Team, Marketing Web, iOS/Android Mobile).",
      },
      {
        id: "b-21",
        type: "mcp-context",
        title: "Active Scoped MCP Configurations",
      },
      {
        id: "b-22",
        type: "code-export",
        title: "Tailwind v4 @theme Output for AI Agents",
        exportTarget: "tailwind",
      },
    ],
  },
];

// Vector Assets Registry (Dark Matter: Assets from supernova-website)
export interface VectorAsset {
  id: string;
  name: string;
  category: "System Icons" | "Brand Marks" | "Status Glyphs";
  figmaSource: string;
  dimensions: string;
  svgPath: string;
  tokensUsed: string[];
}

export const SEED_VECTOR_ASSETS: VectorAsset[] = [
  {
    id: "icon-spark",
    name: "supernova-ray",
    category: "Brand Marks",
    figmaSource: "Dark Matter: Assets",
    dimensions: "24×24",
    svgPath: "M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z",
    tokensUsed: ["color.semantic.primary", "color.semantic.accent"],
  },
  {
    id: "icon-token-node",
    name: "token-alias-chain",
    category: "System Icons",
    figmaSource: "Dark Matter: Assets",
    dimensions: "24×24",
    svgPath: "M7 7h4v4H7V7zm6 6h4v4h-4v-4zM9 11v2a2 2 0 002 2h2",
    tokensUsed: ["color.semantic.primary"],
  },
  {
    id: "icon-branch-fork",
    name: "git-branch-sync",
    category: "System Icons",
    figmaSource: "Dark Matter: Assets",
    dimensions: "24×24",
    svgPath: "M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 9a9 9 0 01-9 9",
    tokensUsed: ["color.semantic.text"],
  },
  {
    id: "icon-shield-check",
    name: "wcag-verified-shield",
    category: "Status Glyphs",
    figmaSource: "Dark Matter: Assets",
    dimensions: "24×24",
    svgPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-1.5-6.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z",
    tokensUsed: ["color.semantic.success"],
  },
  {
    id: "icon-mcp-bridge",
    name: "mcp-agent-connector",
    category: "System Icons",
    figmaSource: "Dark Matter: Assets",
    dimensions: "24×24",
    svgPath: "M4 12h16M12 4l8 8-8 8",
    tokensUsed: ["color.semantic.accent"],
  },
  {
    id: "icon-layers",
    name: "multi-brand-layers",
    category: "Brand Marks",
    figmaSource: "Dark Matter: Assets",
    dimensions: "24×24",
    svgPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    tokensUsed: ["color.semantic.primary"],
  },
];

// Self-Healing Issues (Directly from Supernova Website '04 Improve' section)
export interface SelfHealingIssue {
  id: string;
  title: string;
  source: string;
  severity: "high" | "medium" | "low";
  status: "open" | "resolved";
  detectedAt: string;
  violatingCode: string;
  suggestedFix: string;
  tokenPath: string;
  agentSummary: string;
}

export const SEED_SELF_HEALING_ISSUES: SelfHealingIssue[] = [
  {
    id: "heal-1",
    title: "Button uses hardcoded #1a5ee5 instead of color.semantic.primary",
    source: "apps/checkout-web/src/components/PayButton.tsx:42",
    severity: "high",
    status: "open",
    detectedAt: "14 mins ago · GitHub Scanner",
    violatingCode: `background-color: #1a5ee5;\npadding: 16px 24px;\nborder-radius: 10px;`,
    suggestedFix: `background-color: var(--color-semantic-primary);\npadding: var(--spacing-md) var(--spacing-lg);\nborder-radius: var(--radius-md);`,
    tokenPath: "color.semantic.primary",
    agentSummary:
      "Replaced raw #1a5ee5 and pixel literals with semantic Dark Matter CSS variables so Orion, Vega, and Luna brands theme automatically.",
  },
  {
    id: "heal-2",
    title: "Card border-radius doesn't match Figma Dark Matter: Foundations",
    source: "packages/ui/src/SurfaceCard.tsx:19",
    severity: "medium",
    status: "open",
    detectedAt: "38 mins ago · Figma Parity Bot",
    violatingCode: `.surface-card {\n  background: #161b22;\n  border-radius: 16px;\n}`,
    suggestedFix: `.surface-card {\n  background: var(--color-semantic-surface);\n  border-radius: var(--radius-lg);\n}`,
    tokenPath: "radius.lg",
    agentSummary:
      "Bound SurfaceCard container background and 16px corner radius to color.semantic.surface and radius.lg.",
  },
  {
    id: "heal-3",
    title: "CalloutBanner missing dark-to-light contrast guidance in Living Docs",
    source: "docs/components/callout-banner.mdx",
    severity: "low",
    status: "open",
    detectedAt: "1 hr ago · Documentation Agent",
    violatingCode: `<!-- Missing WCAG AA contrast note for Orion Daylight override -->`,
    suggestedFix: `<Callout intent="info">Verified 7.8:1 contrast ratio across Orion Dark Matter and Daylight themes.</Callout>`,
    tokenPath: "color.semantic.warning",
    agentSummary:
      "Drafted accessibility contrast section and updated CalloutBanner health status to Healthy.",
  },
];

// Incoming sample Figma Variables payload for two-way sync preview & live apply
export const SAMPLE_FIGMA_INCOMING_TOKENS: Token[] = (() => {
  const clone = SEED_TOKENS.filter((t) => !t.deprecated).map((t) => {
    if (t.path === "color.primitive.blue.500") {
      return {
        ...t,
        value: "#3b82f6",
        plain: "Supernova Primary Blue 500 (Updated in Dark Matter: Foundations)",
      };
    }
    if (t.path === "spacing.lg") {
      return {
        ...t,
        value: "28px",
        plain: "Section padding (Updated to 28px in Figma Variables)",
      };
    }
    return t;
  });
  clone.push({
    path: "color.semantic.info",
    type: "color",
    value: "{color.primitive.blue.400}",
    description: "Informational banner accent synced from Dark Matter: Foundations",
    plain: "Semantic Info Blue",
  });
  clone.push({
    path: "color.primitive.emerald.600",
    type: "color",
    value: "#059669",
    description: "New high-contrast emerald shade added in Figma Variables",
    plain: "Emerald 600",
  });
  return clone;
})();

// Reverse-Engineering Architecture Verification Matrix (Supernova Website + supernovaclone REA Dossier)
export const RE_ARCHITECTURE_COMPARISON = [
  {
    subsystem: "01 Manage · W3C DTCG 11-Type Token Engine & Alias Graph",
    novaCoreFlow: "Basic 7-type parser and single-branch resolver.",
    supernovaIndia: "Static array in data.ts with no recursive resolution.",
    unifiedCampusArchitecture:
      "All 11 Supernova token types, 500-level recursion ceiling, fallback value syntax ({path | fallback}), multi-brand themes (Orion, Vega, Luna), and Git-style token branching.",
    status: "Verified & Live",
  },
  {
    subsystem: "02 Document · Living Documentation 37-Block AST & Component Health",
    novaCoreFlow: "Static component cards without AST blocks.",
    supernovaIndia: "Hardcoded preview cards.",
    unifiedCampusArchitecture:
      "Interactive Living Documentation AST with live token group tables, interactive component sandboxes, Do/Don't contracts, Storybook CSF3 parity, and 1-click block authoring.",
    status: "Verified & Live",
  },
  {
    subsystem: "03 Deliver · 10 Multi-Platform Exporters, Pulsar (.pr) & Scoped MCP",
    novaCoreFlow: "6 basic exporters, no Pulsar scripting or MCP server.",
    supernovaIndia: "Hardcoded string templates and non-functional MCP preview.",
    unifiedCampusArchitecture:
      "All 10 Supernova exporters (Tailwind v4, CSS, SCSS, TS, Style Dictionary, iOS SwiftUI, Kotlin Compose, Flutter, Android XML, W3C JSON), live Pulsar .pr template compiler, /llms.txt, and Scoped MCP Server.",
    status: "Verified & Live",
  },
  {
    subsystem: "04 Improve · Self-Healing Agent Loop & AST Compliance Auditor",
    novaCoreFlow: "Regex color/px scanner.",
    supernovaIndia: "Unimplemented MCP stub.",
    unifiedCampusArchitecture:
      "Automated drift detection queue (Figma vs GitHub codebase), 1-click Self-Healing Agent patch resolution, and real-time MCP / adoption telemetry.",
    status: "Verified & Live",
  },
];
