#!/usr/bin/env node
/**
 * Checks every translation in this repository (`npm run check`). It runs on
 * every pull request; CONTRIBUTING.md ("The check on your pull request") says
 * what it refuses and what it only warns about.
 *
 * `icu-check.mjs` beside this file is the game's own check, copied here by
 * the game's `pnpm i18n:publish`: a translation that passes here passes
 * there. Do not edit that file in this repository.
 *
 *   node tools/check.mjs [--verbose]
 */
import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { parsePo } from "pofile-ts";

import { checkTranslation } from "./icu-check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOMAINS = ["ui", "help", "server"];
/** Written by the game from another language, never translated here. */
const GENERATED = { "sr-Cyrl": "sr-Latn" };
/** A BCP 47 tag of the shape this repository uses: es, sr-Latn, pt-BR. */
const LANGUAGE_TAG = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-(?:[A-Z]{2}|\d{3}))?$/;
const verbose = process.argv.includes("--verbose");
const onGitHub = Boolean(process.env.GITHUB_ACTIONS);

const errors = [];
const warnings = [];
const posix = (path) => relative(ROOT, path).split("\\").join("/");

function lineOf(text, key) {
  if (!text || !key) return 1;
  const at = text.indexOf(`msgctxt ${JSON.stringify(key)}`);
  return at < 0 ? 1 : text.slice(0, at).split("\n").length;
}

function problem(list, file, message, { text, key } = {}) {
  list.push({ file: file ? posix(file) : "", line: lineOf(text, key), key, message });
}

const keyOf = (item) => item.msgctxt ?? item.msgid;

/* The English: what every language's file is checked against. */
const templates = {};
for (const domain of DOMAINS) {
  const path = join(ROOT, "templates", `${domain}.pot`);
  if (!existsSync(path)) {
    problem(errors, path, "The English template is missing.");
    continue;
  }
  const byKey = new Map();
  for (const item of parsePo(readFileSync(path, "utf8")).items)
    if (!item.obsolete && keyOf(item)) byKey.set(keyOf(item), item.msgid);
  templates[domain] = byKey;
}

const summary = [];
const localesDir = join(ROOT, "locales");
for (const entry of readdirSync(localesDir, { withFileTypes: true })) {
  const dir = join(localesDir, entry.name);
  if (!entry.isDirectory()) {
    problem(errors, dir, "Put a translation in its language's folder: locales/<code>/ui.po.");
    continue;
  }
  const tag = entry.name;
  if (tag in GENERATED) {
    problem(
      errors,
      dir,
      `${tag} is written automatically from ${GENERATED[tag]}: translate in locales/${GENERATED[tag]} instead.`,
    );
    continue;
  }
  if (!LANGUAGE_TAG.test(tag)) {
    problem(
      errors,
      dir,
      `"${tag}" is not a language code. Use one like es, de, pt-BR or sr-Latn.`,
    );
    continue;
  }
  const counts = { total: 0, checked: 0, needsWork: 0 };
  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    const domain = file.replace(/\.po$/, "");
    if (!file.endsWith(".po") || !DOMAINS.includes(domain)) {
      problem(
        errors,
        path,
        file.endsWith(".mo")
          ? "Upload only the .po file; the .mo file Poedit makes is not needed."
          : `Only ${DOMAINS.map((name) => `${name}.po`).join(", ")} belong in a language's folder.`,
      );
      continue;
    }
    const text = readFileSync(path, "utf8");
    let po;
    try {
      po = parsePo(text);
    } catch (error) {
      problem(errors, path, `This is not a valid .po file: ${error.message}`);
      continue;
    }
    const english = templates[domain] ?? new Map();
    const seen = new Set();
    for (const item of po.items) {
      if (item.obsolete) continue;
      const key = keyOf(item);
      if (!key) continue;
      if (seen.has(key)) {
        problem(errors, path, `"${key}" appears twice.`, { text, key });
        continue;
      }
      seen.add(key);
      const translation = item.msgstr?.[0] ?? "";
      if (!english.has(key)) {
        if (translation)
          problem(warnings, path, `"${key}" is no longer in the game; it will be ignored.`, { text, key });
        continue;
      }
      counts.total++;
      if (!translation) continue;
      if (item.flags?.fuzzy) counts.needsWork++;
      else counts.checked++;
      if (item.msgid !== english.get(key))
        problem(
          warnings,
          path,
          `"${key}": the English (msgid) is not today's. Fine if this copy is older than the latest update; never edit a msgid.`,
          { text, key },
        );
      const result = checkTranslation(item.msgid, translation, tag);
      for (const message of result.errors)
        problem(errors, path, `"${key}" ${message}.`, { text, key });
      for (const message of result.warnings)
        problem(warnings, path, `"${key}" ${message}.`, { text, key });
    }
  }
  summary.push({ tag, ...counts });
}

/* ---------------------------------------------------------------- report */

const escape = (text) =>
  String(text).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");

for (const row of errors) {
  if (onGitHub)
    console.log(`::error file=${row.file},line=${row.line}::${escape(row.message)}`);
  else console.log(`error    ${row.file}:${row.line}  ${row.message}`);
}
const shownWarnings = verbose ? warnings : warnings.slice(0, 50);
for (const row of shownWarnings) {
  if (onGitHub)
    console.log(`::warning file=${row.file},line=${row.line}::${escape(row.message)}`);
  else console.log(`warning  ${row.file}:${row.line}  ${row.message}`);
}
if (shownWarnings.length < warnings.length)
  console.log(
    `… and ${warnings.length - shownWarnings.length} more warning(s); run with --verbose to see them all.`,
  );

const table = [
  "| Language | Sentences | Checked by a person | Needs work |",
  "| -------- | --------: | ------------------: | ---------: |",
  ...summary.map(
    (row) => `| ${row.tag} | ${row.total} | ${row.checked} | ${row.needsWork} |`,
  ),
];
const verdict = errors.length
  ? `**${errors.length} problem(s) to fix** before this can be merged (each is marked on its line), and ${warnings.length} warning(s).`
  : `**No problems.** ${warnings.length} warning(s), worth a look but not required.`;
console.log(`\n${table.join("\n")}\n\n${verdict.replace(/\*\*/g, "")}`);
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## Translations\n\n${verdict}\n\n${table.join("\n")}\n`,
  );
process.exit(errors.length ? 1 : 0);
