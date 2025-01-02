#version 300 es // These is an OpenGL ES 3.0 Shader!

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTexturePosition;
in vec3 aTangent;
out vec3 outTangent;



//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
out float height ;
out vec3 outNormal ;
out vec3 modelNormal ;
out vec3 vertPos4 ;
out vec2 tex_coord;
out mat4 mvmatrix;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 minAndMax ; 

void main() {
  vertPos4 = vec3(uViewMatrix*uModelMatrix * vec4(aVertexPosition, 1.0));
  gl_Position = uProjectionMatrix *vec4(vertPos4,1.0);
  modelNormal = vec3(uViewMatrix*uModelMatrix * vec4(aVertexNormal, 1.0));
  //modelNormal = mat3(transpose(inverse(uModelMatrix))) * aVertexNormal ;
  height = (aVertexPosition.y, minAndMax[0], minAndMax[1],0.0,1.0) ;
  tex_coord=aTexturePosition;
  mvmatrix=uViewMatrix*uModelMatrix;
  outTangent=aTangent;
}