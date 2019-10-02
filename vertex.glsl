precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;

varying vec3 fColor;

uniform float theta;
uniform float scaleX;
uniform float scaleY;
uniform int flag;

void main() {
  fColor = vColor;
  vec3 pusatKiri = vec3(-0.5, 0.0, 0.0);
  vec3 pusatKanan = vec3(0.5, 0.0, 0.0);

  mat4 matrixRotate = mat4(
    cos(theta), sin(theta), 0.0, 0.0,
    -sin(theta), cos(theta), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  mat4 matrixSkalasi = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, scaleY, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  
  mat4 matrixTranslationLeft = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    pusatKiri, 1.0
  );

  mat4 matrixTranslationRight = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    pusatKanan, 1.0
  );

  if(flag == 0){
    gl_Position = matrixTranslationLeft * matrixRotate * vec4(vPosition, 0.0, 1.0);
  }
  else if(flag == 1){
    gl_Position = matrixTranslationRight * matrixSkalasi * vec4(vPosition, 0.0, 1.0);
  }

}
