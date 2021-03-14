import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;


// Handlebars: class that renders handlebars
export default class VerticalBar extends CustomObject {

    constructor() {
        super();
        this.shapes = {
            'stick': new defs.Rounded_Capped_Cylinder(50, 32, [[0, 10], [0, 5]]),
        };
        this.materials = {
            metal: new Material(new defs.Phong_Shader(),
                {ambient: .2, diffusivity: .8, specularity: 0})
        }
    }

    render(context, program_state, palette, bar_length = 5, model_transform=Mat4.identity()) {
        const bar_width = 0.15; 

        model_transform = model_transform.times(Mat4.rotation(Math.PI/2, 1, 0, 0)); //rotate bar to be vertical
        model_transform = model_transform.times(Mat4.scale(bar_width, bar_width, bar_length));
        this.shapes.stick.draw(context, program_state, model_transform, this.materials.metal.override({color: palette.bars}));
    }
    
}