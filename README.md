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

All images in `images/` are generated placeholders. Replace each with a real photo or render **using the same file name**.

| File(s) | Used for |
| --- | --- |
| `hero-bg.jpg` | Home page hero background (1920 × 1080) |
| `elevation-day.jpg`, `elevation-night.jpg`, `elevation-tall.jpg` | Building elevation renders |
| `amenity-pool.jpg`, `amenity-clubhouse.jpg`, `amenity-garden.jpg` | Amenity CGI renders |
| `interior-design.jpg`, `project-1.jpg`, `project-2.jpg` | Interior renders |
| `pano-living.jpg`, `pano-bedroom.jpg`, `pano-balcony.jpg` | 360° virtual tour (wide panoramas, ~4000 × 1000) |
| `update-1.jpg` … `update-3.jpg` | Construction update photos |
| `team-1.jpg`, `team-2.jpg`, `journal-1.jpg` | Founder photos |
| `brand.jpg`, `collage-*.jpg`, `space-*.jpg`, `journal-*.jpg` | Home and About page imagery |
| `plans/*.svg` | Floor plans, typical floor, master plan, location map (indicative — replace with architect's drawings, SVG/PNG/JPG) |

The brochure uses PNG copies of the plans in `brochure/plans/` — replace those too.

## Updating the brochure

1. Edit `brochure/index.html` (text, tables, images).
2. Re-export the PDF: run a local server (`python3 -m http.server 8000`), then `node tools/export-brochure.js` (needs Playwright), or open the page in Chrome → Print → Save as PDF with "Background graphics" on, A4 landscape, no margins.

## Animations

- Letter-by-letter heading reveals (`data-split`), word-by-word (`data-split="words"`), fade-up blocks (`data-reveal`).
- Scroll parallax (`data-speed`), zoom section, sticky scatter collage, rotating word and endless photo strip.
- Project page: sticky section navigation, floor-plan tabs, gallery filters and lightbox, draggable 360° viewer, animated progress bars.
- Respects the visitor's "reduce motion" setting.
