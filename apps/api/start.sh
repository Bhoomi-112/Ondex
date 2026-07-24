#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

npx prisma db push
exec node dist/index.js
