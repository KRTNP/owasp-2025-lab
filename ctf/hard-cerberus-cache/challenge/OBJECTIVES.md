1. Login and collect `FLAG{cache_footprint}` from `/api/me`.
2. Use cache-hit auth bypass on `/api/doc/admin-secrets` to extract `FLAG{key_confusion}`.
3. Abuse bot priming + trusted object caching to obtain `FLAG{poisoned_object}`.
4. Reuse poisoned cache auth context on `/api/root` to get `FLAG{cerberus_root}`.
