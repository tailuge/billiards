export function shorten(url, action) {
  if (typeof process === "object") {
    return action(url)
  }
  const cleanUrl = url
    .replaceAll("(", "%28")
    .replaceAll(")", "%29")
    .replaceAll("!", "%21")
    .replaceAll("*", "%2A")
  fetch("https://gotiny.cc/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: cleanUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && "code" in data[0]) {
        action(`https://gotiny.cc/${data[0].code}`)
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
