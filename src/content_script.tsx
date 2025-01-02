import { videoIDsOnly, type PlaylistParams } from "./youtube";
import type { PlaylistCreateResponse } from "./youtube-api";

export type ListenerRequest = {
	action: string;
	playlistParams?: PlaylistParams;
};

export type ListenerResponse = {
	cookies?: string;
	error?: string;
	playlistId?: string;
};

chrome.runtime.onMessage.addListener(
	(
		request: ListenerRequest,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response: ListenerResponse) => void,
	) => {
		console.log("listener called");
		console.log("request", request);
		console.log("sender", sender);
		if (request.action === "getCookies") {
			console.log("getting cookies");
			console.log("document.cookie", document.cookie);
			sendResponse({ cookies: document.cookie });
		} else if (request.action === "createPlaylist") {
			if (!request.playlistParams) {
				sendResponse({ error: "No playlistParams provided" });
				return false;
			}
			console.log("params", request.playlistParams);
			createPlaylist(request.playlistParams)
				.then((playlistId: string) => {
					sendResponse({ playlistId });
				})
				// biome-ignore lint/suspicious/noExplicitAny: implicit any from catch
				.catch((error: any) => {
					sendResponse({ error });
				});
			return true; // Indicates that the response will be sent asynchronously
		}
	},
);

const createPlaylist = async (params: PlaylistParams): Promise<string> => {
	const { ids, title, privacy } = params;
	const videoIDs = videoIDsOnly(ids);
	console.log("videoIDs", videoIDs);
	console.log("title", title);
	console.log("privacy", privacy);

	const [authHeader, body] = await Promise.all([
		getAuthorizationHeader(),
		getPlaylistCreateBody(params),
	]);
	console.log("authHeader");
	console.log(authHeader);
	console.log("body");
	console.log(body);
	return await fetch(
		"https://www.youtube.com/youtubei/v1/playlist/create?prettyPrint=false",
		// "https://localhost:3000",
		{
			headers: {
				accept: "*/*",
				authorization: authHeader,
				"content-type": "application/json",
			},
			referrer: "https://www.youtube.com",
			referrerPolicy: "strict-origin-when-cross-origin",
			body: JSON.stringify(body),
			method: "POST",
			mode: "cors",
			credentials: "include",
		},
	)
		.then((response) => {
			console.log("response");
			console.log(response);
			return response.json();
		})
		.then((data: PlaylistCreateResponse) => {
			return data.playlistId;
		})
		.catch((error) => {
			console.error("error performing fetch");
			throw error;
		});
};

const getCookie = async (cname: string): Promise<string | undefined> => {
	const name = `${cname}=`;
	const cookies = document.cookie;
	// const cookies = await getCookies();
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

const padStart = (
	str: string,
	targetLength: number,
	padString = " ",
): string => {
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
};

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
};

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

const getPlaylistCreateBody = async (params: PlaylistParams) => {
	const { ids, title, privacy } = params;
	const videoIDs = videoIDsOnly(ids);
	console.log("videoIDs", videoIDs);
	return {
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
				originalUrl: "https://www.youtube.com/",
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
	};
};

console.log("content script loaded");
