// this is the fragment (or pixel) shader
precision mediump float;
uniform vec4 uPixelColor;
void main(void)  {
    // for every pixel called (within the square) sets
    // constant color white with alpha-channel value of 1.0
    gl_FragColor = uPixelColor;
}