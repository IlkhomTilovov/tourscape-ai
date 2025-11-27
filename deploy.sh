#!/bin/bash

# TourScape AI Deployment Script for bestour.uz
# This script handles SSL certificate generation and Docker deployment

set -e

DOMAIN="bestour.uz"
WWW_DOMAIN="www.bestour.uz"
EMAIL="your-email@example.com"  # Change this to your email

echo "========================================="
echo "TourScape AI Deployment Script"
echo "Domain: $DOMAIN"
echo "========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Stop any service using port 80
echo "Step 1: Checking for services on port 80..."
if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Found service on port 80. Attempting to stop..."
    
    # Check for nginx
    if systemctl is-active --quiet nginx; then
        echo "Stopping nginx..."
        systemctl stop nginx
        systemctl disable nginx
    fi
    
    # Check for apache
    if systemctl is-active --quiet apache2; then
        echo "Stopping apache2..."
        systemctl stop apache2
        systemctl disable apache2
    fi
fi

# Step 2: Install Certbot if not already installed
echo "Step 2: Checking Certbot installation..."
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt update
    apt install -y certbot
else
    echo "Certbot already installed"
fi

# Step 3: Generate SSL certificates if they don't exist
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "Step 3: Generating SSL certificates..."
    certbot certonly --standalone \
        -d $DOMAIN \
        -d $WWW_DOMAIN \
        --email $EMAIL \
        --agree-tos \
        --non-interactive \
        --preferred-challenges http
    
    echo "SSL certificates generated successfully!"
else
    echo "Step 3: SSL certificates already exist"
fi

# Step 4: Setup certificate auto-renewal
echo "Step 4: Setting up certificate auto-renewal..."
cat > /etc/cron.d/certbot-renewal << 'EOF'
0 3 * * * root certbot renew --quiet --deploy-hook "docker compose -f /root/tourscape-ai/docker-compose.yml restart"
EOF
echo "Auto-renewal cron job created"

# Step 5: Pull latest code
echo "Step 5: Pulling latest code..."
cd /root/tourscape-ai
git pull origin main

# Step 6: Stop and remove old containers
echo "Step 6: Cleaning up old containers..."
docker compose down || true

# Step 7: Build and start new containers
echo "Step 7: Building and starting Docker containers..."
docker compose up --build -d

# Step 8: Check container status
echo "Step 8: Checking container status..."
sleep 5
docker compose ps

# Step 9: Show logs
echo "========================================="
echo "Deployment complete!"
echo "Your site should be available at:"
echo "  - https://$DOMAIN"
echo "  - https://$WWW_DOMAIN"
echo ""
echo "To view logs, run:"
echo "  docker compose logs -f"
echo "========================================="
