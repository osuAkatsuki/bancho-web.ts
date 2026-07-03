# bancho-web

A clean, modern web frontend for [bancho.py](https://github.com/osuAkatsuki/bancho.py),
built with React + TypeScript. It's a read-only SPA driven entirely by
bancho.py's **v2 api** — no database access, no server-side rendering.

![](https://img.shields.io/badge/react-18-61dafb) ![](https://img.shields.io/badge/typescript-5-3178c6) ![](https://img.shields.io/badge/tailwindcss-3-38bdf8)

## Features

- **Registration & sign in** — website account creation (backed by bancho.py's
  v2 accounts/sessions apis) with optional captcha (reCAPTCHA, hCaptcha or
  Turnstile); important since bancho.py disables in-game registration by default
- **Home** — server stats (online/registered players) & "how to connect" guide
- **Leaderboards** — per-mode rankings (vanilla/relax/autopilot) with
  performance/score/accuracy/playcount sorts, country filtering, avatars,
  clan tags & pagination
- **Player profiles** — per-mode stats with global/country ranks, level bar,
  grade counts, userpage, live "now playing" status, best/recent scores and
  most played maps with beatmap thumbnails
- **Beatmap pages** — map info with cover art, difficulty stats, and per-mode
  leaderboards with grades, mods & FC markers
- **Clans** — clan listing & clan pages with member roles
- **Player search** — debounced live search in the navbar

## Stack

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Build     | [Vite 5](https://vitejs.dev)                  |
| UI        | React 18 + TypeScript (strict)                |
| Styling   | Tailwind CSS 3                                |
| Routing   | React Router 6                                |
| Data      | TanStack Query 5 (caching, retries, refetch)  |

## Development

You'll need Node.js 18+ and a bancho.py instance to talk to.

```bash
npm install
npm run dev        # http://localhost:5173
```

bancho.py routes its api by Host header (`api.{DOMAIN}`), so the dev server
proxies `/api/*` to your local instance with the Host header rewritten.
Configure via `.env` (see `.env.example`):

```bash
BANCHO_API_TARGET=http://127.0.0.1:10000  # where bancho.py listens
BANCHO_DOMAIN=cmyui.xyz                   # builds the api.{DOMAIN} Host header
```

Other scripts:

```bash
npm run build      # typecheck + production build into dist/
npm run typecheck  # typecheck only
npm run preview    # serve the production build locally
```

## Configuration

All `VITE_*` variables are baked in at build time (see `.env.example`):

| Variable                | Purpose                                | Default             |
| ----------------------- | -------------------------------------- | ------------------- |
| `VITE_APP_NAME`         | Server name shown in navbar & titles   | `bancho.py`         |
| `VITE_BANCHO_DOMAIN`    | Domain in "how to connect" instructions | `cmyui.xyz`        |
| `VITE_API_BASE_URL`     | Base url for api requests              | `/api`              |
| `VITE_AVATARS_BASE_URL` | Base url for avatars (`a.{DOMAIN}`)    | `https://a.cmyui.xyz` |

## Deployment

Build the static bundle and serve `dist/` from any web server. The SPA needs:

1. **History fallback** — unknown paths must serve `index.html`
2. **An api origin** — either set `VITE_API_BASE_URL=https://api.your.domain`
   (requires CORS headers on that origin), or keep the default `/api` and
   proxy it to bancho.py — no CORS needed since everything stays same-origin:

```nginx
server {
    server_name osu.example.com;

    location / {
        root /srv/bancho-web/dist;
        try_files $uri /index.html;
    }

    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:10000;
        proxy_set_header Host api.example.com;
        # bancho.py resolves client ips from these headers
        # (used for geolocation during account registration)
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Project structure

```
src/
├── lib/
│   ├── api/          # typed api client (http envelope, types, endpoints)
│   ├── gamemodes.ts  # mode ids <-> vanilla/relax/autopilot helpers
│   ├── mods.ts       # mod bitmask -> acronyms
│   ├── grades.ts     # grade display (XH/X/SH/S/A/...)
│   ├── rankedStatus.ts
│   ├── format.ts     # numbers, accuracy, playtime, relative time
│   └── assets.ts     # avatar/cover/flag url builders
├── components/       # shared components (Navbar, ModeSwitcher, badges, ...)
└── pages/            # one component per route
```

To consume a new api endpoint: add its response shape to `lib/api/types.ts`,
a fetcher to `lib/api/client.ts`, then use it with `useQuery` in a component.

## External assets

- **Avatars** are served by your bancho.py deployment (`a.{DOMAIN}`), with a
  built-in placeholder fallback.
- **Beatmap covers/thumbnails** load from osu!'s public cdn
  (`assets.ppy.sh` / `b.ppy.sh`) by set id.
- **Country flags** load from [flagcdn.com](https://flagcdn.com).
