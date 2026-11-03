#!/usr/bin/env bash
# Apply a new PostgreSQL password without deleting the database volume.
set -Eeuo pipefail

fail() {
    printf 'update-db: %s\n' "$1" >&2
    exit 1
}
trap 'printf "update-db failed. No volumes were deleted. Resolve the error above and retry.\n" >&2' ERR

for tool in docker jq; do
    command -v "$tool" >/dev/null || fail "Install $tool before running this command."
done
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd -- "$project_dir"
env_file="${1:-.env.example}"
compose=(docker compose --env-file "$env_file")

# Compose resolves the selected environment file, including variable expansion.
# Keep configuration in memory; never print it or enable shell tracing.
config="$("${compose[@]}" config --format json)"
db_user="$(printf '%s' "$config" | jq -er '.services.postgres.environment.POSTGRES_USER | select(length > 0)')"
db_name="$(printf '%s' "$config" | jq -er '.services.postgres.environment.POSTGRES_DB | select(length > 0)')"
printf '%s' "$config" | jq -e '.services.postgres.environment.POSTGRES_PASSWORD | select(length > 0 and (test("[\r\n]") | not))' >/dev/null ||
    fail 'POSTGRES_PASSWORD must be nonempty and contain no newlines.'

# Renaming a role/database needs a migration, not a container environment change.
container_id="$("${compose[@]}" ps --all --quiet postgres)"
if [[ -n "$container_id" ]]; then
    container_config="$(docker inspect "$container_id")"
    current_user="$(printf '%s' "$container_config" | jq -r '.[0].Config.Env[] | select(startswith("POSTGRES_USER=")) | ltrimstr("POSTGRES_USER=")')"
    current_db="$(printf '%s' "$container_config" | jq -r '.[0].Config.Env[] | select(startswith("POSTGRES_DB=")) | ltrimstr("POSTGRES_DB=")')"
    [[ "$current_user" == "$db_user" ]] || fail 'POSTGRES_USER changed. Keep the existing username or plan a separate migration.'
    [[ "$current_db" == "$db_name" ]] || fail 'POSTGRES_DB changed. Keep the existing database name or plan a separate migration.'
fi
running_services="$("${compose[@]}" ps --status running --services)"

# Compose keeps the named volume even when it recreates the container.
"${compose[@]}" up -d --wait postgres

# Read the actual container password, not Compose's escaped configuration output.
# Local socket administration lets psql hash the new password before ALTER ROLE.
# Feed it through stdin, never interpolate it into SQL or command-line arguments.
printf 'Applying configured PostgreSQL password; keeping existing data.\n'
"${compose[@]}" exec -T postgres sh -ec '
    printf "%s\n%s\n" "$POSTGRES_PASSWORD" "$POSTGRES_PASSWORD" |
        psql -X -w -h /var/run/postgresql -U "$POSTGRES_USER" -d postgres \
            -v ON_ERROR_STOP=1 -c "\\password"
'

# Verify password authentication over TCP, not the trusted local socket.
"${compose[@]}" exec -T postgres sh -ec \
    'PGPASSWORD="$POSTGRES_PASSWORD" exec psql -X -w -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -c "SELECT current_database(), current_user, 1 AS connection_ok;"'

# Refresh an existing exporter without starting optional services unexpectedly.
if printf '%s\n' "$running_services" | grep -Fxq postgres-exporter; then
    "${compose[@]}" up -d --no-deps postgres-exporter
fi
printf 'Database password updated and login verified. No volumes were deleted.\n'
