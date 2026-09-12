import type { CacheHint } from "emdash";

type CacheHost = {
	cache?: { enabled?: boolean; set: (hint: CacheHint) => void };
	locals: object;
};

export function mergeCacheHints(...hints: Array<CacheHint | undefined | null>): CacheHint {
	const tags = new Set<string>();
	let lastModified: Date | undefined;

	for (const hint of hints) {
		if (!hint) continue;
		for (const tag of hint.tags ?? []) tags.add(tag);
		if (hint.lastModified && (!lastModified || hint.lastModified > lastModified)) {
			lastModified = hint.lastModified;
		}
	}

	return { tags: [...tags], lastModified };
}

export function addCacheHint(Astro: CacheHost, ...hints: Array<CacheHint | undefined | null>) {
	const locals = Astro.locals as { __cacheHint?: CacheHint };
	const merged = mergeCacheHints(locals.__cacheHint, ...hints);
	locals.__cacheHint = merged;
	if (Astro.cache?.enabled) Astro.cache.set(merged);
}
