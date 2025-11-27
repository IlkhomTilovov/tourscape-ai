# 🚀 VPS'ga Deploy Qilish va HTTPS Sozlash Qo'llanmasi

## 📋 Boshlash Uchun Kerakli Narsalar

- VPS server (Ubuntu 20.04/22.04 tavsiya etiladi)
- Domain nomi (masalan: example.com)
- SSH access
- Root yoki sudo huquqlari

## 1️⃣ VPS Server Tayyorlash

### SSH orqali serverga kirish:
```bash
ssh root@your-server-ip
# yoki
ssh your-username@your-server-ip
```

### Serverga kerakli dasturlarni o'rnatish:
```bash
# Sistema yangilash
sudo apt update && sudo apt upgrade -y

# Docker o'rnatish
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose o'rnatish
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Nginx o'rnatish (reverse proxy uchun)
sudo apt install nginx -y

# Certbot o'rnatish (SSL sertifikat uchun)
sudo apt install certbot python3-certbot-nginx -y
```

## 2️⃣ Loyihani Serverga Ko'chirish

### Git orqali:
```bash
# Loyihani clone qilish
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git app
cd app

# Environment variables sozlash
sudo nano .env
```

**.env fayli**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Docker bilan build qilish:
```bash
sudo docker-compose build
sudo docker-compose up -d
```

## 3️⃣ Domain Sozlash

### DNS sozlamalari (Domain provider saytida):

1. **A Record** qo'shing:
   - Type: `A`
   - Name: `@` (root domain uchun)
   - Value: `your-server-ip`
   - TTL: `3600`

2. **A Record** (www uchun):
   - Type: `A`
   - Name: `www`
   - Value: `your-server-ip`
   - TTL: `3600`

### DNS tekshirish:
```bash
# Domain IP manzilini tekshirish
dig +short example.com
dig +short www.example.com
```

## 4️⃣ Nginx Reverse Proxy Sozlash

### Nginx konfiguratsiya fayli yaratish:
```bash
sudo nano /etc/nginx/sites-available/app
```

**Konfiguratsiya** (SSL oldidan):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Konfiguratsiyani yoqish:
```bash
# Symlink yaratish
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/

# Default konfiguratsiyani o'chirish (kerak bo'lsa)
sudo rm /etc/nginx/sites-enabled/default

# Nginx sintaksisini tekshirish
sudo nginx -t

# Nginx'ni qayta yuklash
sudo systemctl reload nginx
```

## 5️⃣ SSL Sertifikat Sozlash (HTTPS)

### Let's Encrypt bilan SSL:
```bash
# SSL sertifikat olish
sudo certbot --nginx -d example.com -d www.example.com

# Email manzilni kiriting (ogohlantirishlar uchun)
# Terms of Service'ga rozi bo'ling (Y)
# www redirect qilish uchun 2 ni tanlang (tavsiya)
```

### Avtomatik yangilanishni sozlash:
```bash
# Certbot avtomatik yangilanishni tekshirish
sudo certbot renew --dry-run

# Cron job allaqachon sozlangan bo'ladi
# Tekshirish uchun:
sudo systemctl status certbot.timer
```

## 6️⃣ Firewall Sozlash

```bash
# UFW firewall yoqish
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## 7️⃣ Yangilanishlarni Deploy Qilish

### Git orqali yangilash:
```bash
cd /var/www/app
sudo git pull origin main
sudo docker-compose down
sudo docker-compose up --build -d
```

### Avtomatik deploy script:
```bash
sudo nano /var/www/app/deploy.sh
```

**deploy.sh**:
```bash
#!/bin/bash
cd /var/www/app
git pull origin main
docker-compose down
docker-compose up --build -d
echo "✅ Deploy muvaffaqiyatli!"
```

```bash
sudo chmod +x /var/www/app/deploy.sh
```

## 8️⃣ Monitoring va Logs

### Docker logs:
```bash
# Barcha loglar
sudo docker-compose logs -f

# Oxirgi 100 qator
sudo docker-compose logs --tail=100
```

### Nginx logs:
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### System resources:
```bash
# CPU va RAM
htop

# Disk space
df -h

# Docker container status
sudo docker ps -a
```

## 🔒 Xavfsizlik Tavsiyalari

1. **SSH port o'zgartirish**:
```bash
sudo nano /etc/ssh/sshd_config
# Port 22 ni Port 2222 ga o'zgartiring
sudo systemctl restart sshd
```

2. **SSH kalit bilan kirish**:
```bash
# Local kompyuterda
ssh-keygen -t rsa -b 4096
ssh-copy-id user@your-server-ip
```

3. **Fail2ban o'rnatish**:
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

4. **Avtomatik backup**:
```bash
# Database backup script yaratish
sudo nano /var/www/backup.sh
```

## 🎯 Monitoring va Optimization

### 1. PM2 o'rnatish (process management):
```bash
npm install -g pm2
```

### 2. Nginx caching:
```bash
sudo nano /etc/nginx/sites-available/app
# Cache sozlamalarni qo'shish
```

### 3. Compression yoqish:
Nginx konfiguratsiyada gzip allaqachon yoqilgan.

## 🆘 Muammo Yechish

### 1. Container ishlamayapti:
```bash
sudo docker-compose down
sudo docker-compose up --build -d
sudo docker-compose logs
```

### 2. Nginx xatolari:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### 3. SSL muammolari:
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

### 4. DNS tarqalish tekshirish:
```bash
nslookup example.com
dig example.com
```

## 📊 Performance Optimization

### 1. Enable HTTP/2:
Nginx'da SSL bilan avtomatik yoqiladi.

### 2. Gzip compression:
Nginx konfiguratsiyada sozlangan.

### 3. Browser caching:
Static assets uchun cache headers qo'shilgan.

## ✅ Tekshirish Ro'yxati

- [ ] VPS serveri tayyorlangan
- [ ] Docker va Docker Compose o'rnatilgan
- [ ] Nginx o'rnatilgan va sozlangan
- [ ] Domain DNS sozlamalari to'g'ri
- [ ] Loyiha serverga ko'chirilgan
- [ ] Environment variables sozlangan
- [ ] Docker container ishlamoqda
- [ ] Nginx reverse proxy ishlayapti
- [ ] SSL sertifikat o'rnatilgan
- [ ] HTTPS ishlayapti
- [ ] Firewall sozlangan
- [ ] Backup tizimi sozlangan

## 📞 Yordam

Muammo yuzaga kelsa:
1. Loglarni tekshiring
2. Server resources'ni monitoring qiling
3. DNS sozlamalarini tekshiring
4. SSL sertifikat muddatini tekshiring

---

**Muvaffaqiyat!** 🎉 Sizning ilovangiz endi https://example.com da ishlayapti!
