const panels = document.querySelectorAll("[data-tab-panel]");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const bottomButtons = document.querySelectorAll(".bottom-nav [data-tab-target]");
const routeDialog = document.querySelector("#routeDialog");
const routeDialogContent = document.querySelector("#routeDialogContent");

const routes = {
  huigang: {
    name: "徽杭古道轻徒步",
    distance: "12.8",
    time: "4.5",
    climb: "620",
    level: "中等",
    season: "春秋最佳",
    ticket: "部分入口可能收费",
    parking: "入口停车较方便",
    supply: "2 个补给点，山顶补给少",
    photo: "山腰竹林、古道石阶、山顶合影点",
    reason: "适合想体验古道和山脊风景的人，拍照点密集，但需要基础体力。",
    tips: ["山顶风大，建议带冲锋衣。", "下午 4 点前完成下撤。", "雨后石阶湿滑，建议穿防滑徒步鞋。"]
  },
  qingshan: {
    name: "青山湖绿道",
    distance: "10.6",
    time: "3.0",
    climb: "60",
    level: "轻松",
    season: "四季可去，秋冬水杉最佳",
    ticket: "无需门票",
    parking: "停车方便",
    supply: "沿线补给充足",
    photo: "水杉栈道、湖面倒影、日落弯道",
    reason: "不想太累又想拍照时优先选它，适合亲子、骑行和新手。",
    tips: ["日落前 1 小时光线最好。", "周末人多，建议早到。", "适合带老人和孩子。"]
  },
  jingshan: {
    name: "径山古道",
    distance: "7.2",
    time: "2.5",
    climb: "360",
    level: "轻中等",
    season: "秋色和春茶季推荐",
    ticket: "多数路段无需门票",
    parking: "寺院周边停车位紧张",
    supply: "山脚和寺院附近有补给",
    photo: "竹林、茶山、寺院屋檐",
    reason: "半天就能完成，有古道、有茶山、有寺院，适合拍照和轻徒步。",
    tips: ["寺院区域保持安静。", "茶山机位适合人像。", "雨天路面较滑。"]
  },
  moganshan: {
    name: "莫干山竹海线",
    distance: "14.1",
    time: "5.5",
    climb: "780",
    level: "中高",
    season: "春夏竹海、秋季清爽",
    ticket: "部分景区需要门票",
    parking: "自驾方便但旺季拥堵",
    supply: "民宿和村落补给较多",
    photo: "竹海小路、民国建筑、山顶平台",
    reason: "更适合有经验的周末徒步，路线长但内容丰富。",
    tips: ["提前确认景区门票和停车。", "建议带足水和高热量食品。", "夏季注意防蚊。"]
  }
};

const badges = [
  { id: "first", icon: "启", name: "第一次徒步", desc: "完成第一次出发记录。" },
  { id: "summit", icon: "顶", name: "首次登顶", desc: "完成一次登顶路线。" },
  { id: "ten", icon: "十", name: "10公里达成", desc: "单次路线超过 10 公里。" },
  { id: "sunrise", icon: "日", name: "日出观察者", desc: "完成一次日出机位打卡。" },
  { id: "cloud", icon: "云", name: "云海捕手", desc: "记录一次云海照片。" },
  { id: "forest", icon: "林", name: "森林漫游者", desc: "走过森林或竹林路线。" }
];

const earnedKey = "luguo-shanhai-earned-badges";
const countKey = "luguo-shanhai-trip-count";
const distanceKey = "luguo-shanhai-distance-count";
const defaultBadges = ["first", "summit", "ten"];
const badgeMigration = { photo: "cloud", sunset: "sunrise", climb: "summit", weekend: "ten" };
const badgeIds = badges.map((badge) => badge.id);
let storedBadges = JSON.parse(localStorage.getItem(earnedKey) || JSON.stringify(defaultBadges));
let earnedBadges = [...new Set(storedBadges.map((id) => badgeMigration[id] || id).filter((id) => badgeIds.includes(id)))];
if (!earnedBadges.length) earnedBadges = defaultBadges;
let tripCountValue = Number(localStorage.getItem(countKey) || 16);
let distanceValue = Number(localStorage.getItem(distanceKey) || 128.4);

