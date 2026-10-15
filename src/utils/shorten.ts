// Identity params name the person who recorded the game. They must not be
// stored in a shared link, or the name shows up for every watcher.
const IDENTITY_PARAMS = ["userName", "userId"]

/** Returns the URL's query string (with leading "?"), minus identity params. */
export function shareableQuery(url: string): string {
  const params = new URL(url).searchParams
  for (const key of IDENTITY_PARAMS) {
    params.delete(key)
  }
  const query = params.toString()
  return query ? `?${query}` : ""
}

export function shorten(url, action) {
  if (typeof process === "object") {
    return action(url)
  }
  const cleanUrl = shareableQuery(
    url
      .replaceAll("(", "%28")
      .replaceAll(")", "%29")
      .replaceAll("!", "%21")
      .replaceAll("*", "%2A")
  )
  console.log("Shortening url")
  const endpoint = "https://scoreboard-tailuge.vercel.app/api/shorten"
  fetch(endpoint, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: cleanUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      if ("shortUrl" in data) {
        action(data.shortUrl)
      } else {
        console.error("Could not shorten url", url, "via", endpoint, data)
        action(url)
      }
    })
    .catch((e) => {
      console.error("Error shortening url", url, "via", endpoint, e)
      action(url)
    })
}

export function share(url) {
  const shareData = {
    title: "Billiards",
    url: url,
  }
  if (navigator.canShare?.(shareData)) {
    navigator
      .share(shareData)
      .then(() => console.log("shared successfully"))
      .catch((e) => {
        console.log("Error: " + e)
      })
    return `link shared`
  }
  navigator.clipboard?.writeText(url)
  return `Replay link copied to clipboard <a href="${url}">${url}</a>`
}
