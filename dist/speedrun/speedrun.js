import { initDiagrams } from "../diagrams/svg.js"

const API_BASE = "https://scoreboard-tailuge.vercel.app"

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

/** Extract `state` query param from a replayUrl */
function extractState(replayUrl) {
  try {
    const url = new URL(replayUrl)
    return url.searchParams.get("state") ?? ""
  } catch {
    // Fallback: parse manually
    const m = replayUrl.match(/[?&]state=([^&]+)/)
    return m ? decodeURIComponent(m[1]) : ""
  }
}

/** Format seconds as ss.tenths (e.g. "12.5s") */
function formatTime(sec) {
  return sec.toFixed(1) + "s"
}

/** Render rankings list inside a card's .rankings div */
function renderRankings(card, entries) {
  const rankingsDiv = card.querySelector(".rankings")
  if (!rankingsDiv) return

  rankingsDiv.innerHTML = ""

  if (!entries || entries.length === 0) {
    rankingsDiv.innerHTML =
      '<h4>Rankings</h4><p class="rankings-empty">— No results yet —</p>'
    return
  }

  const h4 = document.createElement("h4")
  h4.textContent = "Rankings"
  rankingsDiv.appendChild(h4)

  const ol = document.createElement("ol")
  ol.className = "rankings-list"

  entries.forEach((entry, i) => {
    const li = document.createElement("li")
    li.innerHTML =
      `<span class="rank">#${i + 1}</span>` +
      ` <span class="rank-name">${escapeHtml(entry.playerName)}</span>` +
      ` <span class="rank-time">${formatTime(entry.timeSec)}</span>` +
      ` <a class="rank-replay" href="${API_BASE}/api/speedrun-results/${entry.id}" target="_blank" title="Watch replay">▶</a>`
    ol.appendChild(li)
  })

  rankingsDiv.appendChild(ol)
}

function escapeHtml(s) {
  const div = document.createElement("div")
  div.textContent = s
  return div.innerHTML
}

/** Fetch all rankings from the API and render them into cards */
async function fetchRankings() {
  try {
    const res = await fetch(`${API_BASE}/api/speedrun-results`)
    if (!res.ok) {
      console.error("Failed to fetch rankings:", res.status)
      return
    }
    const results = await res.json()

    // Group by positionId
    const byPosition = {}
    for (const entry of results) {
      const pid = entry.positionId
      if (!byPosition[pid]) byPosition[pid] = []
      byPosition[pid].push(entry)
    }

    // Sort each group by timeSec ascending
    for (const pid of Object.keys(byPosition)) {
      byPosition[pid].sort((a, b) => a.timeSec - b.timeSec)
    }

    // Render top 3 per card
    document.querySelectorAll(".speedrun-card").forEach((card) => {
      const pid = positionId(card)
      const entries = (byPosition[pid] || []).slice(0, 3)
      renderRankings(card, entries)
    })
  } catch (err) {
    console.error("Error fetching rankings:", err)
  }
}

/** Submit a result to the API and update the card's rankings */
async function submitResult(card, playerName, timeSec, ruleType, replayUrl) {
  const pid = positionId(card)
  const state = extractState(replayUrl)

  try {
    const res = await fetch(`${API_BASE}/api/speedrun-results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        positionId: pid,
        playerName,
        timeSec,
        ruleType,
        state,
      }),
    })

    if (!res.ok) {
      console.error("Failed to submit result:", res.status)
      return null
    }

    // Response is the updated top entries for this position
    const updated = await res.json()
    renderRankings(card, updated.slice(0, 3))

    // Find this player's rank in the updated list
    const myEntry = updated.find(
      (e) =>
        e.playerName === playerName && Math.abs(e.timeSec - timeSec) < 0.01
    )
    return myEntry ? updated.indexOf(myEntry) + 1 : null
  } catch (err) {
    console.error("Error submitting result:", err)
    return null
  }
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
  const resultModal = document.getElementById("resultModal")
  const resultTitle = document.getElementById("resultTitle")
  const resultBody = document.getElementById("resultBody")
  const resultOkBtn = document.getElementById("resultOkBtn")

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

  // --- Result modal (fail + success) ---

  function showResultModal(type, data) {
    resultModal.className = type // "fail" or "success"

    if (type === "success") {
      resultTitle.textContent = "🏆 Success!"
      resultBody.innerHTML =
        `Time: ${data.elapsed.toFixed(1)}s<br>` +
        `Rank: ${data.rank ?? "—"}<br>` +
        `<a href="${data.replayUrl}" target="_blank">Replay</a>`
    } else {
      resultTitle.textContent = "Attempt Failed"
      resultBody.innerHTML =
        `${data.reason}<br>@ ${data.elapsed.toFixed(1)} seconds`
    }

    resultModal.classList.add("active")
  }

  function hideResultModal() {
    resultModal.classList.remove("active")
  }

  resultOkBtn.addEventListener("click", hideResultModal)

  // --- postMessage: game result ---
  window.addEventListener("message", async (event) => {
    if (event.data.type !== "speedrun-result") return

    const { status, matchResult, replayUrl, reason } = event.data
    const elapsed = stopTimer()
    const card = currentCard

    if (status === "fail") {
      closeOverlay()
      showResultModal("fail", { elapsed, reason })
      return
    }

    closeOverlay()

    if (status === "complete" && card) {
      // Show modal immediately with placeholder, then update after API POST
      showResultModal("success", {
        elapsed,
        matchResult,
        replayUrl,
        rank: "submitting…",
      })

      // Extract ruleType from the card's SVG
      const svg = card.querySelector(".billiards-table")
      let ruleType = matchResult?.ruleType ?? "nineball"
      if (svg) {
        try {
          const configs = JSON.parse(svg.dataset.jsonShots)
          ruleType = configs[0].ruleType ?? ruleType
        } catch {
          // keep default
        }
      }

      // Submit to API and update rank in the already-visible modal
      const rank = await submitResult(
        card,
        playerName,
        elapsed,
        ruleType,
        replayUrl
      )

      if (rank !== null) {
        resultBody.innerHTML =
          `Time: ${elapsed.toFixed(1)}s<br>` +
          `Rank: ${rank}<br>` +
          `<a href="${replayUrl}" target="_blank">Replay</a>`
      } else {
        resultBody.innerHTML =
          `Time: ${elapsed.toFixed(1)}s<br>` +
          `Rank: —<br>` +
          `<a href="${replayUrl}" target="_blank">Replay</a>`
      }
    } else {
      showResultModal("success", { elapsed, matchResult, replayUrl })
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

  // Fetch rankings on page load
  fetchRankings()
}
