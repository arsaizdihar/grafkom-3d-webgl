attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec3 a_bitangent;
uniform mat4 u_normalMat;

uniform mat4 u_matrix, u_viewProjectionMat;

varying vec2 v_texcoord;
varying vec3 v_vertPos;
varying vec3 v_viewDir;
varying mat3 v_TBN;

void main() {
  vec4 position4 = u_matrix * vec4(a_position, 1);
  gl_Position = u_viewProjectionMat * position4;
  vec3 T = normalize(vec3(u_normalMat * vec4(a_tangent, 0.0)));
  vec3 B = normalize(vec3(u_normalMat * vec4(a_bitangent, 0.0)));
  vec3 N = normalize(vec3(u_normalMat * vec4(a_normal, 0.0)));
  v_TBN = mat3(T, B, N);
  v_vertPos = position4.xyz;
  v_texcoord = a_texcoord;
  v_viewDir = gl_Position.xyz;
}