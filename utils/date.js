function pad(value) {
  return value < 10 ? "0" + value : String(value);
}

function toDateKey(date) {
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function addDays(date, days) {
  var next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

function labelForOffset(offset) {
  if (offset === 0) return "今天";
  if (offset === 1) return "明天";
  return "周" + "日一二三四五六".charAt(addDays(new Date(), offset).getDay());
}

function buildDateWindow(days) {
  var today = new Date();
  var result = [];

  for (var i = 0; i < days; i += 1) {
    var date = addDays(today, i);
    result.push({
      key: toDateKey(date),
      day: date.getDate(),
      label: labelForOffset(i),
      offset: i
    });
  }

  return result;
}

module.exports = {
  addDays: addDays,
  buildDateWindow: buildDateWindow,
  toDateKey: toDateKey
};
