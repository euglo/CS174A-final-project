import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube} = defs;

// Seat: class that renders train seats
export default class Pillar extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            pillar_top: new defs.Subdivision_Sphere(4),
            pillar_body: new defs.Rounded_Capped_Cylinder(100, 202, [[0, 15], [0, 5]]),
        };

        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: 0.5, diffusivity: 0.7, specularity: 0, smoothness: 60, color: hex_color("#ffffff")}),
        }
    }

    /* Custom object functions */
    render(context, program_state, model_transform=Mat4.identity()) {

        const gray = hex_color("#C0C0C0");
        const stick_width = 0.8; 
        const stick_length = 6;
   
        let top_transform = model_transform;
        top_transform = top_transform.times(Mat4.translation(0, stick_length - (stick_length/2.0), -0.05));
        top_transform = top_transform.times(Mat4.scale(stick_width, stick_width, stick_width));
        this.shapes.pillar_top.draw(context, program_state, top_transform, this.materials.test.override({color: gray}));
        
        model_transform = model_transform.times(Mat4.rotation(1.54, 1, 0, 0)); //rotate bar vertical
        model_transform = model_transform.times(Mat4.scale(stick_width, stick_width, stick_length));
        this.shapes.pillar_body.draw(context, program_state, model_transform, this.materials.test.override({color: gray}));
    }
}
