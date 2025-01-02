#version 300 es

precision mediump float;

in vec3 normal ; 
in vec3 pos ; 

out vec4 fragColor ;

uniform samplerCube u_texture;
uniform vec3 uCameraPos ; 

void main() {
    vec3 i = normalize(pos - uCameraPos ) ;
    vec3 r = reflect( i, normalize(normal)) ;
    fragColor = vec4( texture(u_texture, r).rgb, 1.0);
}