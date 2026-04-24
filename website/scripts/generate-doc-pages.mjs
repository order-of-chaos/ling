import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { URL } from "node:url";

const websiteDir = process.cwd();
const repoRoot = path.resolve(websiteDir, "..");
const docsDir = path.join(repoRoot, "docs");
const publicDir = path.join(websiteDir, "public");
const docsOutputDir = path.join(publicDir, "docs");
const sitemapPath = path.join(publicDir, "sitemap.xml");

const siteUrl = "https://order-of-chaos.github.io/ling/";
const repoUrl = "https://github.com/order-of-chaos/ling";
const docsRepoUrl = `${repoUrl}/blob/master/docs`;

const docPages = [
  {
    file: "README.md",
    slug: "",
    title: "Ling Documentation",
    description:
      "Canonical Ling documentation, guides, package map, and public examples.",
  },
  {
    file: "getting-started.md",
    slug: "getting-started",
    title: "Ling Getting Started",
    description:
      "Install Ling, add I18nProvider, create modules, and wire up the CLI and ESLint plugin.",
  },
  {
    file: "api-reference.md",
    slug: "api-reference",
    title: "Ling API Reference",
    description:
      "Public runtime, React, core, and CLI API reference for Ling.",
  },
  {
    file: "custom-storage.md",
    slug: "custom-storage",
    title: "Ling Custom Storage",
    description:
      "Implement custom I18nStorage adapters for browsers, React Native, SSR, and reactive stores.",
  },
  {
    file: "cli.md",
    slug: "cli",
    title: "Ling CLI Usage",
    description:
      "Use ling-scan and ling-lint to generate and validate translation files.",
  },
  {
    file: "eslint-plugin.md",
    slug: "eslint-plugin",
    title: "Ling ESLint Plugin",
    description:
      "Configure require-literal-keys for flat config or legacy ESLint setups.",
  },
];

const docsByFile = new Map(docPages.map((page) => [page.file, page]));

generateDocs();

function generateDocs() {
  fs.rmSync(docsOutputDir, { recursive: true, force: true });
  fs.mkdirSync(docsOutputDir, { recursive: true });

  for (const page of docPages) {
    const sourcePath = path.join(docsDir, page.file);
    const markdown = fs.readFileSync(sourcePath, "utf8");
    const { contentHtml, toc } = renderMarkdown(markdown, page);
    const html = renderDocument(page, contentHtml, toc);
    const outputDir = page.slug
      ? path.join(docsOutputDir, page.slug)
      : docsOutputDir;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), html);
  }

  fs.writeFileSync(sitemapPath, buildSitemap());
}

function renderDocument(page, contentHtml, toc) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const pageUrl = new URL(page.slug ? `docs/${page.slug}/` : "docs/", siteUrl).toString();
  const sourceUrl = `${docsRepoUrl}/${page.file}`;
  const homeHref = page.slug ? "../../" : "../";
  const docsIndexHref = page.slug ? "../" : "./";
  const sourceHref = escapeAttribute(sourceUrl);
  const tocHtml =
    toc.length === 0
      ? ""
      : `<aside class="toc">
  <p class="eyebrow">On this page</p>
  <ul>
    ${toc
      .map(
        (item) =>
          `<li class="toc-level-${item.level}"><a href="#${escapeAttribute(
            item.id,
          )}">${escapeHtml(item.text)}</a></li>`,
      )
      .join("\n")}
  </ul>
