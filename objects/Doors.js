import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const { Cube } = defs;

class Doors extends CustomObject {
  constructor(model_transform=Mat4.identity()) {
    super();
    this.shapes = {
      cube: new Cube()
    };

    this.materials = {
      door: new Material(new defs.Phong_Shader(),
          {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
      red_door: new Material(new defs.Phong_Shader(),
      {ambient: .4, diffusivity: .6, color: hex_color("#ff0000")}),
    }
  }

  render_left_door(context, program_state, door_height, door_thickness, model_transform, transformations) {
    this.render_one_door(context, program_state, door_height, door_thickness, model_transform, transformations, true)
  }

  render_right_door(context, program_state, door_height, door_thickness, model_transform, transformations) {
    this.render_one_door(context, program_state, door_height, door_thickness, model_transform, transformations, false)
  }

  render_one_door(context, program_state, door_height, door_thickness, model_transform, transformations, isLeftDoor=true) {
    const door_width_without_seal = door_height / 4;
    const door_width = 1.101 * door_width_without_seal; // the extra 0.001 makes a tiny line visible between the doors

    const { 
      door_base, 
      right_window_frame, 
      left_window_frame,
      top_window_frame,
      handle,
      door_seal
    } = transformations;

    // apply parameters of original render function to get final transformation for door parts  
    const thickness_transform = Mat4.scale(1, 1, door_thickness);                               
    const [ door_base_transform,
            right_window_frame_transform,
            left_window_frame_transform,
            top_window_frame_transform,
            handle_transform, 
            door_seal_transform
          ] = [
                door_base, 
                right_window_frame,
                left_window_frame,
                top_window_frame,
                handle,
                door_seal
              ].map(creation_matrix => {
                if (isLeftDoor)  { // translate door to left
                  return ( model_transform // change to coordinate system passed in
                    .times(Mat4.translation(-door_width/2, 0, 0)) // slide left
                    .times(creation_matrix) // apply part building matrix
                    .times(thickness_transform) // scale door for thickness
                    )
                } else { // flip original (left) door and translate to right
                  return ( model_transform
                    .times(Mat4.scale(-1, 1, 1)) // flip axis to mirror door
                    .times(Mat4.translation(-door_width/2, 0, 0)) // slides right
                    .times(creation_matrix) // apply part building matrix
                    .times(thickness_transform) // scale door for thickness
                  )
                }
              }); 

    // door base                                
    this.shapes.cube.draw(context, program_state, door_base_transform, this.materials.door);
    // right window frame
    this.shapes.cube.draw(context, program_state, right_window_frame_transform, this.materials.door);
    // left window frame
    this.shapes.cube.draw(context, program_state, left_window_frame_transform, this.materials.door);
    // top window frame
    this.shapes.cube.draw(context, program_state, top_window_frame_transform, this.materials.door);
    // handle
    this.shapes.cube.draw(context, program_state, handle_transform, this.materials.red_door);
    // door seal
    this.shapes.cube.draw(context, program_state, door_seal_transform, this.materials.red_door);  
  }

  render(context, program_state, door_height=40, door_thickness=0.25, model_transform=Mat4.identity()) {
    /*
    door_height: vertically and horizontally scales door
    door_thickness: changes thickess of doors
    */
    const door_width = door_height / 4;

    // individual transformations to build door-parts from cube
    const door_base = Mat4.scale(door_width / 2, door_height / 4, 1);

    const right_window_frame = Mat4.translation(door_width / 2, door_height / 2, 0)
                                    .times(Mat4.scale(door_width / 10, door_height / 4, 1))
                                    .times(Mat4.translation(-1, 0, 0));

    const left_window_frame = Mat4.translation(- (door_width / 2), door_height / 2, 0)
                                    .times(Mat4.scale(door_width / 10, door_height / 4, 1))
                                    .times(Mat4.translation(1, 0, 0));

    const top_window_frame = Mat4.translation(0, 3 / 4 * door_height, 0)
                                    .times(Mat4.scale(door_width / 2, door_width / 10, 1))
                                    .times(Mat4.translation(0, -1, 0));

    const handle = Mat4.translation(door_width / 2, door_height / 4,  0)
                                    .times(Mat4.scale( 0.5 * door_width / 10, 1.5 * door_width / 10, 2))
                                    .times(Mat4.translation(-2, -1.5, 0));

    const door_seal = Mat4.translation(door_width / 2, door_height / 4, 0)
                                    .times(Mat4.scale(0.25 * door_width / 10, door_height / 2, 1))
                                    .times(Mat4.translation(1, 0, 0));

    // draw both doors based off parameters passed in to render() function
    this.render_left_door(context, program_state, door_height, door_thickness, model_transform, {
                            door_base, 
                            right_window_frame,
                            left_window_frame, 
                            top_window_frame,
                            handle,
                            door_seal
                          });
    this.render_right_door(context, program_state, door_height, door_thickness, model_transform, {
                            door_base, 
                            right_window_frame,
                            left_window_frame, 
                            top_window_frame,
                            handle,
                            door_seal
                          });
     
  }
} 

export default Doors;
