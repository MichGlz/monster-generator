"use strict";

window.addEventListener("DOMContentLoaded", start);

function start() {
  //fetch monster
  fetch("assets/completeMonster.svg")
    .then(function (res) {
      return res.text();
    })
    .then(function (data) {
      document.querySelector("#monster-container").innerHTML = data;
    });
}
