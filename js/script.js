"use strict";

window.addEventListener("DOMContentLoaded", start);

function start() {
  //fetch monster
  fetchMonster();
  //fetch btn SVG
  fetchBtnSVG();
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
      console.log(document.querySelector("#monster-complete").getBoundingClientRect());
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

  const featureElement = document.querySelector(`#${part + option}`);
  if (featureElement.classList.contains("hide")) {
    for (let i = 1; i <= 3; i++) {
      document.querySelector(`#${part + i}`).classList.add("hide");
    }
    featureElement.classList.remove("hide");
    animationFLIP(this, featureElement);
    featureElement.classList.add("animate-feature-in");
    featureElement.addEventListener("animationend", () => {
      featureElement.classList.remove("animate-feature-in");
    });
  } else {
    document.querySelector(`#${part + option}`).classList.add("hide");
  }
}

function animationFLIP(target, featureElement) {
  const firstFrame = target.querySelector("svg").getBoundingClientRect();
  const lastFrame = featureElement.getBoundingClientRect();
  const monsterComplete = document.querySelector("#monster-complete").getBoundingClientRect();
  const scaleFactor = 716 / monsterComplete.height;

  const deltaX = (firstFrame.left - lastFrame.left) * scaleFactor;
  const deltaY = (firstFrame.top - lastFrame.top) * scaleFactor;
  const deltaWidth = (firstFrame.width / lastFrame.width) * scaleFactor;
  const deltaHeight = (firstFrame.height / lastFrame.height) * scaleFactor;

  const root = document.querySelector(":root");
  featureElement.style.setProperty("--deltaX", `${deltaX}px`);
  featureElement.style.setProperty("--deltaY", `${deltaY}px`);
  featureElement.style.setProperty("--deltaWidth", deltaWidth);
  featureElement.style.setProperty("--deltaHeight", deltaHeight);
}
