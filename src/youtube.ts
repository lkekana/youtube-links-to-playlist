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
	setTextArea: React.Dispatch<React.SetStateAction<string>>,
): Promise<string | null> => {
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
        setTextArea("No valid video IDs found");
        return null;
    }

    const processedParams = {
        ...params,
        videoIDs,
    };

    return await createPlaylist(
        processedParams.videoIDs,
        processedParams.title,
        processedParams.privacy,
    );
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

const createPlaylist = async (
	videoIDs: string[],
	title: string,
	privacy: PlaylistPrivacy,
): Promise<string> => {
	return await fetch(
		// "https://www.youtube.com/youtubei/v1/playlist/create?prettyPrint=false",
        "https://localhost:3000",
		{
			headers: {
				accept: "*/*",
				authorization: await getAuthorizationHeader(),
				"content-type": "application/json",
			},
			referrer: "https://www.youtube.com",
			referrerPolicy: "strict-origin-when-cross-origin",
			body: JSON.stringify({
				context: {
					client: {
						hl: "en-US",
						gl: "US",
						remoteHost: await getRemoteHost(),
						deviceMake: getDeviceMake(),
						deviceModel: "",
						visitorData: "",
						userAgent: navigator.userAgent,
						clientName: "WEB",
						clientVersion: "2.20241219.01.01",
						osName: "Macintosh",
						osVersion: "10_15_7",
						originalUrl: window.location.href,
						platform: "DESKTOP",
						clientFormFactor: "UNKNOWN_FORM_FACTOR",
						configInfo: {},
						userInterfaceTheme: "USER_INTERFACE_THEME_LIGHT",
						timeZone: "Africa/Johannesburg",
						browserName: "Chrome",
						browserVersion: "128.0.0.0",
						acceptHeader:
							"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
						rolloutToken: "",
						screenWidthPoints: getScreenResolution().width,
						screenHeightPoints: getScreenResolution().height,
						screenPixelDensity: getScreenResolution().pixelDensity,
						screenDensityFloat: getScreenResolution().pixelDensity,
						utcOffsetMinutes: 0,
						connectionType: "CONN_WIFI",
						memoryTotalKbytes: "8000000",
						mainAppWebInfo: {},
					},
					user: {
						lockedSafetyMode: false,
					},
					request: {
						useSsl: true,
						consistencyTokenJars: [],
						internalExperimentFlags: [],
					},
					adSignalsInfo: {
						params: [],
					},
				},
				title: title,
				privacyStatus: privacy,
				videoIds: videoIDs,
				params: "",
			}),
			method: "POST",
			mode: "cors",
			credentials: "include",
		},
	)
    .then((response) => response.json())
    .then((data: PlaylistCreateResponse) => {
        return data.playlistId;
    })
};

const getCookie = async (cname: string): Promise<string | undefined> => {
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
}

const getCookies = async (): Promise<string> => {
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("tabs", tabs);
    const currentTabId = tabs[0].id;
    console.log("currentTabId", currentTabId);
    if (currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { action: "getCookies" }, (response: ListenerResponse) => {
            console.log("response", response);
            if (response.cookies) {
                return response.cookies;
            }
        });
    }
    return "";
}

const padStart = (str: string, targetLength: number, padString = ' '): string => {
    const targetLen = Math.trunc(targetLength); // truncate if number or convert non-number to 0
    let padStr = String(padString);

    if (str.length > targetLen) {
        return String(str);
    }

    const paddingNeeded = targetLen - str.length;
    if (paddingNeeded > padStr.length) {
        padStr += padStr.repeat(Math.ceil(paddingNeeded / padStr.length)); // append to original to ensure we are longer than needed
    }

    return padStr.slice(0, paddingNeeded) + String(str);
};

const sha1 = async (input: string) => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-1", encoder.encode(input));

    const hash = Array.from(new Uint8Array(hashBuffer))
        .map((v) => padStart(v.toString(16), 2, "0"))
        .join("");

    return hash;
}

const getAuthorizationHeader = async () => {
	const ytURL = "https://www.youtube.com";
	const SAPISID = await getCookie("SAPISID");
    console.log("SAPISID", SAPISID);
    if (!SAPISID) {
        return "";
    }
	const currentDate = Math.floor(Date.now() / 1e3);
	const initialData = [currentDate, SAPISID, ytURL];
	const joinedInitialData = initialData.join(" ");
	const hash = await sha1(joinedInitialData);
	const result = ["SAPISIDHASH", [currentDate, hash].join("_")].join(" ");
    console.log("hashed SAPISID", result);
	return result;
}

// Get the user's device make (we'll use the `navigator.platform` for this)
const getDeviceMake = () => {
	const platform = navigator.platform.toLowerCase();
	if (platform.includes("mac")) return "Apple";
	if (platform.includes("win")) return "Windows";
	if (platform.includes("linux")) return "Linux";
	return "Unknown";
};

// Get the current user's IP (for demo purposes, using a public API)
const getRemoteHost = async () => {
	// Example service to get the public IP
	const response = await fetch("https://api.ipify.org?format=json");
	const data = await response.json();
	return data.ip;
};

// Get screen resolution
const getScreenResolution = () => {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		pixelDensity: window.devicePixelRatio,
	};
};
