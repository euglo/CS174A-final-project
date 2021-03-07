import {defs, tiny} from '../examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;


// Handlebars: class that renders handlebars
export default class Handlebars {

    constructor() {
        this.shapes = {
            'stick': new defs.Rounded_Capped_Cylinder(50, 32, [[0, 10], [0, 5]]),
            'loop': new defs.Torus(15,15)
        };
        this.materials = {
            metal: new Material(new defs.Phong_Shader(),
                {ambient: .2, diffusivity: .8, specularity: 0, color: hex_color("#DFBD69")})
        }
        this.simulateStop = false;
    }

    render(context, program_state, t, a, simulateStop, model_transform=Mat4.identity()) {
        let i = 0;

        const stick_width = 0.1; 
        const stick_length = 1;
        const loop_width = 0.4;
        const loop_thick = 0.15;
        const barLength = 10;
        const barWidth = 0.15;
        
        let handle_position = -((barLength/2) - 1);

        for(i = 0; i < 4; i++) {
            let handle_model_transform = model_transform;
            handle_model_transform = handle_model_transform.times(Mat4.translation(handle_position, 0, 0));
            if (simulateStop)
                handle_model_transform = handle_model_transform.times(Mat4.rotation(a, 0, 0, 1));
            else
                handle_model_transform = handle_model_transform.times(Mat4.rotation(0.5/8.0 + 0.5/8.0*Math.sin(2*t), 0, 0, 1));
            handle_model_transform = handle_model_transform.times(Mat4.rotation(1.54, 1, 0, 0)); //rotate bar vertical
            handle_model_transform = handle_model_transform.times(Mat4.scale(stick_width, stick_width, stick_length));
            this.shapes.stick.draw(context, program_state, handle_model_transform, this.materials.metal);

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
            this.shapes.loop.draw(context, program_state, handle_model_transform, this.materials.metal);

            handle_position += 2.5;
        }

        model_transform = model_transform.times(Mat4.translation(0, stick_length/2, 0)); //position bar in scene
        model_transform = model_transform.times(Mat4.rotation(1.54, 0, 1, 0)); //make bar horizontal to camera 
        model_transform = model_transform.times(Mat4.scale(barWidth, barWidth, barLength));
        this.shapes.stick.draw(context, program_state, model_transform, this.materials.metal);
    }
    
}