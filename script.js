let table;
let years = [];
let displacements = [];
let visibleYears = 1;
let targetVisibleYears = 1;
let GT, Thin, ThinItalic;
let figure;
let currentScaleFactor = 1;

let gridCols = 9;
let cellWidth, cellHeight;
let rowSpacing = 7;

function preload() {
  table = loadTable('/data.csv', 'csv', 'header');
  GT = loadFont('https://cdn.glitch.global/2ad394e5-87e3-4a67-9932-95e015e681af/GT.otf?v=1733002762842');
  Thin = loadFont('https://cdn.glitch.global/2ad394e5-87e3-4a67-9932-95e015e681af/Thin.otf?v=1733002778879');
  ThinItalic = loadFont('https://cdn.glitch.global/2ad394e5-87e3-4a67-9932-95e015e681af/ThinItalic.otf?v=1733002781468');
  Light = loadFont('https://cdn.glitch.global/2ad394e5-87e3-4a67-9932-95e015e681af/Light.otf?v=1733002775285');

  figure = createGraphics(50, 125);
  figure.noStroke();
  figure.rectMode(CENTER);
  figure.fill(255);

  figure.circle(25, 22, 15);
  figure.rect(25, 55, 18, 40);
  figure.rect(25, 45, 35, 20, 10, 10, 0, 0);
  figure.rect(10, 65, 8, 25, 0, 0, 5, 5);
  figure.rect(40, 65, 8, 25, 0, 0, 5, 5);
  figure.rect(18, 100, 8, 55, 0, 0, 5, 5);
  figure.rect(32, 100, 8, 55, 0, 0, 5, 5);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < table.getRowCount(); i++) {
    let year = table.getString(i, 'Year');
    let displacement = table.getNum(i, 'Internal Displacements by Conflict and Violence');

    years.push(year);
    displacements.push(displacement * 15);
  }
}

function draw() {
  background(0);
  drawTitleAndSubtext();
  visibleYears = lerp(visibleYears, targetVisibleYears, 0.1);

  if (abs(visibleYears - targetVisibleYears) < 0.03) {
    visibleYears = targetVisibleYears;
  }

  let targetScaleFactor = visibleYears >= years.indexOf("2022") + 1 ? width/height/3 : 1;
  currentScaleFactor = lerp(currentScaleFactor, targetScaleFactor, 0.1);
  drawTimeline();
  drawScale();
}

function drawScale() {
  let scaleText = " ";
  let scaleX = 40;
  let scaleY = height - 30;

  fill(255);
  textSize(14);
  textFont('Arial');
  textAlign(LEFT, BOTTOM);
  text(scaleText, 30, height - 20);

  push();
  translate(scaleX + textWidth(scaleText) + 10, scaleY - 20);
  scale(0.3);
  image(figure, -10, -30);
  pop();

  text("= 66,667 displacements", 40 + textWidth(scaleText) + 30, scaleY);
}

function drawTitleAndSubtext() {
  let titleText = "Internal displacements by conflict and violence around the world";
  let titleX = 30;
  let titleY = 30;
  let titleSize = width / 32;

  textSize(titleSize);
  let titleWidth = textWidth(titleText);
  let isHoveringTitle = mouseX > titleX && mouseX < titleX + titleWidth && mouseY > titleY && mouseY < titleY + titleSize;

  fill(255);
  textFont(GT);
  textSize(titleSize);
  textAlign(LEFT, TOP);
  text(titleText, 30, 30);

  let underlineWidth = textWidth("Internal displacements");
  stroke(255);
  strokeWeight(2);
  line(titleX, titleY + titleSize + 5, titleX + underlineWidth, titleY + titleSize + 5);

  if (isHoveringTitle) {
    let subtextX = 30;
    let subtextY = height / 9;
    let subtextWidth = (2 * width) / 7;
    let subtextHeight = width / 12;

    noStroke();
    fill(50, 50, 50, 200);
    rect(subtextX, subtextY, subtextWidth, subtextHeight, 10);

    fill(230);
    textSize(width / 80);
    textFont('Arial');
    textAlign(LEFT, TOP);
    text("The internal displacements figure refers to the number of forced movements of people within the borders of their country recorded during the year.", subtextX + 10, subtextY + 10, subtextWidth - 20, subtextHeight - 20);
  }
}

