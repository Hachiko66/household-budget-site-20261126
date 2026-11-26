// HomeLedger hand-in program (Node 22, standard library only).
//
// It copies this repository's app/ and screenshots/ into the output
// directory and writes /output/dossier.json with the vendored make.fun
// library, so the judge can read the site, its first-load size and its
// screenshots. vendor/makefun-frontend.ts must stay exactly as the kit
// shipped it: the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The output directory is emptied by removing its children one by one,
// never by deleting the directory itself: the grader creates /output
// before this program runs, and removing it would break the hand-in.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function emptyDirectory(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

emptyDirectory(outDir);
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Caps from the scorer's reference (gate.json): the dossier text is
// capped at 160 KiB; at most 4 screenshots of 256 KiB each; app/ holds
// at most 993 files and directories and 16 MiB in all.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
