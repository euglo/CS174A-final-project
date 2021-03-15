import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Cube, Normal_Textured_Phong, Normal_Cube} = defs;

// Seat: class that renders train seats
export default class Floor extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            cube: new Normal_Cube(),
        };

        this.materials = {
            ground: new Material(new Normal_Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.2, specularity: 0.2,
                texture: new Texture("assets/wood.png"),
                normal_texture: new Texture("assets/woodNormal.png")
            }),
        }

        for (let i=0;i<this.shapes.cube.arrays.texture_coord.length;i++){
            this.shapes.cube.arrays.texture_coord[i][0] *= 6;
            this.shapes.cube.arrays.texture_coord[i][1] *= 6;
        }
    }

    /* Custom object functions */
    render(context, program_state, ground_width=10, ground_length=40, ground_height=20, model_transform=Mat4.identity(), ) {
      const ground_thickness = 0.15;

      const ground_transform = model_transform
                                  .times(Mat4.translation(0, ground_height, 0))
                                  .times(Mat4.scale(ground_length / 2, ground_thickness, ground_width / 2)); // length & width / 2 bc 2x2x2 cube
      // ground                           
      this.shapes.cube.draw(context, program_state, ground_transform, this.materials.ground);
    }
}
