# SEPANG 56 — Google Stitch Design Exploration Brief

## Why Stitch is being used

Stitch is being used to establish the visual/UI direction before Codex/OpenCode implementation.

The goal is not to let Stitch redefine the product. The product flow, feature scope, and approved Three.js experiences already exist in this repository.

Stitch should help us answer:

- What should SEPANG 56 look and feel like?
- How should the same experience adapt between desktop and mobile?
- How do we make beginner learning visually exciting without making it childish?
- How do we combine motorsport broadcast graphics, premium editorial design, and interactive racing-game energy?
- How should 3D scenes be framed by the surrounding UI?

Read alongside:

- `DESIGN.md`
- `docs/product-blueprint.md`
- `docs/user-flow.md`
- `docs/wireframes.md`
- `docs/design-direction.md`
- `docs/threejs-experience.md`

---

# Primary Stitch prompt

Design a high-fidelity responsive web experience called **SEPANG 56**, a beginner-first Formula 1-inspired race-weekend web app centered on Sepang, Malaysia.

The core journey is exactly:

**Learn F1 → Understand Sepang → Make Predictions → Compete With Friends**

The audience includes people who are excited that Formula 1 is returning to Sepang but may know almost nothing about F1. The design must therefore feel premium, fast, competitive, cinematic and unmistakably motorsport-inspired while remaining extremely understandable to a newcomer.

Do not design this like a generic SaaS dashboard, online course platform, crypto dashboard, esports menu, or card-heavy startup landing page.

## Visual concept

Blend three visual languages:

1. **Motorsport broadcast** — timing towers, grid positions, lap/sector labels, race-number hierarchy, condensed data labels, track-line graphics.
2. **Premium racing-game presentation** — cinematic framing, dramatic scene transitions, 3D-ready spaces, driver-selection energy, starting-light moments.
3. **Premium editorial** — bold typography, confident negative space, strong photography/graphics, sophisticated hierarchy, clean storytelling.

Use a dark asphalt/graphite foundation with warm white typography and controlled racing-red accents. Signal colors such as green/yellow/red may be used for race-state semantics. Avoid covering everything in red.

Typography should combine a bold extended/geometric display face, highly legible modern sans-serif body text, and condensed/monospaced telemetry-like labels/numerals. Do not imitate or copy Formula 1 proprietary typefaces or logos.

Use sharp, technical geometry, grid lines, timing rails, subtle chamfered corners and strong directional composition. Avoid excessive rounded floating cards and pill-shaped controls.

The Sepang circuit outline should be a signature visual motif throughout the product.

## Important 3D placeholders

The implementation will use Three.js in predetermined areas. Design the surrounding UI to intentionally accommodate these scenes rather than replacing them with flat illustrations:

- Landing hero: cinematic starting-lights sequence, stylised open-wheel car motion, and 3D Sepang circuit reveal.
- Sepang explorer: major interactive 3D circuit centerpiece with selectable hotspots and contextual information.
- Learn: selected visual lessons such as starting grid/qualifying, pit stop, tyre compounds, and simple overtaking/DRS concept.
- Prediction experience: light 3D presentation around selected driver/car plus a starting-lights lock-in ceremony.

Represent these areas as polished scene containers / 3D-ready compositions. Do not invent additional 3D product features.

## Required screens

Create both DESKTOP and MOBILE explorations for these screens:

1. Landing / first arrival
2. F1 knowledge check
3. Beginner Race School lesson
4. Race School completion / transition toward Sepang
5. Sepang 3D circuit explorer
6. Prediction driver-selection screen
7. Prediction yes/no or event-prediction screen
8. Prediction review / lock-in
9. Picks locked state
10. Create/join league
11. Private league leaderboard
12. Returning-user home/dashboard

## Desktop principles

Desktop should feel cinematic and spacious, not merely wider.

- Use large scene areas.
- Use split compositions when appropriate.
- Allow the Sepang 3D circuit to dominate the viewport.
- Information panels can sit alongside 3D scenes.
- Strong horizontal timing/grid structures are encouraged.
- Preserve clear reading order despite asymmetry.

## Mobile principles

Mobile should be intentionally redesigned, not squeezed desktop.

- Prioritize thumb reach, readability, and clear vertical progression.
- 3D scenes should remain visually impressive but use shorter framing and less simultaneous information.
- Sepang circuit detail should use a bottom sheet / stacked information area rather than a desktop side panel.
- Hotspots need generous tap targets.
- One prediction choice/task at a time.
- Fixed bottom actions may be used where useful, but avoid covering important circuit/driver content.
- Maintain motorsport identity without making the screen dense or claustrophobic.

## User-flow behavior

The knowledge check is deterministic UI branching, not AI.

- `Nothing at all` → recommend full beginner learning sequence.
- `I know the basics` → recommend shortened refresher sequence.
- `I watch F1` → allow direct route into Sepang/predictions.

Progression is soft; users can navigate elsewhere if they want.

Auth should not block initial exploration. Ask the user to sign in/create an account only when they need to save/lock predictions or participate persistently in leagues.

## Desired emotional response

The user should think:

> “I don't really know F1, but this makes me want to learn enough to join in.”

and visually:

> “This feels like race weekend, not an educational website.”

---

# Stitch iteration prompts

After generating the first concept, use targeted iterations rather than asking Stitch to redesign everything at once.

## Iteration A — Make it less SaaS

Reduce generic cards, pills, centered startup sections and dashboard patterns. Increase motorsport broadcast structure, asymmetric composition, track-line graphics, large race numerals, timing rails and strong typography. Keep usability beginner-friendly.

## Iteration B — Desktop cinematic pass

Make the desktop version more cinematic without adding product features. Give the 3D Sepang circuit and hero scene more visual dominance, improve composition around widescreen viewports, and make the page feel like premium motorsport editorial/broadcast design.

## Iteration C — Mobile-first pass

Redesign the mobile version intentionally rather than scaling down desktop. Use vertical storytelling, touch-friendly hotspots, bottom sheets for Sepang detail, one-task-at-a-time prediction screens, strong fixed/nearby actions, and simplified 3D framing while retaining racing identity.

## Iteration D — Beginner clarity audit

Audit every screen as if the user has never watched Formula 1. Remove unexplained jargon, clarify hierarchy, ensure actions are obvious, and preserve the premium motorsport visual identity without overwhelming the user.

## Iteration E — Race timing identity

Strengthen leaderboard, prediction progress, navigation micro-labels, section numbering and state changes using visual cues inspired by motorsport timing/classification graphics without copying official Formula 1 brand assets.

---

# What NOT to let Stitch add

Do not add:

- AI assistant/chatbot
- live telemetry
- weather dashboard
- race strategy simulator
- fantasy-team management
- social feed/chat
- ticket purchasing
- ecommerce
- achievements/badges
- notification center
- unrelated stats dashboards

The design exercise is about making the existing MVP exceptional, not expanding feature scope.

---

# Design handoff expectation

Once a Stitch direction is approved:

1. Capture/export the selected design system and screens.
2. Update `DESIGN.md` if Stitch reveals better approved tokens/rules.
3. Store screenshots/exported references in the project if appropriate.
4. Codex/OpenCode should implement the approved result rather than independently redesigning it.
