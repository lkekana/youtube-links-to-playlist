import type { PlaylistInfo } from "./components/playlist";
import { PlaylistPrivacy } from "./youtube";

const userPlaylists: PlaylistInfo[] = [
	{
		title: "Playlist 1",
		playlistID: "PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW24",
		ids: [
			{ type: "video", id: "pZwvrxVavnQ" },
			{ type: "video", id: "Rk2FR8YflrE" },
			{ type: "video", id: "3xottY-7m3k" },
		],
		privacyStatus: PlaylistPrivacy.PRIVATE,
		description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		Pellentesque urna diam, tincidunt nec porta sed, auctor id velit.
		Etiam venenatis nisl ut orci consequat, vitae tempus quam commodo.
		Nulla non mauris ipsum. Aliquam eu posuere orci. Nulla convallis
		lectus rutrum quam hendrerit, in facilisis elit sollicitudin.
		Mauris pulvinar pulvinar mi, dictum tristique elit auctor quis.
		Maecenas ac ipsum ultrices, porta turpis sit amet, congue turpis.`,
		createdAt: 1735828323083,
	},
	{
		title: "Playlist 2",
		playlistID: "PL6o_hmrw5tQgwYP3ra-uoPjCMHUFRoW23",
		ids: [
			{ type: "video", id: "pZwvrxVavnQ" },
			{ type: "video", id: "Rk2FR8YflrE" },
			{ type: "video", id: "3xottY-7m3k" },
		],
		privacyStatus: PlaylistPrivacy.PRIVATE,
		description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		Pellentesque urna diam, tincidunt nec porta sed, auctor id velit.
		Etiam venenatis nisl ut orci consequat, vitae tempus quam commodo.
		Nulla non mauris ipsum. Aliquam eu posuere orci. Nulla convallis
		lectus rutrum quam hendrerit, in facilisis elit sollicitudin.
		Mauris pulvinar pulvinar mi, dictum tristique elit auctor quis.
		Maecenas ac ipsum ultrices, porta turpis sit amet, congue turpis.`,
		createdAt: 1735828323683,
	},
];

export const getPlaylists = (): PlaylistInfo[] => {
    // sort by createdAt (highest first)
	return userPlaylists.sort((a, b) => b.createdAt - a.createdAt);
};

export const addNewPlaylist = (playlist: PlaylistInfo): PlaylistInfo[] => {
    const newPlaylist = {
        ...playlist,
        focused: true,
    };
	for (const p of userPlaylists) {
		p.focused = false;
	}
    userPlaylists.unshift(newPlaylist);
    console.log("userPlaylists", userPlaylists);
    return userPlaylists;
};