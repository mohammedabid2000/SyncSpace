# Local TLS certificates

The gateway mounts `server.crt` and `server.key` from this directory at runtime.
Generate them with `make certs`; `make up` also generates missing files.
These files are ignored by Git and must not be committed or baked into images.

To rotate the local development pair:

```sh
make certs FORCE=1
docker compose --env-file .env.example up -d --force-recreate nginx
```

The certificate is self-signed and covers localhost, 127.0.0.1 and ::1. Browsers
will show a trust warning. Use properly provisioned certificates for deployment.
The old committed development key remains in Git history and must not be reused.
The host directory is owner-only; the files are readable through the read-only
mount by the image's unprivileged Nginx process.
