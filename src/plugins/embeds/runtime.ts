import { definePlugin } from "emdash";

export function createPlugin() {
	return definePlugin({
		id: "sustainomics-embeds",
		version: "1.0.0",
		admin: {
			portableTextBlocks: [
				{
					type: "youtube",
					label: "YouTube Video",
					icon: "video",
					description: "Embed a YouTube video in the article.",
					fields: [
						{ type: "text_input", action_id: "id", label: "YouTube URL", placeholder: "https://www.youtube.com/watch?v=..." },
						{ type: "text_input", action_id: "title", label: "Accessible title" },
					],
				},
			],
		},
	});
}

export default createPlugin;
