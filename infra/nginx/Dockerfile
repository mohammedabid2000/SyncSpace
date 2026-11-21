FROM owasp/modsecurity-crs:nginx-alpine

ENV HTTPS_PORT=8443

USER root
RUN install -d -m 0755 -o nginx -g nginx /var/log/syncspace
USER nginx

COPY conf.d/default.conf.template \
     /etc/nginx/templates/conf.d/default.conf.template
