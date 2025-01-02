#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of a Fragment Shader
// an 'in' inside of a fragment shader is a varying var
// an 'out' inside of a fragment shader is _the_ output you wish to draw (typically a vec4 color)
// attribute is in and varying is out 

// We need to tell the shader executable at what precision we want floats to be
// medium precision is a good balance of speed and accuracy.

// Much of this is from this website where they explain phong and gourad: 
// http://www.cs.toronto.edu/~jacobson/phong-demo/

precision mediump float;

in vec3 aVertexPosition ; 
in vec3 aVertexNormal ;
uniform mat4 uModelViewMatrix ;
uniform mat4 uProjectionMatrix ;

uniform float Ka; 
uniform float Kd;
uniform float Ks;
uniform float shininessVal;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
//uniform vec3 lightPos ; // camera location - 0,0,0 for eye space

out vec3 normalInterp;
out vec4 outColor;

void main() {
  vec3 lightPos = vec3(0,0,0) ;
  vec4 vertPos4 = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  normalInterp = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));
  gl_Position = uProjectionMatrix * vertPos4;

  vec3 N = normalize(normalInterp);
  vec3 L = normalize(lightPos - vec3(vertPos4));
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-vec3(vertPos4));
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  outColor = vec4(Ka * ambientColor +
               Kd * lambertian * diffuseColor +
               Ks * specular * specularColor, 1.0);
}