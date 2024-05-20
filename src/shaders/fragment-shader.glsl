precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_vertPos;
varying vec3 v_normal;
varying vec3 v_viewDir;

uniform mat4 u_normalMat;
uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;
uniform vec4 u_color;
uniform int u_materialType;
uniform vec3 u_lightPos;

uniform sampler2D u_texture;
// uniform sampler2D u_specularTexture;
// uniform sampler2D u_normalTexture;

void main() {
  // basic material
  if(u_materialType == 0) {
    gl_FragColor = u_color * texture2D(u_texture, v_texcoord);
  } else if(u_materialType == 1) {
    vec4 diffuseColor = u_diffuseColor * texture2D(u_texture, v_texcoord);
    // vec4 specularColor = u_specularColor * texture2D(u_specularTexture, v_texcoord);
    vec4 normal = vec4(v_normal, 1);
    vec3 normalInterp = (u_normalMat * normal).xyz;
    // phong material
    vec3 N = normalize(normalInterp);
    vec3 L = normalize(u_lightPos - v_vertPos);
  // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(v_viewDir); // Vector to viewer
    // Compute the specular term
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, u_shininess);
    }
    gl_FragColor = vec4((u_ambientColor +
      lambertian * diffuseColor +
      specular * u_specularColor).xyz, 1.0);
  }
}