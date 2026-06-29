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

function buildSummaryList() {
  const questionList = document.getElementById("questionList");
  if (!questionList || questionList.children.length > 0) return;
  const blocks = document.querySelectorAll(".question-block");
  blocks.forEach((block) => {
    const h3 = block.querySelector("h3");
    const li = document.createElement("li");
    li.innerHTML = `${h3 ? h3.textContent : `Question ${qId}`} <span class="status-unknown">❓ Unknown</span>`;
    questionList.appendChild(li);
  });
}

export function updateUI() {
  buildSummaryList();
  const results = getResults();

  // Update question list summary
  const questionList = document.getElementById("questionList");
  if (questionList) {
    const listItems = questionList.querySelectorAll("li");
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
