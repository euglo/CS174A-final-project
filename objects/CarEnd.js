import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube} = defs;

// Seat: class that renders train seats
export default class CarEnd extends CustomObject {
    constructor() {
        super();
        this.shapes = {
          cube: new Cube()
        };

        this.materials = {
            door: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6}),
            door_frame: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6}),
            window: new Material(new defs.Phong_Shader(),
                {ambient: .5, diffusivity: .6, specularity: 1, color: color(0.5, 0.5, 0.5, .1)}),
            wall: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6}),
            poster: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6})
        }
    }

    /* Custom object functions */
    render(context, program_state, palette, wall_width=60, wall_height=50, door_height=40, model_transform=Mat4.identity()) {
      const door_width = door_height / 2; // always 20, no matter size of wall or door
      const wall_thickness = 0.25;

      // ensure that door height does not exceed wall height
      if (door_height > wall_height) {
        door_height = wall_height;
      }

      const door_base_transform = model_transform
                                            .times(Mat4.translation(0, 0.15 * door_width, 0))
                                            .times(Mat4.scale(door_width / 2, 0.15 * door_width, wall_thickness));
      const door_left_transform = model_transform
                                            .times(Mat4.translation(- door_width / 2, door_height / 2, 0))
                                            .times(Mat4.scale(0.1 * door_width, door_height / 2, wall_thickness))
                                            .times(Mat4.translation(1, 0, 0));
      const door_right_transform = model_transform
                                            .times(Mat4.translation(door_width / 2, door_height / 2, 0))
                                            .times(Mat4.scale(0.1 * door_width, door_height / 2, wall_thickness))
                                            .times(Mat4.translation(-1, 0, 0));
      const door_top_transform = model_transform
                                            .times(Mat4.translation(0, door_height, 0))
                                            .times(Mat4.scale(door_width / 2, 0.15 * door_width, wall_thickness))
                                            .times(Mat4.translation(0, -1, 0));
      
      // base door_handle off of left door piece
      const door_handle_transform = door_left_transform
                                            .times(Mat4.scale(1 / 2, 1 / (door_height / 2), 1)) // change back to cube
                                            .times(Mat4.scale(0.5, 0.05 * door_height, 2));
      const door_window_transform = model_transform
                                            .times(Mat4.translation(0, door_height / 2, 0))
                                            .times(Mat4.scale(door_width / 2, door_height / 2, 0.5 * wall_thickness));

      // base door frame pieces off of the left, right, and top door pieces
      const door_frame_left_transform = door_left_transform
                                            .times(Mat4.translation(-1, 0, 0))
                                            .times(Mat4.scale(0.25, 1, 2))
                                            .times(Mat4.translation(1, 0, 0));
      const door_frame_right_transform = door_right_transform
                                            .times(Mat4.translation(1, 0, 0))
                                            .times(Mat4.scale(0.25, 1, 2))
                                            .times(Mat4.translation(-1, 0, 0));
      const door_frame_top_transform = door_top_transform
                                            .times(Mat4.translation(0, 1, 0))
                                            .times(Mat4.scale(1, 0.25, 2))
                                            .times(Mat4.translation(0, -1, 0));
      
      const wall_top_vertical_scale = 0.5 * (wall_height - door_height);
      const wall_top_strip = model_transform
                                            .times(Mat4.translation(0, wall_height, 0))
                                            .times(Mat4.scale(wall_width / 2, wall_top_vertical_scale, wall_thickness))
                                            .times(Mat4.translation(0, -1, 0));

      // can solve for width wall strip takes up, divide by 2 for scale, and you'll get this scaling factor
      const wall_width_scale = 0.25 * (wall_width - door_width);
      const wall_left_strip = model_transform
                                            .times(Mat4.translation(- wall_width / 2, door_height / 2, 0))
                                            .times(Mat4.scale(wall_width_scale, door_height / 2, wall_thickness))
                                            .times(Mat4.translation(1, 0, 0));
      const wall_right_strip = model_transform
                                            .times(Mat4.translation(wall_width / 2, door_height / 2, 0))
                                            .times(Mat4.scale(wall_width_scale, door_height / 2, wall_thickness))
                                            .times(Mat4.translation(-1, 0, 0));

      // base posters off of the left and wall strips
      const left_poster_transform = wall_left_strip
                                            .times(Mat4.scale(1 / wall_width_scale, 1 / (door_height / 2), 1 / wall_thickness)) // undo wall scaling
                                            .times(Mat4.translation(0, door_height / 4, 0))
                                            .times(Mat4.scale(0.8 * wall_width_scale, 0.8 * door_height / 4, 0.5));
      const right_poster_transform = wall_right_strip
                                            .times(Mat4.scale(1 / wall_width_scale, 1 / (door_height / 2), 1 / wall_thickness)) // undo wall scaling
                                            .times(Mat4.translation(0, door_height / 4, 0))
                                            .times(Mat4.scale(0.8 * wall_width_scale, 0.8 * door_height / 4, 0.5));

      // door base
      this.shapes.cube.draw(context, program_state, door_base_transform, this.materials.door.override({color: palette.door}));
      // left door
      this.shapes.cube.draw(context, program_state, door_left_transform, this.materials.door.override({color: palette.door}));
      // right door
      this.shapes.cube.draw(context, program_state, door_right_transform, this.materials.door.override({color: palette.door}));
      // door top
      this.shapes.cube.draw(context, program_state, door_top_transform, this.materials.door.override({color: palette.door}));
      // door handle
      this.shapes.cube.draw(context, program_state, door_handle_transform, this.materials.door_frame.override({color: palette.door_frame}));
      // door window
      this.shapes.cube.draw(context, program_state, door_window_transform, this.materials.window);

    //   // left door frame
    //   this.shapes.cube.draw(context, program_state, door_frame_left_transform, this.materials.door_red);
    //   // right door frame
    //   this.shapes.cube.draw(context, program_state, door_frame_right_transform, this.materials.door_red);
    //   // top door frame
    //   this.shapes.cube.draw(context, program_state, door_frame_top_transform, this.materials.door_red);

      // wall top strip
      this.shapes.cube.draw(context, program_state, wall_top_strip, this.materials.wall.override({color: palette.wall}));
      // wall left strip
      this.shapes.cube.draw(context, program_state, wall_left_strip, this.materials.wall.override({color: palette.wall}));
      // wall right strip
      this.shapes.cube.draw(context, program_state, wall_right_strip, this.materials.wall.override({color: palette.wall}));

      // left poster
      this.shapes.cube.draw(context, program_state, left_poster_transform, this.materials.poster.override({color: palette.poster}));
      // right poster
      this.shapes.cube.draw(context, program_state, right_poster_transform, this.materials.poster.override({color: palette.poster}));

    }
}