const timer = document.querySelector("#timer");
const toggleTimer = document.querySelector("#toggleTimer");
const finishTrip = document.querySelector("#finishTrip");
const rewardMessage = document.querySelector("#rewardMessage");
const badgeGrid = document.querySelector("#badgeGrid");
const badgeCount = document.querySelector("#badgeCount");
const tripCount = document.querySelector("#tripCount");
const distanceCount = document.querySelector("#distanceCount");
const todayRouteTitle = document.querySelector("#todayRouteTitle");
const todayDistance = document.querySelector("#todayDistance");
const todayTime = document.querySelector("#todayTime");
const todayClimb = document.querySelector("#todayClimb");
const journalText = document.querySelector("#journalText");
let startedAt = 0;
let elapsed = 0;
let intervalId = 0;

function openTab(tabName) {
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName));
  bottomButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.tabTarget === tabName));
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => openTab(button.dataset.tabTarget));
});

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
}

function renderTimer() {
  if (timer) timer.textContent = formatTime(elapsed + Date.now() - startedAt);
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
  if (!nextBadge) return "所有勋章都已经点亮了。";
  earnedBadges = [...earnedBadges, nextBadge.id];
  return "解锁新勋章：" + nextBadge.name;
}

function setTodayRoute(route) {
  if (todayRouteTitle) todayRouteTitle.textContent = route.name;
  if (todayDistance) todayDistance.textContent = route.distance;
  if (todayTime) todayTime.textContent = route.time;
  if (todayClimb) todayClimb.textContent = route.climb;
  openTab("home");
}

function openRouteDialog(routeId) {
  const route = routes[routeId];
  if (!route || !routeDialog || !routeDialogContent) return;

  routeDialogContent.innerHTML = '<div class="dialog-hero"><p class="eyebrow">路线详情</p><h2>' + route.name + '</h2><p>' + route.reason + '</p></div>' +
    '<div class="dialog-body">' +
    '<div class="dialog-stats"><span><strong>' + route.distance + '</strong>km</span><span><strong>' + route.time + '</strong>小时</span><span><strong>' + route.climb + '</strong>m</span></div>' +
    '<p><strong>难度：</strong>' + route.level + ' · ' + route.season + '</p>' +
    '<p><strong>门票：</strong>' + route.ticket + '</p>' +
    '<p><strong>停车：</strong>' + route.parking + '</p>' +
    '<p><strong>补给：</strong>' + route.supply + '</p>' +
    '<p><strong>拍照点：</strong>' + route.photo + '</p>' +
    '<ul>' + route.tips.map((tip) => '<li>' + tip + '</li>').join('') + '</ul>' +
    '<button class="primary-action full" id="chooseRoute">设为今日出行</button>' +
    '</div>';

  routeDialogContent.querySelector("#chooseRoute").addEventListener("click", () => {
    setTodayRoute(route);
    routeDialog.close();
  });

  if (typeof routeDialog.showModal === "function") routeDialog.showModal();
}

document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", () => openRouteDialog(button.dataset.route));
});

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    if (rewardMessage) rewardMessage.textContent = "已标记拍照点：" + pin.dataset.photo;
    openTab("record");
  });
});

document.querySelectorAll("[data-style]").forEach((button) => {
  button.addEventListener("click", () => {
    const style = button.dataset.style;
    if (!journalText) return;
    if (style === "朋友圈短句") journalText.textContent = "走进山里，把风和自由都装进口袋。今天这一路，值了。";
    if (style === "攻略风") journalText.textContent = "本次路线 12.8km，累计爬升约 620m，建议晴天出发，带足饮水，下午 4 点前下撤。";
    if (style === "文艺风") journalText.textContent = "从清晨的山脚出发，到午后的山顶风起，这一路有汗水、有风景，也有久违的自由感。";
  });
});

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
      if (toggleTimer) toggleTimer.textContent = "继续";
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


