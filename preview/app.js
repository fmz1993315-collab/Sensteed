const gyms = [
  {
    id: "sh-banana-jingan",
    city: "上海",
    name: "香蕉攀岩 静安馆",
    district: "静安区",
    address: "上海市静安区共和新路附近",
    lat: 31.2607,
    lng: 121.4592,
    distanceKm: 2.4,
    type: "综合馆",
    tags: ["抱石", "难度", "自动保护", "适合新手"],
    hasBouldering: true,
    hasDifficulty: true,
    hasLead: false,
    hasTopRope: true,
    hasAutoBelay: true,
    beginnerFriendly: true,
    trainingArea: true,
    openingHours: "10:00-22:00",
    verifiedStatus: "已核验",
    lastVerifiedAt: "2026-06-15",
    confidence: 92,
    heatSeed: { today: 18, tomorrow: 11 },
    map: { x: 47, y: 30 }
  },
  {
    id: "sh-pongo-xuhui",
    city: "上海",
    name: "Pongo 抱石",
    district: "徐汇区",
    address: "上海市徐汇区龙华中路附近",
    lat: 31.1867,
    lng: 121.4562,
    distanceKm: 4.8,
    type: "纯抱石",
    tags: ["抱石", "训练区", "适合新手"],
    hasBouldering: true,
    hasDifficulty: false,
    hasLead: false,
    hasTopRope: false,
    hasAutoBelay: false,
    beginnerFriendly: true,
    trainingArea: true,
    openingHours: "11:00-23:00",
    verifiedStatus: "已核验",
    lastVerifiedAt: "2026-06-12",
    confidence: 89,
    heatSeed: { today: 9, tomorrow: 16 },
    map: { x: 43, y: 62 }
  },
  {
    id: "sh-rockplus-yangpu",
    city: "上海",
    name: "Rock Plus 杨浦馆",
    district: "杨浦区",
    address: "上海市杨浦区大学路附近",
    lat: 31.3048,
    lng: 121.5134,
    distanceKm: 7.1,
    type: "抱石+难度",
    tags: ["抱石", "难度", "先锋", "顶绳"],
    hasBouldering: true,
    hasDifficulty: true,
    hasLead: true,
    hasTopRope: true,
    hasAutoBelay: false,
    beginnerFriendly: false,
    trainingArea: true,
    openingHours: "10:00-22:30",
    verifiedStatus: "待复核",
    lastVerifiedAt: "2026-05-28",
    confidence: 76,
    heatSeed: { today: 23, tomorrow: 19 },
    map: { x: 66, y: 23 }
  },
  {
    id: "sh-boulder-hub-pudong",
    city: "上海",
    name: "Boulder Hub 浦东",
    district: "浦东新区",
    address: "上海市浦东新区张杨路附近",
    lat: 31.2279,
    lng: 121.5368,
    distanceKm: 8.6,
    type: "纯抱石",
    tags: ["抱石", "训练区", "新店"],
    hasBouldering: true,
    hasDifficulty: false,
    hasLead: false,
    hasTopRope: false,
    hasAutoBelay: false,
    beginnerFriendly: false,
    trainingArea: true,
    openingHours: "12:00-23:00",
    verifiedStatus: "疑似新开",
    lastVerifiedAt: "2026-06-08",
    confidence: 68,
    heatSeed: { today: 5, tomorrow: 7 },
    map: { x: 78, y: 47 }
  },
  {
    id: "sh-summit-minhang",
    city: "上海",
    name: "巅峰攀岩 闵行馆",
    district: "闵行区",
    address: "上海市闵行区七莘路附近",
    lat: 31.1325,
    lng: 121.3719,
    distanceKm: 14.2,
    type: "难度为主",
    tags: ["难度", "先锋", "顶绳", "青少年课"],
    hasBouldering: false,
    hasDifficulty: true,
    hasLead: true,
    hasTopRope: true,
    hasAutoBelay: false,
    beginnerFriendly: true,
    trainingArea: false,
    openingHours: "09:30-21:30",
    verifiedStatus: "已核验",
    lastVerifiedAt: "2026-06-10",
    confidence: 87,
    heatSeed: { today: 6, tomorrow: 8 },
    map: { x: 24, y: 78 }
  },
  {
    id: "sh-northwall-baoshan",
    city: "上海",
    name: "北墙抱石 宝山店",
    district: "宝山区",
    address: "上海市宝山区一二八纪念路附近",
    lat: 31.3256,
    lng: 121.4316,
    distanceKm: 12.8,
    type: "纯抱石",
    tags: ["抱石", "适合新手"],
    hasBouldering: true,
    hasDifficulty: false,
    hasLead: false,
    hasTopRope: false,
    hasAutoBelay: false,
    beginnerFriendly: true,
    trainingArea: false,
    openingHours: "10:00-22:00",
    verifiedStatus: "用户反馈异常",
    lastVerifiedAt: "2026-05-20",
    confidence: 61,
    heatSeed: { today: 2, tomorrow: 4 },
    map: { x: 34, y: 18 }
  }
];

