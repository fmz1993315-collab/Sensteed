var gyms = require("../../data/gyms");
var dateUtil = require("../../utils/date");

var INTENT_KEY = "climbing_gym_intents_v1";
var REPORT_KEY = "climbing_gym_reports_v1";

function getStorage(key) {
  return wx.getStorageSync(key) || {};
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

function baseHeatForDate(gym, offset) {
  if (offset === 0) return gym.heatSeed.today;
  if (offset === 1) return gym.heatSeed.tomorrow;

  var seed = gym.id.length + gym.name.length + offset * 7;
  return seed % 13;
}

Page({
  data: {
    gym: null,
    todayKey: "",
    tomorrowKey: "",
    todayMarked: false,
    tomorrowMarked: false,
    todayHeat: 0,
    tomorrowHeat: 0,
    calendar: []
  },

  onLoad: function (options) {
    var gym = gyms.find(function (item) {
      return item.id === options.id;
    });

    if (!gym) return;

    var decorated = Object.assign({}, gym, {
      verifiedClass: verifiedClass(gym.verifiedStatus)
    });

    wx.setNavigationBarTitle({
      title: gym.name
    });

    this.setData({
      gym: decorated
    });
    this.refreshCalendar();
  },

  toggleIntent: function (event) {
    var dateKey = event.currentTarget.dataset.date;
    var gym = this.data.gym;
    var store = getStorage(INTENT_KEY);
    var gymStore = store[gym.id] || {};

    if (gymStore[dateKey]) {
      delete gymStore[dateKey];
      wx.showToast({
        title: "已取消标记",
        icon: "none"
      });
    } else {
      gymStore[dateKey] = true;
      wx.showToast({
        title: "已标记",
        icon: "success"
      });
    }

    store[gym.id] = gymStore;
    wx.setStorageSync(INTENT_KEY, store);
    this.refreshCalendar();
  },

  refreshCalendar: function () {
    var gym = this.data.gym;
    var dates = dateUtil.buildDateWindow(14);
    var store = getStorage(INTENT_KEY);
    var gymStore = store[gym.id] || {};

    var calendar = dates.map(function (date) {
      var marked = Boolean(gymStore[date.key]);
      var heat = baseHeatForDate(gym, date.offset) + (marked ? 1 : 0);

      return Object.assign({}, date, {
        heat: heat,
        marked: marked,
        level: heatLevel(heat)
      });
    });

    this.setData({
      todayKey: calendar[0].key,
      tomorrowKey: calendar[1].key,
      todayMarked: calendar[0].marked,
      tomorrowMarked: calendar[1].marked,
      todayHeat: calendar[0].heat,
      tomorrowHeat: calendar[1].heat,
      calendar: calendar
    });
  },

  openLocation: function () {
    var gym = this.data.gym;
    wx.openLocation({
      latitude: gym.lat,
      longitude: gym.lng,
      name: gym.name,
      address: gym.address,
      scale: 16
    });
  },

  reportIssue: function () {
    var self = this;
    var issues = ["已关门", "地址不准确", "类型不准确", "营业时间不准确", "这是新开岩馆"];

    wx.showActionSheet({
      itemList: issues,
      success: function (result) {
        var issue = issues[result.tapIndex];
        var reports = wx.getStorageSync(REPORT_KEY) || [];

        reports.unshift({
          gymId: self.data.gym.id,
          issue: issue,
          createdAt: new Date().toISOString()
        });
        wx.setStorageSync(REPORT_KEY, reports.slice(0, 50));

        wx.showToast({
          title: "已收到反馈",
          icon: "success"
        });
      }
    });
  },

  goBack: function () {
    wx.navigateBack();
  }
});
