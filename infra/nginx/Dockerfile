FROM owasp/modsecurity-crs:nginx-alpine

# Use upstream entrypoint/templates so the ModSecurity module and CRS are loaded.
# Compose supplies the backend address and mounts the local TLS certificate/key.
# The older nginx.conf, conf.d/ and modsecurity/ files are not copied by this image.

# Rootless local Docker uses an unprivileged host HTTPS port.
# Preserve Nginx request variables for evaluation by Nginx, not the shell.
USER root
RUN sed -i 's|https://$host$request_uri|https://$host:${HTTPS_PORT}$request_uri|' /etc/nginx/templates/conf.d/default.conf.template
ENV HTTPS_PORT=8443
USER nginx
