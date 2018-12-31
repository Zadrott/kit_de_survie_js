attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
uniform mat4 model;
uniform mat4 translation;
uniform mat4 rotation;

void main() {
    gl_Position = model * translation * rotation * vec4(position[0] , position[1], position[2] ,1); 
    gl_PointSize = 16.0;
    vColor = color;
} 