"use strict";

var Form = React.createClass({
  displayName: "Form",

  mixins: [CityMixin],
  componentDidMount: function componentDidMount() {
    localStorage.removeItem("day");
    localStorage.removeItem("weather");

    this.getCityByIP(function () {
      this.loadRemotePods();
    });
  },
  getInitialState: function getInitialState() {
    return {
      cityId: localStorage["cityId"],
      podId: localStorage["podId"],
      desk: localStorage["desk"],
      password: localStorage["password"],
      saved: false,
      pods: {}
    };
  },
  getPods: function getPods(data) {
    var pods = {};

    if (data && data.pods) {
      for (var podId in data.pods) {
        pods[podId] = data.pods[podId].name;
      }
    }

    return pods;
  },
  loadRemotePods: function loadRemotePods() {
    var url = "http://progress.appacademy.io/api/pairs.json?city_id=" + this.state.cityId;

    $.getJSON(url, (function (data) {
      this.setState({ "pods": this.getPods(data) });
    }).bind(this));
  },
  flashInfo: function flashInfo() {
    this.setState({ saved: true });

    if (this.flashTimeout) {
      clearTimeout(this.flashTimeout);
    }

    this.flashTimeout = setTimeout((function () {
      this.setState({ saved: false });
    }).bind(this), 2000);
  },
  handleDeskChange: function handleDeskChange(event) {
    var desk = event.target.value;
    localStorage["desk"] = desk;
    this.setState({ desk: desk });
    this.flashInfo();
    this.setDeskHash();
  },
  handlePasswordChange: function handlePasswordChange(event) {
    var password = event.target.value;
    localStorage["password"] = password;
    this.setState({ password: password });
    this.flashInfo();
    this.setDeskHash();
  },
  handleLocationChange: function handleLocationChange(event) {
    this.setCityId(event.target.value, function () {
      this.loadRemotePods();
      this.flashInfo();
      this.setDeskHash();
    });
  },
  handlePodChange: function handlePodChange(event) {
    var podId = event.target.value;
    localStorage["podId"] = podId;
    this.setState({ podId: podId });
    this.flashInfo();
  },
  setDeskHash: function setDeskHash() {
    var deskRecipe = "";

    ["cityId", "desk", "password"].forEach(function (key) {
      deskRecipe += localStorage[key];
    });

    var deskHash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(deskRecipe));
    chrome.storage.local.set({ deskHash: deskHash });
  },
  render: function render() {
    var info = this.state.saved && React.createElement(
      "p",
      null,
      "Settings saved!"
    );
    var podOptions = [];

    if (this.state.cityId && this.state.pods) {
      for (var podId in this.state.pods) {
        podOptions.push(React.createElement(
          "option",
          { value: podId, key: podId },
          this.state.pods[podId]
        ));
      }
    }

    return React.createElement(
      "form",
      { action: "#" },
      React.createElement(
        "h1",
        null,
        "Options"
      ),
      React.createElement(
        "div",
        { id: "info" },
        info
      ),
      React.createElement(
        "div",
        { className: "input" },
        React.createElement(
          "div",
          { className: "label" },
          "Location"
        ),
        React.createElement(
          "div",
          { id: "input-location" },
          React.createElement(
            "label",
            null,
            React.createElement("input", {
              type: "radio",
              htmlName: "location",
              value: "1",
              checked: this.state.cityId == 1,
              onChange: this.handleLocationChange }),
            " NYC"
          ),
          React.createElement(
            "label",
            null,
            React.createElement("input", {
              type: "radio",
              htmlName: "location",
              value: "2",
              checked: this.state.cityId == 2,
              onChange: this.handleLocationChange }),
            " SF"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "input" },
        React.createElement(
          "label",
          { htmlFor: "select-pod" },
          "Pod"
        ),
        React.createElement(
          "select",
          { id: "select-pod", value: this.state.podId, onChange: this.handlePodChange },
          podOptions
        )
      ),
      React.createElement(
        "div",
        { className: "input" },
        React.createElement(
          "label",
          { htmlFor: "input-desk" },
          "Desk"
        ),
        React.createElement("input", {
          type: "number",
          value: this.state.desk,
          id: "input-desk",
          onChange: this.handleDeskChange })
      ),
      React.createElement(
        "div",
        { className: "input" },
        React.createElement(
          "label",
          { htmlFor: "input-password" },
          "Password"
        ),
        React.createElement("input", {
          type: "password",
          value: this.state.password,
          id: "input-password",
          onChange: this.handlePasswordChange })
      )
    );
  }
});

var Body = React.createClass({
  displayName: "Body",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "header",
        { className: "header group" },
        React.createElement(
          "h1",
          { className: "logo" },
          React.createElement(
            "a",
            { href: "http://www.appacademy.io/" },
            "App Academy"
          )
        )
      ),
      React.createElement(Form, null),
      React.createElement(
        "footer",
        null,
        React.createElement(
          "a",
          { href: "tab.html" },
          "Options"
        )
      )
    );
  }
});

$(function () {
  React.render(React.createElement(Body, null), document.body);
});