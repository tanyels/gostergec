#!/bin/bash
set -euo pipefail

REPO="https://github.com/tanyels/fonako.git"
APP_DIR="/opt/fonako"
DOMAIN="fonako.com"

echo "=== Fonako Deployment ==="

# 1. Clone or pull
if [ -d "$APP_DIR" ]; then
    echo "Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# 2. Build and start fonako container
echo "Building and starting fonako container..."
docker compose -f deploy/docker-compose.prod.yml up -d --build

# 3. Fix TransData nginx config — add server_name so it stops being a catch-all
TRANSDATA_CONF="/etc/nginx/sites-available/transdata"
if [ -f "$TRANSDATA_CONF" ]; then
    if ! grep -q "server_name" "$TRANSDATA_CONF"; then
        echo "Fixing TransData nginx config (adding server_name)..."
        sed -i 's/listen 80;/listen 80;\n    server_name transdata.com.tr www.transdata.com.tr;/' "$TRANSDATA_CONF"
    fi
fi

# 4. Install fonako nginx site config
echo "Installing fonako nginx config..."
cp deploy/nginx.conf /etc/nginx/sites-available/fonako
ln -sf /etc/nginx/sites-available/fonako /etc/nginx/sites-enabled/fonako

# 5. Test and reload nginx
echo "Testing nginx config..."
nginx -t
echo "Reloading nginx..."
systemctl reload nginx

echo ""
echo "=== Deployment complete ==="
echo "Site should be live at: http://$DOMAIN"
echo ""
echo "Next steps:"
echo "  1. Verify http://$DOMAIN loads correctly"
echo "  2. Install certbot if not already: apt install certbot python3-certbot-nginx"
echo "  3. Get SSL: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
