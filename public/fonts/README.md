# Brand fonts

`app/globals.css` declares `@font-face` rules for Formula 1's own typefaces:

| Family | Files expected here |
| --- | --- |
| `Formula1` | `Formula1-Regular`, `Formula1-Bold`, `Formula1-Black` (`.woff2` / `.woff`) |
| `Formula1 Wide` | `Formula1-Wide` (`.woff2` / `.woff`) |

These faces are **proprietary and are not committed to this repository**.
Install your licensed copies with:

```bash
F1_FONT_SOURCE=/path/to/fonts npm run fonts:install
```

If the files are absent the browser skips those `src` entries and the type
falls back to **Titillium Web** (body, which is F1's own body face) and
**Barlow Condensed** (display). Nothing breaks, and the build never depends on
them.
