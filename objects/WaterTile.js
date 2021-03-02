import {defs, tiny} from '../examples/common.js';
import CustomObject from './CustomObject.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const { Cube, Textured_Phong } = defs;

// WaterTile: class that renders ocean water
class WaterTile extends CustomObject {
    constructor() {
        super();
        this.shapes = {
            tile: new Cube(),
        };

        const bump = new defs.Fake_Bump_Map(1);
        this.materials = {
            test: new Material(new Textured_Phong(), {ambient: 1, texture: this.texture}),
        }

        this.skipped_first_time = false;
    }

    render(context, program_state, length, width, model_transform=Mat4.identity()) {
        // // Don't call copy to GPU until the event loop has had a chance
        // // to act on our SRC setting once:
        if (this.skipped_first_frame)
            // Update the texture with the current scene:
            // console.log(this.texture);
            // this.texture.copy_onto_graphics_card(context, false);
        this.skipped_first_frame = true;

        // Start over on a new drawing, never displaying the prior one:
        context.context.clear(context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);

        const tile_transform = model_transform.times(Mat4.scale(length, 0., width))
        this.shapes.tile.draw(context, program_state, tile_transform, this.materials.test);
    }

    setTexture(texture) {
        this.texture = texture;
    }
}

// Constants for frame buffers
const REFLECTION_WIDTH = 320;
const REFLECTION_HEIGHT = 180;

const REFRACTION_WIDTH = 1280;
const REFRACTION_HEIGHT = 720;
class WaterFrameBuffers {
    constructor(gl) {
        this.gl = gl;
        this.initReflectionFrameBuffer();
        this.initRefractionFrameBuffer();
    }

    getReflectionTexture() {
        return this.reflectionTexture;
    }

    getRefractionTexture() {
        return this.refractionDepthTexture;
    }

    cleanUp() {
        this.gl.deleteFramebuffer(this.reflectionFrameBuffer);
        this.gl.deleteTexture(this.reflectionTexture);
        this.gl.deleteRenderbuffer(this.reflectionDepthBuffer);
        this.gl.deleteFramebuffer(this.refractionFrameBuffer);
        this.gl.deleteTexture(this.refractionTexture);
        this.gl.deleteTexture(this.refractionDepthTexture)
    }

    // Call before rendering to this FBO
    bindReflectionFrameBuffer() {
        this.bindFrameBuffer(this.reflectionFrameBuffer, REFLECTION_WIDTH, REFLECTION_HEIGHT);
    }

    // Call before rendering to this FBO
    bindRefractionFrameBuffer() {
        this.bindFrameBuffer(this.refractionFrameBuffer, REFRACTION_WIDTH, REFRACTION_HEIGHT);
    }

    // Switch back to default frame buffer
    unbindCurrentFrameBuffer() { 
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    initReflectionFrameBuffer() {
        this.reflectionFrameBuffer = this.createFrameBuffer();
        this.reflectionTexture = this.createTextureAttachment(REFLECTION_WIDTH, REFLECTION_HEIGHT);
        this.reflectionDepthBuffer = this.createDepthBufferAttachment(REFLECTION_WIDTH, REFLECTION_HEIGHT);
        this.unbindCurrentFrameBuffer();
    }
    
    initRefractionFrameBuffer() {
        this.refractionFrameBuffer = this.createFrameBuffer();
        this.refractionTexture = this.createTextureAttachment(REFRACTION_WIDTH, REFRACTION_HEIGHT);
        this.refractionDepthTexture = this.createDepthBufferAttachment(REFRACTION_WIDTH, REFRACTION_HEIGHT);
        this.unbindCurrentFrameBuffer();
    }

    bindFrameBuffer(frameBuffer, width, height) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null); // Ensures that texture is not bound
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
        this.gl.viewport(0, 0, width, height);
    }
    
    createFrameBuffer() {
        // Generate name for frame buffer
        const frameBuffer = this.gl.createFramebuffer();
        // Generate name for frame buffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
        return frameBuffer;
    }

    createTextureAttachment(width, height) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, width, height, 0, this.gl.RGB, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        // Attach the texture as the first color attachment
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
        return texture;
    }

    createDepthTextureAttachment(width, height) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, width, height, 0, this.gl.DEPTH_COMPONENT, this.gl.FLOAT, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, frameBuffer, 0);
        return texture;
    }

    createDepthBufferAttachment(width, height) {
        const depthBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);
        return depthBuffer;
    }
}
class Water_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Create reflection frame buffer

    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            // Compute color of point according to distance from center:
            gl_FragColor = vec4( 0., 0., 1., 1. );
        }`;
    }
}

export { WaterTile, WaterFrameBuffers }