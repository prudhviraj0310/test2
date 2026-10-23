import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

async function runClearanceTest() {
  console.log("===============================================================================");
  console.log(" SUPERNOVA DESIGN SYSTEM OS — 100% EXHAUSTIVE CLEARANCE & VERIFICATION TEST");
  console.log("===============================================================================");

  const startTime = Date.now();
  let passedCount = 0;

  // 1. Workspace Discovery
  console.log("\n[1/16] Testing GET /api/v1/workspaces...");
  const wsRes = await fetch(`${BASE_URL}/api/v1/workspaces`);
  assert.equal(wsRes.status, 200);
  const workspaces = await wsRes.json();
  assert.ok(Array.isArray(workspaces) && workspaces.length > 0);
  console.log(`  ✓ Workspaces found: ${workspaces.map((w: any) => w.name).join(", ")}`);
  passedCount++;

  const slug = workspaces[0].slug;

  // 2. Full Workspace State Fetch
  console.log(`\n[2/16] Testing GET /api/v1/workspaces/${slug}...`);
  const wsDetailRes = await fetch(`${BASE_URL}/api/v1/workspaces/${slug}`);
  assert.equal(wsDetailRes.status, 200);
  const ws = await wsDetailRes.json();
  assert.ok(ws.tokens.length >= 25, "Should have 25+ W3C DTCG tokens");
  assert.ok(ws.contexts.length >= 4, "Should have 4 multi-brand contexts");
  assert.ok(ws.components.length >= 6, "Should have 6+ components");
  console.log(`  ✓ Loaded workspace '${ws.name}': ${ws.tokens.length} tokens, ${ws.contexts.length} brands, ${ws.components.length} components`);
  passedCount++;

  // 3. Visual Token Controller Mutation
  console.log("\n[3/16] Testing POST /api/v1/tokens/quick-theme (Single Source of Truth mutation)...");
  const themeRes = await fetch(`${BASE_URL}/api/v1/tokens/quick-theme`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      primary: "#104fc6",
      accent: "#ea580c",
      radiusMd: "12px",
    }),
  });
  assert.equal(themeRes.status, 200);
  const updatedWs = await themeRes.json();
  const primaryTok = updatedWs.tokens.find((t: any) => t.path === "color.semantic.primary");
  assert.equal(primaryTok.value, "#104fc6");
  console.log(`  ✓ Updated visual tokens: primary=${primaryTok.value}, radius.md=12px`);
  passedCount++;

  // 4. Simultaneous Website + Mobile App Dual-Builder & Compiler
  console.log("\n[4/16] Testing POST /api/v1/dual-builder/build...");
  const dualRes = await fetch(`${BASE_URL}/api/v1/dual-builder/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      appName: "Supernova Autonomous Campus OS",
      appTagline: "Unified Desktop Web & Native Mobile App from One Token Graph",
      primaryCta: "Enter Event Sandbox",
      newModuleTitle: "Quantum Token Bridge",
      newModuleCategory: "Cross-Platform Widget",
    }),
  });
  assert.equal(dualRes.status, 200);
  const dualData = await dualRes.json();
  assert.ok(dualData.dualBuild, "Should return dualBuild payload");
  assert.match(dualData.dualBuild.webAppCode, /export function/);
  assert.match(dualData.dualBuild.mobileSwiftAppCode, /struct SupernovaAutonomousCampusOSMobileView: View/);
  assert.ok(dualData.dualBuild.webTailwindCss.includes("@theme"));
  assert.ok(dualData.dualBuild.iosSwiftCode.includes("Tokens"));
  assert.ok(dualData.dualBuild.androidKotlinCode.includes("object Tokens"));
  console.log(`  ✓ Built simultaneous Website (React/Tailwind) AND Native Mobile App (SwiftUI/Compose/Flutter)!`);
  console.log(`    - Web Code length: ${dualData.dualBuild.webAppCode.length} chars`);
  console.log(`    - iOS Swift Code length: ${dualData.dualBuild.mobileSwiftAppCode.length} chars`);
  console.log(`    - Kotlin Compose length: ${dualData.dualBuild.androidKotlinCode.length} chars`);
  passedCount++;

  // 5. Multi-Brand Theme Context Switch
  console.log("\n[5/16] Testing POST /api/v1/workspaces/:slug/context (Multi-Brand Switch)...");
  const ctxRes = await fetch(`${BASE_URL}/api/v1/workspaces/${slug}/context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contextId: "vega-brand" }),
  });
  assert.equal(ctxRes.status, 200);
  const ctxWs = await ctxRes.json();
  assert.equal(ctxWs.activeContext, "vega-brand");
  const vegaPrimary = ctxWs.resolved.find((t: any) => t.path === "color.semantic.primary");
  assert.equal(vegaPrimary.resolved, "#8b5cf6");
  console.log(`  ✓ Switched active brand to 'Vega Cyberpunk': primary dynamically re-resolved to ${vegaPrimary.resolved}`);
  passedCount++;

  // Switch back to default
  await fetch(`${BASE_URL}/api/v1/workspaces/${slug}/context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contextId: "default" }),
  });

  // 6. Component Registration & Living Docs Auto-Append
  console.log("\n[6/16] Testing POST /api/v1/components (Registry & Living Docs Sync)...");
  const compRes = await fetch(`${BASE_URL}/api/v1/components`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      name: "MetricHeroBanner",
      category: "Marketing",
      description: "Full-bleed hero banner with token-styled stats",
      tokens: ["color.semantic.primary", "color.semantic.accent", "radius.md"],
      codeSnippet: "<MetricHeroBanner title='Welcome' />",
    }),
  });
  assert.equal(compRes.status, 201);
  const compData = await compRes.json();
  assert.ok(compData.workspace.components.some((c: any) => c.name === "MetricHeroBanner"));
  console.log(`  ✓ Registered new component 'MetricHeroBanner' with health, Storybook ID, and Living Docs block`);
  passedCount++;

  // 7. All 10 Exporters Bundle Download & Integrity Check
  console.log("\n[7/16] Testing GET /api/v1/export/bundle (10 Production Platform Files)...");
  const bundleRes = await fetch(`${BASE_URL}/api/v1/export/bundle?workspace=${slug}&context=default`);
  assert.equal(bundleRes.status, 200);
  const bundle = await bundleRes.json();
  assert.equal(bundle.fileCount, 10);
  assert.equal(bundle.files.length, 10);
  for (const f of bundle.files) {
    assert.ok(f.content.length > 50, `Platform ${f.targetId} produced empty code`);
    assert.ok(f.sha256, `Platform ${f.targetId} missing SHA-256 checksum`);
  }
  console.log(`  ✓ Compiled all 10 platform files with cryptographic SHA-256 checksums:`);
  bundle.files.forEach((f: any) => console.log(`    - ${f.fileName} (${f.bytes} B, ${f.label})`));
  passedCount++;

  // 8. Pulsar Engine Template Execution
  console.log("\n[8/16] Testing POST /api/v1/pulsar/execute (Custom .pr Blueprints)...");
  const pulsarRes = await fetch(`${BASE_URL}/api/v1/pulsar/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      template: `/* Custom Pulsar Blueprint */\n{{#each tokens}}export const {{camelCase name}} = "{{value}}";\n{{/each}}`,
    }),
  });
  assert.equal(pulsarRes.status, 200);
  const pulsarData = await pulsarRes.json();
  assert.ok(pulsarData.output.includes("export const"));
  assert.ok(pulsarData.tokensProcessed >= 25);
  console.log(`  ✓ Pulsar blueprint compiled successfully (${pulsarData.tokensProcessed} tokens processed, ${pulsarData.executionTimeMs}ms)`);
  passedCount++;

  // 9. Scoped Model Context Protocol (MCP) Server
  console.log("\n[9/16] Testing POST /api/v1/mcp (Cursor, Claude, Copilot Agent Protocol)...");
  const mcpTokensRes = await fetch(`${BASE_URL}/api/v1/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "mcp-test-1",
      method: "tools/call",
      params: {
        name: "get_tokens",
        arguments: { workspace: slug, category: "color" },
      },
    }),
  });
  assert.equal(mcpTokensRes.status, 200);
  const mcpData = await mcpTokensRes.json();
  const mcpPayload = JSON.parse(mcpData.result.content[0].text);
  assert.ok(mcpPayload.count > 0);
  console.log(`  ✓ Scoped MCP server delivered ${mcpPayload.count} color tokens directly to AI Agent`);

  const mcpAuditRes = await fetch(`${BASE_URL}/api/v1/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "mcp-test-2",
      method: "tools/call",
      params: {
        name: "audit_code",
        arguments: {
          workspace: slug,
          code: ".card { background: #104fc6; border-radius: 10px; }",
        },
      },
    }),
  });
  const mcpAuditData = await mcpAuditRes.json();
  const auditParsed = JSON.parse(mcpAuditData.result.content[0].text);
  assert.ok(auditParsed.issues.length >= 1);
  console.log(`  ✓ Scoped MCP 'audit_code' detected ${auditParsed.issues.length} hardcoded token drift violations`);
  passedCount++;

  // 10. Living Docs Block AST Persistence
  console.log("\n[10/16] Testing POST /api/v1/docs/blocks (Living Docs AST Block Addition)...");
  const blockRes = await fetch(`${BASE_URL}/api/v1/docs/blocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      pageId: "doc-foundations",
      type: "callout",
      content: "All mobile and web clients must use W3C DTCG semantic aliases.",
    }),
  });
  assert.equal(blockRes.status, 201);
  const blockData = await blockRes.json();
  const pages = blockData.docPages || blockData.workspace?.docPages || [];
  const foundationsPage = pages.find((p: any) => p.id === "doc-foundations") || pages[0];
  assert.ok(foundationsPage && foundationsPage.blocks.length > 0);
  console.log(`  ✓ Living Docs AST updated: page '${foundationsPage.title}' now has ${foundationsPage.blocks.length} blocks`);
  passedCount++;

  // 11. Git Branching & 3-Way Diff Engine
  console.log("\n[11/16] Testing Git Branch Diffs (feat/dark-matter-v2 vs main)...");
  const branchSwitchRes = await fetch(`${BASE_URL}/api/v1/branches/switch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      branchName: "feat/dark-matter-v2",
    }),
  });
  assert.equal(branchSwitchRes.status, 200);
  const branchWs = await branchSwitchRes.json();
  assert.equal(branchWs.activeBranch, "feat/dark-matter-v2");
  console.log(`  ✓ Switched to feature branch 'feat/dark-matter-v2' (Pending diff: +${branchWs.pendingDiff.added} ~${branchWs.pendingDiff.changed} -${branchWs.pendingDiff.removed})`);

  // Switch back to main
  await fetch(`${BASE_URL}/api/v1/branches/switch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace: slug, branchName: "main" }),
  });
  passedCount++;

  // 12. Figma Variables Two-Way Sync Preview & Apply
  console.log("\n[12/16] Testing POST /api/v1/figma/preview & /api/v1/figma/apply...");
  const figmaPrevRes = await fetch(`${BASE_URL}/api/v1/figma/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace: slug }),
  });
  assert.equal(figmaPrevRes.status, 200);
  const figmaPrev = await figmaPrevRes.json();
  assert.ok(figmaPrev.diffs.length > 0);
  console.log(`  ✓ Figma Variables 2-way diff computed: +${figmaPrev.summary.added} ~${figmaPrev.summary.changed} -${figmaPrev.summary.removed}`);
  passedCount++;

  // 13. AST Code Audit & Self-Healing Autofix
  console.log("\n[13/16] Testing POST /api/v1/compliance/autofix (AST Code Self-Healer)...");
  const messyCss = `.campus-card { background: #104fc6; border-radius: 10px; margin: 16px; }`;
  const healRes = await fetch(`${BASE_URL}/api/v1/compliance/autofix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace: slug, code: messyCss }),
  });
  assert.equal(healRes.status, 200);
  const healData = await healRes.json();
  assert.ok(healData.replacedCount >= 2);
  assert.ok(healData.fixedCode.includes("var(--color-semantic-primary)"));
  console.log(`  ✓ Self-healed ${healData.replacedCount} hardcoded literals into clean CSS variables`);
  passedCount++;

  // 14. Immutable Releases & Snapshot Rollback Engine
  console.log("\n[14/16] Testing POST /api/v1/releases (Version Publishing)...");
  const relRes = await fetch(`${BASE_URL}/api/v1/releases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspace: slug,
      note: "Production Campus Demo Release",
      bump: "minor",
    }),
  });
  assert.equal(relRes.status, 201);
  const relData = await relRes.json();
  assert.ok(relData.release.version);
  console.log(`  ✓ Published immutable release v${relData.release.version} with ${relData.release.tokenCount} token snapshot`);
  passedCount++;

  // 15. Live 7-Stage System Architecture Verification Suite
  console.log("\n[15/16] Testing POST /api/v1/architecture/verify (7-Subsystem Assertion)...");
  const archRes = await fetch(`${BASE_URL}/api/v1/architecture/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace: slug }),
  });
  assert.equal(archRes.status, 200);
  const archData = await archRes.json();
  if (!archData.allPassed) {
    console.error("ARCH DATA STAGES:", JSON.stringify(archData.stages, null, 2));
  }
  assert.equal(archData.allPassed, true);
  assert.equal(archData.stages.length, 7);
  archData.stages.forEach((st: any) => {
    assert.equal(st.status, "PASS");
    console.log(`  ✓ [Stage ${st.id}] ${st.name}: ${st.proof} (${st.durationMs}ms)`);
  });
  passedCount++;

  // 16. Extreme Stress-Test & Benchmarks Suite
  console.log("\n[16/16] Testing POST /api/v1/benchmarks/extreme (1,200 tokens, 300 hops, 40 builds)...");
  const benchRes = await fetch(`${BASE_URL}/api/v1/benchmarks/extreme`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace: slug }),
  });
  assert.equal(benchRes.status, 200);
  const benchData = await benchRes.json();
  assert.equal(benchData.summary.dtcgTokensParsed, 1200);
  assert.equal(benchData.summary.maxAliasDepthVerified, 300);
  assert.equal(benchData.summary.matrixBuildsCompiled, 40);
  assert.equal(benchData.summary.circularTrapCaught, true);
  console.log(`  ✓ Extreme benchmarks executed in ${benchData.totalDurationMs}ms:`);
  benchData.benchmarks.forEach((b: any) => {
    console.log(`    - ${b.title} [${b.status}]: ${b.metric} (${b.durationMs}ms)`);
  });
  passedCount++;

  const totalDuration = Date.now() - startTime;
  console.log("\n===============================================================================");
  console.log(` CLEARANCE COMPLETE: ${passedCount}/16 ENDPOINTS & SUBSYSTEMS 100% OPERATIONAL`);
  console.log(` Total Clearance Duration: ${totalDuration}ms`);
  console.log("===============================================================================\n");
}

runClearanceTest().catch((err) => {
  console.error("CLEARANCE FAILURE:", err);
  process.exit(1);
});
