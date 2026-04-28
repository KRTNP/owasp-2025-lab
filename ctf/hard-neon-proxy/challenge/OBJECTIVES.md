1. Login as low-priv user and get `FLAG{proxy_foothold}`.
2. Reach `/proxy/admin/hint` by bypassing internal-only edge check to get `FLAG{header_smuggle}`.
3. Abuse trusted forwarded host on `/proxy/admin/pivot` to get `FLAG{trust_boundary_break}` + ops key.
4. Impersonate admin identity and use ops key on `/root-vault` to get `FLAG{neon_root}`.
