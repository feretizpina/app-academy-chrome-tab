// SF: 37.7833 N, 122.4167 W
// NYC: 40.6700 N, 73.9400 W

"use strict";

var CityMixin = {
  getCityId: function getCityId() {
    return this.state && this.state.cityId || localStorage["cityId"] || 1;
  },
  getCityByIP: function getCityByIP(callback) {
    if (this.state && this.state.cityId || localStorage["cityId"]) {
      callback && callback.apply(this);
      return;
    };

    var sfLong = -122;
    var nycLong = -74;
    var midLong = parseInt((sfLong + nycLong) / 2);

    $.getJSON("http://ipinfo.io/json", (function (data) {
      var long = parseInt(data.loc.split(",")[1]);
      this.setCityId(long > midLong ? 1 : 2, callback);
    }).bind(this));
  },
  setCityId: function setCityId(cityId, callback) {
    localStorage["cityId"] = cityId;
    localStorage.removeItem("podId");

    this.setState({
      cityId: cityId,
      podId: null
    }, callback);
  }
};