function drawTimeline() {
  let barWidth = min(width / visibleYears, 250);
  let timelineWidth = visibleYears * barWidth + 50;
  let leftShift = -40;
  let startX = ((width - timelineWidth) / 2) - leftShift;
  let timelineY = height - 100;

  stroke(210);
  strokeWeight(5);
  line(startX + 40, timelineY, startX + timelineWidth - 30, timelineY);

  for (let i = 0; i < Math.floor(visibleYears); i++) {
    let xPos = startX + i * barWidth * 0.9;

    fill(255);
    noStroke();
    textSize(barWidth / 6);
    textFont(GT);
    textAlign(CENTER, TOP);
    text(years[i], xPos + 4 * barWidth / 5, timelineY + 15);

    let totalFigures = displacements[i];
    gridRows = ceil(totalFigures / gridCols);
    cellWidth = (3 * barWidth / 5) / gridCols;
    cellHeight = cellWidth * (height/690) * currentScaleFactor;

    rowSpacing= height/150
    
    let barHeight = gridRows * (cellHeight + rowSpacing);
    let isHoveringBar = mouseX > xPos && mouseX < xPos + barWidth && mouseY > timelineY - barHeight && mouseY < timelineY;

    if (isHoveringBar) {
      fill(230);
      textSize(width/50);
      textFont(Thin);
      textAlign(CENTER, BOTTOM);
      let displacementValue = table.getNum(i, 'Internal Displacements by Conflict and Violence');
      text(`${displacementValue} million`, xPos + 3 * barWidth / 4, timelineY - barHeight - 50);
    }

    for (let j = 0; j < totalFigures; j++) {
      let currentRow = floor(j / gridCols);
      let col = j % gridCols;

      let iconX = xPos + col * cellWidth + barWidth / 2;
      let iconY = timelineY - 50 - currentRow * (cellHeight + rowSpacing);

      push();
      translate(iconX, iconY);
      scale(min(cellWidth / 50, cellHeight / 125));
      image(figure, -25, -62.5);
      pop();
    }

    if (years[i] === "2022") {
      let barHeight = gridRows * (cellHeight + rowSpacing);
      if (mouseX > xPos && mouseX < xPos + barWidth && mouseY > timelineY - barHeight && mouseY < timelineY) {
        show2022Tooltip(mouseX, mouseY);
      }
    }
  }

  if (visibleYears < years.length) {
    fill(200);
    noStroke();
    let arrowX = startX + timelineWidth - 30;
    triangle(arrowX - 15, timelineY - 10, arrowX + 5, timelineY, arrowX - 15, timelineY + 10);
  }
}

function show2022Tooltip(x, y) {
  let tooltipWidth = 300;
  let tooltipHeight = 100;
  let textMargin = 10;

  let tooltipLines = [
    "60% of global conflict displacements were recorded",
    "in Ukraine as people repeatedly fled from rapidly",
    "shifting frontlines. 6 out of 10 displacements",
    "were triggered by international armed conflicts."
  ];

  fill(50, 50, 50, 220);
  rect(x - tooltipWidth - 10, y - tooltipHeight - 10, tooltipWidth, tooltipHeight, 5);

  fill(230);
  textSize(12);
  textFont(Light);
  textAlign(LEFT, TOP);
  for (let i = 0; i < tooltipLines.length; i++) {
    text(tooltipLines[i], x - tooltipWidth + textMargin, y - tooltipHeight + textMargin + i * 15);
  }
}

function mousePressed() {
  if (mouseX < width / 4) {
    targetVisibleYears = max(1, targetVisibleYears - 1);
  } else {
    if (targetVisibleYears < years.length) {
      targetVisibleYears++;
    }
  }
}

function windowResized(){
   resizeCanvas(windowWidth, windowHeight); 
    let targetScaleFactor = visibleYears >= years.indexOf("2022") + 1 ? width/height/3 : 1;
  redraw(); 
}