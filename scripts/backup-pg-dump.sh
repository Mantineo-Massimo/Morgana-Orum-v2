#!/bin/bash

# Load environment variables from .env
if [ -f .env ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ ! "$line" =~ ^# ]] && [[ "$line" =~ = ]]; then
      # Extract key and value
      key=$(echo "$line" | cut -d'=' -f1 | xargs)
      value=$(echo "$line" | cut -d'=' -f2- | xargs)
      # Strip surrounding quotes if present
      value="${value#\"}"
      value="${value%\"}"
      value="${value#\'}"
      value="${value%\'}"
      export "$key"="$value"
    fi
  done < .env
fi

# Select direct or non-pooling URL if available, as they bypass connection poolers (e.g. pgbouncer)
DB_URL=""
if [ -n "$DIRECT_URL" ]; then
  DB_URL="$DIRECT_URL"
elif [ -n "$POSTGRES_URL_NON_POOLING" ]; then
  DB_URL="$POSTGRES_URL_NON_POOLING"
elif [ -n "$DATABASE_URL" ]; then
  DB_URL="$DATABASE_URL"
elif [ -n "$POSTGRES_PRISMA_URL" ]; then
  DB_URL="$POSTGRES_PRISMA_URL"
fi

if [ -z "$DB_URL" ]; then
  echo "❌ Errore: Nessuna stringa di connessione al database trovata nel file .env!"
  exit 1
fi

# Rimuove il parametro pgbouncer dalla stringa di connessione prima di eseguire pg_dump
DB_URL=$(echo "$DB_URL" | sed -E 's/([?&])pgbouncer=[^&]*&?/\1/g' | sed 's/[?&]$//g' | sed 's/?&/?/g')

# Create backups directory if it doesn't exist
mkdir -p backups

# Set backup file name with timestamp
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="backups/db_backup_$DATE.sql"

echo "🔄 Avvio del backup PostgreSQL tramite pg_dump..."

# Run pg_dump
if pg_dump "$DB_URL" -F p -b -v -f "$BACKUP_FILE"; then
  echo "✅ Backup completato con successo!"
  echo "💾 File salvato in: $BACKUP_FILE"
  
  # Compress the backup file to save space
  gzip "$BACKUP_FILE"
  echo "📦 Compresso in: ${BACKUP_FILE}.gz"
else
  echo "❌ Errore durante l'esecuzione di pg_dump."
  echo "💡 Assicurati che 'pg_dump' sia installato sul tuo sistema e che le credenziali in .env siano corrette."
  exit 1
fi
