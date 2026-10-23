import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  diffTokens,
  resolveTokens,
  type ContextTheme,
  type Token,
  type TokenBranch,
} from "../lib/ds/engine";
import {
  SEED_COMPONENTS,
  SEED_CONTEXTS,
  SEED_DOC_PAGES,
  SEED_SELF_HEALING_ISSUES,
  SEED_TOKENS,
  SEED_VECTOR_ASSETS,
  type DSComponent,
  type DocPage,
  type SelfHealingIssue,
  type VectorAsset,
} from "../lib/ds/seed";

export interface Release {
  version: string;
  date: string;
  author: string;
  note: string;
  tokenCount: number;
  changes: { added: number; changed: number; removed: number };
  snapshot: Token[];
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  targetUrl: string;
  events: string[];
  lastStatus: string;
  lastTriggeredAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  category:
    | "token"
    | "release"
    | "component"
    | "figma"
    | "workspace"
    | "mcp"
    | "webhook"
    | "branch"
    | "docs"
    | "heal";
  details: string;
  timestamp: string;
}

export interface WorkspaceData {
  id: string;
  slug: string;
  name: string;
  department: string;
  ownerName: string;
  apiKey: string;
  activeContext: string;
  activeBranch: string;
  createdAt: string;
  tokens: Token[];
  branches: TokenBranch[];
  contexts: ContextTheme[];
  components: DSComponent[];
  docPages: DocPage[];
  vectorAssets: VectorAsset[];
  selfHealingIssues: SelfHealingIssue[];
  releases: Release[];
  webhooks: WebhookEndpoint[];
  auditLogs: AuditLogEntry[];
}

export interface DatabaseSchema {
  workspaces: WorkspaceData[];
}

const DATA_DIR = path.resolve(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "supernova-os-db-v2.json");

function createInitialBranches(baseTokens: Token[], ownerName: string): TokenBranch[] {
  const mainTokens = baseTokens.map((t) => ({ ...t }));
  const v2Tokens = baseTokens.map((t) => {
    if (t.path === "color.primitive.blue.500") {
      return { ...t, value: "#3b82f6", plain: "Supernova Electric Blue 500 (v2)" };
    }
    if (t.path === "radius.md") {
      return { ...t, value: "12px", plain: "Refined 12px card radius (v2)" };
    }
    return { ...t };
  });
  v2Tokens.push({
    path: "color.semantic.focus-ring",
    type: "color",
    value: "{color.primitive.blue.400}",
    plain: "High-visibility keyboard focus ring",
    description: "Added in feat/dark-matter-v2 branch",
  });

  return [
    {
      id: "branch-main",
      name: "main",
      description: "Production W3C DTCG token baseline synced with GitHub & MCP servers",
      baseBranch: "main",
      author: ownerName,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      isDefault: true,
      tokens: mainTokens,
    },
    {
      id: "branch-dark-matter-v2",
      name: "feat/dark-matter-v2",
      description: "Refined primary blue luminance, 12px radius, and new focus-ring semantic token",
      baseBranch: "main",
      author: "Vaclavach · Design Ops",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      isDefault: false,
      tokens: v2Tokens,
    },
  ];
}

