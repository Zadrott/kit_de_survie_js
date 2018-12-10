attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
uniform mat4 matrix;

void main() {
    gl_Position = matrix * vec4(position[0] , position[1], position[2] ,1); 
    gl_PointSize = (position[0] + 1.0) * 20.0;
    vColor = color;
} 