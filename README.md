# Gray Horizon translations

[Gray Horizon](https://grayhorizon.world) is a multiplayer strategy game
played in the browser: players run countries, companies, newspapers and
armies together, in one shared world. This repository holds every sentence
of the game, in English and in the languages players translate it into.

**You do not need to be a programmer to help.** You download a file,
translate it in a free program, and upload it back here. A check reads your
file within minutes and tells you if anything needs fixing.

## Languages

| Language          | Folder            | State                                                           |
| ----------------- | ----------------- | --------------------------------------------------------------- |
| Español           | `locales/es`      | Beta: first drafts written by a machine, being checked          |
| Srpski (latinica) | `locales/sr-Latn` | Beta: the same. Српски (ћирилица) is made from it automatically |

How far each one has come, file by file: [STATUS.md](STATUS.md).

Want another language? See [A new language](#a-new-language) below.

## What there is to translate

Each language has three files. Start with `ui.po`; it is what every player
sees first.

| File        | What is in it                                                         | Sentences |
| ----------- | --------------------------------------------------------------------- | --------- |
| `ui.po`     | the interface: buttons, screens, menus, messages                      | ~9 300    |
| `help.po`   | the Help articles                                                     | ~570      |
| `server.po` | what the game's server says: refusals, alerts, notifications, e-mails | ~1 700    |

The English originals are in `templates/` (`.pot` files).

## How to translate

### 1. Get the file

Open your language's folder above, click the file (say `ui.po`), then the
**Download raw file** button (the arrow pointing down, top right of the
file).

### 2. Open it in Poedit

[Poedit](https://poedit.net) is free, for Windows, macOS and Linux. Open the
`.po` file with it.

One setting keeps your upload small and easy to review: **Preferences ›
Advanced**, untick **Wrap at**.

### 3. Translate

- **Highlighted as "Needs work"**: a first draft a machine wrote, or a
  sentence whose English changed since it was translated. Read it. Fix it if
  it is wrong or clumsy; if it is right, untick **Needs work**. Either way,
  it then counts as checked by a person.
- **Empty**: not translated yet. The game shows these in English.
- The **context** Poedit shows (`shell.nav.home`, for example) is the
  sentence's name in the game, and the **notes for translators** in the
  sidebar say where it appears and what its `{placeholders}` hold. Read them.

Before you start, read the short rules below and the [glossary](GLOSSARY.md):
the game uses one word for each of its own things, everywhere.

### 4. Send it

Save in Poedit (it also makes a `.mo` file: you do not need that one). Then,
on GitHub:

1. Open the same folder here (for example `locales/es`).
2. **Add file › Upload files**, and drop in your `.po` file.
3. Write one line about what you did ("Checked the Market screen"), choose
   **Create a new branch for this commit and start a pull request**, and
   press **Propose changes**, then **Create pull request**.

GitHub makes your own copy of this repository the first time; that is
normal. A check runs on your pull request and says, with the sentence and
the reason, if anything must change. A maintainer then merges it, and it
reaches the game with the next update.

You can send part of a file: translate or check as much as you like and
upload it. Several smaller pull requests are easier to review than one huge
one.

## The rules, in short

The full version, with examples, is in [CONTRIBUTING.md](CONTRIBUTING.md).

1. **Keep every `{placeholder}` exactly as it is**, and move it where your
   sentence needs it: `{count}`, `{name}`, `{price}`. The game fills them in.
   Never translate the word inside the braces.
2. **Keep the tags**: `<b>…</b>`, `<link>…</link>`. Translate the words
   between them, not the tags.
3. **Plurals**: `{count, plural, one {…} other {…}}` is one sentence with a
   form for each number. Translate inside each `{…}` branch; your language may
   need more forms (Serbian: `one`, `few`, `other`). See CONTRIBUTING.md.
4. **Never translate**: Gray Horizon, CR (the money), XP, UTC, product names
   (Discord, Android), and names players chose.
5. **Use the [glossary](GLOSSARY.md)'s word** for every game term, and your
   language's style guide: [Español](style/es.md),
   [Srpski](style/sr.md).
6. **Plain words.** The English is written for someone who has never played
   and may be a teenager reading a second language. Keep it that simple, and
   about as short: buttons have little room.

## A new language

1. Open an issue with the **New language** template, so others know and can
   join you.
2. Download `templates/ui.pot`. In Poedit: **File › New from POT/PO file**,
   choose the `.pot`, then your language.
3. Save it as `ui.po`, and upload it to a new folder `locales/<code>/`, where
   `<code>` is your language's code (`de`, `pt-BR`, `fr`, `pl`…). On GitHub,
   type `locales/<code>/` in front of the file name when uploading.

A language appears in the game once its first-hour screens are translated
and checked; until then the game shows English for anything missing.

## Found a wrong translation in the game?

In the game, **You › Help › Report a bug**, and say which screen; or open an
issue here with a screenshot.

## Licence

The game's text and its translations are © Gray Horizon, all rights
reserved: this repository is public so that players can translate the game,
not so that the text can be reused elsewhere. By contributing you grant Gray
Horizon the right to use your work in the game, and you are credited in
[CREDITS.md](CREDITS.md). The terms are in [LICENSE.md](LICENSE.md).

---

For maintainers: this repository is written to by `pnpm i18n:publish` in
the game's own (private) repository and read back by `pnpm i18n:pull`, which
validates every translation again before the game uses it. Do not edit
`templates/`, `STATUS.md` or `tools/icu-check.mjs` here by hand; they are
overwritten on the next publish.
