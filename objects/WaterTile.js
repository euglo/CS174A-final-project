import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube, Subdivision_Sphere, Shape_From_File} = defs;

// WaterTile: class that renders ocean water
export default class WaterTile extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            tile: new Shape_From_File('../assets/subdivision_cube.obj'),
        };

        this.materials = {
            water: new Material(new Water_Shader(), 
                { ambient: 1., specularity: 1. }),
        }
    }

    render(context, program_state, length, width, height, model_transform=Mat4.identity()) {
        const tile_transform = model_transform.times(Mat4.scale(length, height, width));
        this.shapes.tile.draw(context, program_state, tile_transform, this.materials.water);
    }
}

class Water_Shader extends Shader {
    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        const defaults = {ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, graphics_state, model_transform);
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));

        gl.uniform1f(gpu.animation_time, gpu_state.animation_time / 1000.)
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        uniform float animation_time;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec3 squared_scale, camera_center;
        
        // User-defined parameters
        #define PI 3.141592653589793238462643383279
        vec3 baseColor = vec3(.5, .8, .95);
        vec2 uvScale = vec2(.06, .06);
        float speed = .05;

        // Phong shading code borrowed from common.js
        varying vec3 N, vertex_worldspace;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                                light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = light_colors[i].xyz * diffusivity * diffuse
                                                            + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
                }
            return result;
        }

        // Code for Perlin Noise borrowed from this article: https://medium.com/neosavvy-labs/webgl-with-perlin-noise-part-1-a87b56bbc9fb
        // Helper functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
        // Noise
        float noise(vec3 P) {
            vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
            vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
            vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
            vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
            vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
            vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
            vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
            gx0 = fract(gx0); gx1 = fract(gx1);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
            gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
            vec3 g0 = vec3(gx0.x, gy0.x, gz0.x), g1 = vec3(gx0.y, gy0.y, gz0.y),
                g2 = vec3(gx0.z, gy0.z, gz0.z), g3 = vec3(gx0.w, gy0.w, gz0.w),
                g4 = vec3(gx1.x, gy1.x, gz1.x), g5 = vec3(gx1.y, gy1.y, gz1.y),
                g6 = vec3(gx1.z, gy1.z, gz1.z), g7 = vec3(gx1.w, gy1.w, gz1.w);
            vec4 norm0 = taylorInvSqrt(vec4(dot(g0, g0), dot(g2, g2), dot(g1, g1), dot(g3, g3)));
            vec4 norm1 = taylorInvSqrt(vec4(dot(g4, g4), dot(g6, g6), dot(g5, g5), dot(g7, g7)));
            g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
            g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
            vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
                dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
                vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
                dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);

            return 2.2 * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
        }
        float noise(vec2 P) { return noise(vec3(P, 0.0)); }
        // Turbulence
        float turbulence(vec3 P) {
            float f = 0., s = 1.;
            for (int i = 0; i < 9; i++) {
                f += abs(noise(s * P)) / s;
                s *= 2.;
                P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);
            }
            return f;
        }
        vec3 water(float x, float y) {
            float L = turbulence(vec3(x, y, animation_time * .3));
            return vec3(noise(vec3(.5, 0.3, L) * .7));
        }

        float surface3 ( vec3 coord ) {
            float frequency = 7.0;
            float n = 0.4;
  
            n += 0.25 * abs( noise( coord * 4.0 ) );
            n += 0.5 * abs( noise( coord * 8.0 ) );
            n += 0.25 * abs( noise( coord * 16.0 ) );
            n += 0.125 * abs( noise( coord * 32.0 ) );
  
            return clamp(n, -0.6, 1.0);
        }
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position, normal;
        varying vec2 vUv;
        uniform mat4 projection_camera_model_transform;
        uniform mat4 model_transform;
        
        void main() {
            // Calculate normalized values for Phong lighting
            N = normalize( mat3( model_transform ) * normal / squared_scale);
            vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

            vec4 proj_position;
            proj_position = projection_camera_model_transform * vec4( position, 1.0 );
            
            // Calculate surface displacement
            vUv = vec2( pow( position.x , 1. ), pow( position.z, 1. ) ) / 2.;
            vec2 uvMax = ( 5.0 * asin( sin( 2.0 * PI * vUv.xy ) ) ) / PI;

            float n = surface3( vec3( uvMax * uvScale, animation_time * speed ) );

            vec3 s = vec3( clamp( n, 0.0, 1.0 ) ) * baseColor;
            float mult = sqrt( s.x * s.x + s.y * s.y + s.z * s.z );
            vec4 newPosition = vec4( position.x, position.y * mult * 2. + position.y, position.z, 1.0 );
            gl_Position = projection_camera_model_transform * newPosition;
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        varying vec2 vUv;

        void main(){
            // Compute color of point, adding light effects
            vec3 color;
            vec3 waterEffect = water( vUv.x, vUv.y );
            color = waterEffect + baseColor;
            gl_FragColor = vec4( color * ambient, 1. );
            gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        }`;
    }
}
