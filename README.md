# CodeQL Security Analysis Lab

This repository documents a before-and-after security analysis of a small Node.js/Express application using GitHub CodeQL.

> The first version was intentionally vulnerable for educational scanning. It was never deployed.

## Project and CodeQL setup

- Project: Node.js/Express demonstration API
- CodeQL configuration: GitHub default setup
- Language analyzed: JavaScript / TypeScript
- Initial scan: [CodeQL run #1](https://github.com/stackemt/codeql-security-lab/actions/runs/33712573616)
- Final scan: [CodeQL run #3](https://github.com/stackemt/codeql-security-lab/actions/runs/33712778164)
- Historical results: [Closed CodeQL alerts](https://github.com/stackemt/codeql-security-lab/security/code-scanning?query=is%3Aclosed+branch%3Amain)

## Initial security findings

The first CodeQL scan reported **5 open alerts**.

| # | Finding | Severity | Location | Security impact |
|---|---|---|---|---|
| 1 | Uncontrolled command line | Critical | `app.js:8` | User input was passed directly to `exec()`. An attacker could execute arbitrary operating-system commands and potentially take control of the server. |
| 2 | Exception text reinterpreted as HTML | Medium | `app.js:9` | A raw error message was returned in an HTTP response. If interpreted as HTML, attacker-controlled content could enable cross-site scripting and could also expose internal error details. |
| 3 | Uncontrolled data used in path expression | High | `app.js:15` | A request parameter was used directly as a file path. An attacker could attempt path traversal to read files outside the intended directory. |
| 4 | Missing rate limiting | High | `app.js:7` | The command endpoint had no request limit. Repeated automated requests could consume resources and contribute to denial-of-service abuse. |
| 5 | Missing rate limiting | High | `app.js:14` | The file endpoint had no request limit. An attacker could repeatedly request files, causing resource exhaustion or automated scraping. |

## Changes made

- Removed `child_process.exec()` and replaced it with two safe application operations selected by strict comparisons.
- Replaced the user-controlled file path with an allowlist that maps one approved name to one fixed file path.
- Added `express-rate-limit` globally: 30 requests per minute per client.
- Replaced detailed exception output with generic error responses.
- Added an explicit plain-text response type for file content.

## Before and after comparison

| Result | Before fixes | After fixes |
|---|---:|---:|
| Open CodeQL alerts | 5 | 0 |
| Closed/resolved alerts | 0 | 5 |
| Critical | 1 open | 0 open |
| High | 3 open | 0 open |
| Medium | 1 open | 0 open |
| CodeQL workflow | Successful | Successful |

The final CodeQL scan completed successfully and reports **0 open alerts** and **5 closed alerts**.

## Video demonstration script (under 5 minutes)

**0:00-0:30 — Introduction**

“Hi, this is my GitHub CodeQL security analysis project. The repository is called CodeQL Security Lab, and it contains a small Node.js Express application.”

**0:30-1:00 — Show CodeQL setup**

“Under Settings, Advanced Security, Code scanning, I enabled CodeQL default setup. GitHub detected JavaScript and ran the CodeQL workflow automatically.”

**1:00-2:20 — Show the original findings**

“The initial scan found five alerts: one critical uncontrolled command-line vulnerability, two high-severity missing rate-limiting alerts, one high-severity uncontrolled file-path vulnerability, and one medium-severity HTML error-message issue. Command injection could allow remote command execution. The uncontrolled path could allow unauthorized file reads. Missing rate limiting could support denial-of-service abuse, and returning raw error text could expose details or contribute to cross-site scripting.”

**2:20-3:30 — Show the code changes**

“I removed operating-system command execution and replaced it with strict, safe application operations. I restricted file access with an allowlist, added a 30-request-per-minute rate limit, and changed error handling so internal exception messages are not sent to users.”

**3:30-4:20 — Show the final scan**

“After committing the fixes, CodeQL ran again successfully. The security page now shows zero open alerts and five closed alerts. This demonstrates that all five original findings were resolved.”

**4:20-4:35 — Conclusion**

“In conclusion, CodeQL identified serious input-validation and abuse-prevention problems, and the second scan verified that the changes fixed them.”
