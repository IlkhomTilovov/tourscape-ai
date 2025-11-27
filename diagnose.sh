#!/bin/bash

# Quick diagnostic script to check what's wrong

echo "========================================="
echo "TourScape AI - Diagnostics"
echo "========================================="

echo ""
echo "1. Checking what's using port 80:"
lsof -i :80 || echo "Nothing found"

echo ""
echo "2. Checking what's using port 443:"
lsof -i :443 || echo "Nothing found"

echo ""
echo "3. Checking Docker containers:"
docker ps -a

echo ""
echo "4. Checking Docker port mappings:"
docker port tourscape-ai 2>/dev/null || echo "Container not running"

echo ""
echo "5. Checking nginx processes:"
ps aux | grep nginx | grep -v grep || echo "No nginx processes"

echo ""
echo "6. Testing container nginx config:"
docker exec tourscape-ai nginx -t 2>/dev/null || echo "Cannot test - container not running"

echo ""
echo "7. Checking container logs (last 20 lines):"
docker compose logs --tail=20 tourscape-ai 2>/dev/null || echo "No logs available"

echo ""
echo "8. Testing HTTP request to container:"
curl -I http://localhost:80/ 2>/dev/null | head -n 5 || echo "HTTP request failed"

echo ""
echo "9. Checking SSL certificates:"
ls -la /etc/letsencrypt/live/bestour.uz/ 2>/dev/null || echo "SSL certificates not found"

echo ""
echo "10. Network listening ports:"
netstat -tlnp | grep -E ':80 |:443 '

echo ""
echo "========================================="
echo "Diagnostics Complete"
echo "========================================="
