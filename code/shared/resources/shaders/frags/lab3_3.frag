#version 300 es

precision mediump float;

in vec3 fragNormal ;
in vec3 fragPosition ; 
in vec2 outTexCoords ;

uniform float Ka; 
uniform float Kd;
uniform float Ks;
uniform float shininessVal;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

out vec4 fragColor;
uniform sampler2D u_texture;

void main() {
  vec3 lightPos = vec3(0,0,0) ;
  vec3 N = normalize(fragNormal);
  vec3 L = normalize(lightPos - vec3(fragPosition));
  
  vec4 texOpacity;
  texOpacity = texture(u_texture, outTexCoords);
  if(texOpacity.a < 0.1){ 
    discard;
  }
  //fragColor = texture(u_texture,outTexCoords);
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-vec3(fragPosition));
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  fragColor = vec4(Ka * ambientColor +
               Kd * lambertian * vec3(texture(u_texture,outTexCoords)) +
               Ks * specular * specularColor, 1.0);
}