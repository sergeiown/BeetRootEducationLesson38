"use strict";

const textDisplay = document.getElementById("text-display");
const textEditor = document.getElementById("text-editor");

window.addEventListener("keydown", actionOnEvent);

let isEditing = false;

function actionOnEvent(event) {
  // console.log(event);
  if (event.ctrlKey && event.key === "e") {
    event.preventDefault(); // Disable default behavior for Ctrl+E
    if (!isEditing) {
      textEditor.value = textDisplay.innerText;
      textDisplay.style.display = "none";
      textEditor.style.display = "block";
      isEditing = true;
    }
  } else if (event.ctrlKey && event.key === "s") {
    event.preventDefault(); // Disable default behavior for Ctrl+S
    if (isEditing) {
      textDisplay.innerText = textEditor.value;
      textEditor.style.display = "none";
      textDisplay.style.display = "block";
      isEditing = false;
    }
  }
}
