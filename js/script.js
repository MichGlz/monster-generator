"use strict";

window.addEventListener("DOMContentLoaded", start);

let currentColor = "white";
const defaultColor = "white";
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
  document.querySelector(".btn.btn-2").addEventListener("click", resetColors);
  document.querySelector(".btn.btn-3").addEventListener("click", shareMonster);
  document.querySelector(".btn.btn-4").addEventListener("click", saveMonster);
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
      setTimeout(setMonster, 300);
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
    featureElement.querySelectorAll(".subpart").forEach((part) => {
      part.style.fill = defaultColor;
    });

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
    document.querySelector(`#${part}-btns .btn-option.active`).classList.remove("active");
    activePart.classList.add("hide");
    activePart.querySelectorAll(".subpart").forEach((part) => {
      part.style.fill = defaultColor;
    });
    activePart.classList.remove("active");
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
  this.style.fill = currentColor;
}

function setMonster() {
  const urlParams = new URLSearchParams(window.location.search);
  const theShareMonster = JSON.parse(urlParams.get("mymonster"));
  if (theShareMonster) {
    monster = theShareMonster;
    monsterColors = JSON.parse(urlParams.get("mycolors"));
    getMyMonster();
  } else if (localStorage.getItem("myMonsterParts")) {
    const myMonsterParts = JSON.parse(localStorage.getItem("myMonsterParts"));
    monster = myMonsterParts;
    const myMonsterColors = JSON.parse(localStorage.getItem("myMonsterColors"));
    monsterColors = myMonsterColors;
    getMyMonster();
  } else {
    randomMonster();
  }
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

function resetColors() {
  document.querySelectorAll(".monster-part.active .subpart").forEach((part, i) => {
    setTimeout(() => {
      part.style.fill = defaultColor;
    }, i * 100);
  });
  document.querySelectorAll(".monster-part.active").forEach((part, i) => {
    setTimeout(() => {
      const partXid = part.id;
      const x = partXid.length - 1;
      const partX = partXid.slice(0, x);
      const option = partXid.slice(-1);
      const btnOption = document.querySelector(`.btn-option[data-part="${partX}"][data-option="${option}"]`);
      btnOption.classList.remove("active");
      part.classList.add("hide");
      part.classList.remove("active");
    }, i * 200);
  });
}
////////////save monster & colors////////////////
function saveMonster() {
  monster = {};
  monsterColors = {};
  createPartsObject();
  createColorsObject();
  localStorage.setItem("myMonsterParts", JSON.stringify(monster));
  localStorage.setItem("myMonsterColors", JSON.stringify(monsterColors));
  alert("Your monster is save");
}

function shareMonster() {
  monster = {};
  monsterColors = {};
  createPartsObject();
  createColorsObject();
  const myLink = `https://michglz.github.io/monster-generator/index.html?mymonster=${JSON.stringify(monster)}&mycolors=${JSON.stringify(monsterColors)}`;
  document.querySelector("#my-link").value = myLink;
  document.querySelector("#copy-link").addEventListener("click", copyMyLink);
  document.querySelector("#close-alert").addEventListener("click", () => {
    document.querySelector("#modal").classList.remove("active");
  });
  document.querySelector("#modal").classList.add("active");
}

function copyMyLink() {
  /* Get the text field */
  const copyLink = document.querySelector("#my-link");

  /* Select the text field */
  copyLink.select();

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyLink.value);

  /* Alert the copied text */
  alert("Copied the link");
}

function createPartsObject() {
  const activeParts = document.querySelectorAll(".monster-part.active");
  activeParts.forEach((activepart) => {
    const partID = activepart.id;
    const x = partID.length - 1;
    const part = partID.slice(0, x);
    const option = partID.slice(-1);
    monster[part] = { id: partID, part: part, option: option };
    monsterColors[partID] = {};
  });
}

function createColorsObject() {
  const activeSubParts = document.querySelectorAll(".monster-part.active .subpart");
  activeSubParts.forEach((element) => {
    const partID = element.parentElement.id;
    const subPart = element.classList[0];
    let color = "white";
    if (element.style.fill) {
      color = element.style.fill;
    }
    monsterColors[partID][subPart] = color;
  });
}

function getMyMonster() {
  const monsterParts = Object.keys(monster);
  monsterParts.forEach((key) => {
    displayPart(monster[key].part, monster[key].option);
    getMyColors(monster[key].id);
  });
}

function getMyColors(IDpart) {
  const subparts = document.querySelectorAll(`#${IDpart} .subpart`);
  subparts.forEach((subpart) => {
    subpart.style.fill = monsterColors[IDpart][subpart.classList[0]];
  });
}
