# Website security guardrails

These controls apply to all ExpressEarth website development, content, analytics and repository work.

## Prohibited from source control and public content
- Passwords, API secrets, private keys, access/refresh tokens, session cookies, database credentials and signing secrets.
- Personal data, attendee lists, passport/visa documents, private client itineraries, unpublished commercial pricing and confidential contracts.
- Credentials or private configuration pasted into issues, pull requests, commit messages, screenshots, logs or documentation.

## Required handling
1. Use least-privilege, named accounts and role-based access. Never share a login or request credentials in chat.
2. Store server-side secrets only in the hosting provider's encrypted secret manager/environment settings. Never put secrets in React `REACT_APP_*` variables: Create React App embeds those values in browser bundles.
3. Use public, restricted-scope client identifiers only where intended for browser exposure; protect privileged operations on the server.
4. Keep `.env`, `.env.*`, private key and certificate files out of Git. Commit only a placeholder `.env.example` containing variable names and safe dummy values.
5. Validate and sanitise user input server-side; apply authentication, authorisation, rate limiting and CSRF protections to privileged or state-changing endpoints as appropriate.
6. Do not expose stack traces, tokens, API URLs containing credentials, personal data or internal identifiers in browser logs or error responses.
7. Use HTTPS, secure/HttpOnly/SameSite cookies where applicable, restrictive CORS, security headers and current dependency patches.
8. Review uploads and media for personal/confidential data and obtain client permission before publishing identifiable project material.
9. Review diffs before commit; scan for secrets and personal data; never copy secret values into audit reports. If a secret is suspected to have been committed, stop using it, rotate/revoke it immediately, then remove it from repository history through an approved process.
10. Keep development changes on a review branch. Production deployment and hosting configuration changes require the authorised developer/operator.

## Security review limitations
A text search is not a complete secret scan. It can miss encoded, generated, binary, historical or unindexed content. Run a dedicated secret scanner and dependency/security checks in CI and across repository history before production release. Verify hosting, backend, database, DNS, analytics and third-party account permissions separately; repository review alone cannot certify those systems.
