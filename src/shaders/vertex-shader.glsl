// an attribute will receive data from a buffer
attribute vec4 a_vertexColor;
attribute vec3 a_position;
varying lowp vec4 v_color;

// all shaders have a main function
void main() {
  gl_Position = vec4(a_position, 1);
  v_color = a_vertexColor;
}