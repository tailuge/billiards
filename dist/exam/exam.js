import { initDiagrams } from "../diagrams/svg.js";
import { parseShots, parseJsonShots } from "../diagrams/dsl.js";

const STORAGE_KEY_PREFIX = "exam_results_";
const storageKey = STORAGE_KEY_PREFIX + window.location.pathname;

function getResults() {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : {};
}

function saveResults(results) {
  localStorage.setItem(storageKey, JSON.stringify(results));
}

function calculateAssessment(results) {
  const blocks = document.querySelectorAll(".question-block");
  if (blocks.length === 0) return { label: "Unknown", className: "unknown" };
  let totalAttempts = 0;
  let totalSuccesses = 0;
  Object.keys(results).forEach((qId) => {
    const r = results[qId];
    if (r) {
      totalAttempts += r.attempted;
      totalSuccesses += r.success;
    }
  });
  if (totalAttempts === 0) return { label: "Unknown", className: "unknown" };
  const pct = totalSuccesses / totalAttempts;
  if (pct < 0.25) return { label: "Beginner", className: "beginner" };
  if (pct < 0.5) return { label: "Good", className: "good" };
  if (pct < 0.75) return { label: "Strong", className: "strong" };
  return { label: "Excellent", className: "excellent" };
}

function updateAssessment() {
  const el = document.getElementById("assessment");
  if (!el) return;
  const results = getResults();
  const { label, className } = calculateAssessment(results);
  el.textContent = `Assessment: ${label}`;
  el.className = `assessment ${className}`;
}

function buildSummaryList() {
  const shotList = document.getElementById("shotList");
  if (!shotList || shotList.children.length > 0) return;
  const blocks = document.querySelectorAll(".question-block");
  blocks.forEach((block, index) => {
    const h3 = block.querySelector("h3");
    const li = document.createElement("li");
    li.innerHTML = `${h3 ? h3.textContent : `Shot ${index + 1}`} <span class="status-unknown">❓ Unknown</span>`;
    shotList.appendChild(li);
  });
}

export function updateUI() {
  buildSummaryList();
  updateAssessment();
  const results = getResults();

  // Update shot list summary
  const shotList = document.getElementById("shotList");
  if (shotList) {
    const listItems = shotList.querySelectorAll("li");
    listItems.forEach((li, index) => {
      const qId = String(index + 1);
      const result = results[qId] || { success: 0, attempted: 0 };

      let statusClass = "status-unknown";
      let statusText = "Unknown";
      let icon = "❓";

      if (result.attempted > 0) {
        if (result.success > 0) {
          statusClass = "status-pass";
          statusText = "Pass";
          icon = "✅";
        } else {
          statusClass = "status-fail";
          statusText = "Fail";
          icon = "❌";
        }
      }

      const statusSpan = li.querySelector("span");
      if (statusSpan) {
        statusSpan.className = statusClass;
        statusSpan.textContent = `${icon} ${statusText}`;
      }
    });
  }

  // Update play buttons and their stats
  document.querySelectorAll(".play-btn").forEach((btn) => {
    const qId = btn.getAttribute("data-q");
    const result = results[qId] || { success: 0, attempted: 0 };

    let icon = "❓";
    if (result.attempted > 0) {
      icon = result.success > 0 ? "✅" : "❌";
    }

    let statsSpan = btn.nextElementSibling;
    if (!statsSpan || !statsSpan.classList.contains("q-stats")) {
      statsSpan = document.createElement("span");
      statsSpan.classList.add("q-stats");
      statsSpan.style.marginLeft = "1rem";
      statsSpan.style.fontWeight = "bold";
      btn.parentNode.insertBefore(statsSpan, btn.nextSibling);
    }

    statsSpan.textContent = `${icon} ${result.success}/${result.attempted}`;
  });
}

let currentQuestionId = null;

export function initExam() {
  initDiagrams();

  const overlay = document.getElementById("gameOverlay");
  const iframe = document.getElementById("gameIframe");
  const closeBtn = document.getElementById("closeGame");

  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qBlock = btn.closest(".question-block");
      currentQuestionId = btn.getAttribute("data-q");
      const svg = qBlock.querySelector(".billiards-table");

      let configs = [];
      if (svg.dataset.jsonShots) {
        configs = parseJsonShots(svg.dataset.jsonShots);
      } else if (svg.dataset.shots) {
        configs = parseShots(svg.dataset.shots);
      }

      if (configs.length > 0) {
        const config = configs[0];
        const init = config.balls.flatMap((b) => [b.pos.x, b.pos.y]);
        const initShot = {
          ...config.shot,
          i: config.shot.cueBallId,
          pos: config.balls[config.shot.cueBallId].pos,
        };

        const url = `../index.html?ruletype=threecushion&exam=true&practice=true&init=${encodeURIComponent(JSON.stringify(init))}&initShot=${encodeURIComponent(JSON.stringify(initShot))}`;
        iframe.src = url;
        overlay.classList.add("active");
      }
    });
  });

  window.addEventListener("message", (event) => {
    if (event.data.type === "stationary" && currentQuestionId) {
      const outcomes = event.data.outcome;
      const isSuccess = outcomes.some((o) => o.type === "Proximity");

      // Update storage
      const results = getResults();
      if (!results[currentQuestionId]) {
        results[currentQuestionId] = { success: 0, attempted: 0 };
      }
      results[currentQuestionId].attempted++;
      if (isSuccess) {
        results[currentQuestionId].success++;
      }
      saveResults(results);

      // Close iframe immediately
      overlay.classList.remove("active");
      iframe.src = "";

      // Update UI
      updateUI();

      currentQuestionId = null;
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      iframe.src = "";
      currentQuestionId = null;
    });
  }

  updateUI();
}