function createInitialWorkspace(
  slug: string,
  name: string,
  department: string,
  ownerName: string,
  apiKeySuffix: string,
  activeContext = "default",
): WorkspaceData {
  const initialTokens = SEED_TOKENS.map((t) => ({ ...t }));
  const initialRelease: Release = {
    version: "2.4.0",
    date: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    author: ownerName,
    note: "Supernova Dark Matter foundations, multi-brand contexts (Orion, Vega, Luna) & 10-target exporters",
    tokenCount: initialTokens.length,
    changes: { added: initialTokens.length, changed: 0, removed: 0 },
    snapshot: initialTokens,
  };

  return {
    id: crypto.randomUUID(),
    slug,
    name,
    department,
    ownerName,
    apiKey: `snv_live_${apiKeySuffix}`,
    activeContext,
    activeBranch: "main",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    tokens: initialTokens,
    branches: createInitialBranches(initialTokens, ownerName),
    contexts: SEED_CONTEXTS.map((c) => ({ ...c, overrides: { ...c.overrides } })),
    components: SEED_COMPONENTS.map((c) => ({
      ...c,
      tokens: [...c.tokens],
      dos: [...c.dos],
      donts: [...c.donts],
      props: c.props.map((p) => ({ ...p })),
    })),
    docPages: SEED_DOC_PAGES.map((p) => ({
      ...p,
      blocks: p.blocks.map((b) => ({ ...b })),
    })),
    vectorAssets: SEED_VECTOR_ASSETS.map((a) => ({
      ...a,
      tokensUsed: [...a.tokensUsed],
    })),
    selfHealingIssues: SEED_SELF_HEALING_ISSUES.map((i) => ({ ...i })),
    releases: [initialRelease],
    webhooks: [
      {
        id: "wh-github-pr",
        name: "GitHub Pull Request Exporter (@supernova/exporter-tailwind)",
        targetUrl: `https://api.github.com/repos/supernova-io/${slug}/dispatches`,
        events: ["release.published", "figma.synced", "branch.merged"],
        lastStatus: "200 OK · PR #418 Merged",
        lastTriggeredAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
      {
        id: "wh-mcp-cache",
        name: "Scoped MCP Edge Invalidator (Claude Code & Cursor)",
        targetUrl: `https://mcp.supernova.io/v1/workspaces/${slug}/invalidate`,
        events: ["tokens.updated", "docs.updated"],
        lastStatus: "200 OK · Edge Synced (14ms)",
        lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
    ],
    auditLogs: [
      {
        id: crypto.randomUUID(),
        actor: "Claude Code (Scoped MCP)",
        action: "Queried get_tokens & check_compliance for Checkout Team",
        category: "mcp",
        details: `Served ${initialTokens.length} resolved Dark Matter tokens in 11ms`,
        timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        actor: "Figma Sync Bot",
        action: "Verified Dark Matter: Foundations variable parity",
        category: "figma",
        details: "5 connected Figma files in sync with branch 'main'",
        timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        actor: ownerName,
        action: "Published release v2.4.0",
        category: "release",
        details: `Snapshot of ${initialTokens.length} W3C DTCG tokens across 11 token types committed`,
        timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
    ],
  };
}

function seedDatabase(): DatabaseSchema {
  return {
    workspaces: [
      createInitialWorkspace(
        "dark-matter-core",
        "Supernova · Dark Matter OS",
        "Core Design Systems & AI Platform",
        "Jiri Trecak (System Architect)",
        "dm_core_9f8a7b6c",
        "default",
      ),
      createInitialWorkspace(
        "mews-hospitality",
        "Mews Design System",
        "Enterprise Multi-Brand Product Suite",
        "Vaclavach (Design Ops Lead)",
        "mews_ds_3d2e1f0a",
        "vega-brand",
      ),
      createInitialWorkspace(
        "campus-sandbox",
        "Campus Engineering Lab",
        "Student & Developer Open Sandbox",
        "Prudhvi Raj (Lead Maintainer)",
        "campus_lab_7c6b5a4d",
        "default",
      ),
    ],
  };
}

let dbCache: DatabaseSchema | null = null;

export function loadDb(): DatabaseSchema {
  if (dbCache) return dbCache;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw) as DatabaseSchema;
      if (parsed && Array.isArray(parsed.workspaces) && parsed.workspaces.length > 0) {
        dbCache = parsed;
        return dbCache;
      }
    }
  } catch (err) {
    console.warn("Re-initializing Supernova database from seed:", err);
  }
  dbCache = seedDatabase();
  saveDb(dbCache);
  return dbCache;
}

export function saveDb(db: DatabaseSchema): void {
  dbCache = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
}

export function getWorkspace(slugOrId?: string): WorkspaceData {
  const db = loadDb();
  if (slugOrId) {
    const found = db.workspaces.find(
      (w) => w.slug === slugOrId || w.id === slugOrId || w.apiKey === slugOrId,
    );
    if (found) return found;
  }
  return db.workspaces[0]!;
}

export function addAuditLog(
  ws: WorkspaceData,
  actor: string,
  action: string,
  category: AuditLogEntry["category"],
  details: string,
) {
  ws.auditLogs.unshift({
    id: crypto.randomUUID(),
    actor,
    action,
    category,
    details,
    timestamp: new Date().toISOString(),
  });
  if (ws.auditLogs.length > 60) {
    ws.auditLogs = ws.auditLogs.slice(0, 60);
  }
}

export function serializeWorkspaceResponse(ws: WorkspaceData) {
  const activeCtx =
    ws.contexts.find((c) => c.id === ws.activeContext) ?? ws.contexts[0]!;
  const resolved = resolveTokens(ws.tokens, activeCtx.overrides, activeCtx.id);
  const pendingDiff = diffTokens(ws.releases[0]?.snapshot ?? [], ws.tokens);

  return {
    ...ws,
    resolved,
    pendingDiff,
  };
}
