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
    const spritBtn = document.createElement("div");
    spritBtn.classList.add("sprit-btn");

    const part = button.dataset.part;
    const option = button.dataset.option;
    console.log(part);
    fetch(`assets/btn-${part + option}.svg`)
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        spritBtn.innerHTML = data;
      });

    button.appendChild(spritBtn);
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

    const sprit = createSprit(part, option, featureElement);
    document.querySelector("main").appendChild(sprit);

    animationFLIP(this, featureElement, sprit);
    sprit.classList.add("animate-feature-in");
    sprit.addEventListener("animationend", () => {
      featureElement.classList.remove("hide");
      sprit.classList.remove("animate-feature-in");
    });
  } else {
    document.querySelector(`#${part + option}`).classList.add("hide");
    const sprit = createSprit(part, option, featureElement);
    document.querySelector("main").appendChild(sprit);
    animationFLIP(this, featureElement, sprit);
    sprit.classList.add("animate-feature-out");
    sprit.addEventListener("animationend", () => {
      sprit.remove();
    });
  }
}

function animationFLIP(target, featureElement, sprit) {
  const firstFrame = target.querySelector("svg").getBoundingClientRect();
  const lastFrame = featureElement.getBoundingClientRect();
  const windowY = window.scrollY;
  const deltaX = firstFrame.left - lastFrame.left;
  const deltaY = firstFrame.top - lastFrame.top + windowY;
  const deltaWidth = firstFrame.width / lastFrame.width;
  const deltaHeight = firstFrame.height / lastFrame.height;
  sprit.style.setProperty("--windowScroll", `${windowY}px`);
  sprit.style.setProperty("--deltaX", `${deltaX}px`);
  sprit.style.setProperty("--deltaY", `${deltaY}px`);
  sprit.style.setProperty("--deltaWidth", deltaWidth);
  sprit.style.setProperty("--deltaHeight", deltaHeight);
}

function createSprit(part, option, featureElement) {
  const boxSize = featureElement.getBoundingClientRect();
  const boxLeft = boxSize.left;
  const boxTop = boxSize.top;
  const boxWidth = boxSize.width;
  const boxHeight = boxSize.height;
  const sprit = document.createElement("div");
  sprit.classList.add("sprit");
  sprit.style.width = `${boxWidth}px`;
  sprit.style.height = `${boxHeight}px`;
  sprit.style.top = `${boxTop}px`;
  sprit.style.left = `${boxLeft}px`;

  fetch(`assets/btn-${part + option}.svg`)
    .then(function (res) {
      return res.text();
    })
    .then(function (data) {
      sprit.innerHTML = data;
    });

  // sprit.style.backgroundImage = `url(assets/${part + option}.svg)`;
  return sprit;
}
