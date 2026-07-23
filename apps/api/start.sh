#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

npx prisma migrate deploy
exec node dist/index.js
