@echo off
echo 🧹 Cleaning Next.js build artifacts...

if exist .next (
  rmdir /s /q .next
  echo ✅ Removed .next directory
)

if exist node_modules (
  rmdir /s /q node_modules
  echo ✅ Removed node_modules directory
)

if exist package-lock.json (
  del package-lock.json
  echo ✅ Removed package-lock.json
)

if exist pnpm-lock.yaml (
  del pnpm-lock.yaml
  echo ✅ Removed pnpm-lock.yaml
)

echo 📦 Installing dependencies...
npm install

echo 🚀 Starting development server...
npm run dev
