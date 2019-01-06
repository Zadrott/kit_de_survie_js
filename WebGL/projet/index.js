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
var modelLoc;
var translationLoc;
var translation;
var rotationLoc;
var rotation;
var model;
const aspect = 1;
const near = 0.1;
const far = 100;
var rx = 0;
var ry = 0;
var rz = 0;
var tx = 0;
var ty = 0;
var tz = 0;
var fovy = 0.9;

function initContext() {
  canvas = document.getElementById("dawin-webgl");
  gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("ERREUR : echec chargement du contexte");
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

//Fonction initialisant les attributs pour l'affichage (position et taille)
function initAttributes() {
  pos = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(pos);
  color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);
  modelLoc = gl.getUniformLocation(program, "model");
  translationLoc = gl.getUniformLocation(program, "translation");
  rotationLoc = gl.getUniformLocation(program, "rotation");
}

function initBuffer() {
  posBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();
}

function refreshBuffer(source) {
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, true, 0, 0);
}

function initColors() {
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  points.forEach((item, index) => {
    if (index % 2 == 1) {
      colorsArray.push(Math.random(), Math.random(), Math.random(), 1.0);
    }
  });
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);
  gl.vertexAttribPointer(color, 4, gl.FLOAT, true, 0, 0);
}

function rxChange(val) {
  rx = val;
  draw();
}

function ryChange(val) {
  ry = val;
  draw();
}

function rzChange(val) {
  rz = val;
  draw();
}

function txChange(val) {
  tx = val * 0.1;
  draw();
}

function tyChange(val) {
  ty = val * 0.1;
  draw();
}

function tzChange(val) {
  tz = val * 0.1;
  draw();
}

function fovyChange(val) {
  fovy = val * (Math.PI / 180);
  draw();
}

//Fonction permettant le dessin dans le canvas
function draw() {
  model = mat4.create();
  rotation = mat4.create();
  translation = mat4.create();
  mat4.perspective(model, fovy, aspect, near, far);
  mat4.identity(rotation);
  mat4.identity(translation);
  mat4.rotate(rotation, rotation, rx, [1, 0, 0]);
  mat4.rotate(rotation, rotation, ry, [0, 1, 0]);
  mat4.rotate(rotation, rotation, rz, [0, 0, 1]);
  mat4.translate(translation, translation, [0, 0, -1]);
  mat4.translate(translation, translation, [tx, ty, tz]);
  gl.uniformMatrix4fv(translationLoc, false, translation);
  gl.uniformMatrix4fv(rotationLoc, false, rotation);
  gl.uniformMatrix4fv(modelLoc, false, model);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 3);
}

function main() {
  points = [
    -0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    0.2,
    -0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
    0.2,
    -0.2,
    0.2,
    0.2,
    -0.2,
  ];
  initContext();
  initShaders();
  initProgram();
  initAttributes();
  initBuffer();
  initColors();
  refreshBuffer(points);
  draw();
  debugShaders();
}
