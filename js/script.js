"use strict";

window.addEventListener("DOMContentLoaded", start);

let currentColor = "white";
let bodyParts;
let monster = {};
let monsterColors = {};

function start() {
  //fetch monster
  fetchMonster();
  //fetch btn SVG
  fetchBtnSVG();
  //set hover and first current color
  setFirstHoverColor();
  //event listeners
  document.querySelector(".btn.btn-1").addEventListener("click", randomMonster);
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
      // call init function
      init();
    });
}

function fetchBtnSVG() {
  console.log("fetch SVG buttons");
  const optionButtons = document.querySelectorAll(".btn-option");
  optionButtons.forEach((button, i, arr) => {
    button.addEventListener("click", selectPart);
    const spritBtn = document.createElement("div");
    spritBtn.classList.add("sprit-btn");

    const part = button.dataset.part;
    const option = button.dataset.option;

    fetch(`assets/btn-${part + option}.svg`)
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        spritBtn.innerHTML = data;
      });

    button.appendChild(spritBtn);
    if (i + 1 === arr.length) {
      setTimeout(randomMonster, 500);
    }
  });
}

function selectPart(e) {
  const part = this.dataset.part;
  const option = this.dataset.option;
  displayPart(part, option);
}

function displayPart(part, option) {
  const featureElement = document.querySelector(`#${part + option}`);
  const btnOption = document.querySelector(`.btn-option[data-part="${part}"][data-option="${option}"]`);
  const partNo = part + option;

  if (featureElement.classList.contains("hide")) {
    //hide the other part active
    removeTheActiveParts(part);
    pushPartToObject(part, option);
    btnOption.classList.add("active");
    //create the sprit for animation & append
    const sprit = createSprit(part, option, featureElement);
    document.querySelector("main").appendChild(sprit);

    //calculate and set the values for FLIP animation
    animationFLIP(btnOption, featureElement, sprit);

    //add the class with the animation
    sprit.classList.add("animate-feature-in");

    //add the event listener to show the part in the monster svg
    sprit.addEventListener("animationend", () => {
      featureElement.classList.remove("hide");
      featureElement.classList.add("active");

      sprit.remove();
    });
  } else {
    //hide the part of the monster
    featureElement.classList.add("hide");
    featureElement.classList.remove("active");

    //create the sprit for animation & append
    const sprit = createSprit(part, option, featureElement);
    document.querySelector("main").appendChild(sprit);

    //calculate and set the values for FLIP animation
    animationFLIP(btnOption, featureElement, sprit);
    sprit.classList.add("animate-feature-out");

    //add the event listener to remove the sprit
    sprit.addEventListener("animationend", () => {
      btnOption.classList.remove("active");
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
  const activePart = document.querySelector(`g[id^="${part}"].active`);
  if (activePart) {
    activePart.classList.add("hide");
    activePart.classList.remove("active");

    document.querySelector(`#${part}-btns .btn-option.active`).classList.remove("active");
  }
}

function init() {
  bodyParts.forEach((part) => {
    part.addEventListener("click", setColor);
  });
  document.querySelectorAll(".color-btn").forEach((element) => {
    element.addEventListener("click", (event) => {
      currentColor = event.target.style.backgroundColor;
      document.querySelector(":root").style.setProperty("--currentColor", currentColor);
    });
  });
}

function setColor(event) {
  console.log(this.parentElement);
  const parent = this.parentElement.id;
  this.style.fill = currentColor;
  const subPart = this.classList[0];
  pushColorToObject(parent, subPart);
}

function randomMonster() {
  const monsterParts = document.querySelectorAll(".monster-part").forEach((part) => {
    part.classList.add("hide");
  });
  const parts = ["body", "ears", "eyes", "mouth", "arms", "feet"];
  parts.forEach((part, i) => {
    displayPart(part, Math.floor(Math.random() * 3 + 1));
  });
}

function setFirstHoverColor() {
  const childNo = Math.floor(Math.random() * 8) + 2;
  const btnColor = document.querySelector(`#colors-container .color-${childNo}`);
  currentColor = btnColor.dataset.bgcolor;
  document.querySelector(":root").style.setProperty("--currentColor", currentColor);
}

function pushPartToObject(part, option) {
  monster[part] = part + option;
  monsterColors[part] = {};
}

function pushColorToObject(parent, subPart) {
  // monsterColors[];
  console.log(parent, subPart, currentColor);
}
