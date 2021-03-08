import {defs, tiny} from './examples/common.js';
import { Ceiling, Doors, Ground, Handlebars, Seat, VerticalBar, Wall, WaterTile } from './objects/index.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube} = defs;

export class Main extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
        };

        // *** Materials
        this.materials = {
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.ground = new Ground();
        this.seat = new Seat();
        this.water_tile = new WaterTile();
        this.ceiling = new Ceiling();
        this.wall = new Wall();
        this.handlebars = new Handlebars();
        this.vertical_bar = new VerticalBar();
        this.acceleration = 0.0;
        this.doors = new Doors();
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => 'original');
        this.new_line();
        this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        this.new_line();
        this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        this.new_line();
        this.key_triggered_button("Train start/stop", ["m"], () => {
            this.trainMove = !this.trainMove;
        });
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        // TODO: Lighting (Requirement 2)
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 3 and 4)
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();
    
        // Displaying custom objects
        this.ground.render(context, program_state, 20, 40, -5);
        this.ceiling.render(context, program_state, 4, 20, 50);
        this.wall.render(context, program_state, 20, 5, 3, -1.5);
        //this.water_tile.render(context, program_state, 5, 5);
        this.handlebars.render(context, program_state, t, Math.atan(this.acceleration/9.8), this.trainMove,  Mat4.translation(0,3.2,0));
        this.vertical_bar.render(context, program_state, 8, Mat4.translation(8,0,0));
        this.seat.render(context, program_state, 5, Mat4.translation(0, 0, 4));
        this.doors.render(context, program_state, 10, 0.25, Mat4.identity()); // feel free to experiment with the parameters
    }
}
