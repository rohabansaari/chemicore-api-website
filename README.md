# Chemi-Core API website

Marketing site for **Chemi-Core API**, a pharmaceutical indenting house in Lahore. It is built with [Astro](https://astro.build) as a fully static site. Every page is plain HTML, so it can be hosted on Vercel, Netlify, Cloudflare Pages or any ordinary web host.

## Pages

| Route        | File                       |
| ------------ | -------------------------- |
| `/`          | `src/pages/index.astro`    |
| `/about/`    | `src/pages/about.astro`    |
| `/services/` | `src/pages/services.astro` |
| `/mission/`  | `src/pages/mission.astro`  |
| `/products/` | `src/pages/products.astro` |
| `/contact/`  | `src/pages/contact.astro`  |

## Development

Requires Node 20 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs the static site to dist/
npm run preview   # serves dist/ locally
```

## Where things live

- `src/data/site.ts` holds the phone, email, WeChat, address and navigation.
- `src/data/products.ts` holds the product catalogue. **It is placeholder data**, so replace it with the confirmed product list before launch.
- `src/layouts/Base.astro` holds the shared head, header, footer, page wipe, enquiry tray and WhatsApp button.
- `src/styles/global.css` holds all styles. Brand colours are tokens at the top: navy `#002156` and azure `#0080DD`.
- `src/scripts/main.js` holds the site-wide behaviour: page transitions, scroll reveals, smooth scroll, the enquiry basket, the product filter, the map zoom and the contact form.
- `src/scripts/molecule.js` draws the interactive 3D molecule in the home hero.

## Enquiry form

Set `PUBLIC_FORM_ENDPOINT` (see `.env.example`) to a URL that accepts a JSON `POST`, such as a Formspree form. When it is not set, **Send enquiry** opens WhatsApp with the enquiry pre-filled.

Materials that visitors add with **+** on the Products page are kept in the visitor's browser (`localStorage`). They are included with the enquiry.

## Notes

- On screens 1024 px and wider the whole site renders at 80% scale (`html { zoom: .8 }` in `global.css`), as approved in the design review.
- The supply-route map on the home page is illustrative. Update the origins in `src/pages/index.astro` to match actual suppliers.
