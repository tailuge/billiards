export function logusage() {
  if (
    globalThis.location.hostname === "localhost" ||
    globalThis.location.hostname === "127.0.0.1"
  ) {
    console.log("Skipping usage fetch for localhost.")
    return
  }

  const url = `https://scoreboard-tailuge.vercel.app/api/usage/game`

  fetch(url, {
    method: "PUT",
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText)
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error)
    })
}
