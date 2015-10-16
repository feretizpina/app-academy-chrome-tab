"use strict";

var discourage = function discourage() {
  var $html = $("<a href=\"https://developer.mozilla.org/en-US/docs/Web\">Dear student, App Academy strongly discourages using W3Schools. Instead use the links provided in your new tab page or do a search on MDN.</a>");

  $html.css({
    "display": "block",
    "position": "fixed",
    "top": "10px",
    "left": "10px",
    "margin": "0",
    "font-size": "sans-serif",
    "font-weight": "bold",
    "font-size": "20px",
    "text-decoration": "none",
    "padding": "40px",
    "background": "#f00",
    "color": "#fff",
    "z-index": "9999",
    "width": "400px",
    "cursor": "pointer"
  });

  $("body").prepend($html);
};

$(document).ready(function () {
  discourage();
});