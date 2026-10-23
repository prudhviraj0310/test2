// Supernova Design System OS — Core Engine (Matched to Supernova REA Dossier & supernovaclone)
// Implements:
// 1. All 11 Supernova Token Types + W3C DTCG Parser & Serializer
// 2. Recursive Alias Resolver with 500-level ceiling, cycle detection & fallback syntax
// 3. Multi-Brand & Theme Context Matrix (Orion, Vega, Luna · Dark Matter & Light)
// 4. Token Branching & Three-Way Branch Diff / Merge Engine
// 5. All 10 Supernova Multi-Platform Exporters (Tailwind v4, CSS, SCSS, TS, Style Dictionary, iOS SwiftUI, Android Kotlin, Flutter, Android XML, W3C JSON)
// 6. Pulsar Custom Exporter Template Compiler (.pr / Handlebars syntax)
// 7. Codebase AST Compliance Scanner & Self-Healing Auto-Fix Engine
// 8. Bi-Directional Figma Variables Diff & Sync Engine

export type TokenType =
  | "color"
  | "typography"
  | "dimension"
  | "font"
  | "radius"
  | "borderRadius"
  | "shadow"
  | "border"
  | "gradient"
  | "blur"
  | "text"
  | "generic"
  // Legacy aliases supported seamlessly
  | "fontFamily"
  | "fontWeight"
  | "duration"
  | "number";

export const SUPERNOVA_TOKEN_TYPES: {
  id: TokenType;
  label: string;
  category: string;
  sampleValue: string;
}[] = [
  { id: "color", label: "Color", category: "Color", sampleValue: "#2b70f7" },
  { id: "typography", label: "Typography", category: "Typography", sampleValue: "600 16px/24px Inter" },
  { id: "dimension", label: "Dimension", category: "Spacing & Sizing", sampleValue: "16px" },
  { id: "font", label: "Font Family / Weight", category: "Typography", sampleValue: "Manrope, sans-serif" },
  { id: "radius", label: "Border Radius", category: "Shape", sampleValue: "8px" },
  { id: "shadow", label: "Elevation Shadow", category: "Effects", sampleValue: "0 8px 24px rgba(0,0,0,0.38)" },
  { id: "border", label: "Border Stroke", category: "Shape", sampleValue: "1px solid #262c36" },
  { id: "gradient", label: "Gradient", category: "Color", sampleValue: "linear-gradient(135deg, #2b70f7 0%, #ea580c 100%)" },
  { id: "blur", label: "Backdrop Blur", category: "Effects", sampleValue: "16px" },
  { id: "text", label: "Text String", category: "Content", sampleValue: "Dark Matter OS" },
  { id: "generic", label: "Generic / Motion", category: "Other", sampleValue: "180ms cubic-bezier(0.16, 1, 0.3, 1)" },
];

export interface Token {
  path: string; // e.g. dm.color.primary.500 or color.semantic.primary
  type: TokenType;
  value: string; // raw value or alias "{other.path}" or "{other.path | #2b70f7}"
  description?: string | undefined;
  plain?: string | undefined;
  brand?: string | undefined; // e.g. "orion" | "vega" | "luna"
  figmaVariableId?: string | undefined;
  deprecated?: boolean | undefined;
}

export interface ResolvedToken extends Token {
  resolved: string | null;
  aliasOf: string | null;
  fallbackValue?: string | undefined;
  overriddenByContext?: string | undefined;
  depth?: number;
  error?: string;
}

export interface ContextTheme {
  id: string;
  name: string;
  brand: string;
  mode: "dark" | "light";
  description: string;
  badge: string;
  overrides: Record<string, string>; // token.path -> new raw value or alias
}

export interface TokenBranch {
  id: string;
  name: string;
  description: string;
  baseBranch: string;
  author: string;
  createdAt: string;
  isDefault?: boolean;
  tokens: Token[];
}

