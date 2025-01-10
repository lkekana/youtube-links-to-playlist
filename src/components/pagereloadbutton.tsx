import React from "react";

const SVG_SIZE = "size-12";

/*
return (
    <button
        type="button"
        title="Reload Page"
        onClick={handleReload}
        className="text-center text-xs"
        style={{ whiteSpace: "pre-line" }}
    >
        <svg
            role="img"
            aria-label="Reload Page"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={SVG_SIZE}
        >
            <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
            <path d="M12 0v6l4-4-4-2z" />
        </svg>
    </button>
);
*/
const PageReloadButton: React.FC = () => {
    const handleReload = async () => {
        await chrome.tabs.reload();
    };

    return (
        <div  className="flex flex-col items-center justify-center text-center text-xs py-4" title="Reload Page" >
            <h1 className="text-center text-xs" style={{ whiteSpace: "pre-line" }}>
                <svg
                    role="img"
                    aria-label="Reload Page"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`${SVG_SIZE} cursor-pointer`}
                    onClick={handleReload}
                    onKeyUp={(e) => e.preventDefault()} onKeyDown={(e) => e.preventDefault()}
                >
                    <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
                    <path d="M12 0v6l4-4-4-2z" />
                </svg>
            </h1>
        </div>
    );
};

export default PageReloadButton;