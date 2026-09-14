# abhisheknannuri

Personal site: a homepage, and a set of technical notes built around the
architecture diagrams from my master's thesis.

Hugo + [Hextra](https://github.com/imfing/hextra). No Node, no bundler.

## Running it — Docker (recommended)

Nothing is installed on the host, and the Hugo version is pinned to the exact
one CI deploys with.

```bash
docker compose up serve            # http://localhost:1313
docker compose run --rm build      # writes ./public
```

First run builds the image (~40 s). After that it starts instantly. Stop the
server with `Ctrl+C`, or `docker compose down`.

**Do not run `serve` and `build` at the same time.** Both mount the same source
tree and both write Hugo's `resources/` cache, so running them concurrently can
leave a half-generated stylesheet — the page renders with no CSS and no error.
If that happens: `docker compose down && rm -rf resources public`, then start
one of them.

Edits on the host are picked up live — the container polls the mount
(`--poll 700ms`), because inotify events don't cross a bind mount reliably.

Both services are the same image with a different command. The shared settings
live in one YAML anchor at the top of `docker-compose.yml` rather than being
duplicated per service.

### One-time setup

Compose reads `.env` to learn which uid to run the container as:

```bash
printf 'HOST_UID=%s\nHOST_GID=%s\n' "$(id -u)" "$(id -g)" > .env
```

This is not cosmetic. Hugo writes `public/` straight into the bind-mounted
source tree. As root those files land `root:root` **in your working tree**, and
a later native `hugo` run then fails to overwrite them — you would need `sudo`
just to clean up. Running as your uid keeps the tree yours.

`.env` is gitignored because the uid is machine-specific, so regenerate it after
cloning. Without it Compose falls back to uid 1000, which is right on a typical
single-user laptop but wrong on this machine (your uid is six digits).

### Building the image

After cloning, and again after changing `.hugo-version` or the `Dockerfile`:

```bash
docker compose build
```

The build needs network access — Hextra fetches FlexSearch from a CDN at site
build time, so this does not work fully offline.

The `Dockerfile` is deliberately a single stage with one long `RUN`. A later
`RUN` cannot shrink an earlier layer, so the Hugo `.deb` must be downloaded,
installed and deleted in the same command or its 22 MB stays in the image. A
multi-stage build is *worse* here for that same reason: `COPY`ing the `.deb` in
from a fetch stage creates a layer that permanently holds it — measured at
255 MB versus 231 MB single-stage.

## Running it — Hugo installed directly

Hugo **extended**, version **0.146 or newer**. Hextra compiles SCSS, which the
non-extended build cannot do, and uses template features added in 0.146.

> **`apt install hugo` does not work.** Ubuntu 22.04 ships Hugo 0.92.2 — far
> below the minimum, and not the extended build. The site fails to build.

```bash
sudo snap install hugo     # extended, currently 0.165.x
hugo version               # must show >= 0.146 and "+extended"
```

To match the deployed version exactly, use the official `.deb` instead:

```bash
V=$(cat .hugo-version)
curl -sLO "https://github.com/gohugoio/hugo/releases/download/v${V}/hugo_extended_${V}_linux-amd64.deb"
sudo dpkg -i "hugo_extended_${V}_linux-amd64.deb"
```

Then:

```bash
hugo server --baseURL http://localhost:1313/ --appendPort=false
hugo --minify              # build into ./public
```

The `--baseURL` flag matters. Without it the server inherits `baseURL` from
`hugo.yaml`, which points at the GitHub Pages subpath — every stylesheet and
script then requests `/abhisheknannuri/...` while the server roots at `/`, and
you get an **unstyled page with no error message**. If that happens, view-source
and check the `<link>` tags: they should read `/css/...`, not
`/abhisheknannuri/css/...`. The Docker route sets this flag for you.

## Hugo version

Pinned in [`.hugo-version`](.hugo-version). The CI workflow reads that file, and
the `Dockerfile`/`docker-compose.yml` pass the same value as a build arg — so
local and deployed builds use identical Hugo. To upgrade: edit `.hugo-version`,
update the two `HUGO_VERSION` values in `docker-compose.yml`, then
`docker compose build`.

## Regenerating the diagrams

The diagrams in `static/diagrams/` are rendered from the TikZ sources in the
thesis repo — they are **not** edited here. To rebuild them after changing a
figure in the thesis:

```bash
THESIS=../../Thesis-Docs/.../MasterThesisReport/figures

tools/tikz2svg.sh "$THESIS/chapter2_background"   static/diagrams/chapter2_background
tools/tikz2svg.sh "$THESIS/chapter3_related_work" static/diagrams/chapter3_related_work
tools/tikz2svg.sh "$THESIS/chapter4_methodology"  static/diagrams/chapter4_methodology
```

Requires `texlive` (with `standalone`, `tikz`, `pgf`) and `dvisvgm`.

The script compiles each figure on its own, so thesis-only macros are stubbed:
`\acs`/`\ac` resolve to the acronym's short form (which is what a figure label
wants), `\num` passes through, `\resizebox` renders at natural size, and
`\Cref`/`\cref` become a plain "ref." — a cross-reference has no meaning outside
the thesis. **Figures containing a `\Cref` are worth checking by eye** after a
rebuild; where the reference carried real information I replaced it with a
literal label in the source.

## Adding a note

Drop a Markdown file into the right section under `content/notes/`. Front matter
needs a `title` and a `weight` (ordering within the sidebar):

```markdown
---
title: RLPD
weight: 5
---

{{< diagram
    src="chapter2_background/rlpd_arch_vertical.svg"
    alt="Describe what the diagram shows, for screen readers."
    caption="Short caption." >}}
```

The `diagram` shortcode puts the figure on a light plate (these are line
drawings made for white paper, so they aren't recoloured in dark mode), lets
wide diagrams scroll instead of shrinking, and appends the licence line.

A new top-level section needs a directory with an `_index.md` carrying a
`title` and `weight`, plus a card in `content/notes/_index.md`.

## Publishing

`.github/workflows/deploy.yml` builds and deploys on push to `main`. It uses
GitHub's native Pages deployment, so set **Settings → Pages → Source** to
**GitHub Actions** (not "Deploy from a branch").

`baseURL` in `hugo.yaml` is only used for local builds — CI passes the real one.
If you rename this repo to `abhi-0212000.github.io`, the site moves from
`abhi-0212000.github.io/abhisheknannuri/` to `abhi-0212000.github.io/` and
nothing else needs changing.

## Licence

Mixed — see [LICENSE](LICENSE) and `/license/` on the site.

| What | Licence |
|---|---|
| Hugo templates, styles, `tools/` | MIT |
| `content/**`, `static/diagrams/**` | CC BY-NC 4.0 |
| `static/media/**` (robot footage) | BMW, all rights reserved |
