#version 300 es

precision mediump float;

in vec3 normal ; 
in vec3 pos ; 
in vec3 outColor;
in vec3 v_refraction;
in vec3 v_reflection;
in float v_fresnel;

out vec4 fragColor ;

uniform samplerCube u_texture;
uniform vec3 uCameraPos ; 

void main() {
    vec4 refractionColor = texture(u_texture, normalize(v_refraction));
	vec4 reflectionColor = texture(u_texture, normalize(v_reflection));
    fragColor = mix(refractionColor, reflectionColor, v_fresnel)*vec4(abs(outColor), 0.9);
    
    vec3 i = normalize(pos - uCameraPos) ;
    vec3 r = reflect( i, normalize(normal)) ;
    fragColor = vec4( texture(u_texture, r).rgb, 1.0);
}