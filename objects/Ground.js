import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Normal_Cube, Normal_Textured_Phong} = defs;

// Seat: class that renders train seats
export default class Ground extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            cube: new Normal_Cube(),
        };
        
        this.materials = {
            ground: new Material(new Normal_Textured_Phong(), 
                { ambient: 1, specularity: 0.4,
                  texture: new Texture('../assets/cartoonStone.jpg'), normal_texture: new Texture('../assets/cartoonStoneNormalMap.png') }),
        }
    }
    
    /* Custom object functions */
    render(context, program_state, ground_width=25, ground_length=80, ground_height=1, model_transform=Mat4.identity(), ) {
        const ground_transform = model_transform.times(Mat4.scale(ground_length / 2, ground_height / 2, ground_width / 2));
        
        const texture_scale = 15;

        // Scale the texture coordinates:
        for (let i=0;i<this.shapes.cube.arrays.texture_coord.length;i++){
            this.shapes.cube.arrays.texture_coord[i][0] *= ground_length / texture_scale;
            this.shapes.cube.arrays.texture_coord[i][1] *= ground_width / texture_scale;
        }

        // Draw ground                          
        this.shapes.cube.draw(context, program_state, ground_transform, this.materials.ground);
    }
}
