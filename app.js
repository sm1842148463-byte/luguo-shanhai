const panels = document.querySelectorAll("[data-tab-panel]");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const bottomButtons = document.querySelectorAll(".bottom-nav [data-tab-target]");

const badges = [
  { id: "first", icon: "启", name: "初次启程", desc: "完成第一次出发记录。" },
  { id: "forest", icon: "林", name: "林间行者", desc: "走过一条森林路线。" },
  { id: "photo", icon: "影", name: "山海取景", desc: "保存一次旅行回忆。" },
  { id: "sunset", icon: "暮", name: "追光日落", desc: "完成一次日落路线。" },
  { id: "climb", icon: "峰", name: "登高望海", desc: "累计爬升超过 1000 米。" },
  { id: "weekend", icon: "周", name: "周末不宅", desc: "连续两个周末出发。" }
];

const earnedKey = "luguo-shanhai-earned-badges";
const countKey = "luguo-shanhai-trip-count";
const distanceKey = "luguo-shanhai-distance-count";
let earnedBadges = JSON.parse(localStorage.getItem(earnedKey) || '["first","forest","photo"]');
let tripCountValue = Number(localStorage.getItem(countKey) || 16);
let distanceValue = Number(localStorage.getItem(distanceKey) || 128.4);

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
const finishTrip = document.querySelector("#finishTrip");
const rewardMessage = document.querySelector("#rewardMessage");
const badgeGrid = document.querySelector("#badgeGrid");
const badgeCount = document.querySelector("#badgeCount");
const tripCount = document.querySelector("#tripCount");
const distanceCount = document.querySelector("#distanceCount");
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

function saveProgress() {
  localStorage.setItem(earnedKey, JSON.stringify(earnedBadges));
  localStorage.setItem(countKey, String(tripCountValue));
  localStorage.setItem(distanceKey, String(distanceValue.toFixed(1)));
}

function renderStats() {
  if (tripCount) tripCount.textContent = String(tripCountValue);
  if (distanceCount) distanceCount.textContent = distanceValue.toFixed(1);
}

function renderBadges() {
  if (!badgeGrid) return;

  badgeGrid.innerHTML = badges.map((badge) => {
    const earned = earnedBadges.includes(badge.id);
    const status = earned ? "已获得" : "未解锁";
    return '<article class="badge-card ' + (earned ? 'is-earned' : 'is-locked') + '">' +
      '<div class="badge-card__icon">' + badge.icon + '</div>' +
      '<h3>' + badge.name + '</h3>' +
      '<p>' + status + ' · ' + badge.desc + '</p>' +
    '</article>';
  }).join("");

  if (badgeCount) badgeCount.textContent = earnedBadges.length + "/" + badges.length + " 已获得";
}

function unlockNextBadge() {
  const nextBadge = badges.find((badge) => !earnedBadges.includes(badge.id));
  if (!nextBadge) {
    return "所有勋章都已经点亮了。";
  }

  earnedBadges = [...earnedBadges, nextBadge.id];
  return "解锁新勋章：" + nextBadge.name;
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

if (finishTrip) {
  finishTrip.addEventListener("click", () => {
    if (intervalId) {
      elapsed += Date.now() - startedAt;
      clearInterval(intervalId);
      intervalId = 0;
      toggleTimer.textContent = "继续";
    }

    tripCountValue += 1;
    distanceValue += 3.6;
    const message = unlockNextBadge();
    saveProgress();
    renderStats();
    renderBadges();
    openTab("profile");
    if (rewardMessage) rewardMessage.textContent = message;
  });
}

renderStats();
renderBadges();
