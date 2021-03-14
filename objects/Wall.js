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
            wall_left: new Cube(),
            wall_right: new Cube(),
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
    render(context, program_state, wall_width=20, window_width=5, window_height=3, z_axis=-1.5, model_transform=Mat4.identity()) {
        
        const map_width=2;
        const map_height=1;
        const disp_width=2.5;
        const disp_height=1;
        const poster_width=1.5;
        const poster_height=1; 

        const window_position = window_height + 3;
        const wall_bottom_height = (window_position-window_height)/2;
        const wall_top_height = window_position+window_height+wall_bottom_height;
        const wall_side_width = (wall_width-window_width)/2;
        const wall_side_trans = wall_width - (wall_width-window_width)/2

        const wall_bottom_transform = model_transform.times(Mat4.translation(0,wall_bottom_height,z_axis)).times(Mat4.scale(wall_width, wall_bottom_height, 0));
        const wall_top_transform = model_transform.times(Mat4.translation(0,wall_top_height,z_axis)).times(Mat4.scale(wall_width, wall_bottom_height, 0));
        const wall_left_transform = model_transform.times(Mat4.translation(-wall_side_trans,window_position,z_axis)).times(Mat4.scale(wall_side_width,window_height,0));
        const wall_right_transform = model_transform.times(Mat4.translation(wall_side_trans,window_position,z_axis)).times(Mat4.scale(wall_side_width,window_height,0));
    
        const window_transform = model_transform.times(Mat4.translation(0,window_position,z_axis)).times(Mat4.scale(window_width, window_height, 0));

        const map_transform = model_transform.times(Mat4.translation(-3, window_position+window_height+map_height+.5, z_axis+.1)).times(Mat4.scale(map_width, map_height, 0));
        const disp_transform = model_transform.times(Mat4.translation(2.5, window_position+window_height+disp_height+.5, z_axis+.1)).times(Mat4.scale(disp_width, disp_height, 0));
        const poster_1_transform = model_transform.times(Mat4.translation(-(window_width+poster_width+.5), window_position,z_axis+.1)).times(Mat4.scale(poster_width, poster_height, 0));
        const poster_2_transform = model_transform.times(Mat4.translation((window_width+poster_width+.5), window_position,z_axis+.1)).times(Mat4.scale(poster_width, poster_height, 0));

        const light_grey = hex_color("#bebebe");
        const window_color = color(0.5, 0.5, 0.5, 0.1);
        const white = hex_color("#ffffff");

        this.shapes.wall_bottom.draw(context, program_state, wall_bottom_transform, this.materials.test.override({color: light_grey}));
        this.shapes.wall_left.draw(context, program_state, wall_left_transform, this.materials.test.override({color: light_grey}));
        this.shapes.wall_right.draw(context, program_state, wall_right_transform, this.materials.test.override({color:light_grey}));
        this.shapes.wall_top.draw(context, program_state, wall_top_transform, this.materials.test.override({color: light_grey}));
        //this.shapes.window.draw(context, program_state, window_transform, this.materials.test.override({color: window_color}));

        this.shapes.train_map.draw(context, program_state, map_transform, this.materials.test.override({color: white}));
        this.shapes.disp.draw(context, program_state, disp_transform, this.materials.test.override({color: white}));
        this.shapes.poster.draw(context, program_state, poster_1_transform, this.materials.test.override({color: white}));
        this.shapes.poster.draw(context, program_state, poster_2_transform, this.materials.test.override({color: white}));
    }

}