</aside>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${escapeAttribute(pageUrl)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeAttribute(pageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #020617;
        --panel: rgba(15, 23, 42, 0.88);
        --panel-border: rgba(148, 163, 184, 0.18);
        --muted: #94a3b8;
        --text: #e2e8f0;
        --strong: #f8fafc;
        --accent: #8b5cf6;
        --accent-2: #06b6d4;
        --code: #0f172a;
      }

      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top, rgba(139, 92, 246, 0.16), transparent 30%),
          radial-gradient(circle at top right, rgba(6, 182, 212, 0.1), transparent 26%),
          var(--bg);
        color: var(--text);
      }

      a {
        color: #c4b5fd;
        text-decoration: none;
      }

      a:hover { color: #ddd6fe; }

      code,
      pre {
        font-family: "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .shell {
        width: min(1160px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 32px 0 64px;
      }

      .topbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--strong);
        font-weight: 700;
        font-size: 1.05rem;
      }

      .brand-mark {
        display: inline-flex;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: white;
      }

      .nav {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .nav a {
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid var(--panel-border);
        color: var(--text);
      }

      .hero {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        border-radius: 24px;
        padding: 28px;
        box-shadow: 0 24px 80px rgba(2, 6, 23, 0.36);
      }

      .eyebrow {
        margin: 0 0 8px;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #a78bfa;
      }

      .hero h1 {
        margin: 0;
        font-size: clamp(2rem, 3vw, 3rem);
        color: var(--strong);
      }

      .hero p {
        margin: 14px 0 0;
        max-width: 72ch;
        color: var(--muted);
        line-height: 1.7;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 18px;
      }

      .hero-actions a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 12px;
        border: 1px solid var(--panel-border);
        background: rgba(15, 23, 42, 0.7);
        color: var(--strong);
      }

      .hero-actions a.primary {
        border-color: transparent;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 24px;
        margin-top: 24px;
      }

      .doc-card,
      .toc {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        border-radius: 24px;
        box-shadow: 0 24px 80px rgba(2, 6, 23, 0.24);
      }

      .doc-card {
        padding: 32px;
        overflow: hidden;
      }

      .toc {
        padding: 24px;
        align-self: start;
      }

      .toc ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 10px;
      }

      .toc li.toc-level-3 a {
        padding-left: 16px;
        color: var(--muted);
      }

      .doc-card h1,
      .doc-card h2,
      .doc-card h3,
      .doc-card h4 {
        color: var(--strong);
        scroll-margin-top: 24px;
      }

      .doc-card h1:first-child {
        margin-top: 0;
      }

      .doc-card p,
      .doc-card li {
        color: var(--text);
        line-height: 1.75;
      }

      .doc-card ul,
      .doc-card ol {
        padding-left: 22px;
      }

      .doc-card hr {
        border: 0;
        border-top: 1px solid var(--panel-border);
        margin: 32px 0;
      }

      .doc-card blockquote {
        margin: 24px 0;
        padding: 14px 18px;
        border-left: 3px solid var(--accent);
        background: rgba(30, 41, 59, 0.55);
        color: var(--muted);
      }

      .doc-card :not(pre) > code {
        padding: 0.15em 0.45em;
        border-radius: 8px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.18);
        color: #f8fafc;
      }

      .doc-card pre {
        margin: 18px 0 24px;
        padding: 18px;
        overflow-x: auto;
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: var(--code);
      }

      .doc-card table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0 28px;
        overflow: hidden;
        border-radius: 16px;
      }

      .doc-card th,
      .doc-card td {
        padding: 12px 14px;
        border: 1px solid rgba(148, 163, 184, 0.16);
        text-align: left;
        vertical-align: top;
      }

      .doc-card th {
        background: rgba(15, 23, 42, 0.96);
        color: var(--strong);
      }

      .doc-card td {
        background: rgba(15, 23, 42, 0.55);
      }

      .footer-note {
        margin-top: 24px;
        color: var(--muted);
        font-size: 0.95rem;
      }

      @media (min-width: 980px) {
        .layout {
          grid-template-columns: minmax(0, 1fr) 280px;
        }
      }

      @media (max-width: 720px) {
        .shell {
          width: min(100vw - 20px, 100%);
          padding-top: 20px;
          padding-bottom: 40px;
        }

        .hero,
        .doc-card,
        .toc {
          border-radius: 18px;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="${homeHref}">
          <span class="brand-mark">L</span>
          <span>Ling</span>
        </a>
        <nav class="nav" aria-label="Primary">
          <a href="${homeHref}">Home</a>
          <a href="${docsIndexHref}">Docs</a>
          <a href="${escapeAttribute(sourceUrl)}">GitHub Source</a>
        </nav>
      </header>

      <section class="hero">
        <p class="eyebrow">Generated from docs/*.md</p>
        <h1>${title}</h1>
        <p>${description}</p>
        <div class="hero-actions">
          <a class="primary" href="${docsIndexHref}">Browse all docs</a>
          <a href="${sourceHref}">View Markdown source</a>
        </div>
      </section>

      <div class="layout">
        <article class="doc-card">
          ${contentHtml}
          <p class="footer-note">
            Source of truth: <a href="${sourceHref}">${escapeHtml(page.file)}</a>.
          </p>
        </article>
        ${tocHtml}
      </div>
    </div>
  </body>
</html>`;
}

function renderMarkdown(markdown, page) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const toc = [];
  let html = "";
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      html += `<pre><code class="language-${escapeAttribute(language || "text")}">${escapeHtml(
        codeLines.join("\n"),
      )}</code></pre>\n`;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);

      if (level >= 2 && level <= 3) {
        toc.push({ level, text: stripMarkdown(text), id });
      }

      html += `<h${level} id="${id}">${renderInline(text, page)}</h${level}>\n`;
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      html += "<hr />\n";
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      let tableIndex = index + 2;

      while (tableIndex < lines.length && looksLikeTableRow(lines[tableIndex])) {
        tableIndex += 1;
      }

      html += renderTable(lines.slice(index, tableIndex), page);
      index = tableIndex;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      html += `<blockquote><p>${renderInline(
        quoteLines.join(" "),
        page,
      )}</p></blockquote>\n`;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }

      html += `<ul>\n${items
        .map((item) => `  <li>${renderInline(item, page)}</li>`)
        .join("\n")}\n</ul>\n`;
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      html += `<ol>\n${items
        .map((item) => `  <li>${renderInline(item, page)}</li>`)
        .join("\n")}\n</ol>\n`;
      continue;
    }

    const paragraphLines = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("```") &&
      !lines[index].match(/^(#{1,6})\s+/) &&
      !/^---+$/.test(lines[index].trim()) &&
      !/^>\s?/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !isTableStart(lines, index)
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    html += `<p>${renderInline(paragraphLines.join(" "), page)}</p>\n`;
  }

  return { contentHtml: html, toc };
}

function renderInline(text, page) {
  const codeTokens = [];
  const linkTokens = [];

  let result = text.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `@@CODE_${codeTokens.length}@@`;
    codeTokens.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const placeholder = `@@LINK_${linkTokens.length}@@`;
    const resolvedHref = resolveHref(href, page);
    linkTokens.push(
      `<a href="${escapeAttribute(resolvedHref)}">${escapeHtml(label)}</a>`,
    );
    return placeholder;
  });

  result = escapeHtml(result);
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  result = result.replace(/@@CODE_(\d+)@@/g, (_, index) => codeTokens[Number(index)]);
  result = result.replace(/@@LINK_(\d+)@@/g, (_, index) => linkTokens[Number(index)]);

  return result;
}

function renderTable(lines, page) {
  const [headerRow, separatorRow, ...bodyRows] = lines;

  if (!headerRow || !separatorRow) {
    return "";
  }

  const headers = splitTableRow(headerRow);
  const rows = bodyRows.filter((line) => line.trim()).map(splitTableRow);

  const headHtml = headers
    .map((cell) => `<th>${renderInline(cell, page)}</th>`)
    .join("");
  const bodyHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${renderInline(cell, page)}</td>`)
          .join("")}</tr>`,
    )
    .join("\n");

  return `<table>
  <thead><tr>${headHtml}</tr></thead>
  <tbody>
${bodyHtml}
  </tbody>
</table>\n`;
}

function splitTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableStart(lines, index) {
  return looksLikeTableRow(lines[index]) && looksLikeTableSeparator(lines[index + 1]);
}

function looksLikeTableRow(line = "") {
  return line.includes("|");
}

function looksLikeTableSeparator(line = "") {
  const trimmed = line.trim();
  return /^\|?[\s:-|]+\|?$/.test(trimmed) && trimmed.includes("-");
}

function resolveHref(rawHref, page) {
  if (/^(https?:)?\/\//.test(rawHref) || rawHref.startsWith("mailto:")) {
    return rawHref;
  }

  const [pathPart, hash = ""] = rawHref.split("#");

  if (!pathPart.endsWith(".md")) {
    return rawHref;
  }

  const target = docsByFile.get(path.basename(pathPart));
  if (!target) {
    return rawHref;
  }

  const href = relativeDocHref(page.slug, target.slug);
  return hash ? `${href}#${hash}` : href;
}

function relativeDocHref(fromSlug, toSlug) {
  if (!fromSlug && !toSlug) {
    return "./";
  }

  if (!fromSlug) {
    return `./${toSlug}/`;
  }

  if (!toSlug) {
    return "../";
  }

  if (fromSlug === toSlug) {
    return "./";
  }

  return `../${toSlug}/`;
}

function buildSitemap() {
  const urls = [
    siteUrl,
    ...docPages.map((page) =>
      new URL(page.slug ? `docs/${page.slug}/` : "docs/", siteUrl).toString(),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeHtml(url)}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}

function slugify(text) {
  return stripMarkdown(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
