# Style guide: Srpski (sr-Latn, sr-Cyrl)

Contemporary standard Serbian (ekavian). Read with the
[glossary](../GLOSSARY.md).

## Two scripts, one translation

Only Serbian Latin (`locales/sr-Latn`) is translated and reviewed. The game
writes the Cyrillic from it automatically, converting the words and never
the syntax (`{placeholders}`, plural keywords, `<tags>`), addresses, CR, UTC,
product names or any word with q, w, x or y in it. So translate and review
in Latin only. If the Cyrillic in the game gets a word wrong (a word whose
letters the converter joins wrongly, such as _injekcija_), open an issue
with the word: the fix goes into the converter, never into a file by hand.

## Voice

- **Ti**, informal and direct, as the English is.
- Buttons and menu items in the **imperative** (2nd person singular):
  _Radi_, _Glasaj_, _Otkaži_, _Sačuvaj_, _Zatvori_. Questions as questions:
  _Zatvoriti firmu Fila d.o.o.?_
- Plain words a teenager knows; prefer the common word to the bureaucratic
  one (_plata_, not _zarada od nesamostalnog rada_).
- Ekavian forms: _mesto_, _vreme_, _rešenje_, _lepo_ — never ijekavian
  (_mjesto_, _vrijeme_).
- Serbian, not Croatian or Bosnian, terms where they differ: _hiljada_ (not
  _tisuća_), _voz_ (not _vlak_), _akcija_ (not _dionica_), _opština_ (not
  _općina_), _bezbednost_ (not _sigurnost_ in the security sense),
  _uslovi_, _univerzitet_, _račun_, _sedmica/nedelja_.

## Grammar

- **Gender**: a player's gender is unknown, and Serbian marks it in the past
  tense (_glasao/glasala_). Never write _glasao/la_ or _glasao(la)_. Rephrase
  so no participle refers to a person: _Tvoj glas je zabeležen_ instead of
  _Glasao si_; _{name}: novi član_ instead of _{name} se pridružio_; use the
  present or a noun (_Pridruživanje stranci: {name}_).
- **Cases after placeholders**: a `{name}` placeholder is a nominative that
  cannot decline. Put it where the nominative is correct, often after a
  colon or as a subject: _Firma {name} je zatvorena_, _Država: {country}_.
  Do not write _u {country}_ when the country name would need the locative;
  write _u državi {country}_.
- **Numbers**: three plural forms. Keep `{count}` in every branch:

```
{count, plural, one {{count} pogon} few {{count} pogona} other {{count} pogona}}
{count, plural, one {{count} oblast} few {{count} oblasti} other {{count} oblasti}}
```

`one` covers 1, 21, 31, 101 (not 11); `few` covers 2–4, 22–24, 102–104 (not
12–14); `other` covers the rest, including 0, 5–20, 11–14. Test with 1, 2, 5,
11, 21 and 22.

## Typography

- Quotation marks „…“ in running text; keep any the English uses for names.
- Capitalise only the first word of a title (_Opcije mape_), plus names and
  the glossary's capitalised terms (_Energija_, _Skupština_).
- The game prints its figures itself (`10 007`, `12.50 CR`); keep the
  placeholder.

## Length

Serbian is about as long as English, longer in noun phrases. Labels in bars
and on buttons have little room; prefer the shorter correct word.
