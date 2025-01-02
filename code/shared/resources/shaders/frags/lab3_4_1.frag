#version 300 es

precision mediump float;

in vec3 outTexCoords;

out vec4 fragColor;
uniform samplerCube u_texture;

void main() {
    fragColor = texture(u_texture, outTexCoords) ;
}