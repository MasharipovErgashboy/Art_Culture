#!/bin/bash

echo "🧹 Cleaning Next.js build artifacts..."

# Remove .next directory
if [ -d ".next" ]; then
  rm -rf .next
  echo "✅ Removed .next directory"
fi

# Remove node_modules
if [ -d "node_modules" ]; then
  rm -rf node_modules
  echo "✅ Removed node_modules directory"
fi

# Remove package lock files
if [ -f "package-lock.json" ]; then
  rm package-lock.json
  echo "✅ Removed package-lock.json"
fi

if [ -f "pnpm-lock.yaml" ]; then
  rm pnpm-lock.yaml
  echo "✅ Removed pnpm-lock.yaml"
fi

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting development server..."
npm run dev
