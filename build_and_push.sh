#!/bin/bash
set -e

PLATFORMS="linux/amd64,linux/arm64"

echo "Building and pushing React client..."
cd transportation-reactts

docker buildx build \
  --platform $PLATFORMS \
  --build-arg VITE_API_BASE_URL=https://api.oleksem.itstep.click \
  -t semeniukoleksandr/transfer-react:latest \
  --push .

echo "Done ---client---!"

echo "Building and pushing API..."
cd ../WebAPITransportation

docker buildx build \
  --platform $PLATFORMS \
  -t semeniukoleksandr/transfer-api:latest \
  --push .

echo "Done ---api---!"
