import type { PluginDescriptor } from "emdash";
import { fileURLToPath } from "node:url";

export function embedsPlugin(): PluginDescriptor {
	return {
		id: "sustainomics-embeds",
		version: "1.0.0",
		entrypoint: fileURLToPath(new URL("./runtime.ts", import.meta.url)),
		componentsEntry: fileURLToPath(new URL("./components.ts", import.meta.url)),
		options: {},
	};
}
