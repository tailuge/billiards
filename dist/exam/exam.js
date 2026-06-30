import { initDiagrams } from "../diagrams/svg.js"
import { parseShots, parseJsonShots, maxPower } from "../diagrams/dsl.js"

const R = 0.03275

function proximityPoints(outcomes, ruleType) {
  if (ruleType !== "threecushion") return 0
  const prox = outcomes.filter(
    (o) => o.type === "Proximity" && o.ballA && o.ballA.id === 0
  )
  if (prox.length === 0) return 0
  const d = Math.min(...prox.map((p) => p.incidentSpeed))
  if (d <= 2 * R) return 3
  if (d <= 3 * R) return 2
  if (d <= 4 * R) return 1
  return 0
}

function potPoints(outcomes, ruleType, noPot) {
  if (ruleType === "threecushion" || noPot) return 0
  return (
    outcomes.filter((o) => o.type === "Pot" && o.ballA && o.ballA.id !== 0)
      .length * 3
  )
}

function maxPoints(hasEllipse, ruleType, noPot) {
  if (ruleType === "threecushion") {
    return 3 + (hasEllipse ? 1 : 0)
  }
  return (hasEllipse ? 1 : 0) + (noPot ? 0 : 3)
}

const STORAGE_KEY_PREFIX = "exam_results_"
const storageKey = STORAGE_KEY_PREFIX + window.location.pathname

function getResults() {
  const data = localStorage.getItem(storageKey)
  return data ? JSON.parse(data) : {}
}

function saveResults(results) {
  localStorage.setItem(storageKey, JSON.stringify(results))
}

function calculateAssessment(results) {
  const blocks = document.querySelectorAll(".question-block")
  if (blocks.length === 0) return { label: "Unknown", className: "unknown" }

  let totalScored = 0
  let totalPossible = 0
  let attempted = 0

  const firstSvg = document.querySelector(".billiards-table")
  let ruleType = "threecushion"
  if (firstSvg?.dataset.jsonShots) {
    try {
      ruleType = JSON.parse(firstSvg.dataset.jsonShots)[0]?.ruleType || "threecushion"
    } catch {}
  }

  blocks.forEach((block, index) => {
    const qId = String(index + 1)
    const svg = block.querySelector(".billiards-table")
    if (!svg) return
    const hasEllipse = svg.querySelector("ellipse[data-id]") !== null
    const noPot = svg.dataset.nopot !== undefined
    const max = maxPoints(hasEllipse, ruleType, noPot)
    totalPossible += max

    const r = results[qId]
    if (r) {
      totalScored += r.bestPoints !== undefined ? r.bestPoints : (r.lastPts || 0)
      attempted += r.attempted || 0
    }
  })

  if (attempted === 0 || totalPossible === 0) return { label: "Unknown", className: "unknown" }

  const pct = totalScored / totalPossible
  if (pct < 0.1) return { label: "Beginner", className: "beginner" }
  if (pct < 0.2) return { label: "Novice", className: "novice" }
  if (pct < 0.3) return { label: "Learner", className: "learner" }
  if (pct < 0.4) return { label: "Developing", className: "developing" }
  if (pct < 0.5) return { label: "Intermediate", className: "intermediate" }
  if (pct < 0.6) return { label: "Competent", className: "competent" }
  if (pct < 0.7) return { label: "Proficient", className: "proficient" }
  if (pct < 0.8) return { label: "Advanced", className: "advanced" }
  if (pct < 0.9) return { label: "Expert", className: "expert" }
  return { label: "Master", className: "master" }
}

function updateAssessment() {
  const el = document.getElementById("assessment")
  if (!el) return
  const results = getResults()
  const { label, className } = calculateAssessment(results)
  el.textContent = `Assessment: ${label}`
  el.className = `assessment ${className}`
}

function buildSummaryList() {
  const shotList = document.getElementById("shotList")
  if (!shotList || shotList.children.length > 0) return
  const blocks = document.querySelectorAll(".question-block")
  blocks.forEach((block, index) => {
    const h3 = block.querySelector("h3")
    const li = document.createElement("li")
    li.innerHTML = `${h3 ? h3.textContent : `Shot ${index + 1}`} <span class="status-unknown">❓ Unknown</span>`
    shotList.appendChild(li)
  })
}

