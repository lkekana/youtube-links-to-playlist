import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../public/shadcn-inspired-classless.css";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  // return (
  //   <>
  //     <ul style={{ minWidth: "700px" }}>
  //       <li>Current URL: {currentURL}</li>
  //       <li>Current Time: {new Date().toLocaleTimeString()}</li>
  //     </ul>
  //     <button
  //       onClick={() => setCount(count + 1)}
  //       style={{ marginRight: "5px" }}
  //     >
  //       count up
  //     </button>
  //     <button onClick={changeBackground}>change background</button>
  //   </>
  // );
  return (
    <>
      {/* Header */}
      <header>
        <hgroup>
          <h1>shadcn-inspired</h1>
          <p>A class-less example inspired by shadcn components.</p>
        </hgroup>
        {/* <button onclick="toggleDarkMode()">Toggle theme</button> */}
        <button onClick={changeBackground}>Toggle theme</button>
      </header>

      {/* Main */}
      <main>
        {/* Preview */}
        <section id="preview">
          <h2>Preview</h2>
          <p>
            Sed ultricies dolor non ante vulputate hendrerit. Vivamus sit amet
            suscipit sapien. Nulla iaculis eros a elit pharetra egestas.
          </p>
          <form>
            <input
              type="text"
              name="firstname"
              placeholder="First name"
              aria-label="First name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              aria-label="Email address"
              autoComplete="email"
              required
            />
            <button type="submit">Subscribe</button>
            <fieldset>
              <label htmlFor="terms">
                <input type="checkbox" role="switch" id="terms" name="terms" />
                I agree to the
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </label>
            </fieldset>
          </form>
        </section>
      </main>
    </>
  )
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
