# Style guide: Español (es)

Neutral, international Spanish that a player in Mexico, Argentina, Colombia
and Spain reads without stumbling. Read with the [glossary](../GLOSSARY.md).

## Voice

- **Tú**, informal and direct, as the English is. Plural "you" is
  **ustedes**; never _vosotros_.
- Buttons and menu items in the **infinitive**: _Trabajar_, _Votar_,
  _Cancelar_, _Guardar_. Questions in a decision sheet as questions:
  _¿Cerrar Fila S.A.?_
- Short. The English is deliberately plain (a non-native teenager must read
  it); keep that register. Do not add politeness formulas or explanations the
  English does not have.

## Words to avoid

| Avoid (regional)        | Use                     |
| ----------------------- | ----------------------- |
| ordenador / computadora | dispositivo             |
| móvil / celular         | teléfono                |
| coger                   | tomar, agarrar, recoger |
| vale                    | de acuerdo, listo       |
| coste                   | costo                   |
| conducir / manejar      | (rephrase)              |

## Grammar and typography

- Opening marks: **¿…?** and **¡…!** always.
- Gender: the player's gender is unknown. Prefer forms that do not mark it:
  _Te damos la bienvenida_ rather than _Bienvenido_; _Tienes nivel 5_, not
  _Estás cansado_. Where a noun for a person is unavoidable (_ciudadano_),
  the generic masculine is acceptable; never write _o/a_ or _@_.
- Numbers: the game prints figures itself (`10 007`, `12.50 CR`); keep the
  placeholder, never retype a figure.
- Capitalise only the first word of a title (_Opciones del mapa_, not
  _Opciones Del Mapa_), plus proper nouns and game terms the glossary
  capitalises (_Energía_, _Asamblea_).
- Dates and times come from placeholders already formatted; "UTC" stays.

## Plurals

Spanish has `one` and `other` (and `many` for some large numbers in CLDR,
which the game does not need). Keep `{count}` in each branch:

```
{count, plural, one {1 instalación} other {{count} instalaciones}}
```

## Length

Spanish runs about a quarter longer than English. Labels in bars and on
buttons have little room: prefer the shorter of two correct words
(_Mercado_, not _Mercado de bienes_), and say so in a translator comment if a
label cannot be shortened.
