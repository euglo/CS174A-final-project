import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Normal_Cube, Normal_Textured_Phong} = defs;

// Seat: class that renders train seats
export default class Wall extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            cube: new Normal_Cube(),
        };
        
        this.materials = {
            wall: new Material(new Normal_Textured_Phong(), 
                { ambient: 0.8, 
                  texture: new Texture('../assets/brickWall.jpg'), normal_texture: new Texture('../assets/brickWallNormal.jpg') }),
        }
    }
    
    /* Custom object functions */
    render(context, program_state, wall_width=1, wall_length=80, wall_height=25, model_transform=Mat4.identity(), ) {
        const wall_transform = model_transform.times(Mat4.scale(wall_length / 2, wall_height / 2, wall_width / 2));
        
        const texture_scale = 15;

        // Scale the texture coordinates:
        for (let i=0;i<this.shapes.cube.arrays.texture_coord.length;i++){
            this.shapes.cube.arrays.texture_coord[i][0] *= wall_length / texture_scale;
            this.shapes.cube.arrays.texture_coord[i][1] *= wall_height / texture_scale;
        }

        // Draw wall                          
        this.shapes.cube.draw(context, program_state, wall_transform, this.materials.wall);
    }
}
