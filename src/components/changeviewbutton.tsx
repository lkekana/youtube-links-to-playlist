import React from "react";
import { ActiveSection } from "../popup";

interface ChangeViewButtonProps {
	onClick: () => void;
	activeSection: ActiveSection;
	targetSection: ActiveSection;
}

const SVG_SIZE = "size-4";

const ChangeViewButton: React.FC<ChangeViewButtonProps> = ({
	onClick,
	activeSection,
}) => {
	let title = "unknown";
	let icon = null;
	if (activeSection === ActiveSection.FORM) {
		title = "Your playlists";
		icon = (
			<svg
				role="img"
				aria-label="Your playlists"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className={SVG_SIZE}
			>
				<path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
				<path
					fillRule="evenodd"
					d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
					clipRule="evenodd"
				/>
			</svg>
		);
	} else if (activeSection === ActiveSection.PLAYLISTS) {
		title = "Create a new playlist";
		icon = (
			<svg
				role="img"
				aria-label="Create a new playlist"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className={SVG_SIZE}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 4.5v15m7.5-7.5h-15"
				/>
			</svg>
		);
	}
	return (
			<button
				type="button"
				title={title}
				onClick={onClick}
				className="text-center text-xs"
				style={{ whiteSpace: "pre-line" }}
			>
				{icon}
			</button>
	);
};

export default ChangeViewButton;
