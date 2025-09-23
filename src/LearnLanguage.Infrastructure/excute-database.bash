#!/bin/bash

# -----------------------------
# Script migrate & update cả ReadDbContext và WriteDbContext
# -----------------------------

ACTION=$1        # migrate hoặc update
NAME=$2          # tên migration khi migrate

if [ "$ACTION" != "migrate" ] && [ "$ACTION" != "update" ]; then
  echo "❌ Sai cú pháp!"
  echo "Cách dùng:"
  echo "  ./migrate_all.sh migrate MigrationName   # Tạo migration + update DB"
  echo "  ./migrate_all.sh update                  # Chỉ update DB"
  exit 1
fi

if [ "$ACTION" == "migrate" ] && [ -z "$NAME" ]; then
  echo "❌ Vui lòng nhập tên migration. Ví dụ: ./migrate_all.sh migrate InitDB"
  exit 1
fi

# MIGRATE
if [ "$ACTION" == "migrate" ]; then
  echo "🚀 Tạo migration cho ReadDbContext..."
  dotnet ef migrations add "${NAME}_ReadDb" \
      --context ReadDbContext \
      --output-dir Data/ReadDb/Migrations || exit 1

  echo "🚀 Tạo migration cho WriteDbContext..."
  dotnet ef migrations add "${NAME}_WriteDb" \
      --context WriteDbContext \
      --output-dir Data/WriteDb/Migrations || exit 1
fi

# UPDATE DATABASE
echo "📦 Update database cho ReadDbContext..."
dotnet ef database update --context ReadDbContext || exit 1

echo "📦 Update database cho WriteDbContext..."
dotnet ef database update --context WriteDbContext || exit 1

echo "✅ Hoàn tất!"
