#!/usr/bin/env bash
# Run on hoster as root (sudo). Installs nginx + drops vhost configs.
# Does NOT issue TLS certs (run issue-certs.sh after DNS switch).
set -euo pipefail

apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

STACK_DIR="${STACK_DIR:-/home/ruben/stacks/tumaini}"
SRC="$STACK_DIR/deploy/nginx/host"

install -m 0644 "$SRC/tumaini.be.conf"        /etc/nginx/sites-available/tumaini.be.conf
install -m 0644 "$SRC/admin.tumaini.be.conf"  /etc/nginx/sites-available/admin.tumaini.be.conf
install -m 0644 "$SRC/api.tumaini.be.conf"    /etc/nginx/sites-available/api.tumaini.be.conf
install -m 0644 "$SRC/files.tumaini.be.conf"  /etc/nginx/sites-available/files.tumaini.be.conf

ln -sf /etc/nginx/sites-available/tumaini.be.conf       /etc/nginx/sites-enabled/tumaini.be.conf
ln -sf /etc/nginx/sites-available/admin.tumaini.be.conf /etc/nginx/sites-enabled/admin.tumaini.be.conf
ln -sf /etc/nginx/sites-available/api.tumaini.be.conf   /etc/nginx/sites-enabled/api.tumaini.be.conf
ln -sf /etc/nginx/sites-available/files.tumaini.be.conf /etc/nginx/sites-enabled/files.tumaini.be.conf

nginx -t
systemctl reload nginx
echo "OK. nginx running on :80. Issue certs after DNS switch:"
echo "  sudo $STACK_DIR/deploy/scripts/issue-certs.sh"
