import { initDiagrams } from "../diagrams/svg.js"
import { parseShots, parseJsonShots, maxPower } from "../diagrams/dsl.js"

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
  const totalQuestions = blocks.length
  if (totalQuestions === 0) return { label: "Unknown", className: "unknown" }

  let passedQuestions = 0
  let totalAttempts = 0
  blocks.forEach((_, index) => {
    const qId = String(index + 1)
    const r = results[qId]
    if (r) {
      totalAttempts += r.attempted
      if (r.success > 0) {
        passedQuestions++
      }
    }
  })

  if (totalAttempts === 0) return { label: "Unknown", className: "unknown" }

  const pct = passedQuestions / totalQuestions
  if (pct < 0.25) return { label: "Beginner", className: "beginner" }
  if (pct < 0.5) return { label: "Good", className: "good" }
  if (pct < 0.75) return { label: "Strong", className: "strong" }
  return { label: "Excellent", className: "excellent" }
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
      const result = results[qId] || { success: 0, attempted: 0 }

      let statusClass = "status-unknown"
      let statusText = "Unknown"
      let icon = "❓"

      if (result.attempted > 0) {
        if (result.success > 0) {
          statusClass = "status-pass"
          statusText = "Pass"
          icon = "✅"
        } else {
          statusClass = "status-fail"
          statusText = "Fail"
          icon = "❌"
        }
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
    const result = results[qId] || { success: 0, attempted: 0 }

    let icon = "❓"
    if (result.attempted > 0) {
      icon = result.success > 0 ? "✅" : "❌"
    }

    let statsSpan = btn.nextElementSibling
    if (!statsSpan || !statsSpan.classList.contains("q-stats")) {
      statsSpan = document.createElement("span")
      statsSpan.classList.add("q-stats")
      statsSpan.style.marginLeft = "1rem"
      statsSpan.style.fontWeight = "bold"
      btn.parentNode.insertBefore(statsSpan, btn.nextSibling)
    }

    const newText = `${icon} ${result.success}/${result.attempted}`
    if (statsSpan.textContent !== newText) {
      const hadContent = statsSpan.textContent !== ""
      statsSpan.textContent = newText

      // Set pass/fail class for ring animation color
      statsSpan.classList.remove("q-pass", "q-fail")
      statsSpan.classList.add(result.success > 0 ? "q-pass" : "q-fail")

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

        const url = `../index.html?ruletype=${ruleType}&exam=true&practice=true&init=${encodeURIComponent(JSON.stringify(init))}&initShot=${encodeURIComponent(JSON.stringify(initShot))}`
        iframe.src = url
        overlay.classList.add("active")
      }
    })
  })

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

      const outcomesPass = outcomes.some((o) => {
        const pass =
          o.type === "Proximity" ||
          (o.type === "Pot" && o.ballA && o.ballA.id !== 0)
        if (pass) {
          console.log("outcome pass", {
            type: o.type,
            ballA: o.ballA,
            ballB: o.ballB,
          })
        }
        return pass
      })

      const isSuccess = ellipseHit || outcomesPass

      // Update storage
      const results = getResults()
      if (!results[currentQuestionId]) {
        results[currentQuestionId] = { success: 0, attempted: 0 }
      }
      results[currentQuestionId].attempted++
      if (isSuccess) {
        results[currentQuestionId].success++
      }
      saveResults(results)

      // Close iframe immediately
      overlay.classList.remove("active")
      iframe.src = ""

      // Update UI
      updateUI()

      currentQuestionId = null
      currentEllipseCheck = null
    }
  })

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active")
      iframe.src = ""
      currentQuestionId = null
      currentEllipseCheck = null
    })
  }

  updateUI()
}
