#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal ;

out vec3 normal ; 
out vec3 pos ; 
out vec3 outColor;

out vec3 v_reflection;
out vec3 v_refraction;
out float v_fresnel;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform vec3 uCameraPos ;

const float Air = 1.0;
const float Glass = 1.51714;
const float Eta = Air / Glass;
const float R0 = ((Air - Glass) * (Air - Glass)) / ((Air + Glass) * (Air + Glass));

void main() {
  vec3 vertex = vec3(uModelMatrix*vec4(aVertexPosition, 1.0));
	vec3 incident = normalize(vec3(vertex-uCameraPos));

  normal = mat3(transpose(inverse(uModelMatrix))) * aVertexNormal ;
  
  v_refraction = refract(incident, normal, Eta);
	v_reflection = reflect(incident, normal);
  v_fresnel = R0 + (1.0 - R0) * pow((1.0 - dot(-incident, normal)), 5.0);

  gl_Position = uProjectionMatrix*uViewMatrix*vec4(vertex, 1.0) ;
  outColor = normalize(aVertexNormal);
}
