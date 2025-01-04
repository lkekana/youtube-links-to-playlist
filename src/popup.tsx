import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import { getCookie, type PlaylistParams, PlaylistPrivacy, processLinks } from "./youtube";
import type { ListenerRequest, ListenerResponse } from "./content_script";
import ChangeViewButton from "./components/changeviewbutton";
import Playlist, { type PlaylistInfo } from "./components/playlist";
import { addNewPlaylist, getPlaylists } from "./user_playlists";
import PrivacyOptions from "./components/privacyoptions";

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

export enum ActiveSection {
	FORM = "main-form",
	PLAYLISTS = "playlists",
};

const Popup = () => {
	// const [count, setCount] = useState(0);
	const titleRef = useRef<HTMLInputElement>(null);
	const [currentURL, setCurrentURL] = useState<string>();
	const [processing, setProcessing] = useState(false);
	const [linksText, setLinksText] = useState("");
	const [backupLinkText, setBackupLinkText] = useState("");
	const [privacy, setPrivacy] = useState<PlaylistPrivacy>(
		PlaylistPrivacy.PRIVATE,
	);
	const [activeView, setActiveView] = useState<ActiveSection>(ActiveSection.FORM);
	const [userPlaylists, setUserPlaylists] = useState<PlaylistInfo[]>([]);
	const [shouldOpenPlaylist, setShouldOpenPlaylist] = useState(true);
	const [anonymousPlaylist, setAnonymousPlaylist] = useState(false);
	const [authorised, setAuthorised] = useState(false);
	const [userOnYouTube, setUserOnYouTube] = useState(false);

	console.log("userPlaylists", userPlaylists);
	console.log("activeView", activeView);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setLinksText(e.target.value);
	};

	const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPrivacy(e.target.value as PlaylistPrivacy);
	};

	const handleOpenPlaylistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShouldOpenPlaylist(e.target.checked);
	};

	const handleAnonymousPlaylistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAnonymousPlaylist(e.target.checked);
	};

	// useEffect(() => {
	// 	chrome.action.setBadgeText({ text: count.toString() });
	// }, [count]);

	const submitClick = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setProcessing(true);
		setBackupLinkText(linksText);
		const links = linksText.split("\n").filter((link) => link.trim() !== "");

		console.log("links", links);
		await processLinks({
			links: links,
			ids: [],
			title: (document.getElementById("title") as HTMLInputElement).value,
			privacy: privacy,
		} as PlaylistParams)
		.then(async (processedParams) => {
			console.log("processedParams", processedParams);
			const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, currentWindow: true });
			console.log("tabs", tabs);
			const currentTabId = tabs[0].id;
			console.log("currentTabId", currentTabId);
			if (currentTabId) {
				return new Promise<PlaylistInfo>((resolve, reject) => {
					chrome.tabs.sendMessage(currentTabId, 
						{ 
							action: "createPlaylist",
							playlistParams: processedParams,
						} as ListenerRequest,
						(response: ListenerResponse) => {
						console.log("direct message response", response);
						if (response?.playlistId) {
							resolve({
								title: processedParams.title,
								playlistID: response.playlistId,
								ids: processedParams.ids,
								privacyStatus: processedParams.privacy,
								description: "",
								createdAt: Date.now(),
							});
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
		.then((playlist) => {
			console.log("playlist", playlist);
			// setCount((prevCount) => prevCount + 1);
			addNewPlaylist(playlist)
			.then((playlists) => {
				setUserPlaylists(playlists);
				console.log("userPlaylists (pre-open)", userPlaylists);
				if (shouldOpenPlaylist) {
					openLink(`https://www.youtube.com/playlist?list=${playlist.playlistID}`);
				}
				setActiveView(ActiveSection.PLAYLISTS);
				clearForm();
			});
		})
		.catch((error) => {
			console.error("error", error);
			setProcessing(false);
			setLinksText(backupLinkText);
		});
	};

	const cancelClick = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setProcessing(false);
		setLinksText(backupLinkText);
	};

	const clearForm = () => {
		setProcessing(false);
		setLinksText("");
		setBackupLinkText("");
		setPrivacy(PlaylistPrivacy.PRIVATE);
	};

	const openLink = (link: string) => {
		chrome.tabs.create({ url: link });
	};

	useEffect(() => {
		const fetchPlaylists = async () => {
		  try {
			const playlists = await getPlaylists();
			setUserPlaylists(playlists);
		  } catch (error) {
			console.error("Failed to fetch playlists", error);
		  }
		};

		const checkAuth = async () => {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			const url = tab?.url;
			if (!url) return;
			setCurrentURL(url);
			console.log("currentURL", url);
	
			// if currentURL is a YouTube URL (match with regex)
			// if *.youtube.com/* or *.youtube.com
			// AND if not *.youtube-nocookie.com/*
			const isOnYouTube =
				/^(https?:\/\/)?(www\.)?youtube\.com\/?/.test(url) &&
				!/^(https?:\/\/)?(www\.)?youtube-nocookie\.com\/.*/.test(url);
			setUserOnYouTube(isOnYouTube);
			console.log("isOnYouTube", isOnYouTube);
	
			if (isOnYouTube) {
				// Check cookies if on YouTube
				const SAPISID = await getCookie("SAPISID");
				if (SAPISID) {
					setAuthorised(true);
				} else {
					setAuthorised(false);
					setAnonymousPlaylist(true);
				}
			} else {
				setAuthorised(false);
				setAnonymousPlaylist(true);
			}
		};

		fetchPlaylists();
		checkAuth();
		titleRef.current?.focus();
	}, []);

	return (
		<>
			{/* Header */}
			<header>
				<ChangeViewButton
					onClick={() => {
						setActiveView(activeView === ActiveSection.FORM ? ActiveSection.PLAYLISTS : ActiveSection.FORM);
					}}
					activeSection={activeView}
					targetSection={activeView === ActiveSection.FORM ? ActiveSection.PLAYLISTS : ActiveSection.FORM}
				/>
			</header>

			{/* Main */}
			<main className={"min-w-96 w-max"}>
				{/* Main Form */}
				<section id={ActiveSection.FORM} className={activeView === ActiveSection.FORM ? "" : "hidden"}>
					<h1 className="text-center">▶</h1>
					<h2 className="text-center">Create a new playlist</h2>

					{/* Text */}
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Playlist title"
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
							value={linksText}
							onChange={handleChange}
						/>

						<label htmlFor="open-playlist">
							<input
								type="checkbox"
								role="switch"
								id="open-playlist"
								name="terms"
								aria-checked={shouldOpenPlaylist}
								checked={shouldOpenPlaylist}
								onChange={handleOpenPlaylistChange}
								/>
								Open playlist after creation
						</label>

						{!userOnYouTube ? (
							<p className="text-xs text-center w-full"  style={{ color: "var(--muted-foreground)" }}>
								NOTE: You are not on YouTube. Your playlist will be created as unlisted.
							</p>
						) :
						!authorised ? (
							<p className="text-xs text-center w-full"  style={{ color: "var(--muted-foreground)" }}>
								NOTE: You are not signed in to YouTube. Your playlist will be created as unlisted.
							</p>
						) :
						( <label htmlFor="anonymous-playlist">
							<input
								type="checkbox"
								role="switch"
								id="anonymous-playlist"
								name="anonymous-playlist"
								aria-checked={anonymousPlaylist}
								checked={anonymousPlaylist}
								onChange={handleAnonymousPlaylistChange}
								disabled={!userOnYouTube || !authorised}
								/>
								Create anonymously (not associated with your YouTube account)
						</label> )}

						{/* Buttons */}

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

				{/* Playlists */}
				<section id={ActiveSection.PLAYLISTS} className={activeView === ActiveSection.PLAYLISTS ? "" : "hidden"}>
					<h1 className="text-center">▶</h1>
					<h2 className="text-center">Your Playlists</h2>

					{userPlaylists.map((playlist, index) => (
						<Playlist
							key={playlist.playlistID}
							title={playlist.title}
							playlistID={playlist.playlistID}
							ids={playlist.ids}
							privacyStatus={playlist.privacyStatus}
							description={playlist.description}
							createdAt={playlist.createdAt}
						/>
					))}
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
