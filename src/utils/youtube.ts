export function getYouTubeId(value?: string | null): string | null {
	if (!value) return null;
	const input = value.trim();
	if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;

	try {
		const url = new URL(input);
		if (url.hostname === "youtu.be") {
			return url.pathname.split("/").filter(Boolean)[0]?.slice(0, 11) ?? null;
		}
		if (url.hostname.endsWith("youtube.com")) {
			const id = url.searchParams.get("v")
				?? url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/)?.[1];
			return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
		}
	} catch {
		return null;
	}

	return null;
}
