# CI and CD

## Continuous integration: ci.yml

CI runs on pull requests targeting develop/main and pushes to those branches.
It checks out the proposed code, installs Node 24 (matching the frontend Docker
build), validates Compose and Bash syntax, runs npm ci, builds the frontend,
and scans the checkout with Trivy for HIGH/CRITICAL vulnerabilities and secrets.
Actions are pinned to reviewed commits and Trivy to a specific version.

A successful frontend build proves the source compiles; it does not prove backend
integration or browser behavior. The security scan remains a separate requirement.
Moderate npm audit warnings are visible but are not failures under the current
HIGH/CRITICAL scan policy. Review those dependencies separately with the frontend
owner; do not apply npm audit fix --force blindly.

The previous failure was an AsymmetricPrivateKey finding in the tracked local TLS
key, not a frontend build failure. Certificate files are now generated locally and
ignored by Git. CI scans a clean checkout, so no private key is shipped as source.
A filesystem scan does not erase or scan the entire Git history. The previously
committed key remains historical and must not be reused; the local pair was rotated.

Do not generate runtime keys in the checkout before the CI filesystem scan. For a
local scan, export the Git index or commit into a clean temporary directory so
ignored local runtime secrets do not become repository findings.

## Continuous deployment: deploy.yml

This is a separate workflow triggered by pushes to main. The current deployment
file is still a template: it requires VPS_HOST, VPS_USER and SSH_PRIVATE_KEY secrets,
and `/path/to/SyncSpace` must be replaced with the real checkout path on that server.
It has not been validated against a VPS. A successful CI run is not proof that CD
is configured. The existing CD workflow does not currently wait for push CI to
succeed; complete that integration before relying on automatic deployment.

The local frontend/HTTPS/database checks are available through make up, make test
and make db-test. Local startup generates development certificates through make certs;
production TLS credentials must be provisioned separately.
