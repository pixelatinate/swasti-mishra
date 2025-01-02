#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of a Fragment Shader
// an 'in' inside of a fragment shader is a varying var
// an 'out' inside of a fragment shader is _the_ output you wish to draw (typically a vec4 color)
// attribute is in and varying is out 

// We need to tell the shader executable at what precision we want floats to be
// medium precision is a good balance of speed and accuracy.
precision mediump float;

// Left all this stuff from the last step

in float height ;
in vec3 outNormal ;
in vec3 modelNormal ;
in vec3 vertPos4 ;

uniform float Ka; 
uniform float Kd;
uniform float Ks;
uniform float shininessVal;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

out vec4 fragColor;

void main() {
  vec3 lightPos = vec3(0,0,0) ;

  vec3 N = normalize(modelNormal);
  vec3 L = normalize(lightPos - vec3(vertPos4));
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-vec3(vertPos4)); 
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  fragColor = vec4(Ka * ambientColor +
               Kd * lambertian * diffuseColor +
               Ks * specular * specularColor, 1)*vec4(height,1,1,1);
}