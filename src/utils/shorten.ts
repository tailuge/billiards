export function shorten(url, action) {
  fetch("https://gotiny.cc/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: url }),
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
  if (!navigator.canShare || !navigator.canShare(shareData)) {
    navigator.clipboard.writeText(url)
    return `link copied to clipboard`
  }
  navigator
    .share(shareData)
    .then(() => console.log("shared successfully"))
    .catch((e) => {
      console.log("Error: " + e)
    })
  return `link shared`
}