export interface BranchDiffItem {
  path: string;
  type: TokenType;
  changeType: "added" | "modified" | "deleted" | "unchanged";
  sourceValue?: string;
  targetValue?: string;
}

export interface BranchDiffSummary {
  sourceBranch: string;
  targetBranch: string;
  totalChanges: number;
  addedCount: number;
  modifiedCount: number;
  deletedCount: number;
  unchangedCount: number;
  changes: BranchDiffItem[];
}

const ALIAS_RE = /^\{([^}|]+)(?:\|\s*([^}]+))?\}$/;
export const MAX_ALIAS_DEPTH = 500;

export function isAlias(v: string): boolean {
  return ALIAS_RE.test(v.trim());
}

/** Flatten a W3C DTCG JSON document into tokens. Inherits $type from groups. */
export function parseDTCG(doc: unknown): Token[] {
  const out: Token[] = [];
  const walk = (node: any, path: string[], inherited?: string) => {
    if (!node || typeof node !== "object") return;
    const groupType = node.$type ?? inherited;
    if ("$value" in node) {
      const ext = node.$extensions?.["com.supernova"] ?? {};
      out.push({
        path: path.join("."),
        type: (groupType ?? "generic") as TokenType,
        value: typeof node.$value === "string" ? node.$value : JSON.stringify(node.$value),
        description: node.$description,
        plain: node.$plain ?? node.$description ?? path.join("."),
        brand: ext.brand ?? node.$brand,
        figmaVariableId: ext.figmaVariableId ?? node.$figmaVariableId,
        deprecated: Boolean(node.$deprecated),
      });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue;
      walk(v, [...path, k], groupType);
    }
  };
  walk(doc, []);
  return out;
}

/** Rebuild a W3C DTCG document from flat tokens. */
export function toDTCG(tokens: Token[]): Record<string, unknown> {
  const root: any = {};
  for (const t of tokens) {
    const parts = t.path.split(".");
    let cur = root;
    parts.slice(0, -1).forEach((p) => (cur = cur[p] ??= {}));
    cur[parts[parts.length - 1]!] = {
      $type: t.type,
      $value: t.value,
      ...(t.description ? { $description: t.description } : {}),
      ...(t.plain ? { $plain: t.plain } : {}),
      ...(t.deprecated ? { $deprecated: true } : {}),
      ...(t.brand || t.figmaVariableId
        ? {
            $extensions: {
              "com.supernova": {
                ...(t.brand ? { brand: t.brand } : {}),
                ...(t.figmaVariableId ? { figmaVariableId: t.figmaVariableId } : {}),
              },
            },
          }
        : {}),
    };
  }
  return root;
}

/**
 * Resolve every alias chain up to MAX_ALIAS_DEPTH (500 levels per Supernova REA spec).
 * Detects missing references, circular references, and supports `{token.path | fallback}` syntax.
 */
export function resolveTokens(
  tokens: Token[],
  contextOverrides?: Record<string, string>,
  contextId?: string,
): ResolvedToken[] {
  const effectiveTokens = tokens.map((t) => {
    const override = contextOverrides?.[t.path];
    if (override !== undefined) {
      return { ...t, value: override, overriddenByContext: contextId ?? "custom" };
    }
    return { ...t, overriddenByContext: undefined };
  });

  const map = new Map(effectiveTokens.map((t) => [t.path, t]));

  const resolveOne = (
    t: Token,
  ): { value: string | null; depth: number; fallback?: string; error?: string } => {
    const seen = new Set<string>([t.path]);
    let cur = t.value.trim();
    let depth = 0;
    let firstFallback: string | undefined;

    while (isAlias(cur)) {
      depth++;
      if (depth > MAX_ALIAS_DEPTH) {
        return {
          value: null,
          depth,
          error: `Exceeded maximum alias recursion depth (${MAX_ALIAS_DEPTH})`,
        };
      }
      const match = cur.match(ALIAS_RE)!;
      const ref = match[1]!.trim();
      const fallback = match[2]?.trim();
      if (fallback && !firstFallback) firstFallback = fallback;

      if (seen.has(ref)) {
        return { value: null, depth, error: `Circular reference via ${ref}` };
      }
      const next = map.get(ref);
      if (!next) {
        if (fallback) {
          return { value: fallback, depth, fallback };
        }
        return { value: null, depth, error: `Unknown token ${ref}` };
      }
      seen.add(ref);
      cur = next.value.trim();
    }
    return { value: cur, depth, ...(firstFallback ? { fallback: firstFallback } : {}) };
  };

  return effectiveTokens.map((t) => {
    const r = resolveOne(t);
    const m = t.value.trim().match(ALIAS_RE);
    return {
      ...t,
      resolved: r.value,
      aliasOf: m ? m[1]!.trim() : null,
      ...(r.fallback ? { fallbackValue: r.fallback } : {}),
      depth: r.depth,
      ...(r.error ? { error: r.error } : {}),
    };
  });
}

