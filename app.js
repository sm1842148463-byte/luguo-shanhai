const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-tab]");
const stories = [
  "从清晨的古道入口出发，到午后的山顶风起，这一路有竹林、远山和一点点累。12.8 公里的徒步，不只是走过一条山路，更像是给生活按下了一次重启键。",
  "今天把城市留在身后，沿着石阶、竹影和山风慢慢往上走。照片里是风景，身体里是疲惫，心里倒是久违地安静了下来。",
  "路过竹林，也路过云影。山顶那阵风吹过来的时候，突然觉得这一趟很值得。下次还想再来，只是要多带一件外套。"
];

let storyIndex = 0;
let checkinCount = 2;

function showTab(tabId) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === tabId);
  });

  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showTab(button.dataset.tab);
  });
});

document.getElementById("refreshStory").addEventListener("click", () => {
  storyIndex = (storyIndex + 1) % stories.length;
  document.getElementById("storyText").textContent = stories[storyIndex];
});

document.getElementById("addCheckin").addEventListener("click", () => {
  checkinCount += 1;
  const list = document.getElementById("checkinList");
  const item = document.createElement("article");
  const hour = 10 + checkinCount;
  item.innerHTML = `
    <span></span>
    <div>
      <h3>${hour}:10 新增拍照点</h3>
      <p>已记录位置、时间和路线节点，稍后会进入照片地图。</p>
    </div>
  `;
  list.appendChild(item);
});

setInterval(() => {
  const timer = document.getElementById("timer");
  const [h, m, s] = timer.textContent.split(":").map(Number);
  let total = h * 3600 + m * 60 + s + 1;
  const nextH = String(Math.floor(total / 3600)).padStart(2, "0");
  total %= 3600;
  const nextM = String(Math.floor(total / 60)).padStart(2, "0");
  const nextS = String(total % 60).padStart(2, "0");
  timer.textContent = `${nextH}:${nextM}:${nextS}`;
}, 1000);
