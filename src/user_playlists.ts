import type { PlaylistInfo } from "./components/playlist";
import { PlaylistPrivacy } from "./youtube";

export const getPlaylists = (): Promise<PlaylistInfo[]> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("playlists", (items) => {
      console.log("items", items);
      console.log("items.playlists", items.playlists);
      if (items.playlists) {
        try {
          const playlists = JSON.parse(items.playlists) as PlaylistInfo[];
          resolve(playlists);
        } catch (e) {
          console.error(e);
          savePlaylists([]);
          reject(e);
        }
      } else {
        resolve([]);
      }
    });
  });
};

export const savePlaylists = (playlists: PlaylistInfo[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ playlists: JSON.stringify(playlists) }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log("playlists saved");
        resolve();
      }
    });
  });
};

export const addNewPlaylist = async (playlist: PlaylistInfo): Promise<PlaylistInfo[]> => {
	const playlists = await getPlaylists();
    const newPlaylist = {
        ...playlist,
        focused: true,
    };
	for (const p of playlists) {
		p.focused = false;
	}
    playlists.unshift(newPlaylist);
    console.log("playlists", playlists);
	await savePlaylists(playlists);
    return getPlaylists();
};