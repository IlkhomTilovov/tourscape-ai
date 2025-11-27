#!/bin/bash

# Server Monitoring Setup Script
# Bu script server monitoring tizimini o'rnatadi

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📊 Monitoring Tizimini O'rnatish${NC}"
echo "=================================="

# 1. Htop o'rnatish
echo -e "\n${GREEN}1. Htop o'rnatilmoqda...${NC}"
sudo apt install htop -y

# 2. Netdata o'rnatish (real-time monitoring)
echo -e "\n${GREEN}2. Netdata o'rnatilmoqda...${NC}"
bash <(curl -Ss https://my-netdata.io/kickstart.sh) --non-interactive --stable-channel

# 3. Log rotation sozlash
echo -e "\n${GREEN}3. Log rotation sozlanmoqda...${NC}"
sudo tee /etc/logrotate.d/docker-logs > /dev/null <<'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
EOF

# 4. Disk space monitoring script
echo -e "\n${GREEN}4. Disk monitoring script yaratilmoqda...${NC}"
sudo tee /usr/local/bin/check-disk-space.sh > /dev/null <<'EOF'
#!/bin/bash
THRESHOLD=80
USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "⚠️  OGOHLANTIRISH: Disk to'liq! $USAGE% ishlatilmoqda"
    # Bu yerga email notification qo'shishingiz mumkin
fi
EOF
sudo chmod +x /usr/local/bin/check-disk-space.sh

# 5. Cron job qo'shish
echo -e "\n${GREEN}5. Cron jobs sozlanmoqda...${NC}"
(crontab -l 2>/dev/null; echo "0 */6 * * * /usr/local/bin/check-disk-space.sh") | crontab -

# 6. Docker stats script
echo -e "\n${GREEN}6. Docker monitoring script yaratilmoqda...${NC}"
sudo tee /usr/local/bin/docker-stats.sh > /dev/null <<'EOF'
#!/bin/bash
echo "Docker Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "Docker Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
EOF
sudo chmod +x /usr/local/bin/docker-stats.sh

# 7. Backup script
echo -e "\n${GREEN}7. Backup script yaratilmoqda...${NC}"
sudo tee /usr/local/bin/backup-app.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/app"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Docker volumes backup
docker run --rm -v app_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/app-data-$DATE.tar.gz /data

# Keep only last 7 days
find $BACKUP_DIR -name "app-data-*.tar.gz" -mtime +7 -delete

echo "✅ Backup yaratildi: app-data-$DATE.tar.gz"
EOF
sudo chmod +x /usr/local/bin/backup-app.sh

# Haftalik backup cron
(crontab -l 2>/dev/null; echo "0 2 * * 0 /usr/local/bin/backup-app.sh") | crontab -

# 8. Health check script
echo -e "\n${GREEN}8. Health check script yaratilmoqda...${NC}"
sudo tee /usr/local/bin/health-check.sh > /dev/null <<'EOF'
#!/bin/bash

# Check if Docker containers are running
if ! docker ps | grep -q "uzbekistan-tours-app"; then
    echo "⚠️  Container ishlamayapti! Restart qilinyapti..."
    cd /var/www/app && docker-compose restart
fi

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "⚠️  Nginx ishlamayapti! Restart qilinyapti..."
    systemctl restart nginx
fi

# Check SSL certificate expiry
CERT_DAYS=$(echo | openssl s_client -servername $(hostname) -connect localhost:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2 | xargs -I {} date -d {} +%s)
NOW=$(date +%s)
DAYS_LEFT=$(( ($CERT_DAYS - $NOW) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
    echo "⚠️  SSL sertifikat 30 kundan kam muddatga qolgan! Yangilash kerak."
fi
EOF
sudo chmod +x /usr/local/bin/health-check.sh

# Har 5 daqiqada health check
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh") | crontab -

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ Monitoring tizimi sozlandi!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "\n${YELLOW}Foydali komandalar:${NC}"
echo -e "📊 Htop: ${GREEN}htop${NC}"
echo -e "📈 Netdata: ${GREEN}http://your-server-ip:19999${NC}"
echo -e "🐳 Docker stats: ${GREEN}/usr/local/bin/docker-stats.sh${NC}"
echo -e "💾 Backup: ${GREEN}/usr/local/bin/backup-app.sh${NC}"
echo -e "❤️  Health check: ${GREEN}/usr/local/bin/health-check.sh${NC}"
echo -e "📋 Cron jobs: ${GREEN}crontab -l${NC}"
