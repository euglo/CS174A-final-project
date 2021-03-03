import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube} = defs;

// Wall: class that renders wall & window
export default class Wall extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            wall_bottom: new Cube(),
            wall_middle: new Cube(),
            wall_top: new Cube,
            window: new Cube(),
            train_map: new Cube(),
            disp: new Cube(),
            poster: new Cube(),
        };

        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        }
    }

    /* Custom object functions */
    render(context, program_state, window_height=2.35, window_width=5, model_transform=Mat4.identity()) {
        const wall_bottom_height=1.75;
        const wall_middle_height=2.3;
        const wall_top_height=1.5
        const wall_width=20;

        const map_width=2;
        const map_height=1;
        const disp_width=2.8;
        const disp_height=1;
        const poster_width=1.5;
        const poster_height=1;

        const wall_bottom_transform = model_transform.times(Mat4.scale(wall_width, wall_bottom_height, 0.1)).times(Mat4.translation(0,0.95,-15));
        const wall_middle_transform = model_transform.times(Mat4.scale(wall_width, wall_middle_height, 0.1)).times(Mat4.translation(0, 2.48, -15));
        const wall_top_transform = model_transform.times(Mat4.scale(wall_width, wall_top_height, 0.1)).times(Mat4.translation(0, 6.3,-15));
        const window_transform = model_transform.times(Mat4.scale(window_width, window_height, 0.1)).times(Mat4.translation(0,2.3,-14));

        const map_transform = model_transform.times(Mat4.scale(map_width, map_height, 0.1)).times(Mat4.translation(-1.5, 9.3, -14));
        const disp_transform = model_transform.times(Mat4.scale(disp_width, disp_height, 0.1)).times(Mat4.translation(0.8, 9.3, -14));
        const poster_1_transform = model_transform.times(Mat4.scale(poster_width, poster_height, 0.1)).times(Mat4.translation(-4.5, 6,-14));
        const poster_2_transform = model_transform.times(Mat4.scale(poster_width, poster_height, 0.1)).times(Mat4.translation(4.5, 6, -14));

        const light_grey = hex_color("#878787");
        const dark_grey = hex_color("#767676");
        const darker_grey = hex_color("#333333");
        const black = hex_color("#000000");
        const white = hex_color("#ffffff");

        this.shapes.wall_bottom.draw(context, program_state, wall_bottom_transform, this.materials.test.override({color: dark_grey}));
        this.shapes.wall_middle.draw(context, program_state, wall_middle_transform, this.materials.test.override({color: light_grey}));
        this.shapes.wall_top.draw(context, program_state, wall_top_transform, this.materials.test.override({color: dark_grey}));
        this.shapes.window.draw(context, program_state, window_transform, this.materials.test.override({color: black}));

        this.shapes.train_map.draw(context, program_state, map_transform, this.materials.test.override({color: white}));
        this.shapes.disp.draw(context, program_state, disp_transform, this.materials.test.override({color: darker_grey}));
        this.shapes.poster.draw(context, program_state, poster_1_transform, this.materials.test.override({color: white}));
        this.shapes.poster.draw(context, program_state, poster_2_transform, this.materials.test.override({color: white}));
    }

}
