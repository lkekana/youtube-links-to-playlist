import type { PlaylistInfo } from "./components/playlist";
import { PlaylistPrivacy } from "./youtube";

// const userPlaylists: PlaylistInfo[] = [
// 	{
// 		title: "Playlist 1",
// 		playlistID: "PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW24",
// 		ids: [
// 			{ type: "video", id: "pZwvrxVavnQ" },
// 			{ type: "video", id: "Rk2FR8YflrE" },
// 			{ type: "video", id: "3xottY-7m3k" },
// 		],
// 		privacyStatus: PlaylistPrivacy.PRIVATE,
// 		description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// 		Pellentesque urna diam, tincidunt nec porta sed, auctor id velit.
// 		Etiam venenatis nisl ut orci consequat, vitae tempus quam commodo.
// 		Nulla non mauris ipsum. Aliquam eu posuere orci. Nulla convallis
// 		lectus rutrum quam hendrerit, in facilisis elit sollicitudin.
// 		Mauris pulvinar pulvinar mi, dictum tristique elit auctor quis.
// 		Maecenas ac ipsum ultrices, porta turpis sit amet, congue turpis.`,
// 		createdAt: 1735828323083,
// 	},
// 	{
// 		title: "Playlist 2",
// 		playlistID: "PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW23",
// 		ids: [
// 			{ type: "video", id: "pZwvrxVavnQ" },
// 			{ type: "video", id: "Rk2FR8YflrE" },
// 			{ type: "video", id: "3xottY-7m3k" },
// 		],
// 		privacyStatus: PlaylistPrivacy.PRIVATE,
// 		description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// 		Pellentesque urna diam, tincidunt nec porta sed, auctor id velit.
// 		Etiam venenatis nisl ut orci consequat, vitae tempus quam commodo.
// 		Nulla non mauris ipsum. Aliquam eu posuere orci. Nulla convallis
// 		lectus rutrum quam hendrerit, in facilisis elit sollicitudin.
// 		Mauris pulvinar pulvinar mi, dictum tristique elit auctor quis.
// 		Maecenas ac ipsum ultrices, porta turpis sit amet, congue turpis.`,
// 		createdAt: 1735828323683,
// 	},
// ];

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