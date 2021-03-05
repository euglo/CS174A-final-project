import {defs, tiny} from '../examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

// CustomObject: base class, should not be used on its own
export default class CustomObject {
    constructor(model_transform=Mat4.identity()) {
        this.shapes = {};
        this.materials = {};
    }

    clipPlane(plane=vec4(0, 0, 0, 0)) {
        Object.keys(this.materials).map((key, index) => {
            this.materials[key] = this.materials[key].override({clip_plane: plane});
        });
    }

    render(context, program_state) {
            
    }
}