export function updateUI() {
  buildSummaryList()
  updateAssessment()
  const results = getResults()

  // Update shot list summary
  const shotList = document.getElementById("shotList")
  if (shotList) {
    const listItems = shotList.querySelectorAll("li")
    listItems.forEach((li, index) => {
      const qId = String(index + 1)
      const result = results[qId] || { totalPoints: 0, totalMax: 0, attempted: 0 }

      let statusClass = "status-unknown"
      let statusText = "Unknown"
      let icon = "❓"

      if (result.attempted > 0) {
        const displayPct = result.lastPct !== undefined ? result.lastPct : (result.totalMax > 0 ? Math.round((result.totalPoints / result.totalMax) * 100) : 0)
        if (displayPct >= 50) {
          statusClass = "status-pass"
          icon = "✅"
        } else {
          statusClass = "status-fail"
          icon = "❌"
        }
        statusText = `${displayPct}%, ${result.attempted} attempt${result.attempted > 1 ? "s" : ""}`
      }

      const statusSpan = li.querySelector("span")
      if (statusSpan) {
        statusSpan.className = statusClass
        statusSpan.textContent = `${icon} ${statusText}`
      }
    })
  }

  // Update play buttons and their stats
  const blocks = Array.from(document.querySelectorAll(".question-block"))
  document.querySelectorAll(".play-btn").forEach((btn) => {
    const qBlock = btn.closest(".question-block")
    const index = blocks.indexOf(qBlock)
    const qId = String(index + 1)
    const result = results[qId] || { totalPoints: 0, totalMax: 0, attempted: 0 }

    let icon = "❓"
    let statText = ""
    if (result.attempted > 0) {
      const displayPct = result.lastPct !== undefined ? result.lastPct : (result.totalMax > 0 ? Math.round((result.totalPoints / result.totalMax) * 100) : 0)
      icon = displayPct >= 50 ? "✅" : "❌"
      statText = `${displayPct}%, ${result.attempted} attempt${result.attempted > 1 ? "s" : ""}`
    }

    let statsSpan = btn.nextElementSibling
    if (!statsSpan || !statsSpan.classList.contains("q-stats")) {
      statsSpan = document.createElement("span")
      statsSpan.classList.add("q-stats")
      statsSpan.style.marginLeft = "1rem"
      statsSpan.style.fontWeight = "bold"
      btn.parentNode.insertBefore(statsSpan, btn.nextSibling)
    }

    const newText = `${icon} ${statText}`
    if (statsSpan.textContent !== newText) {
      const hadContent = statsSpan.textContent !== ""
      statsSpan.textContent = newText

      // Set pass/fail class for ring animation color
      statsSpan.classList.remove("q-pass", "q-fail")
      const displayPct = result.lastPct !== undefined ? result.lastPct : (result.totalMax > 0 ? Math.round((result.totalPoints / result.totalMax) * 100) : 0)
      statsSpan.classList.add(displayPct >= 50 ? "q-pass" : "q-fail")

      if (hadContent) {
        statsSpan.classList.remove("updated")
        void statsSpan.offsetWidth
        statsSpan.classList.add("updated")
        statsSpan.addEventListener(
          "animationend",
          () => statsSpan.classList.remove("updated"),
          { once: true }
        )
      }
    }
  })
}

let currentQuestionId = null
let currentEllipseCheck = null
let currentRuleType = null
let currentNoPot = false

