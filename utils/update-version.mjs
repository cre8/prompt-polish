import {readFileSync, writeFileSync} from 'fs';

// updates the version in manifest.json, required for the release process
const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
manifest.version = process.argv[2];
writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2));
