attribute vec3 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix, u_viewProjectionMat;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_viewProjectionMat * u_matrix * vec4(a_position, 1);
  v_texcoord = a_texcoord;
}