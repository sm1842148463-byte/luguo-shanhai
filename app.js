const panels = document.querySelectorAll("[data-tab-panel]");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const bottomButtons = document.querySelectorAll(".bottom-nav [data-tab-target]");

function openTab(tabName) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName);
  });

  bottomButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tabTarget === tabName);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => openTab(button.dataset.tabTarget));
});

const timer = document.querySelector("#timer");
const toggleTimer = document.querySelector("#toggleTimer");
let startedAt = 0;
let elapsed = 0;
let intervalId = 0;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
}

function renderTimer() {
  timer.textContent = formatTime(elapsed + Date.now() - startedAt);
}

if (toggleTimer && timer) {
  toggleTimer.addEventListener("click", () => {
    if (intervalId) {
      elapsed += Date.now() - startedAt;
      clearInterval(intervalId);
      intervalId = 0;
      toggleTimer.textContent = "继续";
      timer.textContent = formatTime(elapsed);
      return;
    }

    startedAt = Date.now();
    intervalId = window.setInterval(renderTimer, 500);
    renderTimer();
    toggleTimer.textContent = "暂停";
  });
}