const state = {
  mode: "list",
  filter: "all",
  sort: "distance",
  listScope: "nearby",
  mapExpanded: false,
  intents: JSON.parse(localStorage.getItem("preview_intents") || "{}")
};

const NEARBY_LIMIT = 3;

const els = {
  home: document.querySelector("#homeView"),
  detail: document.querySelector("#detailView"),
  gymList: document.querySelector("#gymList"),
  gymCount: document.querySelector("#gymCount"),
  listTitle: document.querySelector("#listTitle"),
  listHint: document.querySelector("#listHint"),
  todayTotal: document.querySelector("#todayTotal"),
  hotGymCount: document.querySelector("#hotGymCount"),
  quietGymCount: document.querySelector("#quietGymCount"),
  mapPanel: document.querySelector("#mapPanel"),
  mapCanvas: document.querySelector("#mapCanvas"),
  mapExpandButton: document.querySelector("#mapExpandButton"),
  mapGymCount: document.querySelector("#mapGymCount"),
  detailContent: document.querySelector("#detailContent")
};

function pad(value) {
  return value < 10 ? `0${value}` : String(value);
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function dateKey(days = 0) {
  const date = addDays(days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function heatLevel(value) {
  if (value >= 16) return "hot";
  if (value >= 6) return "warm";
  return "calm";
}

function verifiedClass(status) {
  if (status === "已核验") return "verified";
  if (status === "疑似新开") return "new";
  if (status === "用户反馈异常") return "warning";
  return "pending";
}

function baseHeat(gym, offset) {
  if (offset === 0) return gym.heatSeed.today;
  if (offset === 1) return gym.heatSeed.tomorrow;
  return (gym.id.length + gym.name.length + offset * 7) % 13;
}

function isMarked(gymId, key) {
  return Boolean(state.intents[gymId]?.[key]);
}

function heat(gym, offset) {
  return baseHeat(gym, offset) + (isMarked(gym.id, dateKey(offset)) ? 1 : 0);
}

function decoratedGyms() {
  return gyms.map((gym) => ({
    ...gym,
    todayHeat: heat(gym, 0),
    tomorrowHeat: heat(gym, 1),
    todayHeatLevel: heatLevel(heat(gym, 0)),
    verifiedClass: verifiedClass(gym.verifiedStatus)
  }));
}

function visibleGyms() {
  const filtered = decoratedGyms().filter((gym) => {
    if (state.filter === "all") return true;
    if (state.filter === "bouldering") return gym.hasBouldering && !gym.hasDifficulty;
    if (state.filter === "difficulty") return gym.hasDifficulty;
    if (state.filter === "lead") return gym.hasLead;
    if (state.filter === "beginner") return gym.beginnerFriendly;
    return true;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "hotToday") return b.todayHeat - a.todayHeat;
    if (state.sort === "hotTomorrow") return b.tomorrowHeat - a.tomorrowHeat;
    if (state.sort === "quietToday") return a.todayHeat - b.todayHeat;
    return a.distanceKm - b.distanceKm;
  });
}

function renderHome() {
  const items = visibleGyms();
  const listItems = state.listScope === "nearby" ? items.slice(0, NEARBY_LIMIT) : items;
  const hiddenCount = Math.max(items.length - listItems.length, 0);

  els.gymCount.textContent =
    state.listScope === "nearby" && hiddenCount > 0 ? `${listItems.length}/${items.length} 家` : `${items.length} 家`;
  els.listTitle.textContent = state.listScope === "nearby" ? "附近岩馆" : "同城全部岩馆";
  els.listHint.textContent = state.listScope === "nearby" ? "优先展示离你最近的岩馆" : "当前城市已收录岩馆";
  els.todayTotal.textContent = items.reduce((sum, gym) => sum + gym.todayHeat, 0);
  els.hotGymCount.textContent = items.filter((gym) => gym.todayHeat >= 16).length;
  els.quietGymCount.textContent = items.filter((gym) => gym.todayHeat <= 5).length;
  els.mapPanel.hidden = state.mode !== "map";
  els.mapPanel.classList.toggle("expanded", state.mode === "map" && state.mapExpanded);
  document.body.classList.toggle("map-expanded", state.mode === "map" && state.mapExpanded);
  els.mapExpandButton.textContent = state.mapExpanded ? "收起地图" : "全屏地图";
  els.mapGymCount.textContent = `${items.length} PINS`;
  updateScopeButtons();
  renderMap(items);
  els.gymList.innerHTML = listItems.map(renderGymCard).join("") + renderShowMore(hiddenCount);
}

function renderGymCard(gym) {
  return `
    <article class="gym-card" data-open="${gym.id}">
      <span class="gym-dot ${gym.todayHeatLevel}" aria-hidden="true"></span>
      <div>
        <div class="gym-name">${gym.name}</div>
        <div class="gym-meta">${gym.district} · ${gym.type} · ${gym.distanceKm}km</div>
        <div class="tag-row">${gym.tags.slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
      <div class="heat-stack">
        <strong class="${gym.todayHeatLevel}">${gym.todayHeat}</strong>
        <span>今日</span>
        <em>明日 ${gym.tomorrowHeat}</em>
      </div>
      <span class="chevron">›</span>
    </article>
  `;
}

function renderMap(items) {
  els.mapCanvas.innerHTML = items
    .map((gym) => {
      const level = heatLevel(gym.todayHeat);
      return `
        <button class="pin ${level}" data-open="${gym.id}" style="left:${gym.map.x}%; top:${gym.map.y}%;" type="button">
          ${gym.todayHeat}
          <span class="pin-label">${gym.name}</span>
        </button>
      `;
    })
    .join("");
}

function renderShowMore(hiddenCount) {
  if (state.listScope !== "nearby" || hiddenCount <= 0) return "";

  return `
    <button class="show-more-card" data-scope="all" type="button">
      <span>查看同城全部岩馆</span>
      <strong>还有 ${hiddenCount} 家</strong>
    </button>
  `;
}

function updateScopeButtons() {
  document.querySelectorAll("[data-scope]").forEach((button) => {
    button.classList.toggle("active", button.dataset.scope === state.listScope);
  });
}

function renderDetail(gymId) {
  const gym = decoratedGyms().find((item) => item.id === gymId);
  const calendar = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(index);
    const labels = ["今天", "明天"];
    const label = labels[index] || `周${"日一二三四五六"[date.getDay()]}`;
    const key = dateKey(index);
    const value = heat(gym, index);
    const marked = isMarked(gym.id, key);
    return { label, day: date.getDate(), key, heat: value, marked, level: heatLevel(value) };
  });

  els.detailContent.innerHTML = `
    <section class="hero-card">
      <div class="hero-map"></div>
      <div class="hero-content">
        <div class="status-row">
          <span class="status ${gym.verifiedClass}">${gym.verifiedStatus}</span>
          <span class="gym-meta">可信度 ${gym.confidence}%</span>
        </div>
        <div class="detail-name">${gym.name}</div>
        <div class="gym-meta">${gym.district} · ${gym.type} · ${gym.distanceKm}km</div>
        <div class="address">${gym.address}</div>
        <div class="tag-row">${gym.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
    </section>

    <div class="search-command detail-search" role="search" aria-label="搜索这家岩馆的日期热度">
      <span class="search-symbol" aria-hidden="true"></span>
      <div class="search-copy">
        <span class="search-main">查找同行日期或备注</span>
        <span class="search-sub">搜索此岩馆未来热度</span>
      </div>
      <button class="search-action" type="button" aria-label="筛选日期">
        <span></span>
      </button>
    </div>

    <div class="quick-actions">
      ${quickAction(gym, 0, "今日去爬", "今日已标记")}
      ${quickAction(gym, 1, "明日爬", "明日已标记")}
    </div>

    <section class="section-card">
      <div class="section-title">未来 14 天热度</div>
      <div class="section-sub">只统计计划去爬人数，不公开个人身份</div>
      <div class="calendar">
        ${calendar
          .map(
            (item) => `
              <button class="date-cell ${item.level} ${item.marked ? "marked" : ""}" data-date="${item.key}" data-gym="${gym.id}" type="button">
                <span>${item.label}</span>
                <strong>${item.day}</strong>
                <em>${item.heat}人</em>
              </button>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section-card">
      <div class="section-title">岩馆信息</div>
      <div class="info-row"><span>营业时间</span><b>${gym.openingHours}</b></div>
      <div class="info-row"><span>最近核验</span><b>${gym.lastVerifiedAt}</b></div>
      <div class="facility-grid">
        ${facility("抱石", gym.hasBouldering)}
        ${facility("难度", gym.hasDifficulty)}
        ${facility("先锋", gym.hasLead)}
        ${facility("顶绳", gym.hasTopRope)}
        ${facility("自动保护", gym.hasAutoBelay)}
        ${facility("训练区", gym.trainingArea)}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="secondary" type="button" data-toast="导航会在小程序内打开地图">导航</button>
      <button class="secondary" type="button" data-toast="已收到纠错反馈">信息纠错</button>
    </div>
  `;

  els.home.classList.remove("active");
  els.detail.classList.add("active");
}

function quickAction(gym, offset, plain, markedText) {
  const key = dateKey(offset);
  const marked = isMarked(gym.id, key);
  return `
    <button class="action ${marked ? "marked" : ""}" data-date="${key}" data-gym="${gym.id}" type="button">
      <strong>${marked ? markedText : plain}</strong>
      <span>${heat(gym, offset)} 人计划</span>
    </button>
  `;
}

function facility(label, value) {
  return `<span class="facility ${value ? "yes" : ""}">${label}</span>`;
}

function toggleIntent(gymId, key) {
  state.intents[gymId] = state.intents[gymId] || {};
  if (state.intents[gymId][key]) {
    delete state.intents[gymId][key];
  } else {
    state.intents[gymId][key] = true;
  }
  localStorage.setItem("preview_intents", JSON.stringify(state.intents));
  renderDetail(gymId);
  renderHome();
}

document.addEventListener("click", (event) => {
  const mapExpandButton = event.target.closest("[data-map-expand]");
  if (mapExpandButton) {
    state.mapExpanded = !state.mapExpanded;
    renderHome();
    return;
  }

  const modeButton = event.target.closest("[data-mode]");
  if (modeButton) {
    state.mode = modeButton.dataset.mode;
    if (state.mode !== "map") state.mapExpanded = false;
    document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button === modeButton));
    renderHome();
    return;
  }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("active", button === filterButton));
    renderHome();
    return;
  }

  const sortButton = event.target.closest("[data-sort]");
  if (sortButton) {
    state.sort = sortButton.dataset.sort;
    document.querySelectorAll("[data-sort]").forEach((button) => button.classList.toggle("active", button === sortButton));
    renderHome();
    return;
  }

  const scopeButton = event.target.closest("[data-scope]");
  if (scopeButton) {
    state.listScope = scopeButton.dataset.scope;
    renderHome();
    return;
  }

  const openButton = event.target.closest("[data-open]");
  if (openButton) {
    renderDetail(openButton.dataset.open);
    return;
  }

  const dateButton = event.target.closest("[data-date]");
  if (dateButton) {
    toggleIntent(dateButton.dataset.gym, dateButton.dataset.date);
    return;
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) {
    alert(toastButton.dataset.toast);
  }
});

document.querySelector("#backButton").addEventListener("click", () => {
  els.detail.classList.remove("active");
  els.home.classList.add("active");
});

renderHome();
