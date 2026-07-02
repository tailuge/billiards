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

function maxPoints(ellipseCount, ruleType, noPot) {
  if (ruleType === "threecushion") {
    return 3 + ellipseCount
  }
  return ellipseCount + (noPot ? 0 : 3)
}

function qIdForBlock(block) {
  if (block.id) return block.id
  const svg = block.querySelector(".billiards-table")
  const h3 = block.querySelector("h3")
  let h = 0
  let s = ""
  if (svg) {
    s += svg.dataset.jsonShots || svg.dataset.shots || ""
    if (svg.dataset.nopot !== undefined) s += "nopot"
    s += svg.dataset.figure || ""
    const ellipses = svg.querySelectorAll("ellipse")
    for (const e of ellipses) s += e.outerHTML
  }
  if (h3) s += h3.textContent
  if (!s) s = String(Math.random())
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  const qId = "q" + Math.abs(h).toString(36)
  block.id = qId
  return qId
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
  let attemptedCount = 0
  let questionsAttempted = 0

  const firstSvg = document.querySelector(".billiards-table")
  let ruleType = "threecushion"
  if (firstSvg?.dataset.jsonShots) {
    try {
      ruleType =
        JSON.parse(firstSvg.dataset.jsonShots)[0]?.ruleType || "threecushion"
    } catch {}
  }

  blocks.forEach((block) => {
    const qId = qIdForBlock(block)
    const svg = block.querySelector(".billiards-table")
    if (!svg) return
    const ellipseCount = svg.querySelectorAll("ellipse[data-id]").length
    const noPot = svg.dataset.nopot !== undefined
    const max = maxPoints(ellipseCount, ruleType, noPot)
    totalPossible += max

    const r = results[qId]
    if (r) {
      totalScored += r.bestPoints !== undefined ? r.bestPoints : r.lastPts || 0
      attemptedCount += r.attempted || 0
      if (r.attempted > 0) questionsAttempted++
    }
  })

  if (attemptedCount === 0 || totalPossible === 0)
    return { label: "Unknown", className: "unknown" }

  const scorePct = totalScored / totalPossible
  const completionPct = questionsAttempted / blocks.length

  let label = "Master"
  let className = "master"
  if (scorePct < 0.1) {
    label = "Beginner"
    className = "beginner"
  } else if (scorePct < 0.2) {
    label = "Novice"
    className = "novice"
  } else if (scorePct < 0.3) {
    label = "Learner"
    className = "learner"
  } else if (scorePct < 0.4) {
    label = "Developing"
    className = "developing"
  } else if (scorePct < 0.5) {
    label = "Intermediate"
    className = "intermediate"
  } else if (scorePct < 0.6) {
    label = "Competent"
    className = "competent"
  } else if (scorePct < 0.7) {
    label = "Proficient"
    className = "proficient"
  } else if (scorePct < 0.8) {
    label = "Advanced"
    className = "advanced"
  } else if (scorePct < 0.9) {
    label = "Expert"
    className = "expert"
  }

  return {
    label,
    className,
    completionPct: Math.round(completionPct * 100),
    scorePct: Math.round(scorePct * 100),
  }
}

function updateAssessment() {
  const levelEl = document.getElementById("assessmentLevel")
  const completionEl = document.getElementById("completionPct")
  const scoreEl = document.getElementById("scorePct")
  if (!levelEl) return
  const results = getResults()
  const { label, className, completionPct, scorePct } =
    calculateAssessment(results)
  levelEl.textContent = `Assessment: ${label}`
  levelEl.className = `assessment-item assessment ${className}`
  completionEl.textContent =
    label === "Unknown" ? "—" : `completion: ${completionPct}%`
  scoreEl.textContent = label === "Unknown" ? "—" : `score: ${scorePct}%`
}

function buildSummaryList() {
  const shotList = document.getElementById("shotList")
  if (!shotList || shotList.children.length > 0) return
  const blocks = document.querySelectorAll(".question-block")
  blocks.forEach((block) => {
    const h3 = block.querySelector("h3")
    const li = document.createElement("li")
    const qId = qIdForBlock(block)
    li.dataset.qid = qId
    li.innerHTML = `<a href="#${qId}">${h3 ? h3.textContent : `Shot ${qId}`}</a> <span class="status-unknown">❓ Unknown</span>`
    shotList.appendChild(li)
  })

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash)
    if (target) {
      setTimeout(() => target.scrollIntoView(), 100)
    }
  }
}

