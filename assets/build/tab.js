"use strict";

var Link = React.createClass({
  displayName: "Link",

  render: function render() {
    return React.createElement(
      "a",
      { href: this.props.url },
      this.props.title
    );
  }
});

var PageLinksListItem = React.createClass({
  displayName: "PageLinksListItem",

  render: function render() {
    var subLink = this.props.link.sub ? React.createElement(PageLinksSubList, { links: this.props.link.sub }) : null;

    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: this.props.link.url },
        this.props.link.title
      ),
      subLink
    );
  }
});

var PageLinksSubList = React.createClass({
  displayName: "PageLinksSubList",

  render: function render() {
    var links = [];

    this.props.links.forEach(function (link, index) {
      var key = "link-" + index;

      links.push(React.createElement(PageLinksListItem, { key: key, link: link }));
    });

    return React.createElement(
      "ul",
      null,
      links
    );
  }
});

var PageLinksList = React.createClass({
  displayName: "PageLinksList",

  render: function render() {
    return React.createElement(
      "section",
      null,
      React.createElement(
        "h2",
        null,
        this.props.title
      ),
      React.createElement(PageLinksSubList, { links: this.props.links })
    );
  }
});

var PageLinks = React.createClass({
  displayName: "PageLinks",

  render: function render() {
    var lists = [];

    this.props.links.forEach(function (list, index) {
      var key = "links-list-" + index;

      lists.push(React.createElement(PageLinksList, { key: key, title: list.title, links: list.links }));
    });

    return React.createElement(
      "main",
      { className: "group" },
      lists
    );
  }
});

var PageHeaderInfo = React.createClass({
  displayName: "PageHeaderInfo",

  render: function render() {
    var pods = this.props.day.pods;
    var pod = pods && pods[this.props.podId];
    var pair = pod && pod.pairs[this.props.desk];
    var pairComponent;

    if (pair) {
      pairComponent = React.createElement(Pair, { pair: pair });
    }

    return React.createElement(
      "div",
      { id: "info" },
      React.createElement(
        "p",
        null,
        this.props.day.dateStamp,
        " — ",
        this.props.day.day,
        " ",
        pair && "—",
        " ",
        pairComponent
      )
    );
  }
});

var PageHeaderClock = React.createClass({
  displayName: "PageHeaderClock",

  getInitialState: function getInitialState() {
    return { time: "0:00" };
  },

  componentWillMount: function componentWillMount() {
    this.interval = null;
  },

  componentWillUnmount: function componentWillUnmount() {
    clearInterval(this.interval);
  },

  componentDidMount: function componentDidMount() {
    this.updateTime();
    this.interval = setInterval(this.updateTime, 10000);
  },

  updateTime: function updateTime() {
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;

    this.setState({ time: currentHours + ":" + currentMinutes });
  },

  render: function render() {
    return React.createElement(
      "h1",
      { id: "clock" },
      this.state.time
    );
  }
});

var PageHeader = React.createClass({
  displayName: "PageHeader",

  render: function render() {
    var desk = this.props.desk ? this.props.desk : "•";

    return React.createElement(
      "header",
      { className: "clock-wrap" },
      React.createElement(
        "h2",
        { id: "desk", onClick: this.props.onDeskClick },
        desk
      ),
      React.createElement(PageHeaderClock, null),
      React.createElement(PageHeaderInfo, {
        desk: this.props.desk,
        podId: this.props.podId,
        day: this.props.day })
    );
  }
});

var Page = React.createClass({
  displayName: "Page",

  render: function render() {
    return React.createElement(
      "div",
      { className: "wrap" },
      React.createElement(PageHeader, {
        desk: this.props.desk,
        podId: this.props.podId,
        day: this.props.day,
        onDeskClick: this.props.onDeskClick }),
      React.createElement(PageLinks, { ord: this.props.day.ord, links: this.props.links }),
      React.createElement(
        "h3",
        { className: "localhost" },
        React.createElement(
          "a",
          { href: "http://localhost:3000/" },
          "Localhost:3000"
        )
      )
    );
  }
});

var CornerLink = React.createClass({
  displayName: "CornerLink",

  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: this.props.url },
        this.props.title
      )
    );
  }
});

var Corners = React.createClass({
  displayName: "Corners",

  render: function render() {
    var links = [];

    this.props.corners.forEach(function (link, index) {
      var key = "corner-" + index;

      links.push(React.createElement(CornerLink, { key: key, url: link.url, title: link.title }));
    });

    return React.createElement(
      "nav",
      null,
      React.createElement(
        "ul",
        null,
        links
      )
    );
  }
});

var Header = React.createClass({
  displayName: "Header",

  render: function render() {
    var city = this.props.cityId == 1 ? "NYC" : "SF";
    var weatherLeft, weatherRight;

    if (this.props.weather.main) {
      var degreeCel = parseInt(this.props.weather.main.temp);
      var degreeFar = parseInt(degreeCel * 9 / 5 + 32);

      weatherLeft = React.createElement(
        "em",
        { className: "weather-left" },
        city,
        " / ",
        this.props.weather.weather[0].main,
        React.createElement(
          "span",
          { className: "weather-hidden" },
          " — ",
          this.props.weather.weather[0].description
        )
      );

      weatherRight = React.createElement(
        "em",
        { className: "weather-right" },
        React.createElement(
          "span",
          { className: "weather-hidden" },
          degreeFar,
          " ° F / "
        ),
        degreeCel,
        " ° C"
      );
    }

    return React.createElement(
      "header",
      { className: "header group" },
      weatherLeft,
      weatherRight,
      React.createElement(
        "h1",
        { className: "logo" },
        React.createElement(
          "a",
          { href: "http://www.appacademy.io/" },
          "App Academy"
        )
      )
    );
  }
});

