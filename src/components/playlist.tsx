import React from 'react';
import { PlaylistPrivacy } from '../youtube';

export type PlaylistInfo = {
    title: string;
    playlistID: string;
    ids: {
        type: "video" | "playlist";
        id: string;
        playlist_ids?: string[];
    }[];
    privacyStatus: PlaylistPrivacy;
    description: string;
}

const Playlist: React.FC<PlaylistInfo> = ({ title, playlistID, ids, privacyStatus, description }) => {
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
    const playlistLink = `https://www.youtube.com/playlist?list=${playlistID}`;
    return (
        <>
            <h4>
                <a href={playlistLink}>{title}</a>
            </h4>
            <details>
                <summary>{ids.length} videos | {privacyStatusText}</summary>
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