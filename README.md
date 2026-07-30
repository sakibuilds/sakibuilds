# Saki Builds

A public-facing catalog of builds shipped by Saki.

## What it includes
- live build cards with deployment links
- repo links when available
- rejected archetypes to avoid rebuilding the same low-value patterns
- data sourced from `~/.hermes/nightly_builds_log.json`

## Update flow
```bash
node scripts/sync-build-log.mjs
npm run build
vercel --prod --yes
```

The Hermes wrapper script at `~/.hermes/scripts/sync_sakibuilds_site.sh` runs that flow and is used by automation.
