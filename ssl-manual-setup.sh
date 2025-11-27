#!/bin/bash

# SSL Manual Setup Script
# Agar avtomatik setup ishlamasa, bu scriptni ishlating

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔒 SSL Manual Setup${NC}"
echo "===================="

# Domain va email olish
read -p "Domain nomingiz (example.com): " DOMAIN
read -p "Email manzilingiz: " EMAIL

echo -e "\n${YELLOW}1. DNS Sozlamalarini Tekshirish...${NC}"
echo "A record: $DOMAIN -> $(curl -s ifconfig.me)"
echo "A record: www.$DOMAIN -> $(curl -s ifconfig.me)"

# DNS tekshirish
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo -e "${RED}⚠️  OGOHLANTIRISH: DNS to'g'ri sozlanmagan!${NC}"
    echo -e "Domain IP: $DOMAIN_IP"
    echo -e "Server IP: $SERVER_IP"
    echo -e "\n${YELLOW}DNS sozlamalarini to'g'rilang va 24 soat kuting.${NC}"
    read -p "Davom etasizmi? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

echo -e "\n${GREEN}2. Nginx Sintaksisini Tekshirish...${NC}"
sudo nginx -t

echo -e "\n${GREEN}3. Certbot bilan SSL Olish...${NC}"

# Standart usul
echo -e "${YELLOW}Urinish 1: Nginx plugin bilan...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Urinish 2: Webroot usulida...${NC}"
    
    # Webroot papka yaratish
    sudo mkdir -p /var/www/certbot
    
    # Nginx'ga webroot qo'shish
    sudo tee /etc/nginx/sites-available/app > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    sudo systemctl reload nginx
    
    # Webroot usulida SSL olish
    sudo certbot certonly --webroot -w /var/www/certbot -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ SSL sertifikat olindi${NC}"
        
        # HTTPS konfiguratsiya qo'shish
        sudo tee /etc/nginx/sites-available/app > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/$DOMAIN/chain.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_session_cache shared:SSL:10m;
    
    add_header Strict-Transport-Security "max-age=31536000" always;

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
        
        sudo nginx -t && sudo systemctl reload nginx
        echo -e "${GREEN}✓ Nginx HTTPS bilan qayta sozlandi${NC}"
    else
        echo -e "${RED}✗ SSL olishda xatolik${NC}"
        exit 1
    fi
fi

echo -e "\n${GREEN}4. SSL Sertifikatni Tekshirish...${NC}"
sudo certbot certificates

echo -e "\n${GREEN}5. Avtomatik Yangilanishni Sozlash...${NC}"
sudo certbot renew --dry-run

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ SSL muvaffaqiyatli sozlandi!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "\n${GREEN}Saytingiz:${NC}"
echo -e "🌐 https://$DOMAIN"
echo -e "🌐 https://www.$DOMAIN"
echo -e "\n${YELLOW}SSL Status Tekshirish:${NC}"
echo -e "🔗 https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
