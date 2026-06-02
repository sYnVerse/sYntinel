# [lucent.earth](https://lucent.earth)

Real-time 3D globe visualization of global service outages and infrastructure health.

![lucent-small](https://github.com/user-attachments/assets/43fcc3b1-2a4e-46a1-a759-88b6035b7921)

## Features

- **Interactive 3D Globe** — color-coded columns show service status at a glance
  - 🔴 **Down** — red columns, high altitude
  - 🟠 **Degraded** — orange columns, medium altitude
  - 🟢 **Operational** — green columns, low altitude
- **System Monitor Dashboard** — radar pulse status indicator, 24-hour uptime timeline grid, latency metrics, and live incident log feed
- **Outage Disaster Simulator** — trigger simulated global catastrophe scenarios:
  - ☀️ Solar Flare (global collapse)
  - 🌐 DNS Backbone Collapsed
  - ☁️ AWS Cloud Core Outage
- **Focus Mode** — full-screen system monitor dashboard with Pomodoro timer and ambient lo-fi music
- **API Integration** — supports [Pingdom](https://www.pingdom.com/) and [StatusGator](https://statusgator.com/) APIs, with a built-in simulation engine as fallback

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19, TypeScript |
| 3D Visualization | [globe.gl](https://globe.gl/) + Three.js |
| Backend / Edge | Cloudflare Workers |
| Styling | Vanilla CSS with glassmorphism & micro-animations |
| Fonts | JetBrains Mono, Outfit (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

Start the Angular dev server (proxies `/api` to Wrangler on port 8787):

```bash
npm start
```

In a separate terminal, start the Cloudflare Worker locally:

```bash
npx wrangler dev
```

### Production Build & Deploy

```bash
npm run deploy
```

This runs `ng build --configuration production` followed by `wrangler deploy`.

## API Configuration

The app works out of the box with its built-in simulation engine. To connect real monitoring APIs, add your tokens as Wrangler secrets:

```bash
npx wrangler secret put PINGDOM_API_TOKEN
npx wrangler secret put STATUSGATOR_API_TOKEN
```

When configured, the worker merges real API data with simulated services. Without tokens, all outage data is generated from the simulation engine.

## Project Structure

```
src/
├── workers.ts                          # Cloudflare Worker — /api/outages endpoint
├── app/
│   ├── app.component.*                 # Root component — focus mode, sidebar wiring
│   ├── outage.models.ts                # GlobeOutagePoint interface
│   ├── globe-map.models.ts             # Globe data types
│   ├── globe-view/                     # 3D globe (globe.gl + Three.js)
│   ├── outage-sidebar/                 # Sidebar — monitor widget, outage list, simulator
│   └── focus-pomodoro/                 # Pomodoro timer for focus mode
├── environments/
│   ├── environment.ts                  # Dev config
│   └── environment.production.ts       # Prod config
proxy.conf.json                         # Dev proxy → Wrangler
wrangler.jsonc                          # Cloudflare Workers config
```

## License

See repository for license details.
