# setup-and-run.ps1
# Lancer avec : powershell -ExecutionPolicy Bypass -File .\setup-and-run.ps1

$ErrorActionPreference = "Stop"

Write-Host "== SafeClick: setup & run =="

function Require-Cmd($cmd) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: '$cmd' n'est pas disponible dans le PATH." -ForegroundColor Red
    exit 1
  }
}

Require-Cmd "pnpm"
Require-Cmd "docker"

# 1) Vérifier Docker daemon
try {
  docker info | Out-Null
} catch {
  Write-Host "ERROR: Docker ne semble pas démarré. Ouvre Docker Desktop puis relance." -ForegroundColor Red
  exit 1
}

# 2) Installer dépendances
Write-Host "`n[1/7] Installation des dependances..."
pnpm install

# 3) Postgres Docker
$containerName = "safeclick-postgres"
$pgUser = "user"
$pgPass = "pass"
$pgDb   = "mon_site"
$pgPort = 5432

Write-Host "`n[2/7] Verification du container Postgres..."
$exists = (docker ps -a --format "{{.Names}}" | Select-String -SimpleMatch $containerName) -ne $null
if (-not $exists) {
  Write-Host "Container inexistant -> creation..."
  docker run --name $containerName `
    -e "POSTGRES_USER=$pgUser" `
    -e "POSTGRES_PASSWORD=$pgPass" `
    -e "POSTGRES_DB=$pgDb" `
    -p "$pgPort`:5432" `
    -d postgres:16 | Out-Null
} else {
  $running = (docker ps --format "{{.Names}}" | Select-String -SimpleMatch $containerName) -ne $null
  if (-not $running) {
    Write-Host "Container existe mais est arrete -> demarrage..."
    docker start $containerName | Out-Null
  } else {
    Write-Host "Container Postgres deja en cours d'execution."
  }
}

# 4) Créer .env si absent
Write-Host "`n[3/7] Verification du fichier .env..."
if (-not (Test-Path ".\.env")) {
  Write-Host "Aucun .env trouve -> creation d'un .env par defaut..."
  $secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  @"
DATABASE_URL="postgresql://$pgUser`:$pgPass@localhost:$pgPort/$pgDb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$secret"
"@ | Out-File -FilePath ".\.env" -Encoding utf8
} else {
  Write-Host ".env deja present (ok)."
}

# 5) Prisma generate + migrate
Write-Host "`n[4/7] Prisma generate..."
pnpm exec prisma generate

Write-Host "`n[5/7] Prisma migrate..."
pnpm exec prisma migrate dev --name init

Write-Host "`n[6/7] Seed de la base de donnees..."
node scripts/seed.js

# 6) Run dev
Write-Host "`n[7/7] Lancement du serveur..."
Write-Host "Ouvre ensuite http://localhost:3000"
pnpm dev
