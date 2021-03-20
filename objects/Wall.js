import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Cube, Textured_Phong} = defs;

// Wall: class that renders wall & window
export default class Wall extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            wall_bottom: new Cube(),
            wall_left: new Cube(),
            wall_right: new Cube(),
            wall_top: new Cube(),
            window: new Cube(),
            train_map: new Cube(),
            disp: new Cube(),
            poster: new Cube(),
            door_top: new Cube(),
            door_side: new Cube()
        };

        this.shapes.train_map.arrays.texture_coord.forEach( (v, i, arr) => 
            arr[i] = vec(0.75 * v[0] + 0.13, 0.35 * v[1] + 0.35)
        )
        this.shapes.disp.arrays.texture_coord.forEach( (v, i, arr) => 
            arr[i] = vec(0.4 * v[0], 0.15 * v[1] + 0.42)
        )

        this.materials = {
            wall: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6}),
            display: new Material(new Texture_Scroll_X(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/wall-posters/next-stop-spirit-realm.png")
                }),
            map: new Material(new Textured_Phong(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/wall-posters/map-spirit-world.png")
                }),
        }
    }

    /* Custom object functions */
    render(context, program_state, palette, texture, wall_total_width=20, window_width=5, window_height=3, z_axis=-1.5, model_transform=Mat4.identity()) {
        const map_width=2;
        const map_height=1;
        const disp_width=2.5;
        const disp_height=1;
        const poster_width=1.5;
        const poster_height=1;
        const wall_width = wall_total_width-14.5;

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

        const map_transform = model_transform.times(Mat4.translation(-3, window_position+window_height+map_height+.5, z_axis+.1)).times(Mat4.scale(map_width, map_height, 0.01));
        const disp_transform = model_transform.times(Mat4.translation(2.5, window_position+window_height+disp_height+.5, z_axis+.1)).times(Mat4.scale(disp_width, disp_height, 0.01));
      
        const door_side_transform_one = model_transform.times(Mat4.translation(-20.05, window_position + 0.1, z_axis)).times(Mat4.scale(4.7, 5.95, 0));
        const door_side_transform_two = model_transform.times(Mat4.translation(20.05, window_position + 0.1, z_axis)).times(Mat4.scale(4.7, 5.95, 0));
        const door_top_transform_one = model_transform.times(Mat4.translation(-13, 11, z_axis)).times(Mat4.scale(3, 1, 0));
        const door_top_transform_two = model_transform.times(Mat4.translation(13, 11, z_axis)).times(Mat4.scale(3, 1, 0));

        const poster_1_transform = model_transform.times(Mat4.translation(-(window_width+poster_width+.5), window_position,z_axis+.1)).times(Mat4.scale(poster_width, poster_height, 0));
        const poster_2_transform = model_transform.times(Mat4.translation((window_width+poster_width+.5), window_position,z_axis+.1)).times(Mat4.scale(poster_width, poster_height, 0));

        const window_color = color(0.5, 0.5, 0.5, 0.1);

        this.shapes.wall_bottom.draw(context, program_state, wall_bottom_transform, this.materials.wall.override({color: palette.wall}));
        this.shapes.wall_left.draw(context, program_state, wall_left_transform, this.materials.wall.override({color: palette.wall}));
        this.shapes.wall_right.draw(context, program_state, wall_right_transform, this.materials.wall.override({color:palette.wall}));
        this.shapes.wall_top.draw(context, program_state, wall_top_transform, this.materials.wall.override({color: palette.wall}));
        //this.shapes.window.draw(context, program_state, window_transform, this.materials.test.override({color: window_color}));

        this.shapes.train_map.draw(context, program_state, map_transform, this.materials.map.override({texture: texture.map}));
        this.shapes.disp.draw(context, program_state, disp_transform, this.materials.display.override({texture: texture.display}));

        this.shapes.door_side.draw(context, program_state, door_side_transform_one, this.materials.wall.override({color: palette.wall}));
        this.shapes.door_side.draw(context, program_state, door_side_transform_two, this.materials.wall.override({color: palette.wall}));
        this.shapes.door_top.draw(context, program_state, door_top_transform_one, this.materials.wall.override({color:palette.wall}));
        this.shapes.door_top.draw(context, program_state, door_top_transform_two, this.materials.wall.override({color:palette.wall}));

        this.shapes.poster.draw(context, program_state, poster_1_transform, this.materials.wall.override({color: palette.poster}));
        this.shapes.poster.draw(context, program_state, poster_2_transform, this.materials.wall.override({color: palette.poster}));
    }

}

class Texture_Scroll_X extends Textured_Phong {
    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Add a little more to the base class's version of this method.
        super.update_GPU(context, gpu_addresses, gpu_state, model_transform, material);
        // Updated for assignment 2
        context.uniform1f(gpu_addresses.animation_time, gpu_state.animation_time / 1000);
        if (material.texture && material.texture.ready) {
            // Select texture unit 0 for the fragment shader Sampler2D uniform called "texture":
            context.uniform1i(gpu_addresses.texture, 0);
            // For this draw, use the texture image from correct the GPU buffer:
            material.texture.activate(context);
        }
    }
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #6.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                float x_translate =  mod(f_tex_coord.x + 0.1 * animation_time, 2. * animation_time);
                float y_translate =  f_tex_coord.y + 5.0;
                vec4 tex_color = texture2D( texture, vec2(x_translate, y_translate));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}