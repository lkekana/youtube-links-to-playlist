import React, { useState } from "react";
import { useTernaryDarkMode, type TernaryDarkMode } from "usehooks-ts";

const SVG_SIZE = "size-4";

const ToggleDarkModeButton: React.FC = () => {
	const {
		isDarkMode,
		ternaryDarkMode,
		setTernaryDarkMode,
		toggleTernaryDarkMode,
	} = useTernaryDarkMode();

	let title = "Use Light theme";
	let icon = (
		<svg
			role="img"
			aria-label={title}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={SVG_SIZE}
		>
			<path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
		</svg>
	);
	if (ternaryDarkMode === "system") {
		title = "Use System theme";
		icon = (
			<svg
				role="img"
                aria-label={title}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className={SVG_SIZE}
			>
				<path
					fillRule="evenodd"
					d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z"
					clipRule="evenodd"
				/>
			</svg>
		);
	} else if (ternaryDarkMode === "dark") {
		title = "Use Dark theme";
		icon = (
			<svg
				role="img"
                aria-label={title}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className={SVG_SIZE}
			>
				<path
					fillRule="evenodd"
					d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
	return (
			<button
				type="button"
				title={title}
				onClick={toggleTernaryDarkMode}
				className="text-center text-xs"
				style={{ whiteSpace: "pre-line" }}
			>
				{icon}
			</button>
	);
};

export default ToggleDarkModeButton;
