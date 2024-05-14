attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_matrix, u_viewProjectionMat, u_projectionMat;
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;
uniform int u_materialType;
uniform vec3 u_lightPos;
uniform vec4 u_color;

varying vec2 v_texcoord;
varying vec4 v_color;

void main() {
  vec4 position4 = u_matrix * vec4(a_position, 1);
  gl_Position = u_viewProjectionMat * position4;

  // basic material
  if(u_materialType == 0) {
    v_color = u_color;
  } else if(u_materialType == 1) {
    // vec4 normal = u_matrix * vec4(a_normal, 1);
    vec4 normal = vec4(a_normal, 1);
    vec3 normalInterp = (u_projectionMat * normal).xyz;
    // phong material
    vec3 N = normalize(normalInterp);
    vec3 L = normalize(u_lightPos - position4.xyz);
  // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(-position4.xyz); // Vector to viewer
    // Compute the specular term
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, u_shininess);
    }
    v_color = vec4((u_ambientColor +
      lambertian * u_diffuseColor +
      specular * u_specularColor).xyz, 1.0);
  }

  v_texcoord = a_texcoord;
}