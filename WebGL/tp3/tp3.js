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
var translate = [0, 0]; //contain translation to apply
var zoomFactor = 1;
var angle = 0;
var pos; //position adress
var color; //color adress
var translation; //translation adress
var zoom;
var rotation;
var posBuffer;
var colorBuffer;
// var time = 0;
var matLoc;

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

  translation = gl.getUniformLocation(program, "translation");
  gl.enableVertexAttribArray(translation);
  gl.uniform2f(translation, translate[0], translate[1]);

  zoom = gl.getUniformLocation(program, "zoom");
  gl.enableVertexAttribArray(zoom);
  gl.uniform1f(zoom, zoomFactor);

  rotation = gl.getUniformLocation(program, "angle");
  gl.enableVertexAttribArray(rotation);
  gl.uniform1f(rotation, angle);

  matLoc = gl.getUniformLocation(program, "matrix");
}

function initBuffer() {
  posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
}

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
  var matrix = mat4.create();
  var out = matrix;
  var fovy = 0.5;
  var aspect = 1;
  var near = 0.1;
  var far = 100;
  mat4.perspective(out, fovy, aspect, near, far);
  gl.uniformMatrix4fv(matLoc, false, matrix);
}

function triangle() {
  gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
}

//Fonction permettant le dessin dans le canvas
function draw() {
  triangle();
}

function main() {
  points = [-0.2, -0.2, -1, 0, 0.2, -1, 0.2, -0.2, -10];
  initContext();
  initShaders();
  initProgram();
  initAttributes();
  initBuffer();
  initColors();
  refreshBuffer(points);

  troisD();

  draw();
  debugShaders();
}
