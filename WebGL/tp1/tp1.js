function loadText(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.overrideMimeType("text/plain");
  xhr.send(null);
  if (xhr.status === 200) return xhr.responseText;
  else {
    return null;
  }
}

// variables globales du programme;
var canvas;
var gl; //contexte
var program; //shader program
var attribPos; //attribute position
var attribSize; //attribute size
var vertexShader;
var fragmentShader;
var points = []; //contain all points to draw
var colorsArray = [];
var pos; //position adress
var color; //color adress
var posBuffer;
var colorBuffer;
var mousePositions = [];

function initContext() {
  canvas = document.getElementById("dawin-webgl");
  gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("ERREUR : echec chargement du contexte");
    return;
  }
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

//Initialisation des shaders et du program
function initShaders() {
  var vShaderSource = loadText("http://localhost:8080/vertexShader.glsl");
  var fShaderSource = loadText("http://localhost:8080/fragmentShader.glsl");
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vShaderSource);
  gl.shaderSource(fragmentShader, fShaderSource);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
}

function initProgram() {
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
}

function debugShaders() {
  console.log(
    "vertexShader compiled: " +
      gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
  );
  console.log(
    "fragmentShader compiled: " +
      gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
  );
  console.log(
    "program linked: " + gl.getProgramParameter(program, gl.LINK_STATUS)
  );
  console.log("program logs: " + gl.getProgramInfoLog(program));
}

//Evenement souris
function initEvents() {
  canvas.onclick = function(e) {
    //changement de repere pour les coordonnees de souris
    var x = (e.pageX / canvas.width) * 2.0 - 1.0;
    var y = ((canvas.height - e.pageY) / canvas.height) * 2.0 - 1.0;
    mousePositions.push(x);
    mousePositions.push(y);
    refreshBuffer(mousePositions);
    gl.drawArrays(gl.TRIANGLES, 0, mousePositions.length / 2);
  };
}

function initPoints() {
  for (var x = -1; x <= 1; x = x + 0.15) {
    for (var y = -1; y <= 1; y = y + 0.15) {
      points.push(x * Math.random());
      points.push(y * Math.random());
    }
  }
}

//Fonction initialisant les attributs pour l'affichage (position et taille)
function initAttributes() {
  pos = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(pos);
  color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);
}

function initBuffer() {
  posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
}

///////////////////////////////////     /!\ Work in progress /!\     ////////////////////////////////////////

function refreshBuffer(source) {
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, true, 0, 0);
}

function initColors() {
  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  points.forEach((item, index) => {
    if (index % 2 == 1) {
      colorsArray.push(Math.random(), Math.random(), Math.random(), 1.0);
    }
  });
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, true, 0, 0);
}

function triangle() {
  refreshBuffer(points);
  gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
}

//Fonction permettant le dessin dans le canvas
function draw(methode) {
  if (methode == "click") {
    initEvents();
  } else if (methode == "triangle") {
    triangle();
  } else {
    refreshBuffer(points);
    gl.drawArrays(gl.POINTS, 0, points.length / 2);
  }
}

function main() {
  initContext();
  initShaders();
  initProgram();
  initAttributes();
  initBuffer();
  initPoints();

  ///////////////
  initColors();
  draw("triangle"); // "click" for mouse drawing, something else for grid
  /////////////////

  debugShaders();
}
