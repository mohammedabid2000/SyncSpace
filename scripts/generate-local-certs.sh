#!/usr/bin/env bash
# Generate local development TLS files. Private keys must never be committed.
set -euo pipefail

force=false
case "${1:-}" in
    '') ;;
    --force) force=true ;;
    *) printf 'Usage: bash scripts/generate-local-certs.sh [--force]\n' >&2; exit 1 ;;
esac
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cert_dir="$project_dir/infra/nginx/certs"
mkdir -p -- "$cert_dir"
# The unprivileged Nginx container must read its mounted key. Restrict the host
# directory to its owner while allowing file reads through the container mount.
chmod 700 "$cert_dir"
if [[ "$force" == false && -s "$cert_dir/server.key" && -s "$cert_dir/server.crt" ]]; then
    printf 'Local TLS certificate already exists; keeping it.\n'
    exit 0
fi
command -v openssl >/dev/null || { printf 'Install OpenSSL to generate local TLS certificates.\n' >&2; exit 1; }
umask 077
temp_dir="$(mktemp -d "$cert_dir/.generate.XXXXXX")"
cleanup() {
    rm -f -- "$temp_dir/server.key" "$temp_dir/server.crt"
    rmdir -- "$temp_dir"
}
trap cleanup EXIT
openssl req -x509 -nodes -newkey rsa:3072 -sha256 -days 365 \
    -keyout "$temp_dir/server.key" -out "$temp_dir/server.crt" \
    -subj '/CN=localhost/O=SyncSpace local development' \
    -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1'
chmod 644 "$temp_dir/server.key" "$temp_dir/server.crt"
mv -- "$temp_dir/server.key" "$cert_dir/server.key"
mv -- "$temp_dir/server.crt" "$cert_dir/server.crt"
printf 'Generated local-only TLS certificate and key (ignored by Git).\n'
