import { initDiagrams } from "../diagrams/svg.js"

let timerStart = 0
let timerInterval = null
let closeTimeout = null
let currentCard = null

/** Hash data-json-shots → stable content-based position ID */
function positionId(card) {
  if (card.id) return card.id
  const svg = card.querySelector(".billiards-table")
  const s = svg?.dataset.jsonShots ?? ""
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  const id = "p" + Math.abs(h).toString(36)
  card.id = id
  return id
}

export function initSpeedrun() {
  const params = new URLSearchParams(window.location.search)
  const playerName = params.get("userName") ?? "Anon"
  const nameEl = document.getElementById("playerName")
  if (nameEl) nameEl.textContent = `Player: ${playerName}`

  // Save original query string for passthrough to game (strip leading ?)
  const passThrough = window.location.search.replace(/^\?/, "&")

  initDiagrams()

  const overlay = document.getElementById("gameOverlay")
  const iframe = document.getElementById("gameIframe")
  const closeBtn = document.getElementById("closeGame")
  const timerDisplay = document.getElementById("timerDisplay")
  const failModal = document.getElementById("failModal")
  const failReason = document.getElementById("failReason")
  const failOkBtn = document.getElementById("failOkBtn")

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
      overlay.classList.remove("closing")
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

  // --- Fail modal ---
  let failTimer = null

  function showFailModal(elapsed, reason) {
    failReason.innerHTML = `${reason}<br>@ ${elapsed.toFixed(1)} seconds`
    failModal.classList.add("active")
    failTimer = setTimeout(hideFailModal, 5000)
  }

  function hideFailModal() {
    failModal.classList.remove("active")
    if (failTimer) {
      clearTimeout(failTimer)
      failTimer = null
    }
  }

  failOkBtn.addEventListener("click", hideFailModal)

  // --- postMessage: game result ---
  window.addEventListener("message", (event) => {
    if (event.data.type !== "speedrun-result") return

    const { status, matchResult, replayUrl, reason } = event.data
    const elapsed = stopTimer()

    if (status === "fail") {
      closeOverlay()
      showFailModal(elapsed, reason)
      return
    }

    closeOverlay()

    if (status === "complete") {
      console.log(`Speedrun complete! ${elapsed.toFixed(1)}s`, {
        matchResult,
        replayUrl,
      })
    }
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
    if (closeTimeout) {
      clearTimeout(closeTimeout)
    }
    overlay.classList.add("closing")
    closeTimeout = setTimeout(() => {
      overlay.classList.remove("active", "closing")
      iframe.src = ""
      closeTimeout = null
    }, 300)
    currentCard = null
  }
}
