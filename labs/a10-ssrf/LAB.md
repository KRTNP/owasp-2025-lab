# A10: Server-Side Request Forgery (SSRF) - Starter Lab

## Goal
Demonstrate server-side URL fetch abuse and contain it.

## Scenario
Feature fetches remote URL from user input (webhook/preview/import).

## Steps
1. Find URL-fetch feature.
2. Probe allowed schemes/hosts/redirect behavior.
3. Attempt access to internal metadata/internal service paths.
4. Implement allowlist and egress restrictions; retest.

## Evidence
- Internal endpoint response via server-side fetch
- Bypass attempts and final blocked behavior

## Remediation
- Strict URL allowlist
- Block private IP ranges and metadata endpoints
- Network egress segmentation
