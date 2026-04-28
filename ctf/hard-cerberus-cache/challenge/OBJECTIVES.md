1. Login and collect `FLAG{cache_footprint}` from `/api/me`.
2. Abuse bucketed cache behavior to extract `FLAG{key_confusion}` from `admin-secrets`.
3. Use ticketed bot priming to inject trusted internal object and obtain `FLAG{poisoned_object}`.
4. Reuse poisoned bucket auth context on `/api/root` to get `FLAG{cerberus_root}`.
