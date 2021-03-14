import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube, Capped_Cylinder} = defs;

// Seat: class that renders train seats
export default class Ceiling extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            cube: new Cube(),
            cylinder: new Capped_Cylinder(1, 50)
        };

        this.materials = {
            ceiling: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6}),
            lights: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: .6, color: color(1, 1, 1, 0.8)}),
        }
    }

    /* Custom object functions */
    render(context, program_state, palette, num_lights=3, ceiling_width=10, ceiling_length=40, ceiling_height=20, model_transform=Mat4.identity(), ) {
      const ceiling_thickness = 0.25;

      const ceiling_transform = model_transform
                                  .times(Mat4.translation(0, ceiling_height, 0))
                                  .times(Mat4.scale(ceiling_length / 2, ceiling_thickness, ceiling_width / 2)) // length & width / 2 bc 2x2x2 cube
                                  .times(Mat4.translation(0, 1, 0)) // bottom of ceiling is now at ceiling_height
      
      const light_transforms = [];
      for (let i = 1; i <= num_lights; i++) {
        light_transforms.push(
          model_transform
            // get lights to ceiling and back into standard cartesian coordinates
            .times(Mat4.translation(0, ceiling_height, 0))
            .times(Mat4.scale(1, ceiling_thickness, 1))
            .times(Mat4.translation(0, 1, 0)) // up to this point: same as ceiling transform
            .times(Mat4.scale(1, 1 / ceiling_thickness, 1)) // unscale y-axis to return to standard coordinates
            // space out lights
            .times(Mat4.translation(-ceiling_length / 2, 0, 0)) // start drawing from edge of ceiling
            .times(Mat4.translation( i * ceiling_length /(num_lights + 1), 0, 0)) // space lights evenly across ceiling
            .times(Mat4.scale(2, 0.5, 2)) // size the cylinder
            .times(Mat4.translation(0, -1, 0)) // adjust light so its attached to ceiling (not inside);
            .times(Mat4.rotation(Math.PI / 2, -1, 0, 0)) // spin so it is flat against ceiling
        )
      }

      /*
      // lights: an attempt to put light points inside the actual light cylincers
      // Note: program_state.lights MUST be defined before the draw function is called, so this comes before the draw function below

      program_state.lights = light_transforms.map(light_transform => {
        // place light inside light cylinder
        const light_position = light_transform.times(vec4(1, 1, 1, 1));
        return new Light(light_position, color(1, 1, 1, 1), 10 ** 10);
      });
      */

      // ceiling                           
      this.shapes.cube.draw(context, program_state, ceiling_transform, this.materials.ceiling.override({color: palette.ceiling}));
      // lights cylinders
      light_transforms.forEach(light_transform => {
        this.shapes.cylinder.draw(context, program_state, light_transform, this.materials.lights);
      })

    }
}
