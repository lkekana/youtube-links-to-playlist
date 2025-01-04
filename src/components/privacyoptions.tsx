import React from 'react';
import { PlaylistPrivacy } from '../youtube';

interface PrivacyOptionsProps {
    privacy: PlaylistPrivacy;
    handlePrivacyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    anonymousPlaylist: boolean;
    authorised: boolean;
    userOnYouTube: boolean;
}

const PrivacyOptions: React.FC<PrivacyOptionsProps> = ({ privacy, handlePrivacyChange, anonymousPlaylist, authorised, userOnYouTube }) => {
    return (
        <select
            id="privacy-select"
            name="privacy-select"
            required
            value={privacy}
            onChange={handlePrivacyChange}
            className="w-full m-1"
            disabled={!authorised || !userOnYouTube}
        >
            {anonymousPlaylist || !authorised || !userOnYouTube ? (
                <option value={PlaylistPrivacy.UNLISTED}>
                    🔗 Unlisted: Anyone with the link can view
                </option>
            ) : (
                <>
                    <option value={PlaylistPrivacy.PUBLIC}>
                        🌎 Public: Anyone can search for and view
                    </option>
                    <option value={PlaylistPrivacy.UNLISTED}>
                        🔗 Unlisted: Anyone with the link can view
                    </option>
                    <option value={PlaylistPrivacy.PRIVATE}>
                        🔒 Private: Only you can view
                    </option>
                </>
            )}
        </select>
    );
};

export default PrivacyOptions;