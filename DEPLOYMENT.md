# Deployment Guide for bestour.uz

This guide will help you deploy TourScape AI to your Linux server with SSL support.

## Prerequisites

- Domain: `bestour.uz` pointing to `95.169.192.213`
- Linux server with Docker and Docker Compose installed
- Certbot installed (or will be installed by script)
- Root or sudo access

## Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **Clone/Pull the repository on your server:**
```bash
cd /root
git clone https://github.com/IlkhomTilovov/tourscape-ai.git
# OR if already cloned:
cd /root/tourscape-ai
git pull origin main
```

2. **Update the email in deploy.sh:**
```bash
nano deploy.sh
# Change EMAIL="your-email@example.com" to your actual email
```

3. **Make the script executable and run it:**
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will:
- Stop any service using port 80 (nginx/apache)
- Install Certbot if needed
- Generate SSL certificates for bestour.uz
- Set up auto-renewal
- Build and start Docker containers

### Option 2: Manual Deployment

#### Step 1: Stop Services on Port 80

```bash
# Stop nginx if running
sudo systemctl stop nginx
sudo systemctl disable nginx

# OR stop apache if running
sudo systemctl stop apache2
sudo systemctl disable apache2
```

#### Step 2: Generate SSL Certificates

```bash
sudo certbot certonly --standalone \
  -d bestour.uz \
  -d www.bestour.uz \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

#### Step 3: Verify Certificate Paths

```bash
sudo ls -la /etc/letsencrypt/live/bestour.uz/
```

You should see:
- `fullchain.pem`
- `privkey.pem`
- `chain.pem`
- `cert.pem`

#### Step 4: Deploy with Docker

```bash
cd /root/tourscape-ai

# Make sure .env file exists with Supabase credentials
cat > .env << 'EOF'
VITE_SUPABASE_PROJECT_ID=cryyvpzjerhlwbxpeeks
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeXl2cHpqZXJobHdieHBlZWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTYyODIsImV4cCI6MjA3OTQ3MjI4Mn0.3PzCfRBMatgOaLMDZDLGT71r_Y7hloHwYtShaAiF7gw
VITE_SUPABASE_URL=https://cryyvpzjerhlwbxpeeks.supabase.co
EOF

# Build and start
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## SSL Certificate Auto-Renewal

Set up a cron job to automatically renew certificates:

```bash
sudo crontab -e
```

Add this line:
```
0 3 * * * certbot renew --quiet --deploy-hook "docker compose -f /root/tourscape-ai/docker-compose.yml restart"
```

## Port Configuration

The application uses:
- **Port 8080** (container) → Port 80 (host) → Redirects to HTTPS
- **Port 8443** (container) → Port 443 (host) → HTTPS traffic

If you still have conflicts on port 80, check what's using it:

```bash
sudo lsof -i :80
sudo ss -tlnp | grep ':80'
```

## Firewall Configuration

Make sure ports are open:

```bash
# UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Or iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Troubleshooting

### Port 80 Still in Use

```bash
# Find what's using it
sudo lsof -i :80

# Kill the process (replace PID)
sudo kill -9 PID

# Or stop common services
sudo systemctl stop nginx apache2
```

### SSL Certificate Issues

```bash
# Test certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

### Container Won't Start

```bash
# Check logs
docker compose logs tourscape-ai

# Rebuild without cache
docker compose build --no-cache
docker compose up -d

# Check nginx config inside container
docker exec tourscape-ai nginx -t
```

### DNS Not Resolving

```bash
# Test DNS
nslookup bestour.uz
dig bestour.uz

# Should point to: 95.169.192.213
```

## Useful Commands

```bash
# View container logs
docker compose logs -f tourscape-ai

# Restart container
docker compose restart

# Stop all containers
docker compose down

# Rebuild and restart
docker compose up --build -d

# Check SSL certificate expiry
sudo certbot certificates

# Access container shell
docker exec -it tourscape-ai sh

# Test nginx config
docker exec tourscape-ai nginx -t

# Reload nginx (without restarting container)
docker exec tourscape-ai nginx -s reload
```

## Post-Deployment Verification

1. **Test HTTP redirect:**
   ```bash
   curl -I http://bestour.uz
   # Should return 301 redirect to https://bestour.uz
   ```

2. **Test HTTPS:**
   ```bash
   curl -I https://bestour.uz
   # Should return 200 OK
   ```

3. **Check SSL grade:**
   Visit: https://www.ssllabs.com/ssltest/analyze.html?d=bestour.uz

4. **Test in browser:**
   - https://bestour.uz
   - https://www.bestour.uz

## Updating the Application

```bash
cd /root/tourscape-ai
git pull origin main
docker compose up --build -d
```

## Monitoring

Monitor your application:

```bash
# Container stats
docker stats tourscape-ai

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## Support

If you encounter issues:
1. Check container logs: `docker compose logs -f`
2. Verify SSL certificates: `sudo certbot certificates`
3. Test nginx config: `docker exec tourscape-ai nginx -t`
4. Check DNS resolution: `nslookup bestour.uz`
