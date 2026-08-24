#version 300 es 

precision mediump float;

in float height ;
in vec3 outNormal ;
in vec3 modelNormal ;
in vec3 vertPos4 ;
in vec2 tex_coord;
in mat4 mvmatrix;
in vec3 outTangent;



uniform float Ka; 
uniform float Kd;
uniform float Ks;
uniform float shininessVal;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

uniform sampler2D u_texture;
uniform sampler2D u_normal;


out vec4 fragColor;


vec3 CalcBumpedNormal(){
  vec3 Normal = modelNormal;
  vec3 Tangent = outTangent;
  Tangent = normalize(Tangent - dot(Tangent, Normal) * Normal);
  vec3 Bitangent = cross(Tangent, Normal);
  vec3 BumpMapNormal = texture(u_normal, tex_coord).xyz;
  BumpMapNormal = 2.0 * BumpMapNormal - vec3(1.0, 1.0, 1.0);
  vec3 NewNormal;
  mat3 TBN = mat3(Tangent, Bitangent, Normal);
  NewNormal = TBN * BumpMapNormal;
  NewNormal = normalize(NewNormal);
  return NewNormal;
  //return vec3(1) ;
}

void main() {
  //vec3 mNormal=vec3(mvmatrix*vec4(vec3(texture(u_normal,tex_coord)),0.0));
  //mNormal=normalize(mNormal);
  vec3 lightPos = vec3(0,0,0) ;

  vec3 N = normalize(CalcBumpedNormal());
  vec3 L = normalize(lightPos - vec3(vertPos4));
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-vec3(vertPos4)); 
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  fragColor = vec4(Ka * ambientColor +
               Kd * lambertian * vec3(texture(u_texture,tex_coord)) +
               Ks * specular * specularColor, 1);   
  //fragColor=vec4(vec3(texture(u_texture,tex_coord)),1.0); 
  //fragColor=vec4(mNormal,1.0);
  //fragColor = vec4(CalcBumpedNormal(),1.0);
  //fragColor = vec4(N, 1.0);
}