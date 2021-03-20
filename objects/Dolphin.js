import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js';
// Pull these names into this module's scope for convenience:
const {vec3, vec4, vec, color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;

const { Shape_From_File } = defs;

export default class Dolphin extends CustomObject {                           // **Obj_File_Demo** show how to load a single 3D model from an OBJ file.
                                                                     // Detailed model files can be used in place of simpler primitive-based
                                                                     // shapes to add complexity to a scene.  Simpler primitives in your scene
                                                                     // can just be thought of as placeholders until you find a model file
                                                                     // that fits well.  This demo shows the teapot model twice, with one
                                                                     // teapot showing off the Fake_Bump_Map effect while the other has a
                                                                     // regular texture and Phong lighting.
    constructor() {
      super()
      // Load the model file:
      this.shapes = {
        dolphin: new Shape_From_File("../assets/objects/dolphin.obj")
      };

      // Non bump mapped:
      this.dolphin = new Material(new defs.Phong_Shader(), {
          color: color(.5, .5, .5, 1),
          ambient: .3, diffusivity: .5, specularity: .5,
      });

      this.x_boundary = 50;
      this.initial_y = -50;
      this.dolphin_x = this.x_boundary;
      this.dolphin_y = this.initial_y;
      this.t = 0;
      this.v = 40;
      this.a = -15;

    }

    render(context, program_state, scale_factor=0.5, model_transform=Mat4.identity()) {
      
      this.t += 1 / 45; // custom time we can reset
      this.dolphin_x -= 1 / 10; // custom x speed

      if (this.dolphin_x < -this.x_boundary) {
        this.dolphin_x = this.x_boundary;
      }

      // delta_y = vt + 1/2 * a * t^2
      this.dolphin_y = this.v * this.t + 0.5 * this.a * (this.t ** 2) + this.initial_y;
      const angle = - 1.7 * Math.cos(Math.PI / 6 * this.t) - Math.PI / 6;

      if (this.dolphin_y < this.initial_y) {
        this.t = 0;
        this.dolphin_x -= 5; // give it the effect it swam farther
      } 

      model_transform = model_transform.times(Mat4.translation(this.dolphin_x, this.dolphin_y, 0))
                                      .times(Mat4.rotation(-Math.PI / 2, 0, 1, 0))
                                      .times(Mat4.rotation(angle, 1, 0, 0))
                                      .times(Mat4.scale(scale_factor, scale_factor, scale_factor))
                                      
      this.shapes.dolphin.draw(context, program_state, model_transform, this.dolphin);
    }
}