#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTexturePosition;

out vec3 fragPosition;
out vec3 fragNormal;
out vec2 outTexCoords;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

void main() {
  fragPosition = vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0));
  fragNormal = vec3(uModelViewMatrix * vec4(normalize( aVertexNormal ), 0.0));
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  outTexCoords=aTexturePosition;
}
