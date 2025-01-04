import type { ListenerResponse } from "./content_script";
import type { PlaylistCreateResponse } from "./youtube-api";

export enum PlaylistPrivacy {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
	UNLISTED = "UNLISTED",
}

export type PlaylistParams = {
	links: string[];
	ids: YouTubeID[];
	title: string;
	privacy: PlaylistPrivacy;
};

export const videoIDsOnly = (ids: YouTubeID[]): string[] => {
	if (ids.length === 0) {
		return [];
	}
	const result: string[] = [];
	for (const id of ids) {
		if (id.type === "video") {
			result.push(id.id);
		} else {
			result.push(...id.playlist_video_ids || []);
		}
	}
	return result;
};

export type YouTubeID = {
	type: "video" | "playlist";
	id: string;
	playlist_video_ids?: string[];
};

export const processLinks = async (
	params: PlaylistParams,
): Promise<PlaylistParams> => {
	const promises: Promise<YouTubeID>[] = params.links.map((link) => {
		// check if playlist
		if (link.includes("playlist?list=")) {
			// get playlist id
			const playlistID = getPlaylistID(link);
			if (playlistID !== null) {
				// fetch playlist
				return getPlaylistVideoIDs(playlistID).then((playlist_video_ids) => {
					return { type: "playlist", id: playlistID, playlist_video_ids } as YouTubeID;
				});
			}
		} else {
			// get video id
			const videoID = getVideoID(link);
			if (videoID !== null) {
				return Promise.resolve({ type: "video", id: videoID });
			}
		}
		return Promise.resolve({ type: "video", id: "" });
	});

	const ids: YouTubeID[] = await Promise.all(promises);

	console.log("ids", ids);
	if (ids.length === 0) {
		return {
			...params,
			ids: [],
		};
	}

	return {
		...params,
		ids: ids.filter((id) => id.id !== ""),
	} as PlaylistParams;
};

const getVideoID = (url: string): string | null => {
	// thank you to https://stackoverflow.com/questions/2936467/parse-youtube-video-id-using-preg-match/6382259#6382259
	const match = url.match(
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\?v=|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
	);
	return match ? match[1] : null;
};

const getPlaylistID = (url: string): string | null => {
	// link should be in form: https://www.youtube.com/playlist?list=PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW24
	const match = url.match(
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\?list=)|youtu\.be\/)([^"&?/\s]+)/i,
	);
	return match ? match[1] : null;
};

const getPlaylistVideoIDs = async (playlistID: string): Promise<string[]> => {
	// const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistID}&key=${YOUTUBE_API_KEY}`;
	// const response = await fetch(url);
	// const data = await response.json();
	// return data.items.map((item: any) => item.contentDetails.videoId);
	return [];
};

export const getCookie = async (cname: string): Promise<string | undefined> => {
	const name = `${cname}=`;
	const cookies = await getCookies();
	const decodedCookie = decodeURIComponent(cookies);
	console.log("decodedCookie", decodedCookie);
	const ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return undefined;
};

const getCookies = async (): Promise<string> => {
	const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	console.log("tabs", tabs);
	const currentTabId = tabs[0].id;
	console.log("currentTabId", currentTabId);
	if (currentTabId) {
		return new Promise((resolve, reject) => {
			chrome.tabs.sendMessage(
				currentTabId,
				{ action: "getCookies" },
				(response: ListenerResponse) => {
					console.log("response", response);
					if (response?.cookies) {
						resolve(response.cookies);
					} else {
						reject("No cookies found");
					}
				},
			);
		});
	}
	return "";
};