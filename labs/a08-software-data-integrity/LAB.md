# A08: Software and Data Integrity Failures - Starter Lab

## Goal
Find untrusted update/integrity paths (unsigned artifacts, unsafe deserialization).

## Scenario
App trusts external/internal data without integrity validation.

## Steps
1. Map update/import/plugin/data ingestion paths.
2. Check signature/hash verification for artifacts.
3. Test tampered payload acceptance.
4. Enforce integrity checks and retest.

## Evidence
- Tampered content accepted by system
- No signature/hash enforcement

## Remediation
- Signed artifacts and strict verification
- Safe serialization formats and validation
- Trusted registry and provenance controls
