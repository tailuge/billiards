export function shorten(url, action) {
  if (typeof process === "object") {
    return action(url)
  }
  const cleanUrl = new URL(
    url
      .replaceAll("(", "%28")
      .replaceAll(")", "%29")
      .replaceAll("!", "%21")
      .replaceAll("*", "%2A")
  ).search

  fetch("https://scoreboard-tailuge.vercel.app/api/shorten", {
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
        console.log("Could not shorten url:")
        console.log(data)
        action(url)
      }
    })
}

export function share(url) {
  const shareData = {
    title: "Billiards",
    text: `Replay break`,
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
  return `link copied to clipboard <a href="${url}">${url}</a>`
}
