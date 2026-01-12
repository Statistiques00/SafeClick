#!/usr/bin/env bash
set -e

command -v pnpm >/dev/null || { echo "pnpm manquant"; exit 1; }
command -v docker >/dev/null || { echo "docker manquant"; exit 1; }

docker info >/dev/null || { echo "Docker pas démarré (Docker Desktop)"; exit 1; }

pnpm install

NAME="safeclick-postgres"
USER="user"
PASS="pass"
DB="mon_site"
PORT="5432"

if ! docker ps -a --format '{{.Names}}' | grep -q "^$NAME$"; then
  docker run --name "$NAME" -e POSTGRES_USER="$USER" -e POSTGRES_PASSWORD="$PASS" -e POSTGRES_DB="$DB" -p "$PORT:5432" -d postgres:16
else
  docker start "$NAME" >/dev/null || true
fi

if [ ! -f .env ]; then
  SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  cat > .env <<EOF
DATABASE_URL="postgresql://$USER:$PASS@localhost:$PORT/$DB"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$SECRET"
EOF
fi

pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
node scripts/seed.js
pnpm dev