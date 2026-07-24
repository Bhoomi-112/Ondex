#!/usr/bin/env bash
set -euo pipefail

cd apps/api

npx prisma db push
exec node dist/index.js
