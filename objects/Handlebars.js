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
                {ambient: .2, diffusivity: .8, specularity: 0, color: hex_color("#707070")})
        }
        this.simulateStop = false;
    }

    render(context, program_state, t, a, simulateStop, model_transform=Mat4.identity()) {
        let i = 0;
        let handle_position = -2;

        const stick_width = 0.07; 
        const stick_length = 0.7;
        const loop_width = 0.3;
        const loop_thick = 0.1;
        const barLength = 5;
        const barWidth = 0.1; 

        for(i = 0; i < 5; i++) {
            model_transform = Mat4.identity();
            model_transform = model_transform.times(Mat4.translation(handle_position, 0, 0));
            if (simulateStop)
                model_transform = model_transform.times(Mat4.rotation(a, 0, 0, 1));
            else
                model_transform = model_transform.times(Mat4.rotation(0.5/8.0 + 0.5/8.0*Math.sin(2*t), 0, 0, 1));
            model_transform = model_transform.times(Mat4.rotation(1.54, 1, 0, 0)); //rotate bar vertical
            model_transform = model_transform.times(Mat4.scale(stick_width, stick_width, stick_length));
            this.shapes.stick.draw(context, program_state, model_transform, this.materials.metal);

            model_transform = Mat4.identity();
            model_transform = model_transform.times(Mat4.translation(handle_position, 0, 0));
            if(simulateStop)
                model_transform = model_transform.times(Mat4.rotation(a, 0, 0, 1));
            else 
                model_transform = model_transform.times(Mat4.rotation(0.5/8.0 + 0.5/8.0*Math.sin(2*t), 0, 0, 1));
            model_transform = model_transform.times(Mat4.translation(0, -0.6, 0)); //move handlebars to horizontal bar
            model_transform = model_transform.times(Mat4.rotation(1.3, 1, 0, 0));
            model_transform = model_transform.times(Mat4.rotation(0.2, 0, 0, 1));
            model_transform = model_transform.times(Mat4.rotation(1.5, 0, 1, 0));
            model_transform = model_transform.times(Mat4.scale(loop_width, loop_width, loop_thick));
            this.shapes.loop.draw(context, program_state, model_transform, this.materials.metal);

            handle_position += 1;
        }

        model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(0, 0.4, 0)); //position bar in scene
        model_transform = model_transform.times(Mat4.rotation(1.54, 0, 1, 0)); //make bar horizontal to camera 
        model_transform = model_transform.times(Mat4.scale(barWidth, barWidth, barLength));
        this.shapes.stick.draw(context, program_state, model_transform, this.materials.metal);
    }
    
}