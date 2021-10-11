"use strict";

window.addEventListener("DOMContentLoaded", start);

let currentColor = "white";
let bodyParts;

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
      bodyParts = document.querySelectorAll(".subpart");
      console.log(document.querySelector("#monster-complete").getBoundingClientRect());
      // call init function
      init();
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
    activeMonsterpart[`${part + option}`] = false;

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
  const partNo = part + option;

  if (featureElement.classList.contains("hide")) {
    //hide the other part active
    hideTheOtherParts(part);

    //create the sprit for animation & append
    const sprit = createSprit(part, option, featureElement);
    document.querySelector("main").appendChild(sprit);

    //calculate and set the values for FLIP animation
    animationFLIP(this, featureElement, sprit);

    //add the class with the animation
    sprit.classList.add("animate-feature-in");

    //add the event listener to show the part in the monster svg
    sprit.addEventListener("animationend", () => {
      featureElement.classList.remove("hide");
      sprit.remove();
    });
  } else {
    //hide the part of the monster
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

function removeTheActiveParts(part) {
  for (let i = 1; i <= 3; i++) {
    document.querySelector(`#${part + i}`).classList.add("hide");
  }
}

function init() {
  bodyParts.forEach((part) => {
    part.addEventListener("click", setColor);
    // part.addEventListener("mouseover", () => {
    //   part.querySelectorAll(`path`).forEach((element) => {
    //     element.style.fill = currentColor;
    //   });
    // });
    // part.addEventListener("mouseout", () => {
    //   part.querySelectorAll(`path`).forEach((element) => {
    //     element.style.fill = "white";
    //   });
    // });
  });
  document.querySelectorAll(".color-btn").forEach((element) => {
    element.addEventListener("click", (event) => {
      console.log(event.target.style.backgroundColor);
      currentColor = event.target.style.backgroundColor;
      document.querySelector(":root").style.setProperty("--currentColor", currentColor);
    });
  });
}

function setColor(event) {
  console.log(event.target.parentElement);
  const parent = event.target.parentElement;

  this.style.fill = currentColor;
  // parent.querySelectorAll(`path`).forEach((element) => {
  //   element.style.fill = currentColor;
  // });
}
