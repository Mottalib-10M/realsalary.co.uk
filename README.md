# Real Salary — realsalary.co.uk

Free UK salary, tax, and finance calculators. Updated for the 2026/27 tax year.

## Tech Stack

- **Framework:** Astro 6 (static site generation)
- **Styling:** Tailwind CSS v4
- **Interactive components:** React 19 (islands architecture)
- **Language:** TypeScript (strict mode)
- **Testing:** Vitest
- **Deployment:** Cloudflare Pages

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

Requires Node.js 22+.

## Project Structure

```
src/
├── components/
│   ├── calculators/     # React calculator components (interactive islands)
│   ├── layout/          # Header, Footer (Astro components)
│   └── ui/              # Shared UI: InputField, ResultPanel, BreakdownBar, etc.
├── data/
│   ├── tax-rules-2026-27.ts   # THE source of truth for all tax rates
│   ├── calculator-meta.ts     # Page titles, descriptions, FAQs
│   └── related-calculators.ts # Internal linking map
├── layouts/
│   ├── CalculatorLayout.astro # Layout for calculator pages
│   └── GuideLayout.astro      # Layout for guide/content pages
├── lib/
│   ├── uk-tax-engine.ts       # Pure tax calculation functions
│   ├── uk-tax-engine.test.ts  # Unit tests (40 tests)
│   ├── url-state.ts           # URL query param encoding/decoding
│   ├── format.ts              # Currency/number formatting
│   └── seo.ts                 # SEO utilities and schema generators
├── pages/                     # All routes (Astro file-based routing)
│   ├── index.astro            # / — Main salary calculator
│   ├── take-home-pay.astro    # /take-home-pay
│   ├── hourly-rate.astro      # /hourly-rate
│   ├── pro-rata.astro         # /pro-rata
│   ├── income-tax.astro       # /income-tax
│   ├── national-insurance.astro
│   ├── student-loan.astro
│   ├── pension-contribution.astro
│   ├── bonus.astro
│   ├── required-salary.astro
│   ├── two-jobs.astro
│   ├── guides/                # Guide pages
│   ├── about.astro
│   ├── contact.astro
│   ├── privacy.astro
│   └── terms.astro
└── styles/
    └── global.css             # Tailwind imports + design tokens
```

## How to Update Tax Rules for a New Tax Year

1. Create a new file: `src/data/tax-rules-YYYY-YY.ts`
2. Copy the structure from the current file
3. Update all rates and thresholds from gov.uk
4. Update the import in `src/lib/uk-tax-engine.ts`
5. Update references in `src/data/calculator-meta.ts` (the `TAX_YEAR` export auto-propagates)
6. Run tests: `npm test`
7. Build and verify: `npm run build`

The tax engine is designed so that updating one data file updates all calculators.

## How to Add a New Calculator

1. Create the React component in `src/components/calculators/NewCalculator.tsx`
   - Use `readUrlParams` / `writeUrlParams` for URL state
   - Import calculation functions from `uk-tax-engine.ts`
   - Use shared UI components: `InputField`, `ResultPanel`, `BreakdownBar`
2. Add page metadata in `src/data/calculator-meta.ts`
3. Add related calculator links in `src/data/related-calculators.ts`
4. Create the Astro page in `src/pages/new-calculator.astro`
5. Add the page to the nav in `src/components/layout/Header.astro`
6. Add the page to the footer in `src/components/layout/Footer.astro`

## How to Deploy to Cloudflare Pages

1. Push the repository to GitHub
2. In the Cloudflare dashboard, create a new Pages project
3. Connect your GitHub repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 22 (set in Environment variables: `NODE_VERSION=22`)
5. Deploy

Custom domain setup:
- Add `realsalary.co.uk` as a custom domain in Cloudflare Pages
- Update DNS to point to Cloudflare Pages

## Calculators (V1)

| Calculator | URL | Description |
|---|---|---|
| Salary Calculator | `/` | Main calculator with all options |
| Take-Home Pay | `/take-home-pay` | Full breakdown of net pay |
| Hourly Rate | `/hourly-rate` | Annual to hourly conversion |
| Pro-Rata | `/pro-rata` | Part-time salary calculation |
| Income Tax | `/income-tax` | Tax band-by-band breakdown |
| National Insurance | `/national-insurance` | NI contributions |
| Student Loan | `/student-loan` | Plans 1, 2, 4, 5 and Postgrad |
| Pension | `/pension-contribution` | Sacrifice vs relief at source |
| Bonus | `/bonus` | Tax on a one-off bonus |
| Required Salary | `/required-salary` | Reverse: gross from target net |
| Two Jobs | `/two-jobs` | Combined tax across two employers |

## SEO

- Unique `<title>` and `<meta description>` per page
- Schema.org: `WebApplication`, `FAQPage`, `BreadcrumbList`
- Auto-generated `sitemap.xml`
- `robots.txt` configured
- Open Graph and Twitter Card meta tags
- Canonical URLs

## Key Design Decisions

- **All calculations in the browser.** No server, no API, no data sent anywhere.
- **URL state encoding.** Every calculator state is encoded in URL params for sharing and bookmarking.
- **Single source of truth for tax rates.** One file (`tax-rules-2026-27.ts`) controls all calculations.
- **React islands.** Only calculator components use React; everything else is static Astro HTML.
- **Dark mode.** Auto-detected via `prefers-color-scheme`.
