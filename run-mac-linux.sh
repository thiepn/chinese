#!/bin/sh
cd "$(dirname "$0")" || exit 1
command -v node >/dev/null 2>&1 || { echo 'Node.js 20+ is required.'; exit 1; }
echo 'Character Study: http://127.0.0.1:4173/'
exec node scripts/serve.mjs
