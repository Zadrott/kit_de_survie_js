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
var matLoc;
var translationLoc;
var rotationLoc;
var rotation;
var time = 0;
var angle = 0;

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

//Fonction initialisant les attributs pour l'affichage (position et taille)
function initAttributes() {
  pos = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(pos);

  color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);

  matLoc = gl.getUniformLocation(program, "model");
  translationLoc = gl.getUniformLocation(program, "translation");
  rotationLoc = gl.getUniformLocation(program, "rotation");
}

function initBuffer() {
  posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
}
0;
function refreshBuffer(source) {
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, true, 0, 0);
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

function troisD() {
  var model = mat4.create();
  var translation = mat4.create();
  mat4.identity(translation);
  mat4.translate(translation, translation, [0, 0, -1]);

  rotation = mat4.create();
  mat4.identity(rotation);
  mat4.rotateY(rotation, rotation, 0.5);

  var out = model;
  var fovy = 0.9;
  var aspect = 1;
  var near = 0.1;
  var far = 100;
  mat4.perspective(out, fovy, aspect, near, far);

  gl.uniformMatrix4fv(matLoc, false, model);
  gl.uniformMatrix4fv(translationLoc, false, translation);
  gl.uniformMatrix4fv(rotationLoc, false, rotation);
}

function animate() {
  for (var i = 0; i < 10; i++) {
    angle += -0.1 * time;
    mat4.rotateY(rotation, rotation, angle);
    gl.uniformMatrix4fv(rotationLoc, false, rotation);
    draw();
  }
  requestAnimationFrame(animate);
}

//Fonction permettant le dessin dans le canvas
function draw() {
  gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 3);
}

function main() {
  points = [-0.2, -0.2, 0, 0.2, -0.2, 0, 0.2, 0.2, 0, -0.2, 0.2, 0];
  initContext();
  initShaders();
  initProgram();
  initAttributes();
  initBuffer();
  initColors();
  refreshBuffer(points);
  troisD();
  draw();
  requestAnimationFrame(animate);
  debugShaders();
}
