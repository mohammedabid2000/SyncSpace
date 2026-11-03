FROM owasp/modsecurity-crs:nginx-alpine

ENV HTTPS_PORT=8443

COPY conf.d/default.conf.template \
     /etc/nginx/templates/conf.d/default.conf.template
