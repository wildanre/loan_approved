#!/usr/bin/env bash
set -euo pipefail

SSH_TARGET="${SSH_TARGET:-gcloud}"
REMOTE_DIR="${REMOTE_DIR:-/home/wildanwae354/apps/loansight}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Deploying LoanSight backend to ${SSH_TARGET}:${REMOTE_DIR}"

ssh "${SSH_TARGET}" "mkdir -p '${REMOTE_DIR}'"

tar \
  --exclude='backend/.venv' \
  --exclude='backend/__pycache__' \
  --exclude='backend/**/__pycache__' \
  --exclude='backend/*.db' \
  --exclude='backend/data' \
  --exclude='frontend/node_modules' \
  --exclude='frontend/dist' \
  -C "${PROJECT_ROOT}" \
  -czf - backend docker-compose.yml README.md \
  | ssh "${SSH_TARGET}" "tar -xzf - -C '${REMOTE_DIR}'"

ssh "${SSH_TARGET}" "cd '${REMOTE_DIR}' && docker compose up -d --build --remove-orphans"

echo "Checking health..."
ssh "${SSH_TARGET}" "curl -fsS http://127.0.0.1:3001/api/health"

echo
echo "Done."
echo "Direct API:  http://api-loansight.staifdev.codes:3001/api"
echo "HTTPS API:  https://api-loansight.staifdev.codes/api"
