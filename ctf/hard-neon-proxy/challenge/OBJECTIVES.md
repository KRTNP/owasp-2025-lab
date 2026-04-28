1. Login as low-priv user and get `FLAG{proxy_foothold}`.
2. Abuse profile-note approval side effect (`#approve-admin`) then pivot to internal `/admin/hint` to get `FLAG{header_smuggle}`.
3. Chain trusted `X-Forwarded-Host` + elevated debug context on `/admin/pivot` to get `FLAG{trust_boundary_break}` and ops key.
4. Satisfy root-vault constraints (identity + ops key + elevated context) and retrieve `FLAG{neon_root}`.
