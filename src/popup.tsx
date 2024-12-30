import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";

const INSTRUCTION_TEXT = `Enter your YouTube video link(s) here. 1 video link per line.
Both video links & IDs are supported.

You can also paste a playlist link to add all videos in the playlist
(playlist links must be in the form: https://www.youtube.com/playlist?list={playlist_id})`;

const LINK_BOX_PLACEHOLDER = `Examples:
https://www.youtube.com/watch?v=pZwvrxVavnQ
https://www.youtube.com/watch?v=Rk2FR8YflrE&t=1s
https://youtu.be/3xottY-7m3k
lVWwwfcQ5FA
https://www.youtube.com/playlist?list=PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW24
`;

const Popup = () => {
	const [count, setCount] = useState(0);
	const [currentURL, setCurrentURL] = useState<string>();

	useEffect(() => {
		chrome.action.setBadgeText({ text: count.toString() });
	}, [count]);

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			setCurrentURL(tabs[0].url);
		});
	}, []);

	const changeBackground = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0];
			if (tab.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						color: "#555555",
					},
					(msg) => {
						console.log("result message:", msg);
					},
				);
			}
		});
	};

	return (
		<>
			{/* Main */}
			<main className={"min-w-96 w-max"}>
				{/* Main Form */}
				<section id="main-form">
					<h2 className="text-center">Create a new playlist</h2>
					<p style={{ whiteSpace: "pre-line" }} className="text-sm">
						{INSTRUCTION_TEXT}
					</p>
					<form>
						{/* Link Box */}
						<textarea
							id="text"
							name="text"
							placeholder={LINK_BOX_PLACEHOLDER}
							rows={10} // Adjust number of visible rows
							className="w-full font-mono text-sm"
						/>

						<button type="submit">Create</button>
					</form>
				</section>
			</main>
		</>
	);
};

const root = createRoot(document.getElementById("root")!);

root.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
);
