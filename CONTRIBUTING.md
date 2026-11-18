# Translating Gray Horizon

The [README](README.md) says how to download, translate and upload a file.
This is the detail: what a translation must keep, how plurals work, and what
is checked when your work is brought into the game.

## What one entry looks like

```po
#. Shown on a company's page while it is being wound up. {date} is when it closes.
#, fuzzy, machine-translated
msgctxt "company.closing.until"
msgid "Closing on {date}"
msgstr "Cierra el {date}"
```

| Line             | What it is                                                         | You change it? |
| ---------------- | ------------------------------------------------------------------ | -------------- |
| `#.`             | a note for translators: where the text appears, what it holds      | no             |
| `#, fuzzy`       | "Needs work": a machine draft, or the English changed since        | yes, see below |
| `msgctxt`        | the sentence's name in the game                                    | no             |
| `msgid`          | the English                                                        | **never**      |
| `msgstr`         | your translation                                                   | yes            |

`machine-translated` marks a sentence a machine drafted first. It is only a
note: whether the sentence is checked is decided by `fuzzy` alone.

**Approving a sentence.** In Poedit, fix the text or untick **Needs work**.
In a text editor, delete the word `fuzzy` from the `#,` line (delete the
whole line if nothing else is on it). Do this only for sentences you have
actually read against the English.

## Placeholders

A word in braces is filled in by the game. Keep each one exactly as written,
and put it where your grammar needs it:

| English                         | Español                               |
| ------------------------------- | ------------------------------------- |
| `{name} joined {party}`         | `{name} se unió a {party}`            |
| `Founded on Day {day}`          | `Fundada el día {day}`                |

- Never translate, rename or add a placeholder: `{nombre}` would print as a
  hole, so a sentence with one is refused.
- You may leave one out if your sentence truly does not need it, but never
  leave out a number.
- The note above the entry says what each placeholder holds. A placeholder
  holding a name cannot change its form, so in a language with cases, build
  the sentence so the name stands in the nominative: Serbian _Država:
  {country}_ rather than _u {country}_.

## Tags

`<b>…</b>` (bold), `<link>…</link>` (a link), `<0>…</0>` (something the game
draws around the words) wrap part of a sentence. Keep the same tags, each
opened and closed, around the words that mean the same in your sentence.
Never add HTML: `<a href>`, `<img>` and the like are refused.

## Plurals

A sentence that depends on a number has a branch for each form:

```
{count, plural, one {# site} other {# sites}}
```

- Keep `count` (the name before `, plural`), the word `plural` and the branch
  names (`one`, `few`, `other`); translate only inside the inner braces.
- `#` and `{count}` both print the number. Keep whichever the English uses.
- `=0 {…}` is an exact case for zero: keep it if the English has it.
- Your language may need more branches than English. Serbian needs three:

```
{count, plural, one {# pogon} few {# pogona} other {# pogona}}
```

  `one` is 1, 21, 31, 101 (not 11); `few` is 2–4, 22–24 (not 12–14); `other`
  is everything else, 0 and 5–20 included. Spanish needs `one` and `other`.
  Other languages: the [CLDR plural rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html)
  list theirs.

A `select` works the same way (`{side, select, ATTACKER {…} other {…}}`):
keep the branch names, translate the insides.

## Quotes and braces

In this format an apostrophe next to a brace is special: `'{'` prints a
brace. Use the typographic apostrophe (’) in your text where you can; it is
never special. If the English has `''`, keep it doubled.

## Words

- The [glossary](GLOSSARY.md) gives the one word each language uses for each
  of the game's own things (a _site_, a _shift_, the _Assembly_). Use it
  everywhere, even where another word would also be right: players learn the
  game by its words.
- Follow your language's style guide: [Español](style/es.md),
  [Srpski](style/sr.md). A new language starts its own (copy one and adapt
  it).
- Plain, short words. The English is written for someone who has never
  played and may be a teenager reading a second language.
- The player's gender is unknown. Write so that no word has to guess it.

## Machine translation

You may use tools, but you are responsible for every sentence you submit:
read each one against the English, and never upload a file you have not
checked. A pull request of unchecked machine output for a whole file will
be closed.

## What is checked

When a maintainer brings your file into the game, every sentence is checked
again. A sentence is left out (and the game keeps what it had) when:

- it does not parse: a brace or a plural branch out of place;
- it names a placeholder the English does not have;
- a plural or select has lost its `other` branch;
- its tags are not the English's, or are not closed;
- it contains HTML.

You are told on your pull request which sentences were left out and why;
fix them and upload the file again to the same pull request (on its branch:
**Add file › Upload files**). Never edit a `msgid`: a sentence whose English
changed since your copy was made is kept, and marked to be checked against
the new English. To suggest a change to the English, open an issue.

## Changing a glossary term

Open a pull request that changes the row in [GLOSSARY.md](GLOSSARY.md), with
the reason. Once a reviewer of that language agrees, the maintainer changes
every sentence that used the old word in one go. A term is never changed one
sentence at a time.

## Reviewers

A reviewer is a fluent speaker who reads other people's pull requests for
their language: meaning, the glossary's words, the style guide. Ask in an
issue if you would like to be one for your language.

## Credit

Add yourself to [CREDITS.md](CREDITS.md) in your first pull request, under
your language, by the name you want shown (it may be a nickname). By
contributing you agree to [LICENSE.md](LICENSE.md).
