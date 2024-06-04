# Rasterization

# Getting started
To run and develop this assignment you must start a local HTTP server in the directory containing `rasterization.html`.
``` bash
    python3 -m http.server 
```
Once the HTTP server is up, navigate your browser to [http://localhost:8000/rasterization.html](http://localhost:8000/rasterization.html).

# Implementation instructions

Like the previous assignment, we use text input to specify what to render.
We use the following syntax:
- `p,id,cube;` creates a unit cube mesh and gives it the name `id`
- `p,id,sphere,i,j`	creates a unit sphere mesh with name `id`, formed using `i` "stacks", and `j` "sectors"
- `m,id,ka,kd,ks,shininess,texture;` creates a Phong shader material named by `id`, with ambient (`ka`), diffuse (`kd`), specular (`ks`), and specular exponent (`shininess`) coefficients, and an optional texture image specified by `texture`.
- `X,id,T,x,y,z;` specifies a transformation that translates object `id` by `(x,y,z)`.
- `X,id,R?,theta;` specifies a rotation of object `id` around axis `?` (i.e. `Rx` rotates around `x` etc.), by counter-clockwise angle in degrees `theta`.
- `X,id,S,x,y,z;` specifies a scale transformation of object `id` by scale factors `(x,y,z)` along each axis.
- `o,id,prim,mat;` adds an object to the scene with name `id`. The object uses the primitive mesh with id matching `prim` and the Phong shader material with id matching `mat`. Note this is the way to actually add an object into the scene (i.e. primitives and materials are not part of the scene until they are used by an object).
- `l,id,type,x,y,z,ir,ig,ib;` sets the light (with name `id`) and light type `type` at position `(x,y,z)` with intensity `(ir,ig,ib)`. We only support a single light of type `point`.
- `c,id,type,ex,ey,ez,lx,ly,lz,ux,uy,uz;` sets the camera to be placed at position `(ex,ey,ez)` and looking towards `(lx,ly,lz)` with up axis `(ux,uy,uz)`. We only support a single camera of type `perspective`.