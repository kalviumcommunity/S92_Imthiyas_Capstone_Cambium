# ==============================================================================
# CAMBIUM RESEARCH PLATFORM — NGINX REVERSE PROXY CONTAINER
# Alpine Linux + TLS Certificate Auto-Provisioning + Health Probes
# Document ID: DOCKERFILE-NGINX-CAMBIUM-2026-V2
# ==============================================================================
FROM nginx:1.27-alpine

# Install openssl and wget for healthchecks and dev cert generation
RUN apk add --no-cache openssl wget

# Copy custom Nginx configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Create directories for certificates and webroot
RUN mkdir -p /etc/nginx/certs /var/www/certbot

# Generate self-signed TLS fallback certificate for local dev / testing if none mounted
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/privkey.pem \
    -out /etc/nginx/certs/fullchain.pem \
    -subj "/C=US/ST=California/L=Berkeley/O=Cambium Research/OU=Engineering/CN=cambium.edu"

EXPOSE 80 443

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
