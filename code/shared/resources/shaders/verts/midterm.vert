#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTexturePosition;
in vec3 aTangent ;
in vec3 aBitangent ;

out vec3 fragPosition;
out vec3 fragNormal;
out vec2 outTexCoords;
out vec3 outTangent ;
out vec3 outBitangent ;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  fragPosition = vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0));
  fragNormal = vec3(uModelViewMatrix * vec4(normalize( aVertexNormal ), 0.0));
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  outTexCoords = aTexturePosition;
  outTangent = vec3(uModelViewMatrix * vec4(normalize( aTangent ), 0.0));
  outBitangent = vec3(uModelViewMatrix * vec4(normalize( aBitangent ), 1.0));
}
