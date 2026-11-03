#!/bin/bash
# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — DAILY AUTOMATED BACKUP CRON JOB
# Recommended location: /etc/cron.daily/cambium-backup
# Document ID: CRON-BACKUP-CAMBIUM-2026-V2
# ==============================================================================

set -eo pipefail

APP_DIR="${CAMBIUM_DIR:-/var/www/cambium}"
LOG_FILE="/var/log/cambium-backup.log"

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting Cambium daily automated database snapshot..." >> "$LOG_FILE"

cd "$APP_DIR" || exit 1

# Execute node backup script
if command -v node >/dev/null 2>&1; then
    node scripts/backup-db.mjs >> "$LOG_FILE" 2>&1
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup script completed successfully." >> "$LOG_FILE"
else
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Error: Node.js runtime not found on PATH." >> "$LOG_FILE"
    exit 1
fi

