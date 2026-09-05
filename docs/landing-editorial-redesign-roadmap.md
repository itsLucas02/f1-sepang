# Landing Editorial Redesign Roadmap

## Purpose

Upgrade the landing page using the strongest compositional ideas from the
owner's alternative site while keeping SEPANG 56's actual beginner flow:

> Learn → Understand Sepang → Make Predictions → Compete With Friends

This is an editorial presentation upgrade, not a new product surface. It must
not introduce live timing, weather, race-control status, betting, or other
unapproved features.

## Decisions locked with the owner

- [x] Treat `C:\Users\User\Downloads\f1-sepang-v2\sepang-f1-web-challenge` as the visual benchmark.
- [x] Make the landing hero **Sepang-first**, not a named-driver promotion.
- [x] Remove the Leclerc and Norris portrait treatment from the hero rather than replacing it with more driver portraits.
- [x] Use a timed lights-out entrance, then reveal the Sepang hero content.
- [x] Keep the slanted dual marquee directly below the hero.
- [x] Retain the outlined numbered-section system and red editorial eyebrow labels.
- [x] Use the alternative site's Trackside media as temporary local footage; replace it later with approved final media.
- [x] Place `Trackside — raw footage` after the circuit guide and before the F1/Malaysia timeline.
- [x] Use grain and grid selectively as background layers, never over primary type, controls, the simulated hot lap, or footage.
- [x] Keep the page dark, premium, beginner-friendly, and free of fake live-data claims.

## Alternative-site reference checklist

This is the owner-approved visual acceptance list. An item is only complete
when it matches the *specific composition and behaviour* that made the
alternative site effective—not merely when a loosely similar element exists.

- [x] **Opening sequence:** five-light countdown, lights-out release, then a staged reveal of the hero copy and circuit composition.
- [ ] **Hero composition:** retain the exact `FORMULA 1 RETURNS TO / SEPANG.` hierarchy and make the circuit/architecture, not an anonymous car, the dominant visual after lights out.
- [ ] **Motion language:** reproduce the alternative's deliberate stagger, easing, and section entrances using the existing CSS/React stack; do not settle for generic reveal wrappers.
- [ ] **Atmosphere:** tune moving grain and grid as separate depth layers. Grain must create a deliberate consecutive rhythm *between and behind* editorial modules, rather than being dropped as a full-section overlay. It stays behind hero type and the hot lap, disappears for Section 01, returns for Section 02, and disappears again for Section 03.
- [x] **Slanted marquee:** retain the paired, opposing red/white bands immediately below the hero.
- [x] **Numbered editorial system:** every story section is intentionally numbered in sequence, including Section 04 Trackside; outlined numerals, red eyebrow, and large headline must remain one coherent system.
- [x] **Image-led Section 06:** give the closing conversion section the alternative's full-width, image-backed heading treatment, using SEPANG 56's real route into Learn/Predict rather than its out-of-scope grid simulator.
- [x] **Trackside:** temporary footage, asymmetrical main/secondary layout, and an honest playback control are implemented. Motion and final media remain part of the visual-polish pass.
- [ ] **Section 07 history:** replace the current rough timeline with the alternative's fuller alternating editorial chronology: more moments, stronger year scale, offset desktop cadence, tags, and deliberate reveal timing. Use verified Sepang facts and sources; do not consider the current `A circuit with history.` block finished.

## Target landing narrative

| Order | Section | Job |
| --- | --- | --- |
| 0 | Lights out / hero | Establish Sepang and invite a beginner into the experience. |
| — | Slanted marquee | Carry circuit facts and momentum between the hero and story. |
| 01 | Your race weekend | Show the real Learn → Sepang → Predict → Compete journey. |
| 02 | Malaysia in Formula 1 | Give the Malaysian connection real editorial weight. |
| 03 | Interactive circuit guide | Make `5.543 km` and the Sepang route tangible. |
| 04 | Trackside — raw footage | Add a short, cinematic sense of the sport in motion. |
| 05 | F1 / Malaysia timeline | Place the Sepang story in a concise historical context. |
| — | Closing route-in | Direct the visitor to Learn, Sepang, or Predict. |

## Delivery checklist

### 1. Source and asset audit

- [x] Inspect the alternative site's components, footage, dimensions, and loading behaviour.
- [x] Reuse its two temporary Pexels footage sources without copying them into the repository; replace them with approved final media later.
- [x] Record each temporary asset's source and replacement status in the Trackside section.
- [x] Exclude its false `LIVE`, `REC`, speed, sound, and race-coverage claims.

### 2. Hero: Sepang first

- [x] Remove the two named-driver portrait panels and their credits.
- [x] Replace the current basic lights overlay with the approved five-light countdown and staged lights-out reveal.
- [x] Hold hero copy until the sequence releases, while keeping the CTA immediately available under reduced motion.
- [x] Use the existing Sepang race-atmosphere image as the dominant visual.
- [x] Preserve clear links to `/learn` and `/sepang`.
- [x] Provide a reduced-motion route that leaves the hero immediately readable.

### 3. Editorial structure and atmosphere

- [ ] Preserve the slanted dual marquee without clipping at any viewport.
- [x] Apply the outlined-number/red-eyebrow editorial system consistently through Sections 01–06.
- [ ] Keep grain behind hero content and the hot lap, absent from Section 01, present for Section 02, and absent again for Section 03 as agreed.
- [ ] Make the grain rhythm consecutive through the transitions between modules, with masks and negative space keeping it behind—not over—type, controls, media, or data surfaces.
- [ ] Keep grid texture subordinate to content and never use it as a decorative stripe or footer divider.
- [x] Remove the obsolete hatched band immediately before the footer.

### 4. Trackside and timeline

- [x] Build the temporary `Trackside — raw footage` section using the alternative site's temporary footage sources.
- [x] Give footage a useful fallback poster, meaningful labels, and no claim of live/official coverage.
- [x] Make playback optional, muted, keyboard-accessible, and safe under reduced motion.
- [ ] Replace the short `A circuit with history.` first pass with the complete alternating editorial history composition from the alternative reference.
- [ ] Keep historical claims linked to genuine primary sources before the content is treated as final.

### 5. Image-led closing section

- [x] Rebuild the final route-in as Section 06 with a strong, darkened image background and large editorial heading.
- [ ] Keep its single action truthful: enter Learn, understand Sepang, then make picks. Do not import the alternative's grid simulator or invented data.

### 6. Validation and handoff

- [x] Run lint, typecheck, tests, and a production build.
- [x] Verify the landing page in a browser at desktop and mobile widths.
- [ ] Check hero timing, marquee continuity, video fallback, clipping, focus states, and reduced motion.
- [ ] Review the complete landing-page diff with the owner before any follow-up visual pass.
- [ ] Commit and push only after owner approval of the completed visual pass.

## Guardrails

- Reuse existing SEPANG 56 components and tokens where they already fit.
- Do not add a new dependency unless the existing platform cannot meet a real requirement.
- Do not turn the alternative site's command-centre, weather, pit-wall, or fake-live motifs into SEPANG 56 features.
- Do not let background texture compromise text contrast or interaction clarity.
- Treat temporary footage as replaceable content, not a permanent product claim.
