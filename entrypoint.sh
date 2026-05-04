#!/bin/sh
set -e

export DATABASE_URL="file:/app/data/dev.db"

echo "DATABASE_URL is: $DATABASE_URL"
echo "Running Prisma migrations..."
npx prisma migrate deploy --config prisma.config.ts

echo "Starting server..."
exec node dist/server.js