const { ELASTICSEARCH_URL, ELASTIC_PASSWORD, KIBANA_PASSWORD } = process.env;

function authorization(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

async function setupKibana() {
  if (!ELASTICSEARCH_URL || !ELASTIC_PASSWORD || !KIBANA_PASSWORD || KIBANA_PASSWORD.length < 6) {
    throw new Error("Set ELASTIC_PASSWORD and a KIBANA_PASSWORD of at least six characters.");
  }

  const kibanaAuth = authorization("kibana_system", KIBANA_PASSWORD);
  const authenticate = () =>
    fetch(new URL("/_security/_authenticate", ELASTICSEARCH_URL), {
      headers: { authorization: kibanaAuth },
      signal: AbortSignal.timeout(10000),
    });

  const current = await authenticate();
  if (current.ok) {
    console.log("Elasticsearch already accepts the configured kibana_system password.");
    return;
  }
  if (current.status !== 401) {
    throw new Error(`Kibana authentication check returned HTTP ${current.status}.`);
  }

  const update = await fetch(
    new URL("/_security/user/kibana_system/_password", ELASTICSEARCH_URL),
    {
      method: "POST",
      headers: {
        authorization: authorization("elastic", ELASTIC_PASSWORD),
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: KIBANA_PASSWORD }),
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!update.ok) {
    throw new Error(`Could not set the kibana_system password (HTTP ${update.status}). Check ELASTIC_PASSWORD.`);
  }

  const verified = await authenticate();
  if (!verified.ok) {
    throw new Error(`Elasticsearch still rejects kibana_system (HTTP ${verified.status}).`);
  }
  console.log("Set and verified the kibana_system password in Elasticsearch.");
}

setupKibana().catch((error) => {
  console.error(`Kibana setup failed: ${error.message}`);
  process.exitCode = 1;
});