const photoInput = document.querySelector("#photoInput");
const photoGrid = document.querySelector("#photoGrid");
const photoTimeline = document.querySelector("#photoTimeline");
const photoCount = document.querySelector("#photoCount");
const profilePhotoCount = document.querySelector("#profilePhotoCount");
const saveCheckin = document.querySelector("#saveCheckin");
const checkinPoint = document.querySelector("#checkinPoint");
const checkinNote = document.querySelector("#checkinNote");
const selectedPhotoHint = document.querySelector("#selectedPhotoHint");
const importedPhotos = [];
let pendingFiles = [];

function currentCheckinTime(offset) {
  const baseHour = 8 + Math.floor((importedPhotos.length + offset) * 1.2);
  const minute = (importedPhotos.length + offset) % 2 ? "30" : "10";
  return String(Math.min(baseHour, 18)).padStart(2, "0") + ":" + minute;
}

function renderImportedPhotos() {
  if (photoCount) photoCount.textContent = importedPhotos.length + " 张";
  if (profilePhotoCount) profilePhotoCount.textContent = String(236 + importedPhotos.length);

  if (photoGrid) {
    photoGrid.innerHTML = importedPhotos.map((photo) =>
      '<article class="imported-photo"><img src="' + photo.src + '" alt="' + photo.name + '"><strong>' + photo.point + '</strong><span>' + photo.name + '</span></article>'
    ).join("");
  }

  if (photoTimeline) {
    if (!importedPhotos.length) {
      photoTimeline.innerHTML = '<p class="empty-state">在记录页完成打卡后，会自动排成一条旅行时间线。</p>';
    } else {
      photoTimeline.innerHTML = importedPhotos.map((photo) =>
        '<article class="timeline-item"><img src="' + photo.src + '" alt="' + photo.name + '"><div><strong>' + photo.time + ' · ' + photo.point + '</strong><span>' + photo.name + '</span><p>' + photo.note + '</p></div></article>'
      ).join("");
    }
  }

  if (journalText && importedPhotos.length) {
    const points = [...new Set(importedPhotos.map((photo) => photo.point))].join("、");
    journalText.textContent = "这次路上完成了 " + importedPhotos.length + " 张照片打卡，经过 " + points + "，每个点都被放进了这条照片路线里。";
  }
}

function updatePendingHint() {
  if (!selectedPhotoHint) return;
  selectedPhotoHint.textContent = pendingFiles.length ? "已选择 " + pendingFiles.length + " 张，点保存打卡写入路线。" : "还没有选择照片";
}

if (photoInput) {
  photoInput.addEventListener("change", () => {
    pendingFiles = Array.from(photoInput.files || []).filter((file) => file.type.startsWith("image/"));
    updatePendingHint();
  });
}

if (saveCheckin) {
  saveCheckin.addEventListener("click", () => {
    if (!pendingFiles.length) {
      if (selectedPhotoHint) selectedPhotoHint.textContent = "请先选择本次打卡照片。";
      return;
    }

    const point = checkinPoint ? checkinPoint.value : "临时发现点";
    const note = checkinNote && checkinNote.value.trim() ? checkinNote.value.trim() : "路上随手记录的一刻。";
    pendingFiles.slice(0, 12 - importedPhotos.length).forEach((file, index) => {
      importedPhotos.push({
        name: file.name,
        src: URL.createObjectURL(file),
        time: currentCheckinTime(index),
        point,
        note
      });
    });

    pendingFiles = [];
    if (photoInput) photoInput.value = "";
    if (checkinNote) checkinNote.value = "";
    updatePendingHint();
    renderImportedPhotos();
    if (rewardMessage) rewardMessage.textContent = "已在「" + point + "」保存照片打卡。";
  });
}

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    if (checkinPoint) checkinPoint.value = pin.dataset.photo || "临时发现点";
    if (selectedPhotoHint) selectedPhotoHint.textContent = "已选中点位：「" + (pin.dataset.photo || "临时发现点") + "」，可以上传照片打卡。";
  });
});

renderImportedPhotos();
