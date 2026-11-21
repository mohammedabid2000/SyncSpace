const { ELASTIC_PASSWORD, LOGSTASH_ES_PASSWORD } = process.env;
const indexPattern = "syncspace-nginx-access-*";
const writer = "syncspace_log_writer";

async function configureLogstash() {
  if (!ELASTIC_PASSWORD || !LOGSTASH_ES_PASSWORD || LOGSTASH_ES_PASSWORD.length < 6) {
    throw new Error("Set ELASTIC_PASSWORD and a LOGSTASH_ES_PASSWORD of at least six characters.");
  }

  const authorization = `Basic ${Buffer.from(`elastic:${ELASTIC_PASSWORD}`).toString("base64")}`;

  async function put(path, body) {
    const response = await fetch(`http://elasticsearch:9200${path}`, {
      method: "PUT",
      headers: { authorization, "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}.`);
  }

  await put("/_index_template/syncspace-nginx-access", {
    index_patterns: [indexPattern],
    priority: 200,
    template: {
      settings: { number_of_shards: 1, number_of_replicas: 0 },
      mappings: {
        properties: {
          "@timestamp": { type: "date" },
          nginx: {
            properties: {
              request_id: { type: "keyword" },
              method: { type: "keyword" },
              path: { type: "keyword" },
              status: { type: "integer" },
              duration_seconds: { type: "double" },
            },
          },
        },
      },
    },
  });
  await put(`/_security/role/${writer}`, {
    cluster: ["monitor"],
    indices: [{ names: [indexPattern], privileges: ["create_index", "create_doc"] }],
  });
  await put(`/_security/user/${writer}`, {
    password: LOGSTASH_ES_PASSWORD,
    roles: [writer],
  });
  console.log("Configured the Nginx log index template and Logstash writer.");
}

configureLogstash().catch((error) => {
  console.error(`Logstash setup failed: ${error.message}`);
  process.exitCode = 1;
});
