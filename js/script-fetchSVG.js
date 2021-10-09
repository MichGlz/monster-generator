"use strict";

const parts = document.querySelectorAll("#monster .part");
parts.forEach((part) => {
  const partName = part.classList[1];
  console.log("part ", partName);
  for (let i = 1; i <= 3; i++) {
    const div = document.createElement("div");
    div.setAttribute("id", `${partName + i}`);
    part.appendChild(div);
    fetch(`assets/${partName + i}.svg`)
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        div.innerHTML = data;
      });
  }
});
