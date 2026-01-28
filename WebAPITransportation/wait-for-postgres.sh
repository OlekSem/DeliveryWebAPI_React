#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -U "$POSTGRES_USER"; do
  echo "Waiting for Postgres at $host..."
  sleep 2
done

echo "Applying EF Core migrations..."
dotnet ef database update --project /app/WebAPITransportation.dll

echo "Starting server..."
exec $cmd