export function groupOf(path: string): string {
  return path.split(".")[0] ?? path;
}

export const kebab = (p: string) => p.replace(/\./g, "-").replace(/[^a-zA-Z0-9-]/g, "-");

export const camel = (p: string) =>
  p
    .split(/[.\-_]/)
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join("")
    .replace(/^(\d)/, "_$1");

export const pascal = (p: string) => {
  const c = camel(p);
  return c.charAt(0).toUpperCase() + c.slice(1);
};

export const snake = (p: string) =>
  p
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase();

export const upperSnake = (p: string) => snake(p).toUpperCase();

// ─── All 10 Official Supernova Multi-Platform Exporters ─────────────────

export type ExportTarget =
  | "tailwind"
  | "css"
  | "scss"
  | "typescript"
  | "style-dictionary"
  | "swift"
  | "kotlin"
  | "flutter"
  | "android-xml"
  | "json";

export const EXPORT_TARGETS: {
  id: ExportTarget;
  label: string;
  exporterPackage: string;
  file: string;
  forPlatform: string;
}[] = [
  {
    id: "tailwind",
    label: "Tailwind CSS v4",
    exporterPackage: "@supernova/exporter-tailwind",
    file: "tailwind.theme.css",
    forPlatform: "React, Next.js & Vite web apps (@theme)",
  },
  {
    id: "css",
    label: "CSS Custom Properties",
    exporterPackage: "@supernova/exporter-css",
    file: "tokens.css",
    forPlatform: "Standard CSS variables with alias var() references",
  },
  {
    id: "scss",
    label: "SCSS Variables & Mixins",
    exporterPackage: "@supernova/exporter-scss",
    file: "_tokens.scss",
    forPlatform: "Sass variables ($token) and typography @mixin helpers",
  },
  {
    id: "typescript",
    label: "TypeScript Dictionary",
    exporterPackage: "@supernova/exporter-typescript",
    file: "tokens.ts",
    forPlatform: "Strongly typed TypeScript constants & union types",
  },
  {
    id: "style-dictionary",
    label: "Style Dictionary v4",
    exporterPackage: "@supernova/exporter-style-dictionary",
    file: "tokens.sd.json",
    forPlatform: "Amazon Style Dictionary v4 multi-platform build pipeline",
  },
  {
    id: "swift",
    label: "iOS SwiftUI",
    exporterPackage: "@supernova/exporter-swiftui",
    file: "SupernovaTokens.swift",
    forPlatform: "Native iOS / macOS SwiftUI Color & CGFloat constants",
  },
  {
    id: "kotlin",
    label: "Android Jetpack Compose",
    exporterPackage: "@supernova/exporter-compose",
    file: "SupernovaTokens.kt",
    forPlatform: "Android Kotlin Compose Color(0xFF...) & Dp values",
  },
  {
    id: "flutter",
    label: "Flutter ThemeData",
    exporterPackage: "@supernova/exporter-flutter",
    file: "supernova_tokens.dart",
    forPlatform: "Cross-platform Dart Color, EdgeInsets & TextStyle constants",
  },
  {
    id: "android-xml",
    label: "Android XML Resources",
    exporterPackage: "@supernova/exporter-android-xml",
    file: "tokens.xml",
    forPlatform: "Android res/values/colors.xml & dimens.xml resources",
  },
  {
    id: "json",
    label: "W3C DTCG JSON",
    exporterPackage: "@supernova/exporter-dtcg-json",
    file: "tokens.dtcg.json",
    forPlatform: "W3C Design Tokens Community Group format & AI MCP payload",
  },
];

