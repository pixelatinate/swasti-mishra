#version 300 es // These is an OpenGL ES 3.0 Shader!
// add another uniform that gives the minimum and maximum values from the bounding box 
// then use that to find how high up in the bunny aVertexPosition.y is 
// then pass that on to the fragment and muliplied the red component by that 

// This shader is the exact same as simple.vert, only it uses the newer OpenGL ES GLSL specification.

// In's and Out's of Vertex Shader in Version 3.0
// an 'in' inside of a vertex shader is an attribute
// an 'out' inside of a vertex shader is a varying

// An Attribute is a value pulled from a bound buffer on the GPU
// You set these up in the client code (our JS application)
// An attribute does not use the 'attribute' keyword in 3.0.
// We use the 'in' key word inside the vertex shader for attributes.
in vec3 aVertexPosition;
in vec3 aVertexNormal;

//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
out float height ;
out vec3 outNormal ;
out vec3 modelNormal ;
out vec3 vertPos4 ;


uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 minAndMax ; 

// Calculated common mapping function and then assigned it to the height and passed it to sphere
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vertPos4 = vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0));
  gl_Position = uProjectionMatrix * uModelViewMatrix *vec4(aVertexPosition,1.0);
  modelNormal = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));
  height = map(aVertexPosition.y, minAndMax[0], minAndMax[1],0.0,1.0) ;
}