export function updateUI() {
  buildSummaryList()
  updateAssessment()
  const results = getResults()

  // Update shot list summary
  const shotList = document.getElementById("shotList")
  if (shotList) {
    const listItems = shotList.querySelectorAll("li")
    listItems.forEach((li) => {
      const qId = li.dataset.qid
      const result = results[qId] || {
        totalPoints: 0,
        totalMax: 0,
        attempted: 0,
      }

      let statusClass = "status-unknown"
      let statusText = "Unknown"
      let icon = "❓"

      if (result.attempted > 0) {
        const displayPct =
          result.lastPct !== undefined
            ? result.lastPct
            : result.totalMax > 0
              ? Math.round((result.totalPoints / result.totalMax) * 100)
              : 0
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
  document.querySelectorAll(".play-btn").forEach((btn) => {
    const qBlock = btn.closest(".question-block")
    const qId = qIdForBlock(qBlock)
    const result = results[qId] || { totalPoints: 0, totalMax: 0, attempted: 0 }

    let icon = "❓"
    let statText = ""
    if (result.attempted > 0) {
      const displayPct =
        result.lastPct !== undefined
          ? result.lastPct
          : result.totalMax > 0
            ? Math.round((result.totalPoints / result.totalMax) * 100)
            : 0
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
      const displayPct =
        result.lastPct !== undefined
          ? result.lastPct
          : result.totalMax > 0
            ? Math.round((result.totalPoints / result.totalMax) * 100)
            : 0
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
let currentEllipseChecks = null
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

  // Analysis link (magnifying glass) for each three-cushion SVG
  document.querySelectorAll(".billiards-table").forEach((svg) => {
    let configs = []
    if (svg.dataset.jsonShots) {
      configs = parseJsonShots(svg.dataset.jsonShots)
    } else if (svg.dataset.shots) {
      configs = parseShots(svg.dataset.shots)
    }
    if (configs.length === 0) return
    const cfg = configs[0]
    const ruleType = cfg.ruleType || "threecushion"
    const isThreeCushion = ruleType === "threecushion"
    const ballsPos = cfg.balls.flatMap((b) => [b.pos.x, b.pos.y])

    const parent = svg.parentElement
    if (!parent) return
    const prevPos = parent.style.position
    if (
      prevPos !== "relative" &&
      prevPos !== "absolute" &&
      prevPos !== "fixed"
    ) {
      parent.style.position = "relative"
    }

    if (isThreeCushion) {
      const link = document.createElement("a")
      link.textContent = "\uD83D\uDD0D"
      link.target = "_blank"
      link.rel = "noopener"
      link.style.cssText =
        "position:absolute;bottom:4%;right:5%;font-size:16px;cursor:pointer;text-decoration:none;z-index:10;opacity:0.6;filter:grayscale(1)"
      link.title = "Open in analysis view"

      const init = JSON.stringify(cfg.balls.flatMap((b) => [b.pos.x, b.pos.y]))
      const initShot = JSON.stringify({
        cueBallId: cfg.shot.cueBallId,
        angle: cfg.shot.angle,
        power: cfg.shot.power,
        offset: cfg.shot.offset,
        elevation: cfg.shot.elevation ?? 0,
      })
      const params = new URLSearchParams()
      params.set("ruletype", "threecushion")
      params.set("practice", "")
      params.set("analysis", "")
      params.set("init", init)
      params.set("initShot", initShot)
      link.href = `https://velikodimov.github.io/billiards/dist/index.html?${params}`
      parent.appendChild(link)
    }

    const editBtn = document.createElement("button")
    editBtn.textContent = "\u270F\uFE0F"
    editBtn.className = "edit-btn"
    editBtn.style.cssText =
      "position:absolute;bottom:4%;right:10%;font-size:16px;cursor:pointer;z-index:10;opacity:0.6;filter:grayscale(1);background:none;border:none;padding:0"
    editBtn.title = "Open in diagram editor"
    editBtn.addEventListener("click", () => {
      const shot = {
        angle: cfg.shot.angle,
        power: cfg.shot.power,
        offset: cfg.shot.offset,
      }
      const p = new URLSearchParams()
      p.set("ruletype", cfg.ruleType || "threecushion")
      p.set("cushionModel", cfg.cushionModel || "mathavan")
      p.set("init", JSON.stringify(ballsPos))
      p.set("initShot", JSON.stringify(shot))
      window.open(`../diagrams/export.html?${p}`, "_blank")
    })
    parent.appendChild(editBtn)

    const setupBtn = document.createElement("button")
    setupBtn.textContent = "\uD83D\uDD27"
    setupBtn.className = "setup-btn"
    setupBtn.style.cssText =
      "position:absolute;bottom:4%;right:15%;font-size:16px;cursor:pointer;z-index:10;opacity:0.6;filter:grayscale(1);background:none;border:none;padding:0"
    setupBtn.title = isThreeCushion
      ? "Open in three cushion research view"
      : "Open in practice layout view"
    setupBtn.addEventListener("click", () => {
      if (isThreeCushion) {
        const cueBall = cfg.balls[cfg.shot.cueBallId]
        const state = {
          diagram: true,
          init: ballsPos,
          shots: [
            {
              type: "AIM",
              angle: cfg.shot.angle,
              power: cfg.shot.power,
              offset: cfg.shot.offset,
              pos: { x: cueBall.pos.x, y: cueBall.pos.y, z: 0 },
              i: cfg.shot.cueBallId,
            },
          ],
        }
        const p = new URLSearchParams()
        p.set("s", JSON.stringify(state))
        window.open(`../diagrams/three.html?${p}`, "_blank")
      } else {
        const init = cfg.balls.flatMap((b) => [b.pos.x, b.pos.y])
        const p = new URLSearchParams()
        p.set("ruletype", cfg.ruleType)
        p.set("init", JSON.stringify(init))
        window.open(`../practice.html?${p}`, "_blank")
      }
    })
    parent.appendChild(setupBtn)
  })

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

  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qBlock = btn.closest(".question-block")
      currentQuestionId = qIdForBlock(qBlock)
      currentRuleType = null
      currentNoPot = false
      const svg = qBlock.querySelector(".billiards-table")

      const ellipses = svg.querySelectorAll("ellipse[data-id]")
      currentEllipseChecks =
        ellipses.length > 0
          ? Array.from(ellipses).map((e) => ({
              ballId: parseInt(e.dataset.id, 10),
              cx: parseFloat(e.getAttribute("cx")),
              cy: parseFloat(e.getAttribute("cy")),
              rx: parseFloat(e.getAttribute("rx")),
              ry: parseFloat(e.getAttribute("ry")),
            }))
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
        if (iframe.contentWindow && iframe.src) {
          iframe.contentWindow.location.replace(url)
        } else {
          iframe.src = url
        }
        overlay.classList.add("active")
      }
    })
  })

  window.addEventListener("message", (event) => {
    if (event.data.type === "stationary" && currentQuestionId) {
      const outcomes = event.data.outcome

      let ellipseHits = 0
      if (currentEllipseChecks && event.data.table?.balls) {
        for (const ec of currentEllipseChecks) {
          const targetBall = event.data.table.balls.find(
            (b) => b.id === ec.ballId
          )
          if (targetBall) {
            const dx = targetBall.pos.x - ec.cx
            const svgY = -targetBall.pos.y
            const dy = svgY - ec.cy
            const ex = (dx * dx) / (ec.rx * ec.rx)
            const ey = (dy * dy) / (ec.ry * ec.ry)
            if (ex + ey <= 1) ellipseHits++
            console.log("ellipse check", {
              ballId: ec.ballId,
              ballPos: targetBall.pos,
              svgY,
              dx,
              dy,
              ex,
              ey,
              sum: ex + ey,
              hit: ex + ey <= 1,
            })
          }
        }
      }

      // Score this attempt
      const pts =
        proximityPoints(outcomes, currentRuleType) +
        ellipseHits +
        potPoints(outcomes, currentRuleType, currentNoPot)
      const max = maxPoints(
        currentEllipseChecks ? currentEllipseChecks.length : 0,
        currentRuleType,
        currentNoPot
      )
      const pct = max > 0 ? Math.round((pts / max) * 100) : 0
      console.log("exam score", { pts, max, pct, outcomes })

      // Update storage
      const results = getResults()
      if (!results[currentQuestionId]) {
        results[currentQuestionId] = {
          totalPoints: 0,
          totalMax: 0,
          attempted: 0,
        }
      }
      results[currentQuestionId].attempted++
      results[currentQuestionId].totalPoints += pts
      results[currentQuestionId].totalMax += max
      results[currentQuestionId].bestPoints = Math.max(
        results[currentQuestionId].bestPoints || 0,
        pts
      )
      results[currentQuestionId].lastPct = pct
      results[currentQuestionId].lastPts = pts
      results[currentQuestionId].lastMax = max
      saveResults(results)

      // Close iframe immediately
      overlay.classList.remove("active")

      // Update UI
      updateUI()

      currentQuestionId = null
      currentEllipseChecks = null
      currentRuleType = null
      currentNoPot = false
    }
  })

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active")
      currentQuestionId = null
      currentEllipseChecks = null
      currentRuleType = null
      currentNoPot = false
    })
  }

  updateUI()
}
