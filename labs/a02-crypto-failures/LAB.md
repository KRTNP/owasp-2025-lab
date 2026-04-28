# A02: Cryptographic Failures - Starter Lab

## Goal
Find insecure crypto usage or sensitive data exposure in transit/at rest.

## Scenario
App stores or transmits sensitive data with weak/no encryption.

## Steps
1. Identify sensitive fields (password reset token, PII, API key).
2. Check if transport uses HTTPS/TLS only.
3. Inspect tokens/cookies for weak signing or plaintext data.
4. Validate password storage practice (hash algorithm + salt).

## Evidence
- Weak algorithm/config proof
- Decodable sensitive token content
- Screenshots/log snippets

## Remediation
- Use strong algorithms (`bcrypt/argon2`, AES-GCM)
- Enforce HTTPS + HSTS
- Rotate keys and separate environments
