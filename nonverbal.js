
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var images = {};
var totalResources = 7;
var numResourcesLoaded = 0;
var fps = 30;
var charX = 245;
var charY = 185;
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 2;
var breathInterval = setInterval(updateBreath, 1000 / fps);
var maxEyeHeight = 4;
var curEyeHeight = maxEyeHeight;
var normalEyeColor = "white";
var curEyeColor = "white";
var listeningEyeColor = "red";
var eyeOpenTime = 0;
var timeBtwBlinks = 4000;
var blinkUpdateTime = 200;                    
var blinkTimer = setInterval(updateBlink, blinkUpdateTime);
var fpsInterval = setInterval(updateFPS, 1000);
var numFramesDrawn = 0;
var curFPS = 0;
var jumping = false;

function updateFPS() {
	
	curFPS = numFramesDrawn;
	numFramesDrawn = 0;
}
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	canvas.width = canvas.width; // clears the canvas 
	context.fillText("loading...", 40, 140);
	
	loadImage("pandaear");
	loadImage("pandahead");
	loadImage("pandaleftarm");
	loadImage("pandarightarm");
	loadImage("pandaleftleg");		
	loadImage("pandarightleg");
  loadImage("pandaleftarm_jump");
  loadImage("pandarightarm_jump");
  loadImage("pandaleftleg_jump");
  loadImage("pandarightleg_jump");
  loadImage("pandabody");
	/*loadImage("legs-jump");
	loadImage("rightArm-jump");*/
}

function loadImage(name) {

  images[name] = new Image();
  images[name].onload = function() { 
	  resourceLoaded();
  }
  images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {

  numResourcesLoaded += 1;
  if(numResourcesLoaded === totalResources) {
  
	setInterval(redraw, 1000 / fps);
  }
}

function redraw() {

  var x = charX;
  var y = charY;
  var jumpHeight = 45;
  
  canvas.width = canvas.width; // clears the canvas 

  // Draw shadow
  if (jumping) {
	  drawEllipse(x + 15, y + 16, 100 - breathAmt, 4);
  } else {
	  drawEllipse(x + 15, y + 16, 160 - breathAmt, 6);
  }
  
  if (jumping) {
	  y -= jumpHeight;
  }

  if (jumping) {
    context.drawImage(images["pandaleftleg_jump"], x - 40, y - 28 - breathAmt);
    context.drawImage(images["pandarightleg_jump"], x + 35, y - 28 - breathAmt);
    context.drawImage(images["pandaleftarm_jump"], x - 42, y - 80 - breathAmt);
    context.drawImage(images["pandarightarm_jump"], x + 28, y - 80 - breathAmt);
  } else {
    context.drawImage(images["pandaleftleg"], x - 30, y - 21 - breathAmt);
    context.drawImage(images["pandarightleg"], x + 25, y - 21 - breathAmt);
    context.drawImage(images["pandaleftarm"], x - 42, y - 80 - breathAmt);
    context.drawImage(images["pandarightarm"], x + 28, y - 80 - breathAmt);

  }

  context.drawImage(images["pandabody"], x - 26, y - 80);
  context.drawImage(images["pandahead"], x - 15, y - 125 - breathAmt);
  context.drawImage(images["pandaear"], x - 17, y - 130 - breathAmt);
	
  drawEllipse(x + 26, y - 100 - breathAmt, 8, curEyeHeight, curEyeColor); // Left Eye
  drawEllipse(x + 3, y - 100 - breathAmt, 8, curEyeHeight, curEyeColor); // Right Eye
}

function drawEllipse(centerX, centerY, width, height, color) {

  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2);
  
  context.bezierCurveTo(
	centerX + width/2, centerY - height/2,
	centerX + width/2, centerY + height/2,
	centerX, centerY + height/2);

  context.bezierCurveTo(
	centerX - width/2, centerY + height/2,
	centerX - width/2, centerY - height/2,
	centerX, centerY - height/2);
 
  context.fillStyle = color;
  context.fill();
  context.closePath();	
}

function setEyeColor(color) {
    curEyeColor = color
}

function updateBreath() { 
				
  if (breathDir === 1) {  // breath in
	breathAmt -= breathInc;
	if (breathAmt < -breathMax) {
	  breathDir = -1;
	}
  } else {  // breath out
	breathAmt += breathInc;
	if(breathAmt > breathMax) {
	  breathDir = 1;
	}
  }
}

function setBreathInc(inc) {
    breathInc = inc;
}

function updateBlink() { 
				
  eyeOpenTime += blinkUpdateTime;
	
  if(eyeOpenTime >= timeBtwBlinks){
	blink();
  }
}

function setTimeBetweenBlinks(duration) {
    timeBtwBlinks = duration
}

function blink() {

  curEyeHeight -= 1;
  if (curEyeHeight <= 0) {
	eyeOpenTime = 0;
	curEyeHeight = maxEyeHeight;
  } else {
	setTimeout(blink, 10);
  }
}

function jump() {
	
  if (!jumping) {
	jumping = true;
	setTimeout(land, 500);
  }

}
function land() {
	
  jumping = false;

}
