#version 300 es // These is an OpenGL ES 3.0 Shader!

// This shader is the exact same as simple.vert, only it uses the newer OpenGL ES GLSL specification.

// In's and Out's of Vertex Shader in Version 3.0
// an 'in' inside of a vertex shader is an attribute
// an 'out' inside of a vertex shader is a varying


// An Attribute is a value pulled from a bound buffer on the GPU
// You set these up in the client code (our JS application)
// An attribute does not use the 'attribute' keyword in 3.0.
// We use the 'in' key word inside the vertex shader for attributes.

// In phong all the interesting stuff is in the other file (frag)

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 outNormal;
out vec3 vertPos4 ;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  outNormal = vec3(uModelViewMatrix * vec4(normalize( aVertexNormal ), 0.0));
  vertPos4 = vec3(uModelViewMatrix * vec4(aVertexPosition , 1.0 )) ;
}