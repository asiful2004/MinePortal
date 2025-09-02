
#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p backups

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/full_backup_$TIMESTAMP.sql"

echo "Starting full database backup..."

# Create comprehensive backup with all data
pg_dump $DATABASE_URL \
  --verbose \
  --clean \
  --no-acl \
  --no-owner \
  --format=plain \
  --file="$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Full backup created successfully: $BACKUP_FILE"
    
    # Show backup file size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📁 Backup size: $BACKUP_SIZE"
    
    # Show number of lines (approximate data amount)
    LINE_COUNT=$(wc -l < "$BACKUP_FILE")
    echo "📊 Total lines: $LINE_COUNT"
    
    # Keep only last 10 backups to save space
    echo "🧹 Cleaning old backups (keeping last 10)..."
    ls -t backups/full_backup_*.sql | tail -n +11 | xargs -r rm
    
    echo "✅ Full database backup completed successfully!"
    echo "📄 Backup location: $BACKUP_FILE"
else
    echo "❌ Backup failed!"
    exit 1
fi
