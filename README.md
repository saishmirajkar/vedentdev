# Vedant Developers & Builders — website and brochure

Static website (plain HTML, CSS and JavaScript, no build step) plus a 24-page sales brochure.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home page |
| `about.html` | About Us: story, founders, philosophy, promise |
| `project.html` | Project website for **Vedant Residency**: overview, floor plans, master plan, amenities, location advantages, construction updates, gallery, 360° virtual tour, enquiry form, brochure download |
| `brochure/index.html` | Sales brochure source (24 A4 landscape pages) |
| `brochure/Vedant-Residency-Brochure.pdf` | Exported brochure PDF (download link on the project page) |

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
const WHATSAPP_NUMBER = '910000000000';  // your WhatsApp number: country code + number, digits only
const FORM_ENDPOINT = '';                // optional: e.g. a Formspree URL to receive enquiries by email
```

How the lead forms work:
- The visitor fills in the form (name, 10-digit mobile, configuration, visit date, consent).
- If `FORM_ENDPOINT` is set, the enquiry is sent there (Formspree, Getform, Google Apps Script, your CRM's webhook…).
- The visitor then sees a thank-you message with a "Continue on WhatsApp" button that opens a pre-filled chat to your number.
- The brochure form reveals the PDF download after the visitor enters name and mobile.

## Content checklist (placeholders to replace)

**Everywhere**
- [ ] Phone, email, office/site address (header menu, footer, project enquiry section, brochure back cover)
- [ ] Social media links (`href="#"`)
- [ ] Real logo (currently a text logo plus a simple "V" mark)

**Project (`project.html` and brochure)**
- [ ] Project name (currently "Vedant Residency")
- [ ] Location / city
- [ ] Possession date
- [ ] MahaRERA registration number and QR code
- [ ] Carpet areas for each configuration (`___ sq.ft.`)
- [ ] Number of towers and floors
- [ ] Final amenity list
- [ ] Travel times on the location list (`__ min`) and the Google Maps link
- [ ] Construction updates (dates, text, photos) and progress percentages
- [ ] Payment plan (the brochure shows a sample construction-linked plan)
- [ ] Specifications (the brochure shows indicative specifications)
- [ ] 360° virtual tour: replace `images/pano-*.jpg` with real equirectangular/360 photos, or link a Matterport / YouTube 360 tour

**About / Home**
- [ ] Founder photos (`team-1.jpg` = Yash Parab, `team-2.jpg` = Pandhari Parab, `journal-1.jpg` = Aarti Parab)

## Images

| Folder / file | What it is |
| --- | --- |
| `images/building/render.jpg` | Your building render (used in the hero, camera tour, gallery and brochure) |
| `images/building/blueprint.jpg` | Line drawing generated from the render, used for the "blueprint to building" hero animation |
| `images/building/detail-*.jpg` | Close-up crops of the render (rooftop, balconies, greens, entrance, facade, street) |
| `images/photos/*.jpg` | Real photos from Unsplash (free licence, commercial use allowed). They are **representative** interiors, amenities and lifestyle images, labelled as such on the site. See `CREDITS.md`. |
| `images/plans/*.svg` | Indicative floor plans, master plan and location map — replace with the architect's drawings |
| `images/update-*.jpg` | Placeholder construction-update images — replace with real site photos |

When you get more renders (interiors, clubhouse, pool), drop them in and swap the file names in the HTML. If you replace `render.jpg`, regenerate `blueprint.jpg` too (or ask for it to be regenerated).

The brochure uses PNG copies of the plans in `brochure/plans/` — replace those too.

## Updating the brochure

1. Edit `brochure/index.html` (text, tables, images).
2. Re-export the PDF: run a local server (`python3 -m http.server 8000`), then `node tools/export-brochure.js` (needs Playwright), or open the page in Chrome → Print → Save as PDF with "Background graphics" on, A4 landscape, no margins.

## Animations

Home page, top to bottom:
- **Loader**: the "V" mark draws itself with a 0–100 counter (first visit only), then the curtain lifts. Every internal link closes the curtain before the next page opens.
- **Rise**: the blueprint drawing sketches in, then the real building rises floor by floor as you scroll (Blueprint → Foundation → Structure → Facade → Home), expands to full screen and reveals the call to action.
- **Word fill**: the belief statement lights up word by word as you scroll.
- **Camera tour**: the view flies over the render to the rooftop, balconies, planters and entrance, with a pulsing marker on each feature.
- **Residences**: vertical scrolling moves a horizontal strip of 1, 2 and 3 BHK cards.
- **Scatter collage**, **expanding generation panels**, **amenity list with floating photo preview**, **"Elevated" cut out of the render**, **parallax interior columns**, **founder monograms**, **rotating word with photo marquee**, **parallax call to action**.
- Site-wide: smooth scrolling (Lenis), custom cursor with labels, magnetic buttons, image wipe reveals, subtle film grain.

- Letter-by-letter heading reveals (`data-split`), word-by-word (`data-split="words"`), fade-up blocks (`data-reveal`).
- Scroll parallax (`data-speed`), zoom section, sticky scatter collage, rotating word and endless photo strip.
- Project page: sticky section navigation, floor-plan tabs, gallery filters and lightbox, draggable 360° viewer, animated progress bars.
- Respects the visitor's "reduce motion" setting.
