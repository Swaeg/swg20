let s;
let b0, b1;
var t;
let w, h;
let c_arr = [];
let p_arr = [];
let c0, c1, c2, c3;
let r1, r2,r3,r4,r5,r6,r7,r8 = 0.0;
let msmv;
function setup() {
    
  createCanvas(windowWidth, windowHeight, WEBGL);
  b0 = createGraphics(windowWidth, windowHeight, WEBGL);
  b1 = createGraphics(windowWidth, windowHeight, WEBGL);
  w = width; h = height;
  
  s  = b0.createShader(vs, fs);
  b0.setAttributes('alpha', true)
  noStroke();
 
 for (i = 0; i < 18; i ++) {
    p_arr.push([random(-w, w), random(-h, h)]);
  }
  b0.clear()
  b0.push()
  b0.noStroke()
  b0.beginShape()
  for (i = 0; i < p_arr.length; i++) {
    b0.fill(random(255))
    if(random() < 0.1){
        //b0.fill(random(255), random(255), random(255))
    }
    b0.vertex(p_arr[i][0], p_arr[i][1]);
  }
  b0.endShape(CLOSE)
  b0.pop()


  r1 = round(random(4, 32))
  r2 = round(random(7, 27))
  r3 = random(0.01, 0.0005) 
  r4 = round(random(0.1, 0.03));
  r5 = random(0.005, 0.1)
b0.noStroke()
  }

function draw() { 
  b0.shader(s);
//frameRate(round(random(5, 60)))
  b0.reset()
  msmv = false
circle(random(-w, w), random(-h, h), random(50))

if(random() < 0.1){
    beginShape()
    for(i = 0; i < 6; i++){
      
      fill(random(255))
      if(random() < 0.1){
          fill(random(255), random(255), random(255))
      }
      vertex(random(-w, w), random(-h, h))
    }
    endShape()
}

  //if (frameCount % 50 === 0 || msmv) {
    r1 = round(random(7, 32))
    r2 = round(random(12, 27))
    r3 = random(0.001, 0.0005) 
    r4 = round(random(0.01, 0.03));
    r5 = random(0.005, 0.1)
    r6 = random(0.005, -0.005)
 // }
  if (frameCount % 33 === 0 || msmv){
    r6 = random(0.005, -0.005)
  }

  s.setUniform('tex0', this._renderer);
  s.setUniform('tex1', b0);
  s.setUniform('resot', [w, h]);
  s.setUniform('boxy', [r1, r2]);
  s.setUniform('separation', r3);
  s.setUniform('scanlines', r4); 
  s.setUniform('separate', r5);
  s.setUniform('size', r6);

  let num0 = round(random(2, 200))
  let num1 = round(random(2, 200))
  let sx = w / num0
  let sy = h / num1
  b1.image(this._renderer, -w/2, -h/2, sx, sy)
  image(b1, -w/2, -h/2, w*num0, h*num1);

  //h = random() *  windowHeight
  //w = random() *  windowWidth
  let gx = round(random(5, 1555))
  let gy = round(random(5, 1555))
  let x = random(-w,w) 
  let y = random(-h,h)
  let c = this._renderer.get(x,y);
  fill(c);
  rect(x, y, gx*15, gy*15);

  b0.rect(-w/2, -h/2, w, h);
  image(b0, -w/2, -h/2 ,w, h);
}

function mouseMoved() {
    msmv = true;
 }

vs = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vuv;

void main() {
  vuv = aTexCoord;
  vec4 apos = vec4(aPosition, 1.0);
  apos.xy = apos.xy * 2.0 - 1.0;
  gl_Position = apos;
}`

fs = /*glsl*/`
precision highp float;
varying vec2 vuv;
uniform float time;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform vec2 resot;
uniform float separation;
uniform float scanlines;
uniform float separate;
uniform float size;
uniform vec2 boxy;
const float space = 0.01;

vec4 tex2DNear(sampler2D tex, vec2 coord, vec2 textureSize){
  vec2 pixel = coord * textureSize;
  vec2 texelSize = 1.0 / textureSize; 
  vec2 frac = fract(pixel);
  pixel = (floor(pixel) / textureSize);
  return texture2D(tex, pixel + vec2(texelSize/2.0));
}

float rand(vec2 co) {
			  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {

  vec2 uv = vuv;
  uv.y = 1.0 - uv.y;
  vec2 fbuv = uv;

  vec2 lod2 = vec2(boxy.r, 15.);
  vec2 zuv1 = uv;
  zuv1 += fract(rand(fract(zuv1*lod2)/lod2)*2.0-1.)*separation;

  vec2 lod3 = vec2(15., boxy.g);
  vec2 zuv2 = uv;
  zuv2 += atan(rand(fract(zuv2*lod3)/lod3)*2.0-1.)*separation;

  uv = vec2(zuv1.s, zuv2.t);

  vec4 tex = tex2DNear(tex0, uv, resot);
  vec4 texb = tex2DNear(tex0, fbuv, resot);

  float gray = luma(tex.rgb);
  float cutty = step(gray, 0.87);
  
  vec4 ccol = vec4(mix(tex, texb, -gray));
  //ccol.rgb = mix(ccol.rgb, 1.0 - ccol.gbr, step(1.0, -ccol.r) );

  if(ccol.r < 0.1){
    ccol.r += 0.1;
  } 
  if(ccol.r > 0.5){
    ccol.r -= 0.1;
  }
if(ccol.r < 0.033 || ccol.r > 0.9966){
    discard;
}
 gl_FragColor = vec4(ccol.rgb, cutty);
}`