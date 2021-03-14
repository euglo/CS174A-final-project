import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Cube, Normal_Textured_Phong} = defs;

// Seat: class that renders train seats
export default class Ground extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            cube: new Cube(),
        };
        
        this.materials = {
            ground: new Material(new Normal_Textured_Phong(), 
                { ambient: 1, 
                  texture: new Texture('../assets/brickWall.jpg'), normal_texture: new Texture('../assets/brickWallNormal.jpg') }),
        }
    }
    
    /* Custom object functions */
    render(context, program_state, ground_width=2, ground_length=80, ground_height=30, model_transform=Mat4.identity(), ) {
        const ground_transform = model_transform.times(Mat4.translation(0, -5, 0))
            .times(Mat4.scale(ground_length / 2, ground_height / 2, ground_width / 2));
        
        // Scale the texture coordinates:
        for (let i=0;i<this.shapes.cube.arrays.texture_coord.length;i++){
            this.shapes.cube.arrays.texture_coord[i][0] *= 6;
            this.shapes.cube.arrays.texture_coord[i][1] *= 2;
        }

        // Draw wall                           
        this.shapes.cube.draw(context, program_state, ground_transform, this.materials.ground);
    }
}

class Ground_Shader extends Shader {
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
        attribute vec3 position, normal;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            vec3 rgb_normal = normal * 0.5 + 0.5;
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
