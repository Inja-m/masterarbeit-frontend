# Co-Track Frontend

**Co-Track** ist ein Frontend zur Unterstützung und Dokumentation von Co-Design Workshops. Es ermöglicht die transparente und strukturierte Auswertung von Workshop-Daten und legt dabei besonderen Wert auf **Nachvollziehbarkeit** und **Verantwortung** im Umgang mit sensiblen Informationen.
Zusätzlich wird das Co-Track Backend benötigt!

## ✨ Features

- Darstellung und Auswertung von Workshop-Ergebnissen
- Unterstützung mehrerer Workshop-Serien
- Visualisierung von Materialien (Bilder, Texte, Links)
- Rollenbasiertes Login

## Verwendete Technologien

| Technologie                | Beschreibung |
|----------------------------|--------------|
| [**Nuxt 4**](https://nuxt.com) | Modernes Vue Fullstack Framework mit SSR/SSG/SPA-Unterstützung. |
| [**Vue 3**](https://vuejs.org) + [**Vue Router 4**](https://router.vuejs.org) | Reaktive UI-Entwicklung mit der Composition API und Routing. |
| [**TypeScript**](https://www.typescriptlang.org) | Statisch typisiertes JavaScript für bessere Wartbarkeit und DX. |
| [**@nuxt/ui**](https://ui.nuxt.com) | Tailwind-basierte UI-Komponenten mit Designsystem. |
| [**@nuxt/content**](https://content.nuxt.com) | Verwaltung & Rendering von Markdown- und JSON-Inhalten. |
| [**@nuxt/image**](https://image.nuxt.com) | Automatische Bildoptimierung und Responsive Support. |
| [**@vite-pwa/nuxt**](https://vite-pwa-org.netlify.app/frameworks/nuxt.html) | PWA-Unterstützung mit Vite & Nuxt. |
| [**@nuxtjs/strapi**](https://strapi.nuxtjs.org) | Integration von Strapi CMS als Headless Backend. |
| [**Lucide Icons**](https://lucide.dev) (`lucide-vue-next`) | Moderne, schlanke Open-Source Icons. |
| [**Marked**](https://marked.js.org) | Schnelles Markdown-to-HTML Parsing für Content-Rendering. |
| [**date-fns**](https://date-fns.org) + [**date-fns-tz**](https://github.com/marnusw/date-fns-tz) | Zeit- und Datumsmanipulation inkl. Zeitzonen. |
| [**better-sqlite3**](https://github.com/WiseLibs/better-sqlite3) | Performante SQLite-Anbindung für evtl. lokale Speicherung. |
| [**ESLint**](https://eslint.org) | Statische Codeanalyse mit Nuxt/Vue-Integration. |

## Projekt-Setup
Schauen Sie sich die [Nuxt-Dokumentation](https://nuxt.com/docs/getting-started/introduction) an, um mehr zu erfahren.

###  Einrichtung
Stellen Sie sicher, dass Sie die Abhängigkeiten installieren:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Entwicklungsserver

Starten Sie den Entwicklungsserver auf `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Produktion

Erstellen Sie die Anwendung für die Produktion:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Lokale Vorschau für die Produktion:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

### Umgebungsvariablen 

Erstelle eine .env Datei in der Projektwurzel basierend auf der mitgelieferten .env.example.
