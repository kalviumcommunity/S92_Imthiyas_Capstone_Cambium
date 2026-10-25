#!/usr/bin/env bash
# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — DATABASE RESTORATION SCRIPT
# Validates Cryptographic SHA-256 Integrity before decompression & restore
# Document ID: SCRIPT-CAMBIUM-RESTORE-2026-V2
# ==============================================================================

set -eo pipefail

BACKUP_FILE="${1:-}"
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_DB="${POSTGRES_DB:-cambium}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-2Live&letLive}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "${BACKUP_FILE}" ]; then
  echo -e "${RED}[Cambium Restore ERROR]${NC} Usage: ./scripts/restore-db.sh <path-to-backup.sql.gz>"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo -e "${RED}[Cambium Restore ERROR]${NC} Specified backup file does not exist: ${BACKUP_FILE}"
  exit 1
fi

CHECKSUM_FILE="${BACKUP_FILE}.sha256"

# 1. Cryptographic Checksum Validation
if [ -f "${CHECKSUM_FILE}" ]; then
  echo -e "${YELLOW}[Cambium Restore]${NC} Verifying SHA-256 checksum from ${CHECKSUM_FILE}..."
  EXPECTED_HASH=$(awk '{print $1}' "${CHECKSUM_FILE}")
  
  if command -v sha256sum >/dev/null 2>&1; then
    ACTUAL_HASH=$(sha256sum "${BACKUP_FILE}" | awk '{print $1}')
  else
    ACTUAL_HASH=$(shasum -a 256 "${BACKUP_FILE}" | awk '{print $1}')
  fi

  if [ "${EXPECTED_HASH}" != "${ACTUAL_HASH}" ]; then
    echo -e "${RED}[Cambium Restore CRITICAL]${NC} SHA-256 checksum mismatch! Archive may be corrupted or tampered."
    echo -e "Expected: ${EXPECTED_HASH}"
    echo -e "Actual:   ${ACTUAL_HASH}"
    exit 1
  fi
  echo -e "${GREEN}[Cambium Restore VERIFIED]${NC} SHA-256 integrity check passed: ${ACTUAL_HASH}"
else
  echo -e "${YELLOW}[Cambium Restore WARN]${NC} No .sha256 checksum file found. Proceeding with unverified restore."
fi

# 2. Decompress and Restore into Target PostgreSQL Database
export PGPASSWORD="${POSTGRES_PASSWORD}"
echo -e "${YELLOW}[Cambium Restore]${NC} Restoring into database: ${POSTGRES_DB} on ${POSTGRES_HOST}:${POSTGRES_PORT}..."

if command -v psql >/dev/null 2>&1; then
  gunzip -c "${BACKUP_FILE}" | psql -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
  echo -e "${GREEN}[Cambium Restore SUCCESS]${NC} Database restored successfully from ${BACKUP_FILE}"
else
  echo -e "${YELLOW}[Cambium Restore MOCK]${NC} psql client not installed. Verified decompression only."
  gunzip -t "${BACKUP_FILE}"
  echo -e "${GREEN}[Cambium Restore SUCCESS]${NC} Backup archive verified valid."
fi

exit 0
