import { initDiagrams } from "../diagrams/svg.js"

let timerStart = 0
let timerInterval = null
let closeTimeout = null
let currentCard = null

export function initSpeedrun() {
  const params = new URLSearchParams(window.location.search)
  const playerName = params.get("userName") ?? "Anon"
  const nameEl = document.getElementById("playerName")
  if (nameEl) nameEl.textContent = `Player: ${playerName}`

  // Save original query string for passthrough to game (strip leading ?)
  const passThrough = window.location.search.replace(/^\?/, "&")

  initDiagrams("nineball")

  const overlay = document.getElementById("gameOverlay")
  const iframe = document.getElementById("gameIframe")
  const closeBtn = document.getElementById("closeGame")
  const timerDisplay = document.getElementById("timerDisplay")

  // --- Play button: open iframe overlay ---
  document.querySelectorAll(".speedrun-card").forEach((card) => {
    const svg = card.querySelector(".billiards-table")
    const btn = card.querySelector(".play-btn")
    if (!svg || !btn) return

    btn.addEventListener("click", () => {
      let configs
      try {
        configs = JSON.parse(svg.dataset.jsonShots)
      } catch {
        console.error("Failed to parse data-json-shots")
        return
      }
      const config = configs[0]
      const init = JSON.stringify(
        config.balls.flatMap((b) => [b.pos.x, b.pos.y])
      )
      const initShot = JSON.stringify(config.shot)
      const url =
        `../index.html?ruletype=${config.ruleType}` +
        `&speedrun&practice` +
        `&init=${encodeURIComponent(init)}` +
        `&initShot=${encodeURIComponent(initShot)}` +
        passThrough

      // Cancel any pending close so we don't wipe the new iframe
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
      currentCard = card
      iframe.src = url
      overlay.classList.add("active")
      startTimer()
    })
  })

  // --- Close button ---
  if (closeBtn) {
    closeBtn.addEventListener("click", closeOverlay)
  }

  // --- postMessage: game result ---
  window.addEventListener("message", (event) => {
    if (event.data.type !== "speedrun-result") return

    const { status, matchResult, replayUrl, reason } = event.data
    const elapsed = stopTimer()

    if (status === "fail") {
      console.log(`Speedrun failed: ${reason} (${elapsed.toFixed(1)}s)`)
    } else if (status === "complete") {
      console.log(`Speedrun complete! ${elapsed.toFixed(1)}s`, {
        matchResult,
        replayUrl,
      })
    }

    // Close overlay after a brief pause so the user sees the timer stop
    setTimeout(closeOverlay, 300)
  })

  // --- Timer helpers ---
  function startTimer() {
    timerStart = performance.now()
    timerDisplay.textContent = "0.0s"
    timerInterval = setInterval(() => {
      const elapsed = (performance.now() - timerStart) / 1000
      timerDisplay.textContent = elapsed.toFixed(1) + "s"
    }, 100)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    return (performance.now() - timerStart) / 1000
  }

  function closeOverlay() {
    stopTimer()
    overlay.classList.remove("active")
    // Delay clearing iframe so the game can finish any pending work
    closeTimeout = setTimeout(() => {
      iframe.src = ""
      closeTimeout = null
    }, 100)
    currentCard = null
  }
}
