import {defs, tiny} from '../examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;


// Handlebars: class that renders handlebars
export default class VerticalBar {

    constructor() {
        this.shapes = {
            'stick': new defs.Rounded_Capped_Cylinder(50, 32, [[0, 10], [0, 5]]),
        };
        this.materials = {
            metal: new Material(new defs.Phong_Shader(),
                {ambient: .2, diffusivity: .8, specularity: 0, color: hex_color("#DFBD69")})
        }
    }

    render(context, program_state, barLength = 5, model_transform=Mat4.identity()) {
        const barWidth = 0.15; 

        model_transform = model_transform.times(Mat4.rotation(3.14/2, 1, 0, 0)); //rotate bar to be vertical
        model_transform = model_transform.times(Mat4.scale(barWidth, barWidth, barLength));
        this.shapes.stick.draw(context, program_state, model_transform, this.materials.metal);
    }
    
}