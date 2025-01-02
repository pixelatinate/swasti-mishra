#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal ;

out vec3 normal ; 
out vec3 pos ; 

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {
  normal = mat3(transpose(inverse(uModelMatrix))) * aVertexNormal ;
  pos = vec3(uModelMatrix*vec4(aVertexPosition, 1.0));
  gl_Position = uProjectionMatrix*uViewMatrix*vec4(pos, 1.0) ;
}
