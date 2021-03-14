import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube} = defs;

// Seat: class that renders train seats
export default class Seat extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            seat_block: new Cube(),
            seat_base: new Cube(),
        };

        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        }
    }

    /* Custom object functions */
    render(context, program_state, seat_width=1, model_transform=Mat4.identity()) {
        const seat_thickness = .2;
        const base_depth = 1;
        const back_rest_height = 1;
        const base_height = .4;
        const base_percentage = .95;

        const cushion_transform = model_transform
            .times(Mat4.translation(0, base_height, 0)) // translate up so bottom of base is at (0, 0, 0)
            .times(Mat4.scale(seat_width, seat_thickness, base_depth))
            .times(Mat4.translation(0, base_height / seat_thickness + 1, 0));
        const back_rest_transform = model_transform
            .times(Mat4.translation(0, base_height, 0)) // translate up so bottom of base is at (0, 0, 0)
            .times(Mat4.scale(seat_width, back_rest_height, seat_thickness))
            .times(Mat4.translation(0, base_height / back_rest_height + 1, -(base_depth / seat_thickness + 1)));
        const base_transform = model_transform
            .times(Mat4.scale(seat_width * base_percentage, base_height, base_depth * base_percentage))
            .times(Mat4.translation(0, 1, -1 * seat_thickness)) // translate up so bottom of base at (0, 0, 0)

        const maroon = hex_color("#800000")
        const brown = hex_color("#765c48");

        this.shapes.seat_block.draw(context, program_state, cushion_transform, this.materials.test.override({color: maroon}));
        this.shapes.seat_block.draw(context, program_state, back_rest_transform, this.materials.test.override({color: maroon}));
        this.shapes.seat_base.draw(context, program_state, base_transform, this.materials.test.override({color: brown}));
    }
}
