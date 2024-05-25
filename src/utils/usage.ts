export function logusage() {
  const params = new URLSearchParams(location.search)
  const ruletype = params.get("ruletype") ?? "nineball"
  const mode = params.get("state") ? "replay" : "play"
  const url = `https://scoreboard-tailuge.vercel.app/usage/${mode}/${ruletype}`

  fetch(url, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  })
}
