import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube} = defs;

// WaterTile: class that renders ocean water
export default class WaterTile extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            tile: new Cube(),
        };

        this.materials = {
            test: new Material(new Water_Shader()),
        }
    }

    render(context, program_state, length, width, model_transform=Mat4.identity()) {
        const tile_transform = model_transform.times(Mat4.scale(length, 0., width))
        this.shapes.tile.draw(context, program_state, tile_transform, this.materials.test);
    }
}

class Water_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            // Compute color of point according to distance from center:
            gl_FragColor = vec4( 0., 0., 1., 1. );
        }`;
    }
}