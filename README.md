# Vedant Developers & Builders — website and brochure

Static website (plain HTML, CSS and JavaScript, no build step) plus the Nature’s Nest sales brochure (PDF).

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home page |
| `about.html` | About Us: story, founders, philosophy, promise |
| `project.html` | Project website for **Vedant Nature’s Nest**, Belagavi: overview, floor plans (floor picker + wing layouts), amenities, location advantages, construction updates, gallery, 360° virtual tour, enquiry form, brochure download |
| `brochure/Vedant-Natures-Nest-Brochure.pdf` | The official sales brochure, linked from the "Download Brochure" button. Replace this file to update it. |

Shared files: `css/style.css` (all styles) and `js/main.js` (animations and interactions). Every page has the floating WhatsApp button.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

To publish, upload the whole folder to any static host (GitHub Pages, Netlify, Vercel, Hostinger, cPanel…).

## Settings to fill in first (`js/main.js`)

At the top of the "Project page" block:

```js
const WHATSAPP_NUMBER = '919660699108';  // your WhatsApp number: country code + number, digits only
const GOOGLE_SHEET_URL = '';             // your Google Sheet web app URL (see google-sheet/README.md)
```

How the enquiry form works:
- The visitor fills in the form (name, 10-digit mobile, optional email, flat type, message, consent).
- Each enquiry is added as a row in your Google Sheet. Setup takes about 5 minutes: follow [`google-sheet/README.md`](google-sheet/README.md) and paste the script from [`google-sheet/Code.gs`](google-sheet/Code.gs).
- The visitor then sees a thank-you message with a "Continue on WhatsApp" button that opens a pre-filled chat to your number.
- The Sales Brochure section is a direct download button (no form).

## Content checklist (placeholders to replace)

**Everywhere**
- [x] Phone numbers and address (from the brochure). Email address not yet added.
- [ ] Social media links (`href="#"`)
- [x] Logo (`images/brand/`). For the sharpest result, ask your designer for an SVG or a larger transparent PNG and replace the files with the same names.

**Project (`project.html` and brochure)**
- [x] Project name (Vedant Nature’s Nest) and location (Belagavi), taken from the architect's drawings — change if the marketing name differs
- [ ] Possession date
- [ ] K-RERA registration number and QR code (Karnataka RERA, rera.karnataka.gov.in)
- [x] Flat sizes A1–C2 for the 1st, typical and 5th floors (from the brochure; stated as sq.ft., not specified as carpet or super built-up)
- [x] Building: G+7, 49 homes, 2, 2.5 & 3 BHK, 30 guntas (32,670 sq.ft.)
- [x] Amenities: the eight named in the brochure ("10+ lifestyle amenities")
- [x] Location: map and nearby landmarks with distances (from the brochure)
- [ ] Construction updates (dates, text, photos) and progress percentages
- [x] Demo flat: B1 plan and interior renders replace the earlier virtual tour

**About / Home**
- [x] Chairman photo (Mr. Pandhari Parab). Add photos of Yash and Aarti Parab if wanted.

## Images

| Folder / file | What it is |
| --- | --- |
| `images/brand/logo-*.png` | Your logo: full, horizontal (header), monogram, wordmark and tagline. `-light` versions have the small lettering lifted to light gold for dark backgrounds. Plus `favicon.png` and `apple-touch-icon.png`. |
| `images/building/render.jpg` | Your building render (used in the hero, camera tour, gallery and brochure) |
| `images/building/render-day.jpg` | Your afternoon front render, aligned pixel-for-pixel to `render.jpg` for the day-to-dusk slider. If either render changes, they must be re-aligned. |
| `images/building/blueprint.jpg` | Line drawing generated from the render, used for the "blueprint to building" hero animation |
| `images/building/detail-*.jpg` | Close-up crops of the render (rooftop, balconies, greens, entrance, facade, street) |
| `images/renders/*.jpg` | Your rooftop amenity renders (café, open-air theatre, kids' area, aerial) and close-up crops of them (`crop-*.jpg`) |
| `images/plans/flats/*.jpg` | 3D floor plans (parking, 1st, typical 2–4 & 6–7, 5th, terrace) and flat plans A1–C2 plus the B1 demo flat, from the sales brochure |
| `images/booklet/*.jpg` | Renders, B1 demo-flat interiors, amenity renders, chairman photo and location map from the sales brochure |
| `images/terrace/view-*.jpg` | The architect's 3D views of the terrace (gym, banquet hall, play area, pet area…) |
| `images/update-*.jpg` | Placeholder construction-update images — replace with real site photos |

When you get more renders (interiors, clubhouse, pool), drop them in and swap the file names in the HTML. If you replace `render.jpg`, regenerate `blueprint.jpg` too (or ask for it to be regenerated).

The brochure uses PNG copies of the plans in `brochure/plans/` — replace those too.


## Animations

Home page, top to bottom:
- **Loader**: the VD monogram wipes in with a gold shimmer, then the wordmark and "Spaces for a better tomorrow" fade up beside a 0–100 counter (first visit only), then the curtain lifts. Every internal link closes the curtain before the next page opens.
- **Rise**: the blueprint drawing sketches in, then the real building rises floor by floor as you scroll (Blueprint → Foundation → Structure → Facade → Home), expands to full screen and reveals the call to action.
- **Word fill**: the belief statement lights up word by word as you scroll.
- **Day to dusk**: scrolling (or dragging) wipes the afternoon render into the dusk render while a clock runs from 4:30 to 7:15 PM.
- **Camera tour**: the view flies over the render to the rooftop, balconies, planters and entrance, with a pulsing marker on each feature.
- **Life on the rooftop**: six renders (aerial, café, open-air theatre, kids' area, gazebos, seniors' court) wipe up over each other as you scroll, with captions and progress markers.
- **Residences**: vertical scrolling moves a horizontal strip of 1, 2 and 3 BHK cards.
- **Scatter collage**, **expanding generation panels**, **amenity list with floating photo preview**, **"Elevated" cut out of the render**, **parallax interior columns**, **founder monograms**, **rotating word with photo marquee**, **parallax call to action**.
- Site-wide: the header logo switches between its dark and light versions depending on the section behind it; smooth scrolling (Lenis), custom cursor with labels, magnetic buttons, image wipe reveals, subtle film grain.

- Letter-by-letter heading reveals (`data-split`), word-by-word (`data-split="words"`), fade-up blocks (`data-reveal`).
- Scroll parallax (`data-speed`), zoom section, sticky scatter collage, rotating word and endless photo strip.
- Project page: sticky section navigation, floor-plan tabs, gallery filters and lightbox, draggable 360° viewer, animated progress bars.
- Respects the visitor's "reduce motion" setting.
