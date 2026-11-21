# Kibana and the SyncSpace log pipeline

Use this guide to find a real SyncSpace gateway request in Kibana. Start from the repository root with your local `.env` configured.

## Find a request in Discover

1. Run `make up` and generate an HTTPS request through the Nginx gateway.

   ```bash
   curl -kfsS https://localhost:8443/api/test
   ```

   Expect `The Back end Already healthy`. The `-k` option is for the local self-signed certificate.
2. Open [Kibana](http://127.0.0.1:5601). Sign in as `elastic` with the `ELASTIC_PASSWORD` from `.env`.
3. Search for **Discover** in Kibana’s top search bar. Choose **Create data view** if you’re setting it up for the first time.
4. Name it **SyncSpace Nginx access logs**. Set the index pattern to `syncspace-nginx-access-*` and the timestamp field to `@timestamp`. Save the data view.
5. Select **Last 15 minutes** and enter this query in Discover:

   ```text
   nginx.path: "/api/test" and nginx.status: 200
   ```

   Expand the result to see `nginx.status`, `nginx.duration_seconds`, and `nginx.request_id`. The request ID identifies one specific request.

## How the services communicate

ELK stands for **Elasticsearch, Logstash, and Kibana**. Filebeat is the log collector. The pipeline is the series of handoffs that makes a gateway request searchable.

```text
Nginx ── shared log file ──▶ Filebeat ── Beats over TCP ──▶ Logstash
                                                             │
                                                             │ HTTP
                                                             ▼
Browser ── HTTP ──▶ Kibana ── search over HTTP ──────────▶ Elasticsearch
```

| Service | What it does in SyncSpace |
| --- | --- |
| **Nginx** | Writes a JSON line for each logged HTTPS request to `/var/log/syncspace/access.json` on the `nginx_access_logs` volume. [Gateway config](../infra/nginx/conf.d/default.conf.template) |
| **Filebeat** | Reads the shared log file through a read-only mount and sends new lines to `logstash:5044`. Its `filebeat_data` volume remembers how far it has read. [Filebeat config](../infra/elk/filebeat/filebeat.yml) |
| **Logstash** | Receives Beats events, parses the JSON into `nginx.*` fields, and sets `@timestamp` from the request time. It writes to `http://elasticsearch:9200` as `syncspace_log_writer`. [Logstash pipeline](../infra/elk/logstash/pipeline/nginx.conf) |
| **Elasticsearch** | Stores each event in a daily index such as `syncspace-nginx-access-2026.11.20`. It answers Kibana’s searches across those indices. [Index setup](../infra/elk/logstash/init.cjs) |
| **Kibana** | Serves the browser UI on `127.0.0.1:5601` and connects to `http://elasticsearch:9200` as `kibana_system`. Discover uses the data view and time range to query Elasticsearch. [Compose services](../docker-compose.yml) |

On startup, `kibana-init` checks or sets the Kibana service password, and `logstash-init` prepares the writer account and index template. A successful setup container shows `Exited (0)`. The browser login uses `elastic`.

## If the request is missing

- **Kibana says it is not ready.** Run `make logs SERVICES="kibana-init kibana"` and check for startup or authentication errors. `curl -sS http://127.0.0.1:5601/api/status` should show `available` once startup completes.
- **Discover is empty.** Select `syncspace-nginx-access-*`, verify the `@timestamp` field and time range, then generate a fresh request and refresh Discover.
- **Still missing.** Run `make logs SERVICES=nginx` to confirm the gateway logged the request, then `make logs SERVICES="filebeat logstash"` to check the handoff. Use `Ctrl-C` to stop following logs.

The current pipeline collects Nginx HTTPS access logs. WAF audit logs, log retention, and archives are separate work. `make down` keeps the volumes, while `docker compose down -v` removes them, including the indexed logs.

[Elastic Discover guide](https://www.elastic.co/guide/en/kibana/8.11/discover.html)
