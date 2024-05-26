precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_vertPos;
varying mat3 v_TBN;

uniform vec4 u_ambientColor;
uniform vec4 u_diffuseColor;
uniform vec4 u_specularColor;
uniform float u_shininess;
uniform vec3 u_lightDir;
uniform int u_enableDirLight;
uniform vec4 u_lightColor;
uniform vec3 u_cameraPos;

struct Light {
  vec3 position;
  float radius;
  vec4 color;
};

#define MAX_LIGHTS 3

uniform Light u_lights[MAX_LIGHTS];
uniform int u_numLights;

uniform sampler2D u_texture;
uniform sampler2D u_specularTexture;
uniform sampler2D u_normalTexture;

vec3 CalcDirLight(vec3 normal, vec3 viewDir, vec3 diffuseColor, vec3 specularColor) {
  vec3 L = normalize(-u_lightDir);
  // Lambert's cosine law
  float lambertian = max(dot(normal, L), 0.0);
  float specular = 0.0;
  // blinn phong
  if(lambertian > 0.0) {
    vec3 H = normalize(L + viewDir);
    // Compute the specular term
    float specAngle = max(dot(normal, H), 0.0);
    specular = pow(specAngle, u_shininess);
  }
  return (u_ambientColor.rgb + lambertian * diffuseColor + specular * specularColor) * u_lightColor.rgb;
}

vec3 CalcPointLight(Light light, vec3 normal, vec3 viewDir, vec3 diffuseColor, vec3 specularColor) {
  // 0 for directional light, 1 for point light
  vec3 L = normalize((light.position - v_vertPos));
  // Lambert's cosine law
  float lambertian = max(dot(normal, L), 0.0);
  float specular = 0.0;
  float attenuation = 0.0;
  float distance = length(light.position - v_vertPos);
  if(distance <= light.radius) {
    // calculate intensity based on distance
    // Attenuation factors can be adjusted as needed
    float constant = 0.5;
    float x = 5.0;
    float linear = 0.09 / x;
    float quadratic = 0.01 / (x * x);
    attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));
  }

  // blinn phong
  if(lambertian > 0.0) {
    vec3 H = normalize(L + viewDir);
    // Compute the specular term
    float specAngle = max(dot(normal, H), 0.0);
    specular = pow(specAngle, u_shininess);
  }

  return (attenuation * (u_ambientColor.rgb + lambertian * diffuseColor + specular * specularColor)) * light.color.rgb;
}

void main() {
  vec3 diffuseColor = (u_diffuseColor * texture2D(u_texture, v_texcoord)).rgb;
  vec3 specularColor = (u_specularColor * texture2D(u_specularTexture, v_texcoord)).rgb;
  vec3 normal = texture2D(u_normalTexture, v_texcoord).rgb;
  normal = normal * 2.0 - 1.0;

  // phong material
  vec3 N = normalize(v_TBN * normal);
  vec3 result = vec3(0.0);
  vec3 V = normalize(u_cameraPos - v_vertPos);

  if(u_enableDirLight == 1) {
    result += CalcDirLight(N, V, diffuseColor, specularColor);
  }

  for(int i = 0; i < MAX_LIGHTS; i++) {
    if(i >= u_numLights) {
      break;
    }
    if(u_lights[i].radius > 0.0) {
      result += CalcPointLight(u_lights[i], N, V, diffuseColor, specularColor);
    }
  }

  gl_FragColor = vec4(result, 1.0);
}