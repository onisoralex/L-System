// import * as pen from "./pen.module";
import "./style";

// Global variables
const canvasObj = document.getElementById("myCanvas");
canvasObj.width = 300;
canvasObj.height = 300;
const ctx = canvasObj.getContext("2d");

// first make int, for odd screen sizes; then add half of linewidth to positions to go on the pixel (canvas 0;0 seems to be between pixels)

let pen = {
  dir: 0,
  angle: 0,
  lineLength: 0,
  x: 0,
  y: 0,
  init: function () { // Initialises the starting values for the pen
    this.dir = 90; // Set drawing direction to upwards
    this.angle = Number(eval(getValue("angle")));
    this.lineLength = Number(getValue("lineLength")); // Line Length
    this.x = Math.floor(canvasObj.width / 2); // Reset X position
    this.y = Math.floor(canvasObj.height / 2); // Reset X position
  },
  turnLeft: function () { // Turn left a degrees
    this.dir = (this.dir + this.angle) % 360; // + means turning counter clockwise starting with 0° at 3 o'clock
  },
  turnRight: function () { // Turn right b degrees
    this.dir = (this.dir + (360 - this.angle)) % 360; // Turning counterclockwise to remain in positive number by the complementary angle
  },
  getNextPos: function () {
    this.x = this.x + calculateNextPositionX(this);
    this.y = this.y - calculateNextPositionY(this); // Minus, because screen positions are positive downwards
    /* console.log("x:", this.x, "& y:", this.y, "& dir:", this.dir); */
  },
  line: function () { // Draw forward
    ctx.lineTo(this.x + hp(), this.y + hp());
  },
  move: function () { // Move forward (without drawing)
    ctx.moveTo(this.x + hp(), this.y + hp());
  }
};

function start() {
  pen.init();
  console.clear();
  let axiom = getValue("axiom");
  const rulesField = getValue("rules");
  const it = Number(getValue("iterations")); // How many iterations will be transformed
  let rules = extraxtRules(rulesField);
  ctx.lineWidth = getValue("lineThickness");
  const resultField = document.getElementById("result");
  let result = axiom;

  for (let i = 0; i < it; i++) {
    result = transform(result, rules);
  }
  resultField.innerText = `${result}`;

  // draw();
}

// function draw() {
//   ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
//   ctx.beginPath();

//   pen.move();

//   pen.getNextPos();
//   pen.line();

//   pen.turnLeft();
//   pen.getNextPos();
//   pen.line();

//   pen.getNextPos();
//   pen.line();

//   pen.turnLeft();
//   pen.getNextPos();
//   pen.line();

//   pen.turnRight();
//   pen.getNextPos();
//   pen.line();

//   ctx.stroke();
// }

// Additional Functions for formation, calculation and drawing
// ==============================================================

// Gets the HTML element by it's element ID
function getValue(id) {
  return document.getElementById(id).value.replace(/ /g, "");
}

// Creates an object with all rules specified by the user
function extraxtRules(rulesField) {
  let rule = rulesField.split(",");
  let rules = [];
  for (let i = 0; i < rule.length; i++) {
    let ruleObject = {
      input: rule[i].split("->")[0],
      output: rule[i].split("->")[1]
    };
    rules.push(ruleObject);
  }
  return rules;
}

// Recursive function to transform the Axiom character by character
function transform(axiom, rules) {
  if (axiom.length >= 2) {
    return exchange(axiom.slice(0, 1), rules) + transform(axiom.substring(1, axiom.length), rules);
  } else if (axiom.length === 1) {
    return exchange(axiom.slice(0, 1), rules);
  } else {
    return "";
  }
}

// If specific characters occur, they remain, else they get exchanged based on the rules
function exchange(char, rules) {
  switch (char) {
    case "+": // Turn Left
    case "-": // Turn Right
    /* case "|": // Turn Back (180°) */
    case "[": // Push Drawing State to Stack
    case "]": // Pop Drawing State from Stack
    /* case "#": // Increment line width */
    /* case "!": // Decrement line width */
    /* case "@": // Draw a dot with line width radius */
    /* case "{": // Open a polygon */
    /* case "}": // Close a polygon and fill it with line color */
    /* case ">": // Multiply Line Length by Line Length Scale Factor */
    /* case "<": // Divide Line Length by Line Length Scale Factor */
    case "&": // Swap Meaning of + and -
      /* case "(": // Decrement turning angle by turning angle increment */
      /* case ")": // Increment turning angle by turning angle increment */
      return char;
    default:
      return getTransformationByRule(char, rules);
  }
}

// Exchange characters based on the rules
function getTransformationByRule(char, rules) {
  for (let i = 0; i < rules.length; i++) {
    if (char == rules[i].input) {
      return rules[i].output;
    }
  }
  return char;
  // return "*";
}

// DEG to RAD
function degToRad(deg) {
  return deg / 180 * Math.PI;
}

// Calculate next X Point
function calculateNextPositionX(pen) {
  return Math.round(pen.lineLength * Math.cos(degToRad(pen.dir)));
}

// Calculate next Y Point
function calculateNextPositionY(pen) {
  return Math.round(pen.lineLength * Math.sin(degToRad(pen.dir)));
}

// Function to correct the position of the pixels if the linestrength is odd
function hp() {
  return (ctx.lineWidth / 2) % 1;
}

start();
