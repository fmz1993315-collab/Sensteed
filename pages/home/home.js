var gyms = require("../../data/gyms");
var dateUtil = require("../../utils/date");

var STORAGE_KEY = "climbing_gym_intents_v1";

function getIntentStore() {
  return wx.getStorageSync(STORAGE_KEY) || {};
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

Page({
  data: {
    city: "上海",
    mode: "list",
    activeFilter: "all",
    sortBy: "distance",
    listScope: "nearby",
    mapExpanded: false,
    mapCenter: {
      lat: 31.2304,
      lng: 121.4737
    },
    visibleGyms: [],
    displayGyms: [],
    hiddenGymCount: 0,
    markers: [],
    todayTotal: 0,
    hotGymCount: 0,
    quietGymCount: 0
  },

  onLoad: function () {
    this.refreshGyms();
  },

  onShow: function () {
    this.refreshGyms();
  },

  setMode: function (event) {
    this.setData({
      mode: event.currentTarget.dataset.mode,
      mapExpanded: false
    });
  },

  toggleMapExpanded: function () {
    this.setData({
      mapExpanded: !this.data.mapExpanded
    });
  },

  setFilter: function (event) {
    var self = this;

    this.setData(
      {
        activeFilter: event.currentTarget.dataset.filter
      },
      function () {
        self.refreshGyms();
      }
    );
  },

  setSort: function (event) {
    var self = this;

    this.setData(
      {
        sortBy: event.currentTarget.dataset.sort
      },
      function () {
        self.refreshGyms();
      }
    );
  },

  setScope: function (event) {
    var self = this;

    this.setData(
      {
        listScope: event.currentTarget.dataset.scope
      },
      function () {
        self.refreshGyms();
      }
    );
  },

  openGym: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/gym-detail/gym-detail?id=" + id
    });
  },

  openMarker: function (event) {
    var marker = this.data.markers.find(function (item) {
      return item.id === event.markerId;
    });

    if (!marker) return;

    wx.navigateTo({
      url: "/pages/gym-detail/gym-detail?id=" + marker.gymId
    });
  },

  refreshGyms: function () {
    var todayKey = dateUtil.toDateKey(new Date());
    var tomorrowKey = dateUtil.toDateKey(dateUtil.addDays(new Date(), 1));
    var intentStore = getIntentStore();
    var prepared = gyms.map(function (gym, index) {
      var gymIntents = intentStore[gym.id] || {};
      var todayHeat = gym.heatSeed.today + (gymIntents[todayKey] ? 1 : 0);
      var tomorrowHeat = gym.heatSeed.tomorrow + (gymIntents[tomorrowKey] ? 1 : 0);

      return Object.assign({}, gym, {
        index: index + 1,
        todayHeat: todayHeat,
        tomorrowHeat: tomorrowHeat,
        todayHeatLevel: heatLevel(todayHeat),
        verifiedClass: verifiedClass(gym.verifiedStatus)
      });
    });

    var filtered = this.filterGyms(prepared);
    var sorted = this.sortGyms(filtered);
    var nearbyLimit = 3;
    var displayGyms = this.data.listScope === "nearby" ? sorted.slice(0, nearbyLimit) : sorted;
    var hiddenGymCount = Math.max(sorted.length - displayGyms.length, 0);
    var todayTotal = sorted.reduce(function (sum, gym) {
      return sum + gym.todayHeat;
    }, 0);
    var hotGymCount = sorted.filter(function (gym) {
      return gym.todayHeat >= 16;
    }).length;
    var quietGymCount = sorted.filter(function (gym) {
      return gym.todayHeat <= 5;
    }).length;
    var markers = sorted.map(function (gym, index) {
      var level = heatLevel(gym.todayHeat);
      var color = level === "hot" ? "#FF453A" : level === "warm" ? "#FF8A00" : "#30C85A";

      return {
        id: index + 1,
        gymId: gym.id,
        latitude: gym.lat,
        longitude: gym.lng,
        iconPath: "/assets/marker-transparent.png",
        width: 1,
        height: 1,
        callout: {
          content: gym.name + " · " + gym.todayHeat + "人",
          color: "#172026",
          fontSize: 12,
          borderRadius: 4,
          bgColor: "#FFFFFF",
          padding: 6,
          display: "ALWAYS"
        },
        label: {
          content: String(gym.todayHeat),
          color: "#FFFFFF",
          fontSize: 11,
          bgColor: color,
          borderRadius: 10,
          padding: 4
        }
      };
    });

    this.setData({
      visibleGyms: sorted,
      displayGyms: displayGyms,
      hiddenGymCount: hiddenGymCount,
      markers: markers,
      todayTotal: todayTotal,
      hotGymCount: hotGymCount,
      quietGymCount: quietGymCount
    });
  },

  filterGyms: function (items) {
    var filter = this.data.activeFilter;

    return items.filter(function (gym) {
      if (filter === "all") return true;
      if (filter === "bouldering") return gym.hasBouldering && !gym.hasDifficulty;
      if (filter === "difficulty") return gym.hasDifficulty;
      if (filter === "lead") return gym.hasLead;
      if (filter === "beginner") return gym.beginnerFriendly;
      return true;
    });
  },

  sortGyms: function (items) {
    var sortBy = this.data.sortBy;
    var cloned = items.slice();

    cloned.sort(function (a, b) {
      if (sortBy === "hotToday") return b.todayHeat - a.todayHeat;
      if (sortBy === "hotTomorrow") return b.tomorrowHeat - a.tomorrowHeat;
      if (sortBy === "quietToday") return a.todayHeat - b.todayHeat;
      return a.distanceKm - b.distanceKm;
    });

    return cloned;
  }
});
