# ⚡ Tezkor Boshlash Qo'llanmasi

VPS'ga deploy qilish uchun 3 ta yo'l mavjud:

## 🚀 Usul 1: Avtomatik Setup (Tavsiya etiladi)

### Bitta komanda bilan to'liq setup:

```bash
# 1. Script'ni yuklang va ishga tushiring
curl -sSL https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/vps-setup.sh | bash
```

Bu script:
- ✅ Barcha kerakli dasturlarni o'rnatadi
- ✅ Loyihani clone qiladi  
- ✅ Docker container'larni ishga tushiradi
- ✅ Nginx'ni sozlaydi
- ✅ SSL sertifikat o'rnatadi
- ✅ Firewall'ni sozlaydi

---

## 🔧 Usul 2: Qo'lda Setup

### VPS'ga SSH orqali kiring:
```bash
ssh root@your-server-ip
```

### 1. Kerakli dasturlarni o'rnating:
```bash
# Sistema yangilash
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Nginx va Certbot
sudo apt install nginx certbot python3-certbot-nginx git -y
```

### 2. Loyihani clone qiling:
```bash
cd /var/www
sudo git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git app
cd app
```

### 3. Environment sozlang:
```bash
sudo nano .env
```

Quyidagilarni kiriting:
```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 4. Docker'ni ishga tushiring:
```bash
sudo docker-compose build
sudo docker-compose up -d
```

### 5. Nginx sozlang:
```bash
sudo nano /etc/nginx/sites-available/app
```

Quyidagi konfiguratsiyani kiriting:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL o'rnating:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 7. Firewall sozlang:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🎯 Usul 3: Docker faqat

Agar server'da Nginx allaqachon sozlangan bo'lsa:

```bash
# 1. Loyihani clone qiling
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# 2. .env yarating
nano .env

# 3. Build va run
docker-compose up -d
```

---

## 📋 DNS Sozlamalari

Domain provider'ingiz saytida:

### A Records qo'shing:

1. **Root domain:**
   - Type: `A`
   - Name: `@`
   - Value: `VPS_IP_ADDRESS`
   - TTL: `3600`

2. **WWW subdomain:**
   - Type: `A`
   - Name: `www`
   - Value: `VPS_IP_ADDRESS`
   - TTL: `3600`

### DNS tekshirish:
```bash
dig +short your-domain.com
```

DNS tarqalish uchun 24-72 soat kutish kerak bo'lishi mumkin.

---

## ✅ Tekshirish

### 1. Docker container ishlayaptimi?
```bash
sudo docker ps
```

### 2. Nginx ishlayaptimi?
```bash
sudo systemctl status nginx
```

### 3. SSL sozlanganmi?
```bash
sudo certbot certificates
```

### 4. Saytingiz ochilmoqdami?
```bash
curl -I https://your-domain.com
```

---

## 🔄 Yangilanishlarni Deploy Qilish

```bash
cd /var/www/app
sudo git pull origin main
sudo docker-compose down
sudo docker-compose up --build -d
```

Yoki deploy script ishlatish:
```bash
sudo /var/www/app/deploy.sh
```

---

## 🆘 Muammo Yechish

### Container ishlamayapti:
```bash
sudo docker-compose logs
sudo docker-compose restart
```

### Nginx xatolari:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### SSL muammolari:
```bash
sudo certbot renew --dry-run
sudo certbot certificates
```

### DNS tekshirish:
```bash
nslookup your-domain.com
dig your-domain.com
```

---

## 📞 Monitoring

### Real-time logs:
```bash
# Docker logs
sudo docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

### Server resurslari:
```bash
htop
df -h
docker stats
```

---

## 🎉 Muvaffaqiyat!

Agar hamma narsa to'g'ri ishlasa, saytingiz https://your-domain.com da mavjud bo'ladi!

**Kerakli havolalar:**
- 📚 To'liq qo'llanma: `deployment-guide.md`
- 🔒 SSL setup: `ssl-manual-setup.sh`
- 📊 Monitoring: `monitoring-setup.sh`