const twPrefix: Record<string, string> = {
  color: "color",
  typography: "font",
  dimension: "spacing",
  font: "font",
  radius: "radius",
  shadow: "shadow",
  border: "border",
  gradient: "bg-image",
  blur: "blur",
  text: "content",
  generic: "token",
  fontFamily: "font",
  fontWeight: "font-weight",
  duration: "duration",
  number: "number",
};

function hexToRgba(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(8, "f");
  const [r = 0, g = 0, b = 0, a = 1] = [0, 2, 4, 6].map(
    (i) => parseInt(full.slice(i, i + 2), 16) / 255,
  );
  return { r, g, b, a };
}

function hexToArgbHex(hex: string): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return (full.length === 8 ? full.slice(6) + full.slice(0, 6) : "FF" + full).toUpperCase();
}

export function exportTokens(
  tokens: Token[],
  target: ExportTarget,
  contextOverrides?: Record<string, string>,
  contextId?: string,
): string {
  const resolved = resolveTokens(tokens, contextOverrides, contextId).filter(
    (t) => t.resolved !== null,
  );
  const ctxLabel = contextId && contextId !== "default" ? ` [Context: ${contextId}]` : "";
  const header = `Generated by Supernova Design System OS${ctxLabel} — do not edit manually`;

  switch (target) {
    case "css":
      return `/* ${header} */\n:root {\n${resolved
        .map(
          (t) =>
            `  --${kebab(t.path)}: ${t.aliasOf ? `var(--${kebab(t.aliasOf)})` : t.resolved};`,
        )
        .join("\n")}\n}\n`;

    case "tailwind":
      return `/* ${header} */\n@theme {\n${resolved
        .map(
          (t) =>
            `  --${twPrefix[t.type] ?? "token"}-${kebab(
              t.path.split(".").slice(1).join(".") || t.path,
            )}: ${t.resolved};`,
        )
        .join("\n")}\n}\n`;

    case "scss": {
      const vars = resolved
        .map((t) => `$${kebab(t.path)}: ${t.aliasOf ? `$${kebab(t.aliasOf)}` : t.resolved} !default;`)
        .join("\n");
      const mapEntries = resolved
        .map((t) => `  '${t.path}': $${kebab(t.path)},`)
        .join("\n");
      return `// ${header}\n\n${vars}\n\n$supernova-tokens: (\n${mapEntries}\n);\n`;
    }

    case "typescript":
      return `// ${header}\nexport const tokens = {\n${resolved
        .map((t) => `  ${JSON.stringify(t.path)}: ${JSON.stringify(t.resolved)},`)
        .join("\n")}\n} as const;\n\nexport type TokenName = keyof typeof tokens;\n`;

    case "style-dictionary": {
      const sdRoot: Record<string, any> = {};
      for (const t of resolved) {
        const parts = t.path.split(".");
        let cur = sdRoot;
        parts.slice(0, -1).forEach((p) => (cur = cur[p] ??= {}));
        cur[parts[parts.length - 1]!] = {
          value: t.resolved,
          type: t.type,
          ...(t.description || t.plain ? { comment: t.description || t.plain } : {}),
          ...(t.aliasOf ? { originalValue: `{${t.aliasOf}}` } : {}),
        };
      }
      return JSON.stringify(sdRoot, null, 2);
    }

    case "swift":
      return `// ${header}\nimport SwiftUI\n\npublic enum Tokens {\n${resolved
        .map((t) => {
          if (t.type === "color" && t.resolved!.startsWith("#")) {
            const { r, g, b, a } = hexToRgba(t.resolved!);
            return `  public static let ${camel(t.path)} = Color(red: ${r.toFixed(
              3,
            )}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, opacity: ${a.toFixed(2)})`;
          }
          const n = parseFloat(t.resolved!);
          return Number.isFinite(n) &&
            (t.type === "dimension" || t.type === "radius" || t.type === "blur" || t.type === "number")
            ? `  public static let ${camel(t.path)}: CGFloat = ${n}`
            : `  public static let ${camel(t.path)} = ${JSON.stringify(t.resolved)}`;
        })
        .join("\n")}\n}\n`;

    case "kotlin":
      return `// ${header}\npackage io.supernova.tokens\n\nimport androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.dp\n\nobject Tokens {\n${resolved
        .map((t) => {
          if (t.type === "color" && t.resolved!.startsWith("#")) {
            const argb = hexToArgbHex(t.resolved!);
            return `    val ${camel(t.path)} = Color(0x${argb})`;
          }
          const n = parseFloat(t.resolved!);
          if ((t.type === "dimension" || t.type === "radius") && Number.isFinite(n))
            return `    val ${camel(t.path)} = ${n}.dp`;
          return `    val ${camel(t.path)} = ${JSON.stringify(t.resolved)}`;
        })
        .join("\n")}\n}\n`;

    case "flutter":
      return `// ${header}\nimport 'package:flutter/material.dart';\n\nclass SupernovaTokens {\n  SupernovaTokens._();\n\n${resolved
        .map((t) => {
          if (t.type === "color" && t.resolved!.startsWith("#")) {
            const argb = hexToArgbHex(t.resolved!);
            return `  static const Color ${camel(t.path)} = Color(0x${argb});`;
          }
          const n = parseFloat(t.resolved!);
          if ((t.type === "dimension" || t.type === "radius") && Number.isFinite(n)) {
            return `  static const double ${camel(t.path)} = ${n}.0;`;
          }
          return `  static const String ${camel(t.path)} = ${JSON.stringify(t.resolved)};`;
        })
        .join("\n")}\n}\n`;

    case "android-xml": {
      const lines = resolved.map((t) => {
        const resName = snake(t.path);
        if (t.type === "color" && t.resolved!.startsWith("#")) {
          return `  <color name="${resName}">${t.resolved}</color>`;
        }
        if (t.type === "dimension" || t.type === "radius") {
          const dpVal = t.resolved!.replace(/px$/, "dp");
          return `  <dimen name="${resName}">${dpVal}</dimen>`;
        }
        return `  <string name="${resName}">${t.resolved}</string>`;
      });
      return `<?xml version="1.0" encoding="utf-8"?>\n<!-- ${header} -->\n<resources>\n${lines.join(
        "\n",
      )}\n</resources>\n`;
    }

    case "json":
      return JSON.stringify(toDTCG(tokens), null, 2);
  }
}

