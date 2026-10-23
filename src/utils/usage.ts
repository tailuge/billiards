export function logusage(key: string = "game") {
  if (
    globalThis.location.hostname === "localhost" ||
    globalThis.location.hostname === "127.0.0.1"
  ) {
    console.log("Skipping usage fetch for localhost.")
    return
  }

  const url = `https://billiards-network.onrender.com/api/usage/${key}`

  fetch(url, {
    method: "PUT",
    mode: "cors",
  }).catch(() => {
    // Retry once if the first attempt fails.
    fetch(url, {
      method: "PUT",
      mode: "cors",
    }).catch(() => {
      /* silent */
    })
  })
}
