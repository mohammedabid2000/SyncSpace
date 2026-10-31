FROM owasp/modsecurity-crs:nginx-alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Copy SSL certificates
COPY certs/ /etc/nginx/certs/

# Copy ModSecurity config and rules (overrides base image defaults)
COPY modsecurity/modsecurity.conf /etc/modsecurity.d/modsecurity.conf
COPY modsecurity/crs-setup.conf /etc/modsecurity.d/owasp-crs/crs-setup.conf
COPY modsecurity/rules/ /etc/modsecurity.d/owasp-crs/rules/

RUN mkdir -p /var/log/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]