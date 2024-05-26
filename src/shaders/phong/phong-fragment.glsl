precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_vertPos;
varying vec3 v_viewDir;
varying mat3 v_TBN;

uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;
uniform vec3 u_lightPos;
uniform vec3 u_lightDir;
uniform float u_lightRadius;
uniform int u_lightType;

uniform sampler2D u_texture;
uniform sampler2D u_specularTexture;
uniform sampler2D u_normalTexture;

void main() {
  vec4 diffuseColor = u_diffuseColor * texture2D(u_texture, v_texcoord);
  vec4 specularColor = u_specularColor * texture2D(u_specularTexture, v_texcoord);
  vec3 normal = texture2D(u_normalTexture, v_texcoord).rgb;
  normal = normal * 2.0 - 1.0;
    // phong material
  vec3 N = normalize(v_TBN * normal);
  // 0 for directional light, 1 for point light
  vec3 L = u_lightType == 0 ? normalize(-u_lightDir) : normalize((u_lightPos - v_vertPos));
  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;

  // If the light is a point light, check if the light is within the radius
  if(u_lightType == 1) {
    float distance = length(u_lightPos - v_vertPos);
    if(distance > u_lightRadius) {
      lambertian = 0.0;
    } else {
      // calculate intensity based on distance
      // Attenuation factors can be adjusted as needed
      float constant = 1.0;
      float linear = 0.09 / u_lightRadius;
      float quadratic = 0.032 / (u_lightRadius * u_lightRadius);
      float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));
      lambertian *= attenuation;
    }
  }

  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(v_viewDir); // Vector to viewer
    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, u_shininess);
  }
  gl_FragColor = vec4((u_ambientColor +
    lambertian * diffuseColor +
    specular * specularColor).xyz, 1.0);
}