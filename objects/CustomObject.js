import {defs, tiny} from '../examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class CustomObject {
    constructor(model_transform=Mat4.identity()) {
        this.shapes = {};
    }

    draw() {

    }
}