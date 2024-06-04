import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1], // Back Face
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
  const positions = [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1, // Back Face
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, 1, 1,  1, 1, -1, 1, 1, // Front Face
    1, -1, -1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, 1, -1, // Right Face
    -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1,  1, 1, -1, 1, -1, // Left Face
    1, 1, 1, -1, 1, 1, -1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, // Top Face
    1, -1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, // Bottom Face
    ];
  const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Back Face
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, // Front Face
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // Right Face
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Left Face
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Top Face
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // Botom Face
  ];
  const uvCoords =  [1, 0, 1/2, 0, 1/2, 1/3, 1, 0, 1/2, 1/3, 1, 1/3, // Back Face
    0, 2/3, 0, 1, 1/2, 1, 0, 2/3, 1/2, 1, 1/2, 2/3, // Front Face
    1/2, 1/3, 0, 1/3, 0, 2/3, 1/2, 1/3, 0, 2/3, 1/2, 2/3, // Right Face
    1, 1/3, 1/2, 1/3, 1/2, 2/3, 1, 1/3, 1/2, 2/3, 1, 2/3, // Left Face
    1/2, 0, 0, 0, 0, 1/3, 1/2, 0, 0, 1/3, 1/2, 1/3, // Top Face
    1, 2/3, 1/2, 2/3, 1/2, 1, 1, 2/3, 1/2, 1, 1, 1, // Bottom Face
  ];
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  this.positions = positions;
  this.normals = normals;
  this.uvCoords = uvCoords;
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  const positions = [];
  const normals = [];
  const uvCoords = [];
  const indices = [];

  const radius = 1;

  var x, y, z, xy; // vertex position
  var s, t; // vertex texCoord
  var lengthInv = 1.0 / radius; // vertex normal
  var nx, ny, nz; // vertex normal

  var sectorStep = 2 * Math.PI / numSectors;
  var stackStep = Math.PI / numStacks;

  var sectorAngle;
  var stackAngle;

  // Iterate over stacks and sectors to generate vertices
  for (let i = 0; i <= numStacks; ++i) {
    stackAngle = Math.PI / 2  - i * stackStep;

    xy = radius * Math.cos(stackAngle);        
    z = radius * Math.sin(stackAngle); 

    for (let j = 0; j <= numSectors; ++j) {
      sectorAngle = j * sectorStep;

      x = xy * Math.cos(sectorAngle);  
      y = xy * Math.sin(sectorAngle);     
      positions.push(x);
      positions.push(y);
      positions.push(z);

      nx = x * lengthInv;
      ny = y * lengthInv;
      nz = z * lengthInv;
      normals.push(nx);
      normals.push(ny);
      normals.push(nz);

      t = 1 - parseFloat(j / numStacks);
      s = parseFloat(i / numSectors);
      uvCoords.push(t);
      uvCoords.push(s);
      
      if (i !== numStacks && j !== numSectors) {
        const first = i * (numSectors + 1) + j;
        const second = first + numSectors + 1;
        indices.push(first, second, first + 1);
        indices.push(first + 1, second, second + 1);
      }
    }
  }
  // Assign data to the TriangleMesh instance
  this.positions = positions;
  this.normals = normals;
  this.uvCoords = uvCoords;
  this.indices = indices;
}

Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix

  //console.log(overallTransform);

  transformSequence.forEach(transform => {
    if (transform[0] === 'T'){
      const Translation = [ 1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            transform[1], transform[2], transform[3], 1,];
      Mat4.multiply(overallTransform, Translation, overallTransform);
    }
    else if (transform[0] === 'Rx'){
      const xRotate = [ 1, 0, 0, 0,
                        0, Math.cos((transform[1] * Math.PI) / 180.0), Math.sin((transform[1] * Math.PI) / 180.0), 0,
                        0, -Math.sin((transform[1] * Math.PI) / 180.0), Math.cos((transform[1] * Math.PI) / 180.0), 0,
                        0, 0, 0, 1,];
      Mat4.multiply(overallTransform, xRotate, overallTransform);
    }
    else if (transform[0] === 'Ry'){
      const yRotate = [ Math.cos((transform[1] * Math.PI) / 180.0), 0, -Math.sin((transform[1] * Math.PI) / 180.0), 0,
                        0, 1, 0, 0,
                        Math.sin((transform[1] * Math.PI) / 180.0), 0, Math.cos((transform[1] * Math.PI) / 180.0), 0,
                        0, 0, 0, 1,];
      Mat4.multiply(overallTransform, yRotate, overallTransform);
    }
    else if (transform[0] === 'Rz'){
      const zRotate = [ Math.cos((transform[1] * Math.PI) / 180.0), Math.sin((transform[1] * Math.PI) / 180.0), 0, 0,
                        -Math.sin((transform[1] * Math.PI) / 180.0), Math.cos((transform[1] * Math.PI) / 180.0), 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1,];
      Mat4.multiply(overallTransform, zRotate, overallTransform);
    }
    else if (transform[0] === 'S'){
      const Scale = [ transform[1], 0, 0, 0,
                      0, transform[2], 0, 0,
                      0, 0, transform[3], 0,
                      0, 0, 0, 1,];
      Mat4.multiply(overallTransform, Scale, overallTransform);
    }
  });
  return overallTransform;
}



Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

varying vec3 L;
varying vec3 N;
varying vec3 V;
varying vec3 R;
varying vec3 H;

void main() {
  vec4 viewVertex = viewMatrix * modelMatrix * vec4(position, 1.0);
  L = normalize(lightPosition - viewVertex.xyz);
  N = normalize(normalMatrix * normal);
  V = normalize(-viewVertex.xyz);
  R = reflect(-L, N);
  H = normalize(L + V);

  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); 
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

varying vec3 N;
varying vec3 L;
varying vec3 V;
varying vec3 R;
varying vec3 H;

void main() {
  vec3 ambient = ka * lightIntensity;

  float diffuseFactor = max(0.0, dot(N, L));
  vec3 diffuse = (kd / (length(L) * length(L))) * diffuseFactor * lightIntensity;

  float specularFactor = pow(max(0.0, dot(N, H)), shininess);
  vec3 specular_blin = specularFactor * lightIntensity;
  vec3 specular = ( ks / (length(L) * length(L))) * pow(max(0.0, dot(R, V)), shininess) * lightIntensity;

  vec3 finalColor = ambient + diffuse + specular;

  // If the material has a texture, sample the texture color and modulate with final color
  if (hasTexture) {
    vec4 texColor = texture2D(uTexture, vTexCoord);
    finalColor *= texColor.rgb;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };