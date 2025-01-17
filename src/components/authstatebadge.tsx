import React from "react";

interface AuthBadgeProps<T> {
	authenticated: boolean;
}

const AuthStateBadge = <T,>({ authenticated }: AuthBadgeProps<T>) => {
	return (
		<div
            className="flex items-center font-bold text-green-600 bg-green-200"
			style={{
				border: "1px solid var(--border)",
				borderRadius: "var(--radius)",
				padding: "1rem",
                height: "2rem",
			}}
		>
            {/* Icon */}
			<svg
                role="img"
                aria-label="Authenticated"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-6 text-green-600"
			>
				<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
			</svg>
		</div>
	);
};

export default AuthStateBadge;