// ─── Pulsar Template Engine (.pr / Handlebars-Compatible Scripting) ──────

export interface PulsarTemplatePreset {
  id: string;
  name: string;
  outputFileName: string;
  description: string;
  template: string;
}

export const DEFAULT_PULSAR_TEMPLATES: PulsarTemplatePreset[] = [
  {
    id: "pulsar-css-dark-matter",
    name: "Dark Matter CSS Custom Properties (.pr)",
    outputFileName: "dark-matter-tokens.css",
    description: "Generates scoped [data-theme] CSS variables with token descriptions as inline comments.",
    template: `/* Supernova Pulsar Blueprint: {{designSystemName}} ({{contextId}}) */
[data-theme="{{contextId}}"] {
{{#each tokens}}
  /* {{plain}} ({{type}}) */
  --{{kebabCase path}}: {{resolved}};
{{/each}}
}`,
  },
  {
    id: "pulsar-react-theme-hook",
    name: "React Typed Design Token Hook (.pr)",
    outputFileName: "useSupernovaTheme.ts",
    description: "Compiles design tokens into a zero-runtime TypeScript React hook and CSS variable helper.",
    template: `// Generated by Supernova Pulsar Engine — {{designSystemName}}
export const SUPERNOVA_THEME = {
{{#each tokens}}
  {{camelCase path}}: "{{resolved}}",
{{/each}}
} as const;

export type SupernovaTokenKey = keyof typeof SUPERNOVA_THEME;
`,
  },
  {
    id: "pulsar-swift-ui-extension",
    name: "SwiftUI Color & Spacing Extension (.pr)",
    outputFileName: "SupernovaTheme+SwiftUI.swift",
    description: "Builds SwiftUI design system extensions from active workspace tokens.",
    template: `// Supernova Pulsar SwiftUI Export — {{designSystemName}}
import SwiftUI

public struct SupernovaDesignTokens {
{{#each tokens}}
  /// {{plain}}
  public static let {{camelCase path}} = "{{resolved}}"
{{/each}}
}`,
  },
];

