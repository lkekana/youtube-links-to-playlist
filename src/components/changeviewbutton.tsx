import React from 'react';
import { ActiveSection } from '../popup';

interface ChangeViewButtonProps {
    onClick: () => void;
    activeSection: ActiveSection;
    targetSection: ActiveSection;
}

const ChangeViewButton: React.FC<ChangeViewButtonProps> = ({ onClick, activeSection }) => {
    let title = "(unknown)";
    let icon = "(unknown)";
    if (activeSection === ActiveSection.FORM) {
        title = "Your playlists";
        icon = "📂";
    } else if (activeSection === ActiveSection.PLAYLISTS) {
        title = "Create a new playlist";
        icon = "➕";
    }
    return (
        <div className="flex justify-end w-full">
            <button
                type="button"
                title={title}
                onClick={onClick}
                className="text-center text-xs"
                style={{ whiteSpace: "pre-line" }}
            >
                {icon}
            </button>
        </div>
    );
};

export default ChangeViewButton;