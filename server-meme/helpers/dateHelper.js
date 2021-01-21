module.exports = {
  stringToDateObj: function(string) {
    split = string.replace(" ", "").split(",");
    date = split[0].split(".");
    time = split[1].split(":");
    dateObj = new Date(date[2], date[1], date[0], time[0], time[1], time[2]);
    return dateObj;
  }
}