#!/bin/bash

# Docker Deploy Script
# Bu script loyihangizni Docker container sifatida ishga tushiradi

echo "🚀 Docker container yaratyapman..."

# Environment variables'larni tekshirish
if [ ! -f .env ]; then
    echo "⚠️  .env fayli topilmadi!"
    echo "📝 .env fayli yaratish uchun quyidagi o'zgaruvchilarni kiriting:"
    echo ""
    read -p "VITE_SUPABASE_URL: " SUPABASE_URL
    read -p "VITE_SUPABASE_PUBLISHABLE_KEY: " SUPABASE_KEY
    read -p "VITE_SUPABASE_PROJECT_ID: " PROJECT_ID
    
    cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$SUPABASE_KEY
VITE_SUPABASE_PROJECT_ID=$PROJECT_ID
EOF
    echo "✅ .env fayli yaratildi!"
fi

# Docker image yaratish
echo "🔨 Docker image build qilyapman..."
docker-compose build

# Container'ni ishga tushirish
echo "🎯 Container'ni ishga tushiryapman..."
docker-compose up -d

echo ""
echo "✅ Deploy muvaffaqiyatli yakunlandi!"
echo "🌐 Ilovangiz http://localhost:80 da ishlayapti"
echo ""
echo "📊 Container loglarini ko'rish: docker-compose logs -f"
echo "🛑 Container'ni to'xtatish: docker-compose down"
