#version 300 es

precision mediump float;

in vec3 fragNormal ;
in vec3 fragPosition ; 
in vec2 outTexCoords ;
in vec3 outTangent ;
in vec3 outBitangent ;

uniform float Ka; 
uniform float Kd;
uniform float Ks;
uniform float shininessVal;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

out vec4 fragColor;
uniform sampler2D u_texture;
uniform sampler2D u_normal;


vec3 CalcBumpedNormal(){
  vec3 Normal = fragNormal;
  vec3 Tangent = outTangent;
  Tangent = normalize(Tangent - dot(Tangent, Normal) * Normal);
  vec3 Bitangent = cross(Tangent, Normal);
  vec3 BumpMapNormal = texture(u_normal, outTexCoords).xyz;
  BumpMapNormal = 2.0 * BumpMapNormal - vec3(1.0, 1.0, 1.0);
  vec3 NewNormal;
  mat3 TBN = mat3(Tangent, Bitangent, Normal);
  NewNormal = TBN * BumpMapNormal;
  NewNormal = normalize(NewNormal);
  //return NewNormal;
  return vec3(1) ;
}


void main() {
  vec3 lightPos = vec3(0,0,0) ;
  vec3 N = normalize(CalcBumpedNormal());
  vec3 L = normalize(lightPos - vec3(fragPosition));

  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-vec3(fragPosition));
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }

  
  fragColor = vec4(Ka * ambientColor +
               Kd * lambertian * vec3(texture(u_texture,outTexCoords)) +
               Ks * specular * specularColor, 1.0);

}