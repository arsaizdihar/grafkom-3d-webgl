attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_matrix, u_viewProjectionMat;

varying vec2 v_texcoord;
varying vec3 v_vertPos;
varying vec3 v_normal;
varying vec3 v_viewDir;

void main() {
  vec4 position4 = u_matrix * vec4(a_position, 1);
  gl_Position = u_viewProjectionMat * position4;
  v_normal = a_normal;
  v_vertPos = position4.xyz;
  v_texcoord = a_texcoord;
  v_viewDir = -gl_Position.xyz;
}