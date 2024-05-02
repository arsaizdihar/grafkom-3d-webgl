// an attribute will receive data from a buffer
attribute vec3 a_position;

// all shaders have a main function
void main() {
  gl_Position = vec4(a_position, 1);
}