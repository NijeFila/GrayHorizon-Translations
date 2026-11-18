/**
 * What a translation must keep from its English, checked the same way by the
 * merge (which refuses a bad translation) and by `pnpm i18n:check`.
 *
 * - It parses as ICU MessageFormat (Lingui's own compiler).
 * - It names no parameter the English does not pass: an invented `{nombre}`
 *   would print as a hole. Leaving one out is allowed but reported, since a
 *   language may need fewer words (never a figure).
 * - Each plural or select keeps its argument and has an `other` branch;
 *   a plural has the branches the language needs (Serbian: one, few, other).
 * - Rich-text tags (`<b>…</b>`, `<link>…</link>`) are the English's set, each
 *   closed.
 */
import { compileMessageOrThrow } from "@lingui/message-utils/compileMessage";

const PLURAL_CATEGORIES = {
  en: ["one", "other"],
  es: ["one", "other"],
  "sr-Latn": ["one", "few", "other"],
  "sr-Cyrl": ["one", "few", "other"],
};

/**
 * A language the table does not name yet (a new one, started by a
 * translator): the plural forms CLDR gives it, without `zero`, which no
 * language needs a branch for when `=0` is written where it matters.
 */
function pluralCategoriesOf(locale) {
  try {
    return new Intl.PluralRules(locale)
      .resolvedOptions()
      .pluralCategories.filter((category) => category !== "zero");
  } catch {
    return ["other"];
  }
}

/** Every parameter name and every plural/select in a compiled message. */
function walk(tokens, out = { names: new Set(), choices: [] }) {
  for (const token of tokens) {
    if (typeof token === "string") continue;
    const [name, type, format] = token;
    out.names.add(name);
    if (
      (type === "plural" || type === "select" || type === "selectordinal") &&
      format
    ) {
      const branches = Object.keys(format).filter((key) => key !== "offset");
      out.choices.push({ name, type, branches });
      for (const key of branches)
        if (Array.isArray(format[key])) walk(format[key], out);
    }
  }
  return out;
}

function tagsOf(text) {
  const tags = [];
  for (const match of text.matchAll(/<(\/?)([a-z][a-z0-9]*)(\/?)>/g))
    tags.push(`${match[1]}${match[2]}${match[3]}`);
  return tags.sort();
}

export function analyse(message) {
  return walk(compileMessageOrThrow(message));
}

/**
 * Problems with one translation: `errors` make it unusable (the merge refuses
 * it, the check fails), `warnings` are worth a reviewer's look.
 */
export function checkTranslation(source, translation, locale) {
  const errors = [];
  const warnings = [];
  let english;
  let theirs;
  try {
    english = analyse(source);
  } catch (error) {
    errors.push(`the English does not parse: ${error.message}`);
    return { errors, warnings };
  }
  try {
    theirs = analyse(translation);
  } catch (error) {
    errors.push(`does not parse as ICU: ${error.message}`);
    return { errors, warnings };
  }
  for (const name of theirs.names)
    if (!english.names.has(name))
      errors.push(`names {${name}}, which the English does not pass`);
  for (const name of english.names)
    if (!theirs.names.has(name)) warnings.push(`leaves out {${name}}`);
  const needed = PLURAL_CATEGORIES[locale] ?? pluralCategoriesOf(locale);
  for (const choice of theirs.choices) {
    if (!choice.branches.includes("other"))
      errors.push(
        `its ${choice.type} on {${choice.name}} has no "other" branch`,
      );
    if (choice.type === "plural") {
      const missing = needed.filter(
        (category) =>
          !choice.branches.includes(category) && category !== "other",
      );
      /* "one" may be covered by an exact =1 branch. */
      const reallyMissing = missing.filter(
        (category) => !(category === "one" && choice.branches.includes("=1")),
      );
      if (reallyMissing.length)
        warnings.push(
          `its plural on {${choice.name}} has no ${reallyMissing.join(", ")} branch`,
        );
    }
  }
  /* The same kinds of tag as the English, each opened as often as closed. A
     language with more plural branches repeats a branch's tags, so the count
     may differ; the names may not. */
  const names = (tags) =>
    [...new Set(tags.map((tag) => tag.replace(/\//g, "")))].sort().join(" ");
  const balanced = (tags) =>
    [...new Set(tags.map((tag) => tag.replace(/\//g, "")))].every(
      (name) =>
        tags.filter((tag) => tag === name).length ===
          tags.filter((tag) => tag === `/${name}`).length ||
        tags.includes(`${name}/`),
    );
  const englishTags = names(tagsOf(source));
  const theirTags = names(tagsOf(translation));
  if (englishTags !== theirTags)
    errors.push(
      `its tags (${theirTags || "none"}) are not the English's (${englishTags || "none"})`,
    );
  else if (!balanced(tagsOf(translation)))
    errors.push("a tag is opened and not closed, or closed and not opened");
  if (/<(script|style|iframe|img|a)\b/i.test(translation))
    errors.push("contains markup; translations are text");
  return { errors, warnings };
}
