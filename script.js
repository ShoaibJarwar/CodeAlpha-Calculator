const display = document.getElementById("display");
let justEvaluated = false;

function append(value) {
  const invalidStates = ["Error", "Infinity", "NaN"];
  const lastChar = display.value.slice(-1);

  if (invalidStates.includes(display.value)) {
    display.value = "";
  }

  if (justEvaluated) {
    if (!isNaN(value)) {
      display.value = value;
    } else if (['+', '-', '*', '/', '^'].includes(value)) {
      justEvaluated = false;
    } else {
      display.value = "";
    }
    justEvaluated = false;
  }

  if (value === '.' && lastChar === '.') return;
  display.value += value;
}

function clearDisplay() {
  display.value = "";
  justEvaluated = false;
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Use inline conversion to degrees instead of relying on a separate function
function calculate() {
  try {
    let expression = display.value;

    // Balance parentheses
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    expression += ')'.repeat(openParens - closeParens);

    // Convert readable math input into valid JavaScript
    expression = expression
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log(")
      .replace(/(\d+|\))\s*\^/g, "$1**") // convert ^ to **
      .replace(/sin\(/g, "Math.sin((Math.PI/180)*") // sin(deg)
      .replace(/cos\(/g, "Math.cos((Math.PI/180)*") // cos(deg)
      .replace(/tan\(/g, "Math.tan((Math.PI/180)*"); // tan(deg)

    const result = Function('"use strict"; return (' + expression + ')')();
    display.value = Number.isFinite(result) ? result : "Error";
    justEvaluated = true;
  } catch (e) {
    display.value = "Error";
    justEvaluated = true;
  }
}

// Toggle Scientific Buttons
document.getElementById("toggle-scientific").addEventListener("click", () => {
  const sci = document.getElementById("scientific-buttons");
  const toggleBtn = document.getElementById("toggle-scientific");
  const icon = toggleBtn.querySelector("i");

  const isVisible = sci.style.display === "grid";
  sci.style.display = isVisible ? "none" : "grid";

  // Toggle icon between flask and calculator
  icon.classList.toggle("fa-flask", !isVisible);      // scientific
  icon.classList.toggle("fa-calculator", isVisible);  // basic
});

// Toggle Dark Theme
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Keyboard Support
document.addEventListener("keydown", (e) => {
  if (e.key.match(/[0-9\+\-\*\/\.\(\)]/)) {
    append(e.key);
  } else if (e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key === "Delete") {
    clearDisplay();
  }
});
