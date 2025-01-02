import type { ListenerResponse } from "./content_script";
import type { PlaylistCreateResponse } from "./youtube-api";

export enum PlaylistPrivacy {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
	UNLISTED = "UNLISTED",
}

export type PlaylistParams = {
    videoIDs: string[];
    title: string;
    privacy: PlaylistPrivacy;
};

export const processLinks = async (
	params : PlaylistParams,
): Promise<PlaylistParams> => {
	const promises: Promise<string[]>[] = params.videoIDs.map((link) => {
		// check if playlist
		if (link.includes("playlist?list=")) {
			// get playlist id
			const playlistID = getPlaylistID(link);
			if (playlistID !== null) {
				// fetch playlist
				return getPlaylistVideoIDs(playlistID);
			}
		} else {
			// get video id
			const videoID = getVideoID(link);
			if (videoID !== null) {
				return Promise.resolve([videoID]);
			}
		}
		return Promise.resolve([]);
	});

	const videoIDs: string[] = await Promise.all(promises).then((results) => {
		const videoIDs: string[] = [];
		for (const result of results) {
			videoIDs.push(...result);
		}
		return videoIDs;
	})
    .catch((error) => {
        console.error("error", error);
        return [];
    });

    console.log("videoIDs", videoIDs);
    if (videoIDs.length === 0) {
        return {
			...params,
			videoIDs: [],
		}
    }

   return {
        ...params,
        videoIDs,
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
