attribute vec3 a_position;
// attribute vec3 a_normal;
// attribute vec2 a_texcoord;

uniform mat4 u_matrix, u_normalMat;
// uniform vec4 u_ambientColor;
// uniform vec4 u_diffuseColor;
// uniform vec4 u_specularColor;
// uniform float u_shininess;
// uniform int u_materialType;
// uniform vec3 u_lightDirection;
uniform vec4 u_color;

// varying vec2 v_texcoord;
varying vec4 v_color;

void main() {
  vec4 position4 = u_matrix * vec4(a_position, 1);
  gl_Position = u_normalMat * position4;

  // basic material
  // if(u_materialType == 0) {
  v_color = u_color;
  // } 
  // TODO: phong material
  // else if(u_materialType == 1) {
  //   vec3 normalInterp = (u_normalMat * vec4(a_normal, 1.0)).xyz;
  //   // phong material
  //   vec3 N = normalize(normalInterp);
  //   vec3 L = normalize(u_lightDirection);
  // // Lambert's cosine law
  //   float lambertian = max(dot(N, L), 0.0);
  //   vec4 specular = vec4(0.0, 0.0, 0.0, 1.0);
  //   vec4 ambient = u_ambientColor;

  //   vec4 diffuse = lambertian * u_diffuseColor;

  //   if(lambertian > 0.0) {
  //     vec3 V = normalize(-position4.xyz);
  //     vec3 H = normalize(L + V);
  //     float specAngle = max(dot(N, H), 0.0);
  //     specular = u_specularColor * pow(specAngle, u_shininess);
  //   }
  //   v_color = ambient + diffuse + specular;
  // }
  // TODO: texture
  // v_texcoord = a_texcoord;
}