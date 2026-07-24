# LEBox

The site for **LEBox**, a Minecraft box server. Server address: `LEBox.aternos.me`

Plain HTML, CSS and JS. No build step, no dependencies.

## Run it

Open `home.html` in a browser and that's it. To view it through a local
server instead (handy if anything acts up over `file://`), serve the folder
with any static file server and open the page it gives you.

## Editing

- **Tagline**: the line under the title in `home.html`, marked `EDIT ME`.
- **Discord link**: there's a commented-out spot in the "get on" section of
  `home.html`. Uncomment it and paste your invite.
- **Screenshots**: they live in `images/`. Swap any file for a new one under
  the same name and the site picks it up.

## Live status

The "online / asleep" pill under the address pulls real data from the public
mcsrvstat.us API. If it can't reach it, it says "status unavailable" instead
of guessing. Aternos servers sleep when nobody's on, so "asleep" is normal.

## Putting it online

It's all static, so anything works: drag the folder onto Netlify Drop, use
GitHub Pages, whatever.

One catch with GitHub Pages: it serves `index.html` at the root by default,
and this site's main file is `home.html`. So either open `.../home.html`
directly, or add a tiny `index.html` that redirects to `home.html`.

Not affiliated with Mojang or Microsoft.
