# Vedant Developers & Builders — website

A static, single-page website (plain HTML, CSS and JavaScript, no build step).

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

To publish, upload the whole folder to any static host (GitHub Pages, Netlify, Vercel, cPanel, etc.).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | All page content and sections |
| `css/style.css` | Colours, fonts, layout, responsive rules and CSS animations |
| `js/main.js` | Letter-by-letter text reveals, scroll parallax, zoom and scatter effects, menu, rotating word, marquee |
| `images/` | Placeholder images — replace with real photos |

## Animations and effects

- Hero: the card fades up, then the background fades in and slowly zooms (Ken Burns).
- Headings marked `data-split` reveal letter by letter (blur + fade + rise); `data-split="words"` reveals word by word.
- Blocks marked `data-reveal` fade up as they enter the screen.
- Images marked `data-speed` move with scroll parallax (positive and negative speeds).
- "Quality Living" section: the photo grows while the headline shrinks as you scroll.
- Collage section: photos start stacked in the centre and scatter outward while the headline fades in (sticky scroll).
- "Building Spaces for …": the word below rotates every 1.8 s; the photo strip scrolls endlessly (pauses on hover).
- Full-screen menu slides down with staggered links; `Esc` closes it.
- Buttons: the sparkle icon spins on hover; images zoom gently on hover.
- Everything respects the visitor's "reduce motion" setting.

## Replacing placeholder content

All text in `index.html` is placeholder copy written for Vedant Developers & Builders — edit it directly.
Things to fill in: project names, team names/roles, office address, phone, email, and the social links (`href="#"`).

Replace each image in `images/` with a real photo **using the same file name** (JPG). Recommended sizes:

| File | Used for | Size (px) |
| --- | --- | --- |
| `hero-bg.jpg` | Full-screen hero background | 1920 × 1080 |
| `hero-card.jpg` | Photo inside the hero card | 800 × 860 |
| `project-1.jpg` … `project-4.jpg` | Projects section | ~1200 × 1500 (portrait) |
| `brand.jpg` | Right half of the brand section | 1440 × 1800 |
| `interior-design.jpg` | "Quality Living" zoom section | 1600 × 940 |
| `collage-1.jpg` … `collage-8.jpg` | Scatter collage | 900 × 900 |
| `journal-1.jpg` … `journal-3.jpg` | Latest updates cards | 800 × 776 |
| `team-1.jpg`, `team-2.jpg` | Team photos | ~1200 × 1600 |
| `space-1.jpg` … `space-6.jpg` | Scrolling photo strip | 886 × 1028 |
| `menu-card.jpg` | Small card in the menu | 600 × 420 |

To use a video for the hero background instead of a photo, replace the `<img>` inside `.hero__bg` with:

```html
<video src="images/hero.mp4" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video>
```

The logo is set in text in the header (`.logo`) and as a simple SVG "V" mark (`#i-mark` in `index.html`); swap in your real logo when ready.

Fonts: Hanken Grotesk and Inter, loaded from Google Fonts.
