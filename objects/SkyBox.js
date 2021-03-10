import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
		Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube, Phong_Shader} = defs;

// Seat: class that renders train seats
export default class SkyBox extends CustomObject {
	constructor() {
    super();
    this.shapes = {
        cube: new Cube()
    };

    this.materials = {
        sky: new Material(new SkyBox_Shader()),
        // TODO: change custom shader so we can override ambience
    }
	}

  /* Custom object functions */
  render(context, program_state, sky_scale=100, model_transform=Mat4.identity()) {
    const sky_box_transform = model_transform.times(Mat4.scale(sky_scale, sky_scale, sky_scale))
    this.shapes.cube.draw(context, program_state, sky_box_transform, this.materials.sky)
  }
}

class SkyBox_Shader extends Phong_Shader {

  update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
    // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
    const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
        PCM = P.times(C).times(M);
    context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
    context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
        Matrix.flatten_2D_to_1D(PCM.transposed()));
    
    context.uniform1f ( gpu_addresses.animation_time, graphics_state.animation_time / 1000 );

}

shared_glsl_code() {
    // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    return `
    precision mediump float;
    varying vec4 point_position;
    varying vec4 center;
    uniform float animation_time;
    `;
}

vertex_glsl_code() {
    // ********* VERTEX SHADER *********
    // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    return this.shared_glsl_code() + `
    attribute vec3 position;
    uniform mat4 model_transform;
    uniform mat4 projection_camera_model_transform;
    
    void main(){
        gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
        point_position = model_transform * vec4( position, 1.0 );
        center = model_transform * vec4( 0.0, 0.0, 0.0, 1.0 );
    }`;
}


    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `

        // equation = 54. * sin(animation_time) + 102.;
        const float upper_hex = 200.;
        const float lower_hex = 20.;

        void main(){

            // range [48, 156]
            float midpoint = (upper_hex + lower_hex) / 2.;
            float amplitude = (upper_hex - lower_hex ) / 2.;
            // amplitude = 400.;
            float red = amplitude * sin(0.5 * animation_time) + midpoint;
            float blue = amplitude * sin(0.1 * animation_time) + midpoint;
            float green = amplitude * sin(0.2 * animation_time); // lower range so we don't super green skies

            float sigmoid = 1. / (1. + pow(2.71828, -0.015 * (point_position.y + pow(2., -1. * pow(point_position.x + point_position.y, 2.)))));
            float blue_color = (sigmoid * blue + 256. - blue) / 256.;
            float red_color = (sigmoid * red + 256. - red) / 256.;
            float green_color = (sigmoid * green + 256. - green) / 256.;
            gl_FragColor = vec4( red_color, blue_color, green_color, 1.);
        }`;
    }
}
