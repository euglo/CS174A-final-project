import {defs, tiny} from './examples/common.js';
import { Seat, WaterTile, Handlebars, VerticalBar, Pillar } from './objects/index.js';

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
        this.seat = new Seat();
        this.water_tile = new WaterTile();
        this.handlebars = new Handlebars();
        this.vertical_bar = new VerticalBar();
        this.pillar = new Pillar();

        this.acceleration = 0;
        this.current_velocity = 0;
        this.time_counter = 0;
        this.train_move = false;
        this.train_stop = false;
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
        this.key_triggered_button("Train start", ["n"], () => {
            this.train_move = true;
            this.train_stop = false;
        });
        this.key_triggered_button("Train stop", ["m"], () => {
            this.train_stop = true;
            this.train_move = false;
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

        if(this.train_move) {
            if(this.acceleration < 11.87 && !this.reverse) {
                this.acceleration += 0.02;
            } else if (this.reverse && this.acceleration > 0) {
                this.acceleration -= 0.02;
            } else if (this.acceleration > 11.87) {
                this.reverse = true;
            } else if (this.reverse && this.acceleration <= 0) {
                this.train_move = false;
                this.reverse = false;
                this.acceleration = 0;
            }
        }

        if(this.train_stop) {
            if(this.acceleration >= -11.87 && !this.reverse) {
                this.acceleration -= 0.02;
            } else if (this.reverse && this.acceleration <= 0) {
                this.acceleration += 0.02;
            } else if (this.acceleration <= -11.87) {
                this.reverse = true;
            }
            else if (this.current_velocity <= 0 || this.acceleration >= 0) {
                this.train_stop = false;
                this.acceleration = 0;
                this.current_velocity = 0;
            }
        }


        this.current_velocity += dt * this.acceleration;
        if(this.train_stop && this.current_velocity <= 0) {
            this.current_velocity = 0;
            this.acceleration = 0;
            this.train_stop = false;
        }
    
        // Displaying custom objects
        this.handlebars.render(context, program_state, t, Math.atan(this.acceleration/9.8), this.train_move || this.train_stop,  Mat4.translation(0,5,0));
        //this.vertical_bar.render(context, program_state, 8, Mat4.translation(8,0,0));
        //this.seat.render(context, program_state, 5);
        //this.water_tile.render(context, program_state, 5, 5);
        model_transform =  Mat4.translation(-15 + this.current_velocity * (t % 6),-2,-25);
        this.pillar.render(context, program_state, model_transform);
    }
}
