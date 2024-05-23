precision mediump float;
uniform vec4 u_lightColor;
uniform vec4 u_color;

uniform sampler2D u_texture;
varying vec2 v_texcoord;

void main() {
  gl_FragColor = u_color * u_lightColor * texture2D(u_texture, v_texcoord);
}