export function initExam() {
  // Read ruleType from the first SVG's data-json-shots for correct table rendering
  const firstSvg = document.querySelector(".billiards-table")
  let ruletype
  if (firstSvg?.dataset.jsonShots) {
    try {
      ruletype = JSON.parse(firstSvg.dataset.jsonShots)[0]?.ruleType
    } catch {}
  }
  initDiagrams(ruletype)

  const overlay = document.getElementById("gameOverlay")
  const iframe = document.getElementById("gameIframe")
  const closeBtn = document.getElementById("closeGame")
  const resetBtn = document.getElementById("resetExam")

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(storageKey)
      updateUI()
    })
  }

  const blocks = Array.from(document.querySelectorAll(".question-block"))
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qBlock = btn.closest(".question-block")
      const index = blocks.indexOf(qBlock)
      currentQuestionId = String(index + 1)
      currentRuleType = null
      currentNoPot = false
      const svg = qBlock.querySelector(".billiards-table")

      const ellipse = svg.querySelector("ellipse[data-id]")
      currentEllipseCheck = ellipse
        ? {
            ballId: parseInt(ellipse.dataset.id, 10),
            cx: parseFloat(ellipse.getAttribute("cx")),
            cy: parseFloat(ellipse.getAttribute("cy")),
            rx: parseFloat(ellipse.getAttribute("rx")),
            ry: parseFloat(ellipse.getAttribute("ry")),
          }
        : null
      currentNoPot = svg.dataset.nopot !== undefined

      let configs = []
      if (svg.dataset.jsonShots) {
        configs = parseJsonShots(svg.dataset.jsonShots)
      } else if (svg.dataset.shots) {
        configs = parseShots(svg.dataset.shots)
      }

      if (configs.length > 0) {
        const config = configs[0]
        const init = config.balls.flatMap((b) => [b.pos.x, b.pos.y])

        // Power 50%, Spin 0,0, Aim +-5 Deg
        const randomAngle = (Math.random() - 0.5) * 2 * 0.0872665
        const initShot = {
          ...config.shot,
          power: maxPower * 0.5,
          offset: { x: 0, y: 0 },
          angle: config.shot.angle + randomAngle,
          i: config.shot.cueBallId,
          pos: config.balls[config.shot.cueBallId].pos,
        }

        const ruleType = config.ruleType || "threecushion"
        currentRuleType = ruleType

        const url = `../index.html?ruletype=${ruleType}&exam=true&practice=true&init=${encodeURIComponent(JSON.stringify(init))}&initShot=${encodeURIComponent(JSON.stringify(initShot))}`
        iframe.src = url
        overlay.classList.add("active")
      }
    })
  })

  // Edit button for localhost — opens diagram export page
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    blocks.forEach((block) => {
      const playBtn = block.querySelector(".play-btn")
      if (!playBtn) return
      const editBtn = document.createElement("button")
      editBtn.textContent = "Edit"
      editBtn.className = "edit-btn"
      editBtn.style.cssText = "margin-left:0.5rem;cursor:pointer"
      playBtn.parentNode.insertBefore(editBtn, playBtn.nextSibling)
      editBtn.addEventListener("click", () => {
        const svg = block.querySelector(".billiards-table")
        if (!svg) return
        let configs = []
        if (svg.dataset.jsonShots) {
          configs = parseJsonShots(svg.dataset.jsonShots)
        } else if (svg.dataset.shots) {
          configs = parseShots(svg.dataset.shots)
        }
        if (configs.length === 0) return
        const cfg = configs[0]
        const init = cfg.balls.flatMap((b) => [b.pos.x, b.pos.y])
        const shot = {
          angle: cfg.shot.angle,
          power: cfg.shot.power,
          offset: cfg.shot.offset,
        }
        const p = new URLSearchParams()
        p.set("ruletype", cfg.ruleType || "threecushion")
        p.set("cushionModel", cfg.cushionModel || "mathavan")
        p.set("init", JSON.stringify(init))
        p.set("initShot", JSON.stringify(shot))
        window.open(`../diagrams/export.html?${p}`, "_blank")
      })
    })
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "stationary" && currentQuestionId) {
      const outcomes = event.data.outcome

      let ellipseHit = false
      if (currentEllipseCheck && event.data.table?.balls) {
        const targetBall = event.data.table.balls.find(
          (b) => b.id === currentEllipseCheck.ballId
        )
        if (targetBall) {
          const dx = targetBall.pos.x - currentEllipseCheck.cx
          const svgY = -targetBall.pos.y
          const dy = svgY - currentEllipseCheck.cy
          const ex =
            (dx * dx) / (currentEllipseCheck.rx * currentEllipseCheck.rx)
          const ey =
            (dy * dy) / (currentEllipseCheck.ry * currentEllipseCheck.ry)
          ellipseHit = ex + ey <= 1
          console.log("ellipse check", {
            ballPos: targetBall.pos,
            svgY,
            ellipse: currentEllipseCheck,
            dx,
            dy,
            ex,
            ey,
            sum: ex + ey,
            ellipseHit,
          })
        }
      }

      // Score this attempt
      const pts =
        proximityPoints(outcomes, currentRuleType) +
        (ellipseHit ? 1 : 0) +
        potPoints(outcomes, currentRuleType, currentNoPot)
      const max = maxPoints(currentEllipseCheck !== null, currentRuleType, currentNoPot)
      const pct = max > 0 ? Math.round((pts / max) * 100) : 0
      console.log("exam score", { pts, max, pct, outcomes })

      // Update storage
      const results = getResults()
      if (!results[currentQuestionId]) {
        results[currentQuestionId] = { totalPoints: 0, totalMax: 0, attempted: 0 }
      }
      results[currentQuestionId].attempted++
      results[currentQuestionId].totalPoints += pts
      results[currentQuestionId].totalMax += max
      results[currentQuestionId].bestPoints = Math.max(results[currentQuestionId].bestPoints || 0, pts)
      results[currentQuestionId].lastPct = pct
      results[currentQuestionId].lastPts = pts
      results[currentQuestionId].lastMax = max
      saveResults(results)

      // Close iframe immediately
      overlay.classList.remove("active")
      iframe.src = ""

      // Update UI
      updateUI()

      currentQuestionId = null
      currentEllipseCheck = null
      currentRuleType = null
      currentNoPot = false
    }
  })

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active")
      iframe.src = ""
      currentQuestionId = null
      currentEllipseCheck = null
      currentRuleType = null
      currentNoPot = false
    })
  }

  updateUI()
}
