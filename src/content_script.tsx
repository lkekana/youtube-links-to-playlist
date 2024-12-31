export type ListenerResponse = {
  cookies: string;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("listener called");
  console.log("request", request);
  console.log("sender", sender);
  if (request.action === "getCookies") {
    console.log("getting cookies");
    console.log("document.cookie", document.cookie); 
    sendResponse({ cookies: document.cookie });
  }
});
