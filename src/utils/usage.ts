export function logusage() {

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log("Skipping usage fetch for localhost.")
    return;
  }

  const url = `https://scoreboard-tailuge.vercel.app/api/usage/game`

  try {
    fetch(url, {
      method: "PUT",
      mode: "cors",
    })
    .then(response => {
      if (!response.ok) {
        // Log HTTP errors (e.g., 4xx, 5xx)
        console.error("HTTP error:", response.status, response.statusText)
      }
    })
    .catch(error => {
      // Log network errors or other fetch-related errors
      console.error("Fetch error:", error)
    });
  } catch (error) {
    // Log any synchronous errors that occur in the try block
    console.error("Error in logusage:", error)
  }
}