var Pair = React.createClass({
  displayName: "Pair",

  render: function render() {
    var pair = [];

    this.props.pair.forEach((function (student, index) {
      var key = "link-" + student.github;
      var url = "https://github.com/" + student.github;

      pair.push(React.createElement(Link, { key: key, url: url, title: student.name }));

      if (this.props.pair.length - 1 > index) {
        pair.push(" & ");
      }
    }).bind(this));

    return React.createElement(
      "span",
      { className: "pair" },
      pair
    );
  }
});

var DesksPairListItem = React.createClass({
  displayName: "DesksPairListItem",

  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "strong",
        null,
        this.props.desk
      ),
      " — ",
      React.createElement(Pair, { pair: this.props.pair })
    );
  }
});

var DesksPairList = React.createClass({
  displayName: "DesksPairList",

  render: function render() {
    var pairs = [];
    var desks = Object.getOwnPropertyNames(this.props.pod.pairs);

    desks.forEach((function (desk, index) {
      var key = "pair-" + index;

      pairs.push(React.createElement(DesksPairListItem, {
        key: key,
        desk: desk,
        pair: this.props.pod.pairs[desk] }));
    }).bind(this));

    return React.createElement(
      "ul",
      null,
      pairs
    );
  }
});

var Desks = React.createClass({
  displayName: "Desks",

  render: function render() {
    var pods = this.props.day.pods;
    var pod = pods && pods[this.props.podId];
    var deskClass = this.props.visible ? "is-active" : "";
    var podName, podDeskPairList;

    if (pod) {
      podName = React.createElement(
        "h2",
        null,
        pod.name,
        " ",
        pod.instructor && "—",
        " ",
        pod.instructor
      );

      podDeskPairList = React.createElement(DesksPairList, { pod: pod });
    }

    return React.createElement(
      "article",
      { className: deskClass, id: "desks" },
      React.createElement(
        "span",
        { onClick: this.props.onDeskClick },
        "×"
      ),
      React.createElement(
        "h1",
        null,
        this.props.day.day,
        " Desks"
      ),
      podName,
      podDeskPairList
    );
  }
});

var Body = React.createClass({
  displayName: "Body",

  mixins: [CityMixin],
  getWeather: function getWeather() {
    var weatherId = this.getCityId() == 2 ? 5391959 : 5128581;
    var url = "http://api.openweathermap.org/data/2.5/weather?id=" + weatherId + "&units=metric";
    var weather = JSON.parse(localStorage["weather"] || "{}");

    if (!weather || weather.timeStamp != this.props.stamp.time) {
      $.getJSON(url, (function (data) {
        data.timeStamp = this.props.stamp.time;

        localStorage["weather"] = JSON.stringify(data);
        this.setState({ weather: data });
      }).bind(this));
    }

    return weather;
  },
  getDay: function getDay() {
    var url = "http://progress.appacademy.io/api/pairs.json?city_id=" + this.getCityId();
    var day = JSON.parse(localStorage["day"] || "{}");

    if (!day || day.dateStamp != this.props.stamp.date) {
      $.getJSON(url, (function (data) {
        data.dateStamp = this.props.stamp.date;
        localStorage["day"] = JSON.stringify(data);

        if (!this.state.podId || !data.pods[this.state.podId]) {
          var podId = Object.keys(data.pods)[0];
          localStorage["podId"] = podId;
          this.setState({ podId: podId });
        }

        this.setState({ day: data });
      }).bind(this));
    }

    return day;
  },
  componentDidMount: function componentDidMount() {
    this.getCityByIP();
  },
  getInitialState: function getInitialState() {
    return {
      cityId: localStorage["cityId"],
      podId: localStorage["podId"],
      desk: localStorage["desk"],
      weather: this.getWeather(),
      day: this.getDay(),
      deskVisible: false
    };
  },
  handleDeskClick: function handleDeskClick(event) {
    this.setState({
      deskVisible: !this.state.deskVisible
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, {
        cityId: this.state.cityId,
        weather: this.state.weather }),
      React.createElement(Corners, {
        corners: this.props.links.corners }),
      React.createElement(Desks, {
        podId: this.state.podId,
        day: this.state.day,
        visible: this.state.deskVisible,
        onDeskClick: this.handleDeskClick }),
      React.createElement(Page, {
        desk: this.state.desk,
        podId: this.state.podId,
        day: this.state.day,
        links: this.props.links.main,
        onDeskClick: this.handleDeskClick }),
      React.createElement(
        "footer",
        null,
        React.createElement(
          "a",
          { href: "options.html" },
          "Options"
        )
      )
    );
  }
});

$(function () {

  var Stamp = (function () {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var dateStamp;
    var d = new Date();
    var hours = d.getHours();

    dateStamp = days[d.getDay()].substring(0, 3) + ", ";
    dateStamp += months[d.getMonth()].substring(0, 3) + " ";
    dateStamp += d.getDate();

    return {
      date: dateStamp,
      time: dateStamp + ", " + hours
    };
  })();

  React.render(React.createElement(Body, {
    stamp: Stamp,
    links: Links }), document.body);
});