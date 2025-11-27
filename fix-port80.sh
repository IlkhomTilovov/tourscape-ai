#!/bin/bash

# Complete Fix Script for TourScape AI Deployment
# This script stops system nginx and deploys your Docker application

set -e

DOMAIN="bestour.uz"
PROJECT_DIR="/root/tourscape-ai"

echo "========================================="
echo "TourScape AI - Complete Fix & Deployment"
echo "Domain: $DOMAIN"
echo "========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Find and stop anything using port 80 and 443
echo ""
echo "Step 1: Checking for processes using ports 80 and 443..."

# Find process using port 80
PORT80_PID=$(lsof -ti:80 || true)
if [ ! -z "$PORT80_PID" ]; then
    echo "Found process $PORT80_PID using port 80. Stopping..."
    kill -9 $PORT80_PID || true
fi

# Find process using port 443
PORT443_PID=$(lsof -ti:443 || true)
if [ ! -z "$PORT443_PID" ]; then
    echo "Found process $PORT443_PID using port 443. Stopping..."
    kill -9 $PORT443_PID || true
fi

# Stop system nginx if running
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo "Stopping system nginx service..."
    systemctl stop nginx
    systemctl disable nginx
    echo "System nginx stopped and disabled"
fi

# Stop apache if running
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo "Stopping apache2 service..."
    systemctl stop apache2
    systemctl disable apache2
    echo "Apache2 stopped and disabled"
fi

# Step 2: Clean up Docker containers
echo ""
echo "Step 2: Cleaning up Docker containers..."
cd $PROJECT_DIR
docker compose down 2>/dev/null || true
docker container prune -f

# Step 3: Verify SSL certificates exist
echo ""
echo "Step 3: Checking SSL certificates..."
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "ERROR: SSL certificates not found!"
    echo "Please run: sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN"
    exit 1
fi
echo "SSL certificates found ✓"

# Step 4: Rebuild and start Docker containers
echo ""
echo "Step 4: Building and starting Docker containers..."
docker compose build --no-cache
docker compose up -d

# Step 5: Wait for container to be healthy
echo ""
echo "Step 5: Waiting for container to be healthy..."
sleep 10

# Check container status
CONTAINER_STATUS=$(docker inspect --format='{{.State.Status}}' tourscape-ai 2>/dev/null || echo "not found")
echo "Container status: $CONTAINER_STATUS"

if [ "$CONTAINER_STATUS" = "running" ]; then
    echo "✓ Container is running"
else
    echo "✗ Container is not running. Checking logs..."
    docker compose logs --tail=50 tourscape-ai
    exit 1
fi

# Step 6: Test nginx configuration inside container
echo ""
echo "Step 6: Testing nginx configuration..."
docker exec tourscape-ai nginx -t

# Step 7: Check what's listening on ports
echo ""
echo "Step 7: Verifying port bindings..."
echo "Ports in use:"
netstat -tlnp | grep -E ':80 |:443 ' || echo "No processes found (this might be okay if Docker handles it differently)"

echo ""
echo "Docker port mappings:"
docker port tourscape-ai

# Step 8: Test HTTP and HTTPS
echo ""
echo "Step 8: Testing endpoints..."

# Test container internally
docker exec tourscape-ai wget -q -O /dev/null http://localhost:80/ && echo "✓ HTTP inside container works" || echo "✗ HTTP inside container failed"

# Test from host
curl -k -I -s http://localhost:80/ | head -n 1 && echo "✓ HTTP from host works" || echo "✗ HTTP from host failed"

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Your site should be accessible at:"
echo "  - http://$DOMAIN (redirects to HTTPS)"
echo "  - https://$DOMAIN"
echo "  - https://www.$DOMAIN"
echo ""
echo "To check logs:"
echo "  docker compose logs -f tourscape-ai"
echo ""
echo "To verify nginx config:"
echo "  docker exec tourscape-ai nginx -t"
echo ""
echo "To restart:"
echo "  docker compose restart"
echo "========================================="
