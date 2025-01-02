import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import { PlaylistPrivacy, processLinks } from "./youtube";
import type { ListenerRequest, ListenerResponse } from "./content_script";

const INSTRUCTION_TEXT = `Enter your YouTube video link(s) or ID(s) here. 1 video per line.

You can also paste a playlist link to add all videos in the playlist
(playlist links must be in the form: https://www.youtube.com/playlist?list={playlist_id})`;

const LINK_BOX_PLACEHOLDER = `Enter your YouTube video link(s) or ID(s) here. 1 video per line.

You can also paste a playlist link to add all videos in the playlist
(playlist links must be in the form: https://www.youtube.com/playlist?list={playlist_id})

Examples:
https://www.youtube.com/watch?v=pZwvrxVavnQ
https://www.youtube.com/watch?v=Rk2FR8YflrE&t=1s
https://youtu.be/3xottY-7m3k
lVWwwfcQ5FA
https://www.youtube.com/playlist?list=PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW24
`;

const Popup = () => {
	// const [count, setCount] = useState(0);
	// const [currentURL, setCurrentURL] = useState<string>();
	const [processing, setProcessing] = useState(false);
	const [text, setText] = useState("");
	const [backupText, setBackupText] = useState("");
	const [privacy, setPrivacy] = useState<PlaylistPrivacy>(
		PlaylistPrivacy.PRIVATE,
	);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPrivacy(e.target.value as PlaylistPrivacy);
	};

	// useEffect(() => {
	// 	chrome.action.setBadgeText({ text: count.toString() });
	// }, [count]);

	// useEffect(() => {
	// 	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	// 		setCurrentURL(tabs[0].url);
	// 	});
	// }, []);

	const submitClick = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setProcessing(true);
		setBackupText(text);
		const links = text.split("\n").filter((link) => link.trim() !== "");

		console.log("links", links);
		await processLinks({
			videoIDs: links,
			title: (document.getElementById("title") as HTMLInputElement).value,
			privacy: privacy,
		})
		.then(async (processedParams) => {
			console.log("processedParams", processedParams);
			const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, currentWindow: true });
			console.log("tabs", tabs);
			const currentTabId = tabs[0].id;
			console.log("currentTabId", currentTabId);
			if (currentTabId) {
				return new Promise((resolve, reject) => {
					chrome.tabs.sendMessage(currentTabId, 
						{ 
							action: "createPlaylist",
							playlistParams: processedParams,
						} as ListenerRequest,
						(response: ListenerResponse) => {
						console.log("direct message response", response);
						if (response?.playlistId) {
							resolve(response.playlistId);
						} else if (response?.error) {
							reject(response.error);
						}
						else {
							reject("An unspecified error occurred");
						}
					});
				});
			}
			return Promise.reject("No current tab found");
		})
		.then((playlistId) => {
			console.log("playlistId", playlistId);
			// setCount((prevCount) => prevCount + 1);
			setProcessing(false);
			setText("");
		})
		.catch((error) => {
			console.error("error", error);
			setProcessing(false);
			setText(backupText);
		});
	};

	const cancelClick = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setProcessing(false);
		setText(backupText);
	};

	return (
		<>
			{/* Main */}
			<main className={"min-w-96 w-max"}>
				{/* Main Form */}
				<section id="main-form">
					<h1 className="text-center">▶</h1>
					<h2 className="text-center">Create a new playlist</h2>

					{/* Text */}
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Choose a playlist title"
						required
						className="w-full text-sm resize-none m-1"
					/>

					{/* Select */}
					<select
						id="privacy-select"
						name="privacy-select"
						required
						value={privacy}
						onChange={handlePrivacyChange}
						className="w-full m-1"
					>
						<option value={PlaylistPrivacy.PUBLIC}>
						🌎 Public: Anyone can search for and view
						</option>
						<option value={PlaylistPrivacy.UNLISTED}>
						🔗 Unlisted: Anyone with the link can view
						</option>
						<option value={PlaylistPrivacy.PRIVATE}>
						🔒 Private: Only you can view
						</option>
					</select>

					{/* Instructions */}
					{/* <p style={{ whiteSpace: "pre-line" }} className="text-sm">
						{INSTRUCTION_TEXT}
					</p> */}
					<form className="m-1">
						{/* Link Box */}
						<textarea
							id="text"
							name="text"
							placeholder={LINK_BOX_PLACEHOLDER}
							rows={10} // Adjust number of visible rows
							className="w-full font-mono text-xs resize-none"
							readOnly={processing}
							aria-busy={processing}
							value={text}
							onChange={handleChange}
						/>

						{processing ? (
							<button
								type="reset"
								style={{ backgroundColor: "var(--muted-foreground)" }}
								onClick={cancelClick}
							>
								Cancel
							</button>
						) : (
							<button
								type="submit"
								style={{ backgroundColor: "var(--primary)" }}
								onClick={submitClick}
							>
								Create
							</button>
						)}
					</form>
				</section>
			</main>
		</>
	);
};

const rootElement = document.getElementById("root");
if (rootElement !== null) {
	const root = createRoot(rootElement);

	root.render(
		<React.StrictMode>
			<Popup />
		</React.StrictMode>,
	);
}