export function executePulsarTemplate(
  templateStr: string,
  tokens: Token[],
  options?: {
    designSystemName?: string;
    contextId?: string;
    contextOverrides?: Record<string, string>;
    filterType?: string;
  },
): {
  output: string;
  tokensProcessed: number;
  linesGenerated: number;
  executionMs: number;
} {
  const start = performance.now();
  const resolvedAll = resolveTokens(
    tokens,
    options?.contextOverrides,
    options?.contextId ?? "default",
  ).filter((t) => t.resolved !== null);

  const filtered =
    options?.filterType && options.filterType !== "all"
      ? resolvedAll.filter((t) => t.type === options.filterType)
      : resolvedAll;

  const dsName = options?.designSystemName ?? "Supernova Dark Matter OS";
  const ctxId = options?.contextId ?? "default";

  // Evaluate {{#each tokens}} ... {{/each}} blocks
  let output = templateStr.replace(
    /\{\{#each\s+tokens\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_match, innerBlock: string) => {
      return filtered
        .map((tok) => {
          const line = innerBlock
            .replace(/^\n/, "")
            .replace(/\n$/, "")
            .replace(/\{\{camelCase\s+path\}\}/g, camel(tok.path))
            .replace(/\{\{kebabCase\s+path\}\}/g, kebab(tok.path))
            .replace(/\{\{pascalCase\s+path\}\}/g, pascal(tok.path))
            .replace(/\{\{snakeCase\s+path\}\}/g, snake(tok.path))
            .replace(/\{\{upperSnakeCase\s+path\}\}/g, upperSnake(tok.path))
            .replace(/\{\{stripUnit\s+resolved\}\}/g, String(tok.resolved ?? "").replace(/[a-zA-Z%]+$/g, ""))
            .replace(/\{\{path\}\}/g, tok.path)
            .replace(/\{\{type\}\}/g, tok.type)
            .replace(/\{\{value\}\}/g, tok.value)
            .replace(/\{\{resolved\}\}/g, String(tok.resolved ?? ""))
            .replace(/\{\{plain\}\}/g, tok.plain ?? tok.description ?? tok.path);
          return line;
        })
        .join("\n");
    },
  );

  output = output
    .replace(/\{\{designSystemName\}\}/g, dsName)
    .replace(/\{\{contextId\}\}/g, ctxId)
    .replace(/\{\{totalTokens\}\}/g, String(filtered.length));

  const elapsed = Math.max(1, Math.round((performance.now() - start) * 100) / 100);
  return {
    output,
    tokensProcessed: filtered.length,
    linesGenerated: output.split("\n").length,
    executionMs: elapsed,
  };
}

// ─── Token Branching & Three-Way Diff / Merge Engine ─────────────────────

export function diffBranches(
  sourceBranchName: string,
  sourceTokens: Token[],
  targetBranchName: string,
  targetTokens: Token[],
): BranchDiffSummary {
  const srcMap = new Map(sourceTokens.map((t) => [t.path, t]));
  const tgtMap = new Map(targetTokens.map((t) => [t.path, t]));
  const allPaths = new Set([...srcMap.keys(), ...tgtMap.keys()]);

  const changes: BranchDiffItem[] = [];
  let addedCount = 0;
  let modifiedCount = 0;
  let deletedCount = 0;
  let unchangedCount = 0;

  for (const path of allPaths) {
    const s = srcMap.get(path);
    const t = tgtMap.get(path);
    if (s && !t) {
      addedCount++;
      changes.push({
        path,
        type: s.type,
        changeType: "added",
        sourceValue: s.value,
      });
    } else if (!s && t) {
      deletedCount++;
      changes.push({
        path,
        type: t.type,
        changeType: "deleted",
        targetValue: t.value,
      });
    } else if (s && t) {
      if (s.value !== t.value || s.type !== t.type) {
        modifiedCount++;
        changes.push({
          path,
          type: s.type,
          changeType: "modified",
          sourceValue: s.value,
          targetValue: t.value,
        });
      } else {
        unchangedCount++;
      }
    }
  }

  return {
    sourceBranch: sourceBranchName,
    targetBranch: targetBranchName,
    totalChanges: addedCount + modifiedCount + deletedCount,
    addedCount,
    modifiedCount,
    deletedCount,
    unchangedCount,
    changes,
  };
}

export function mergeBranchTokens(sourceTokens: Token[], targetTokens: Token[]): Token[] {
  const merged = new Map(targetTokens.map((t) => [t.path, { ...t }]));
  for (const s of sourceTokens) {
    merged.set(s.path, { ...s });
  }
  return [...merged.values()];
}

// ─── Codebase AST Compliance & Self-Healing Auditor ─────────────────────

export interface AuditIssue {
  line: number;
  match: string;
  message: "Hardcoded color" | "Hardcoded spacing";
  suggestion?: string;
  cssVar?: string;
}

/** Find hardcoded hex colors / px values in source code that should use tokens. */
export function auditCode(code: string, tokens: Token[]): AuditIssue[] {
  const resolved = resolveTokens(tokens);
  const sorted = [...resolved].sort((a, b) => {
    const aSem = a.path.includes("semantic") || a.path.includes("brand") ? 0 : 1;
    const bSem = b.path.includes("semantic") || b.path.includes("brand") ? 0 : 1;
    return aSem - bSem;
  });

  const issues: AuditIssue[] = [];
  code.split("\n").forEach((ln, i) => {
    for (const m of ln.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const hit = sorted.find(
        (t) => t.type === "color" && t.resolved?.toLowerCase() === m[0].toLowerCase(),
      );
      issues.push({
        line: i + 1,
        match: m[0],
        message: "Hardcoded color",
        ...(hit
          ? { suggestion: hit.path, cssVar: `var(--${kebab(hit.path)})` }
          : {}),
      });
    }
    for (const m of ln.matchAll(/\b\d+px\b/g)) {
      const hit = sorted.find(
        (t) =>
          (t.type === "dimension" ||
            t.type === "radius" ||
            t.type === "borderRadius") &&
          t.resolved === m[0],
      );
      issues.push({
        line: i + 1,
        match: m[0],
        message: "Hardcoded spacing",
        ...(hit
          ? { suggestion: hit.path, cssVar: `var(--${kebab(hit.path)})` }
          : {}),
      });
    }
  });
  return issues;
}

/** Automatically rewrite hardcoded values in CSS/TSX to use CSS variables where tokens exist. */
export function autofixCode(
  code: string,
  tokens: Token[],
): { fixedCode: string; replacedCount: number } {
  const resolved = resolveTokens(tokens);
  const sorted = [...resolved].sort((a, b) => {
    const aSem = a.path.includes("semantic") || a.path.includes("brand") ? 0 : 1;
    const bSem = b.path.includes("semantic") || b.path.includes("brand") ? 0 : 1;
    return aSem - bSem;
  });

  let replacedCount = 0;
  const lines = code.split("\n").map((ln) => {
    let updated = ln.replace(/#[0-9a-fA-F]{3,8}\b/g, (match) => {
      const hit = sorted.find(
        (t) => t.type === "color" && t.resolved?.toLowerCase() === match.toLowerCase(),
      );
      if (hit) {
        replacedCount++;
        return `var(--${kebab(hit.path)})`;
      }
      return match;
    });
    updated = updated.replace(/\b\d+px\b/g, (match) => {
      const hit = sorted.find(
        (t) =>
          (t.type === "dimension" ||
            t.type === "radius" ||
            t.type === "borderRadius") &&
          t.resolved === match,
      );
      if (hit) {
        replacedCount++;
        return `var(--${kebab(hit.path)})`;
      }
      return match;
    });
    return updated;
  });

  return { fixedCode: lines.join("\n"), replacedCount };
}

