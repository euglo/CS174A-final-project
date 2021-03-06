import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;


// Handlebars: class that renders handlebars
export default class Handlebars extends CustomObject {

    constructor() {
        super();
        this.shapes = {
            'stick': new defs.Rounded_Capped_Cylinder(50, 32, [[0, 10], [0, 5]]),
            'loop': new defs.Torus(15,15)
        };
        this.materials = {
            metal: new Material(new defs.Phong_Shader(),
                {ambient: .2, diffusivity: .8, specularity: 0})
        }
        this.simulateStop = false;
    }

    render(context, program_state, palette, t, a, simulateStop, num_handlebars = 15, bar_length = 20, model_transform=Mat4.identity()) {
        let i = 0;

        const stick_width = 0.1; 
        const stick_length = 1;
        const loop_width = 0.4;
        const loop_thick = 0.15;
        const bar_width = 0.15;
        const spacing = bar_length / (num_handlebars + 1);
        
        let handle_position = -((bar_length/2) -spacing);

        for(i = 0; i < num_handlebars; i++) {
            let handle_model_transform = model_transform;
            handle_model_transform = handle_model_transform.times(Mat4.translation(handle_position, 0, 0));
            if (simulateStop)
                handle_model_transform = handle_model_transform.times(Mat4.rotation(a, 0, 0, 1));
            else
                handle_model_transform = handle_model_transform.times(Mat4.rotation(0.5/8.0 + 0.5/8.0*Math.sin(2*t), 0, 0, 1));
            handle_model_transform = handle_model_transform.times(Mat4.rotation(Math.PI / 2, 1, 0, 0)); //rotate bar vertical
            handle_model_transform = handle_model_transform.times(Mat4.scale(stick_width, stick_width, stick_length));
            this.shapes.stick.draw(context, program_state, handle_model_transform, this.materials.metal.override({color: palette.handle_string}));

            handle_model_transform = model_transform;
            handle_model_transform = handle_model_transform.times(Mat4.translation(handle_position, 0, 0));
            if(simulateStop)
                handle_model_transform = handle_model_transform.times(Mat4.rotation(a, 0, 0, 1));
            else 
                handle_model_transform = handle_model_transform.times(Mat4.rotation(0.5/8.0 + 0.5/8.0*Math.sin(2*t), 0, 0, 1));
            handle_model_transform = handle_model_transform.times(Mat4.translation(0, -stick_length + 0.2, 0)); //move handlebars to horizontal bar
            handle_model_transform = handle_model_transform.times(Mat4.rotation(1.3, 1, 0, 0));
            handle_model_transform = handle_model_transform.times(Mat4.rotation(0.2, 0, 0, 1));
            handle_model_transform = handle_model_transform.times(Mat4.rotation(1.5, 0, 1, 0));
            handle_model_transform = handle_model_transform.times(Mat4.scale(loop_width, loop_width, loop_thick));
            this.shapes.loop.draw(context, program_state, handle_model_transform, this.materials.metal.override({color: palette.handle_grip}));

            handle_position += spacing;
        }

        model_transform = model_transform.times(Mat4.translation(0, stick_length/2, 0)); //position bar in scene
        model_transform = model_transform.times(Mat4.scale(bar_length, bar_width, bar_width));
        model_transform = model_transform.times(Mat4.rotation(Math.PI / 2, 0, 1, 0)); //make bar horizontal to camera 
        this.shapes.stick.draw(context, program_state, model_transform, this.materials.metal.override({color: palette.bars}));
    }
    
}