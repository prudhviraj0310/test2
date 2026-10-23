import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseDTCG,
  toDTCG,
  resolveTokens,
  exportTokens,
  executePulsarTemplate,
  diffBranches,
  mergeBranchTokens,
  auditCode,
  autofixCode,
  diffTokens,
  computeFigmaDiff,
  applyFigmaDiff,
  EXPORT_TARGETS,
  DEFAULT_PULSAR_TEMPLATES,
  type Token,
} from "./engine";
import { SEED_TOKENS, SEED_CONTEXTS, SAMPLE_FIGMA_INCOMING_TOKENS } from "./seed";

describe("Supernova Design System OS — Core Engine Suite", () => {
  it("parses and round-trips W3C DTCG tokens across all 11 Supernova token types", () => {
    assert.ok(SEED_TOKENS.length >= 25, "Seed should have 25+ Dark Matter tokens");
    const types = new Set(SEED_TOKENS.map((t) => t.type));
    assert.ok(types.has("color"));
    assert.ok(types.has("dimension"));
    assert.ok(types.has("radius"));
    assert.ok(types.has("typography"));
    assert.ok(types.has("shadow"));
    assert.ok(types.has("gradient"));

    const dtcg = toDTCG(SEED_TOKENS);
    const reparsed = parseDTCG(dtcg);
    assert.equal(reparsed.length, SEED_TOKENS.length);
  });

  it("resolves alias chains, fallback syntax, and detects circular references", () => {
    const resolved = resolveTokens(SEED_TOKENS);
    const primary = resolved.find((t) => t.path === "color.semantic.primary");
    assert.equal(primary?.resolved, "#2b70f7");
    assert.equal(primary?.aliasOf, "color.primitive.blue.500");

    // Fallback value test when referenced token is missing
    const withFallback: Token[] = [
      {
        path: "color.semantic.fallbackTest",
        type: "color",
        value: "{color.primitive.missing.900 | #ea580c}",
      },
    ];
    const fbResolved = resolveTokens(withFallback);
    assert.equal(fbResolved[0]?.resolved, "#ea580c");
    assert.equal(fbResolved[0]?.fallbackValue, "#ea580c");

    // Circular reference test
    const cycleTokens: Token[] = [
      { path: "color.a", type: "color", value: "{color.b}" },
      { path: "color.b", type: "color", value: "{color.a}" },
    ];
    const cycleResolved = resolveTokens(cycleTokens);
    assert.equal(cycleResolved[0]?.resolved, null);
    assert.match(cycleResolved[0]?.error ?? "", /Circular reference/);
  });

  it("applies multi-brand context overrides (Orion Daylight, Vega, Luna)", () => {
    const vegaCtx = SEED_CONTEXTS.find((c) => c.id === "vega-brand")!;
    const resolved = resolveTokens(SEED_TOKENS, vegaCtx.overrides, vegaCtx.id);
    const primary = resolved.find((t) => t.path === "color.semantic.primary");
    assert.equal(primary?.resolved, "#8b5cf6");
    assert.equal(primary?.overriddenByContext, "vega-brand");
  });

  it("compiles all 10 official Supernova exporters deterministically", () => {
    assert.equal(EXPORT_TARGETS.length, 10);
    for (const target of EXPORT_TARGETS) {
      const out = exportTokens(SEED_TOKENS, target.id);
      assert.ok(out.length > 50, `Exporter ${target.id} should produce non-empty output`);
    }

    const scssOut = exportTokens(SEED_TOKENS, "scss");
    assert.match(scssOut, /\$color-semantic-primary:/);
    assert.match(scssOut, /\$supernova-tokens:/);

    const sdOut = exportTokens(SEED_TOKENS, "style-dictionary");
    const sdParsed = JSON.parse(sdOut);
    assert.equal(sdParsed.color.semantic.primary.value, "#2b70f7");

    const flutterOut = exportTokens(SEED_TOKENS, "flutter");
    assert.match(flutterOut, /class SupernovaTokens/);
    assert.match(flutterOut, /Color\(0xFF2B70F7\)/);

    const xmlOut = exportTokens(SEED_TOKENS, "android-xml");
    assert.match(xmlOut, /<resources>/);
    assert.match(xmlOut, /<color name="color_semantic_primary">#2b70f7<\/color>/);
  });

  it("executes Pulsar (.pr / Handlebars) templates with case helpers", () => {
    const preset = DEFAULT_PULSAR_TEMPLATES[0]!;
    const res = executePulsarTemplate(preset.template, SEED_TOKENS, {
      designSystemName: "Supernova Dark Matter OS",
      contextId: "default",
    });
    assert.ok(res.tokensProcessed >= 25);
    assert.match(res.output, /--color-semantic-primary: #2b70f7;/);
  });

  it("computes three-way token branch diffs and merges branches cleanly", () => {
    const mainTokens = SEED_TOKENS.map((t) => ({ ...t }));
    const featureTokens = SEED_TOKENS.map((t) =>
      t.path === "radius.md" ? { ...t, value: "12px" } : { ...t },
    );
    featureTokens.push({
      path: "color.semantic.focus",
      type: "color",
      value: "#5c95ff",
    });

    const diff = diffBranches("feat/v2", featureTokens, "main", mainTokens);
    assert.equal(diff.addedCount, 1);
    assert.equal(diff.modifiedCount, 1);
    assert.equal(diff.totalChanges, 2);

    const merged = mergeBranchTokens(featureTokens, mainTokens);
    assert.equal(merged.find((t) => t.path === "radius.md")?.value, "12px");
    assert.equal(merged.find((t) => t.path === "color.semantic.focus")?.value, "#5c95ff");
  });

  it("audits and self-heals hardcoded hex colors and pixel dimensions", () => {
    const snippet = `.cta {\n  background: #2b70f7;\n  padding: 16px;\n}`;
    const issues = auditCode(snippet, SEED_TOKENS);
    assert.equal(issues.length, 2);
    assert.equal(issues[0]?.suggestion, "color.semantic.primary");

    const healed = autofixCode(snippet, SEED_TOKENS);
    assert.equal(healed.replacedCount, 2);
    assert.match(healed.fixedCode, /var\(--color-semantic-primary\)/);
    assert.match(healed.fixedCode, /var\(--spacing-md\)/);
  });

  it("computes and applies Figma Variables two-way diffs", () => {
    const diffs = computeFigmaDiff(SEED_TOKENS, SAMPLE_FIGMA_INCOMING_TOKENS);
    assert.ok(diffs.some((d) => d.kind === "Added" && d.path === "color.semantic.info"));
    assert.ok(diffs.some((d) => d.kind === "Changed" && d.path === "spacing.lg"));

    const updated = applyFigmaDiff(SEED_TOKENS, diffs);
    const infoTok = updated.find((t) => t.path === "color.semantic.info");
    assert.ok(infoTok);
    assert.equal(diffTokens(SEED_TOKENS, updated).added, 2);
  });

  it("handles extreme stress workloads: 1,200 DTCG tokens, 300-hop alias chain, and 40 multi-brand builds", () => {
    const bulkTokens: Token[] = [...SEED_TOKENS];
    for (let i = 0; i < 1200; i++) {
      bulkTokens.push({
        path: `stress.scale.token_${i}`,
        type: i % 2 === 0 ? "color" : "dimension",
        value: i % 2 === 0 ? `#${((i * 2654435761) >>> 8).toString(16).padStart(6, "0").slice(0, 6)}` : `${(i % 64) * 2}px`,
      });
    }
    const dtcg = toDTCG(bulkTokens);
    const reparsed = parseDTCG(dtcg);
    assert.equal(reparsed.length, bulkTokens.length);

    // 300-hop deep alias chain
    const chainTokens: Token[] = [{ path: "chain.hop_0", type: "color", value: "#2b70f7" }];
    for (let i = 1; i <= 300; i++) {
      chainTokens.push({
        path: `chain.hop_${i}`,
        type: "color",
        value: `{chain.hop_${i - 1}}`,
      });
    }
    const resolvedChain = resolveTokens(chainTokens);
    assert.equal(resolvedChain[300]?.resolved, "#2b70f7");

    // 40 simultaneous builds (4 brands x 10 targets)
    let buildCount = 0;
    for (const ctx of SEED_CONTEXTS) {
      for (const target of EXPORT_TARGETS) {
        const code = exportTokens(SEED_TOKENS, target.id, ctx.overrides, ctx.id);
        assert.ok(code.length > 40);
        buildCount++;
      }
    }
    assert.equal(buildCount, 40);
  });
});