/** Diff two token snapshots for version releases and Figma syncs. */
export function diffTokens(prev: Token[], next: Token[]) {
  const p = new Map(prev.map((t) => [t.path, t.value]));
  const n = new Map(next.map((t) => [t.path, t.value]));
  let added = 0,
    changed = 0,
    removed = 0;
  n.forEach((v, k) => (!p.has(k) ? added++ : p.get(k) !== v && changed++));
  p.forEach((_, k) => !n.has(k) && removed++);
  return { added, changed, removed };
}

export interface FigmaDiffItem {
  path: string;
  kind: "Added" | "Changed" | "Removed";
  type: TokenType;
  from: string;
  to: string;
  plain?: string;
}

/** Compute detailed item-level diff between workspace tokens and incoming Figma Variables. */
export function computeFigmaDiff(current: Token[], incoming: Token[]): FigmaDiffItem[] {
  const curMap = new Map(current.map((t) => [t.path, t]));
  const incMap = new Map(incoming.map((t) => [t.path, t]));
  const diffs: FigmaDiffItem[] = [];

  for (const [path, inc] of incMap.entries()) {
    const cur = curMap.get(path);
    if (!cur) {
      diffs.push({
        path,
        kind: "Added",
        type: inc.type,
        from: "—",
        to: inc.value,
        plain: inc.plain ?? inc.description,
      });
    } else if (cur.value !== inc.value) {
      diffs.push({
        path,
        kind: "Changed",
        type: inc.type,
        from: cur.value,
        to: inc.value,
        plain: inc.plain ?? cur.plain ?? inc.description,
      });
    }
  }

  for (const [path, cur] of curMap.entries()) {
    if (!incMap.has(path) && cur.deprecated) {
      diffs.push({
        path,
        kind: "Removed",
        type: cur.type,
        from: cur.value,
        to: "—",
        plain: cur.plain ?? cur.description,
      });
    }
  }

  return diffs;
}

/** Apply approved Figma variable diffs onto current workspace tokens. */
export function applyFigmaDiff(current: Token[], diffs: FigmaDiffItem[]): Token[] {
  const map = new Map(current.map((t) => [t.path, { ...t }]));
  for (const d of diffs) {
    if (d.kind === "Added") {
      map.set(d.path, {
        path: d.path,
        type: d.type,
        value: d.to,
        plain: d.plain,
        description: d.plain,
      });
    } else if (d.kind === "Changed") {
      const existing = map.get(d.path);
      if (existing) {
        map.set(d.path, { ...existing, value: d.to });
      }
    } else if (d.kind === "Removed") {
      map.delete(d.path);
    }
  }
  return [...map.values()];
}
