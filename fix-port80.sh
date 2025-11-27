#!/bin/bash

# Fix port 80 conflict - Stop system Nginx and redirect traffic to Docker

echo "Fixing port 80 conflict..."

# Stop and disable system nginx
echo "Stopping system nginx..."
sudo systemctl stop nginx
sudo systemctl disable nginx

# Stop Docker containers temporarily
echo "Stopping Docker containers..."
docker compose down

# Optional: Remove system nginx completely (uncomment if you want)
# sudo apt remove --purge nginx nginx-common -y

# Configure iptables to redirect port 80 to 8080 and 443 to 8443
echo "Setting up port forwarding..."
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443

# Make iptables rules persistent
echo "Making iptables rules persistent..."
sudo apt install -y iptables-persistent
sudo netfilter-persistent save

# Restart Docker containers
echo "Starting Docker containers..."
docker compose up -d

echo "Done! Your application should now be accessible at http://bestour.uz"
echo ""
echo "To verify, run: curl -I http://bestour.uz"
