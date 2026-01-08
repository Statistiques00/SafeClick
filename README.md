# SafeClick 🚀

SafeClick est une application web développée avec **Next.js**, utilisant une base de données **PostgreSQL**, **Prisma** comme ORM et **NextAuth** pour l’authentification (inscription / connexion / pages protégées).

Le projet fonctionne **entièrement en local**.

---

## 🧰 Technologies utilisées

- **Node.js** (v20 LTS)
- **pnpm**
- **Next.js** (App Router)
- **Tailwind CSS v4**
- **PostgreSQL**
- **Prisma**
- **NextAuth (Credentials)**
- **Docker** (optionnel)
- **Git / GitHub**

---

## ✅ Prérequis

### 1️⃣ Installer Node.js
- Installer **Node.js LTS 20.x** depuis https://nodejs.org
- Vérifier :
```bash
node -v
npm -v
```

### 2️⃣ Installer pnpm
```npm install -g pnpm
pnpm -v```
- Vérifier :
```bash
pnpm -v*
```

### 3️⃣ Installer Git (recommandé)
```
https://git-scm.com/
```

- Vérifier :

git --version

## 📦 Installation du projet

### 1️⃣ Cloner le dépôt
```
git clone https://github.com/Statistiques00/SafeClick.git
cd SafeClick
```

### 2️⃣ Installer les dépendances

```bash
pnpm install

```

## 🐘 Base de données PostgreSQL

## 1️⃣ Installer Docker Desktop

```bash
https://www.docker.com/products/docker-desktop/
```

### 2️⃣ Lancer PostgreSQL

```bash
docker run --name safeclick-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_DB=mon_site \
  -p 5432:5432 \
  -d postgres:16
```

### Vérifier

```bash
docker ps
```

## 🧬 Prisma (OBLIGATOIRE)

### 1️⃣ Générer Prisma Client

```bash
pnpm exec prisma generate
```

### 2️⃣ Appliquer les migrations

```bash
pnpm exec prisma migrate dev --name init
```

## ▶️ Lancer le projet

```bash
pnpm dev
```


### ▶️ Lancer le script

# Dans PowerShell, à la racine du projet :

```bash
https://www.docker.com/products/docker-desktop/
```

```bash
https://pnpm.io/fr/installation
```

## Installer Requis avant de lancer le script


```bash
powershell -ExecutionPolicy Bypass -File .\setup-and-run.ps1
```