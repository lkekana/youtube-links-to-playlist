import React, { useState } from "react";
import { PlaylistPrivacy, type YouTubeID } from "../youtube";

export type PlaylistInfo = {
	title: string;
	playlistID: string;
	ids: YouTubeID[];
	privacyStatus: PlaylistPrivacy;
	description: string;
	focused?: boolean;
	createdAt: number;
};

const SVG_SIZE = "size-4";

const Playlist: React.FC<PlaylistInfo> = ({
	title,
	playlistID,
	ids,
	privacyStatus,
	description,
	focused = false,
}) => {
	const [copied, setCopied] = useState(false);
	const playlistLink = `https://www.youtube.com/playlist?list=${playlistID}`;

    const handleCopyClick = () => {
		navigator.clipboard.writeText(playlistLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const openLink = (link: string) => {
		chrome.tabs.create({ url: link });
	};

	let privacyStatusText: string;
	switch (privacyStatus) {
		case PlaylistPrivacy.PUBLIC:
			privacyStatusText = "🌎 Public";
			break;
		case PlaylistPrivacy.UNLISTED:
			privacyStatusText = "🔗 Unlisted";
			break;
		case PlaylistPrivacy.PRIVATE:
			privacyStatusText = "🔒 Private";
			break;
		default:
			privacyStatusText = "🔒 Private";
			break;
	}

	return (
		<>
			<div className="flex items-center justify-between">
				<h4 className="flex-grow truncate">
					<a href={playlistLink}>{title}</a>
				</h4>
				<div className="flex space-x-2">
					{/* Open In New Tab */}
					<div title="Open in new tab" onClick={() => openLink(playlistLink)}  onKeyUp={(e) => e.preventDefault()} onKeyDown={(e) => e.preventDefault()}>
						<svg
							role="img"
							aria-label="Open in new tab"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className={`${SVG_SIZE} cursor-pointer`}
						>
							<path
								fillRule="evenodd"
								d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z"
								clipRule="evenodd"
							/>
						</svg>
					</div>

					{/* Clipboard Copy */}
					<div title="Copy to clipboard" onClick={handleCopyClick} onKeyUp={(e) => e.preventDefault()} onKeyDown={(e) => e.preventDefault()}>
						{copied ? (
							<svg
								role="img"
								aria-label="Copied"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className={`${SVG_SIZE}`}
							>
								<path
									fillRule="evenodd"
									d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
									clipRule="evenodd"
								/>
								<path
									fillRule="evenodd"
									d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<svg
								role="img"
								aria-label="Copy to clipboard"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className={`${SVG_SIZE} cursor-pointer`}
							>
								<path
									fillRule="evenodd"
									d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z"
									clipRule="evenodd"
								/>
								<path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
								<path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
							</svg>
						)}
					</div>
				</div>
			</div>
			<details open={focused}>
				<summary>
					{ids.length} videos | {privacyStatusText}
				</summary>
				<p>
					<a href={playlistLink}>View Playlist</a>
					<br />
					<br />
					{description}
				</p>
			</details>
		</>
	);
};

export default Playlist;
