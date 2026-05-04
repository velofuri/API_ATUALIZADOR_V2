#!/bin/sh
set -e

export DATABASE_URL="file:/app/data/dev.db"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec node dist/server.js