import {defs, tiny} from '../examples/common.js';

const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const { Cube } = defs;

class Door {
  constructor(model_transform=Mat4.identity()) {
      this.shapes = {
        door: new Cube()
      };

      this.materials = {
        door: new Material(new defs.Phong_Shader(),
            {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
    }
  }

  render(context, program_state, door_height=20, door_width=10, door_thickness=3, model_transform=Mat4.identity()) {
    this.shapes.door.draw(context, program_state, model_transform, this.materials.door)
  }
} 

export default Door;