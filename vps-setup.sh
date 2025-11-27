#!/bin/bash

# VPS Server Setup Script
# Bu script VPS'ingizni avtomatik ravishda sozlaydi

set -e  # Xatolik bo'lsa to'xtatish

echo "🚀 VPS Server Setup Boshlandi..."
echo "================================"

# Rangli output uchun
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Foydalanuvchidan ma'lumot olish
echo -e "${YELLOW}Domain nomingizni kiriting (masalan: example.com):${NC}"
read -p "Domain: " DOMAIN

echo -e "${YELLOW}Email manzilingizni kiriting (SSL uchun):${NC}"
read -p "Email: " EMAIL

echo -e "${YELLOW}GitHub repository URL (masalan: https://github.com/user/repo.git):${NC}"
read -p "GitHub URL: " GITHUB_URL

# 1. Sistema yangilash
echo -e "\n${GREEN}1. Sistema yangilanmoqda...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Docker o'rnatish
echo -e "\n${GREEN}2. Docker o'rnatilmoqda...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker o'rnatildi${NC}"
else
    echo -e "${YELLOW}Docker allaqachon o'rnatilgan${NC}"
fi

# 3. Docker Compose o'rnatish
echo -e "\n${GREEN}3. Docker Compose o'rnatilmoqda...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓ Docker Compose o'rnatildi${NC}"
else
    echo -e "${YELLOW}Docker Compose allaqachon o'rnatilgan${NC}"
fi

# 4. Nginx o'rnatish
echo -e "\n${GREEN}4. Nginx o'rnatilmoqda...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    echo -e "${GREEN}✓ Nginx o'rnatildi${NC}"
else
    echo -e "${YELLOW}Nginx allaqachon o'rnatilgan${NC}"
fi

# 5. Certbot o'rnatish
echo -e "\n${GREEN}5. Certbot o'rnatilmoqda...${NC}"
if ! command -v certbot &> /dev/null; then
    sudo apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✓ Certbot o'rnatildi${NC}"
else
    echo -e "${YELLOW}Certbot allaqachon o'rnatilgan${NC}"
fi

# 6. Git o'rnatish
echo -e "\n${GREEN}6. Git o'rnatilmoqda...${NC}"
if ! command -v git &> /dev/null; then
    sudo apt install git -y
    echo -e "${GREEN}✓ Git o'rnatildi${NC}"
else
    echo -e "${YELLOW}Git allaqachon o'rnatilgan${NC}"
fi

# 7. Loyihani clone qilish
echo -e "\n${GREEN}7. Loyiha yuklanmoqda...${NC}"
sudo mkdir -p /var/www
cd /var/www
if [ -d "app" ]; then
    echo -e "${YELLOW}app papkasi mavjud. O'chirish...${NC}"
    sudo rm -rf app
fi
sudo git clone $GITHUB_URL app
cd app
echo -e "${GREEN}✓ Loyiha yuklandi${NC}"

# 8. Environment variables
echo -e "\n${GREEN}8. Environment variables sozlash...${NC}"
echo -e "${YELLOW}Supabase ma'lumotlarini kiriting:${NC}"
read -p "VITE_SUPABASE_URL: " SUPABASE_URL
read -p "VITE_SUPABASE_PUBLISHABLE_KEY: " SUPABASE_KEY
read -p "VITE_SUPABASE_PROJECT_ID: " PROJECT_ID

sudo tee .env > /dev/null <<EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$SUPABASE_KEY
VITE_SUPABASE_PROJECT_ID=$PROJECT_ID
EOF
echo -e "${GREEN}✓ .env fayli yaratildi${NC}"

# 9. Nginx konfiguratsiya
echo -e "\n${GREEN}9. Nginx sozlanmoqda...${NC}"
sudo tee /etc/nginx/sites-available/app > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx sozlandi${NC}"

# 10. Docker container ishga tushirish
echo -e "\n${GREEN}10. Docker container ishga tushirilmoqda...${NC}"
sudo docker-compose build
sudo docker-compose up -d
echo -e "${GREEN}✓ Container ishga tushdi${NC}"

# 11. Firewall sozlash
echo -e "\n${GREEN}11. Firewall sozlanmoqda...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable
echo -e "${GREEN}✓ Firewall sozlandi${NC}"

# 12. SSL sertifikat
echo -e "\n${GREEN}12. SSL sertifikat o'rnatilmoqda...${NC}"
echo -e "${YELLOW}DNS sozlamalari to'g'ri ekanligini tekshiring!${NC}"
echo -e "${YELLOW}A record: $DOMAIN -> $(curl -s ifconfig.me)${NC}"
echo -e "${YELLOW}A record: www.$DOMAIN -> $(curl -s ifconfig.me)${NC}"
read -p "DNS to'g'ri sozlangan bo'lsa, Enter bosing..."

sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect
echo -e "${GREEN}✓ SSL sertifikat o'rnatildi${NC}"

# 13. Deploy script yaratish
echo -e "\n${GREEN}13. Deploy script yaratilmoqda...${NC}"
sudo tee /var/www/app/deploy.sh > /dev/null <<'EOF'
#!/bin/bash
cd /var/www/app
git pull origin main
docker-compose down
docker-compose up --build -d
echo "✅ Deploy muvaffaqiyatli!"
EOF
sudo chmod +x /var/www/app/deploy.sh
echo -e "${GREEN}✓ Deploy script yaratildi${NC}"

# Yakuniy ma'lumotlar
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ Setup muvaffaqiyatli yakunlandi!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "\n${GREEN}Sizning saytingiz:${NC}"
echo -e "🌐 https://$DOMAIN"
echo -e "🌐 https://www.$DOMAIN"
echo -e "\n${YELLOW}Foydali komandalar:${NC}"
echo -e "📊 Logs: ${GREEN}sudo docker-compose logs -f${NC}"
echo -e "🔄 Restart: ${GREEN}sudo docker-compose restart${NC}"
echo -e "🚀 Deploy: ${GREEN}sudo /var/www/app/deploy.sh${NC}"
echo -e "🔧 Nginx reload: ${GREEN}sudo systemctl reload nginx${NC}"
echo -e "🔒 SSL yangilash: ${GREEN}sudo certbot renew${NC}"
echo -e "\n${GREEN}Tabriklaymiz! 🎉${NC}"
