#!/usr/bin/env bash
# Run AFTER DNS A records point to this host's IP. Idempotent.
set -euo pipefail
EMAIL="${CERTBOT_EMAIL:-ruben@kaiser.fyi}"

certbot --nginx --non-interactive --agree-tos -m "$EMAIL" --redirect \
    -d tumaini.be -d www.tumaini.be \
    -d admin.tumaini.be -d www.admin.tumaini.be \
    -d api.tumaini.be \
    -d files.tumaini.be -d www.files.tumaini.be

systemctl reload nginx
echo "Certs issued. Renewal handled by certbot.timer."
