#version 300 es

in vec3 aVertexPosition;

out vec3 outTexCoords;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  outTexCoords = aVertexPosition ;
  vec4 pos = uProjectionMatrix * vec4(mat3(uViewMatrix) * aVertexPosition, 1.0) ;
  gl_Position = pos.xyww ;
}
