#version 300 es 

precision mediump float;

in vec2 outTexCoords;
in vec4 outColor ; 

out vec4 fragColor;
uniform sampler2D u_texture;

void main() {
  vec4 texOpacity;
  texOpacity = texture(u_texture, outTexCoords);
  if(texOpacity.a < 0.1){ 
    discard;
  }
  fragColor = texture(u_texture,outTexCoords)*outColor;  
}
