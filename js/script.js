"use strict";

window.addEventListener("DOMContentLoaded", start);

let currentColor = "white";
let bodyParts;

function start() {
  //fetch monster
  fetchMonster();
  //fetch btn SVG
  fetchBtnSVG();

  // call init function
  init();
}

function fetchMonster() {
  console.log("fetch monster");
  //fetch monster
  fetch("assets/completeMonster.svg")
    .then(function (res) {
      return res.text();
    })
    .then(function (data) {
      document.querySelector("#monster-container").innerHTML = data;
      bodyParts = document.querySelector(".monster-part");
    });
}

function fetchBtnSVG() {
  console.log("fetch SVG buttons");
  const optionButtons = document.querySelectorAll(".btn-option");
  optionButtons.forEach((button) => {
    button.addEventListener("click", selectPart);

    const part = button.dataset.part;
    const option = button.dataset.option;
    console.log(part);
    fetch(`assets/${part + option}.svg`)
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        button.innerHTML = data;
      });
  });
}

function selectPart(e) {
  const part = this.dataset.part;
  const option = this.dataset.option;
  console.log(part, option);

  if (document.querySelector(`#${part + option}`).classList.contains("hide")) {
    for (let i = 1; i <= 3; i++) {
      document.querySelector(`#${part + i}`).classList.add("hide");
    }
    document.querySelector(`#${part + option}`).classList.remove("hide");
  } else {
    document.querySelector(`#${part + option}`).classList.add("hide");
  }
}

function init() {
  bodyParts.addEventListener("click", setColor);
  document.querySelectorAll(".color-btn").forEach((element) => {
    element.addEventListener("click", (event) => {
      console.log(event.target.style.backgroundColor);
      currentColor = event.target.style.backgroundColor;
    });
  });
}

function setColor(event) {
  console.log(event.target.parentElement);
  event.target.style.fill = currentColor;
  const parent = event.target.parentElement;

  document.querySelectorAll(`#${this.id} .cls-1`).forEach((element) => {
    element.style.fill = currentColor;
  });
}
