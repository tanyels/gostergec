#!/bin/bash
set -euo pipefail

REPO="https://github.com/tanyels/fonako.git"
APP_DIR="/opt/fonako"
DOMAIN="fonako.com"
EMAIL="${CERTBOT_EMAIL:-admin@fonako.com}"

echo "=== Fonako Deployment ==="

# Clone or pull
if [ -d "$APP_DIR" ]; then
    echo "Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# Build and start containers
echo "Building and starting containers..."
docker compose -f deploy/docker-compose.prod.yml up -d --build

# Wait for nginx to be ready
echo "Waiting for nginx..."
sleep 5

# Obtain SSL certificate (skip if already exists)
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "Obtaining SSL certificate..."
    docker compose -f deploy/docker-compose.prod.yml run --rm certbot \
        certonly --webroot --webroot-path=/var/www/certbot \
        --email "$EMAIL" --agree-tos --no-eff-email \
        -d "$DOMAIN" -d "www.$DOMAIN"

    echo ""
    echo "SSL certificate obtained!"
    echo "Now update deploy/nginx.conf:"
    echo "  1. Uncomment the HTTPS server block"
    echo "  2. Uncomment the HTTP->HTTPS redirect block"
    echo "  3. Comment out the plain HTTP server block"
    echo "Then run: docker compose -f deploy/docker-compose.prod.yml restart nginx"
else
    echo "SSL certificate already exists."
fi

# Set up auto-renewal cron (if not already set)
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    echo "Setting up certificate renewal cron..."
    (crontab -l 2>/dev/null; echo "0 3 * * * cd $APP_DIR && docker compose -f deploy/docker-compose.prod.yml run --rm certbot renew && docker compose -f deploy/docker-compose.prod.yml restart nginx") | crontab -
    echo "Cron job added for certificate renewal."
fi

echo ""
echo "=== Deployment complete ==="
echo "Site: http://$DOMAIN"
echo ""
echo "Before running this script, ensure:"
echo "  - DNS A record for $DOMAIN -> 45.126.124.181"
echo "  - DNS A record for www.$DOMAIN -> 45.126.124.181"
