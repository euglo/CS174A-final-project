import {defs, tiny} from './examples/common.js';
import { CarEnd, Ceiling, Doors, Ground, Handlebars, Seat, VerticalBar, Wall, WaterTile } from './objects/index.js';

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

        this.initial_camera_location = Mat4.look_at(vec3(0, 5, 10), vec3(0, 5, 0), vec3(0, 1, 0));
        this.ground = new Ground();
        this.seat = new Seat();
        this.water_tile = new WaterTile();
        this.ceiling = new Ceiling();
        this.wall = new Wall();
        this.handlebars = new Handlebars();
        this.vertical_bar = new VerticalBar();
        this.acceleration = 0.0;
        this.doors = new Doors();
        this.car_end = new CarEnd();

        this.horizontal_look = 0;
        this.vertical_look = 5;
        this.dt = 0;
        this.detached = false;
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
        this.new_line();
        if (!this.detached) {
            this.key_triggered_button("Look left", ["a"], () => {
                if (this.horizontal_look > -9) {
                  this.horizontal_look -= 40 * this.dt;
                }
            })
            this.key_triggered_button("Look right", ["d"], () => {
                if (this.horizontal_look < 9) {
                    this.horizontal_look += 40 * this.dt;
                }
            });
            this.key_triggered_button("Look up", ["w"], () => {
                if (this.vertical_look < 7) {
                    this.vertical_look += 40 * this.dt;
                }
            })
            this.key_triggered_button("Look down", ["s"], () => {
                if (this.vertical_look > -3) {
                    this.vertical_look -= 40 * this.dt;
                }
            });
            this.new_line();
        }
        this.key_triggered_button("Detach", ["y"], () => {
            this.detached = true;
        });
        this.key_triggered_button("Reattach", ["t"], () => {
            this.detached = false;
            this.initial_camera_location = Mat4.look_at(vec3(0, 5, 10), vec3(0, 5, 0), vec3(0, 1, 0));
            this.horizontal_look = 0;
            this.vertical_look = 5;
      });
    }

    display(context, program_state) {
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        this.dt = dt;
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!this.detached) {
            this.initial_camera_location =  Mat4.look_at(vec3(0, 5, 7), vec3(this.horizontal_look, this.vertical_look, 0), vec3(0, 1, 0));
        }
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        } else {
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        // TODO: Lighting (Requirement 2)
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 3 and 4)

        let model_transform = Mat4.identity();
            
        const depth = 7;
        const length = 25;
        // Displaying custom objects
        this.ground.render(context, program_state, depth * 2, length * 2, -0.5);
        this.ceiling.render(context, program_state, 5, depth * 2, length * 2, 11.75);
        // opposite side
        this.wall.render(context, program_state, length, 5, 3, -1.5, Mat4.translation(0, -.5, 1.5 - depth));
        this.car_end.render(context, program_state, depth * 2, 12, 10.75, Mat4.translation(-length, -.5, 0).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)));
        this.handlebars.render(context, program_state, t, Math.atan(this.acceleration/9.8), this.trainMove, 13, length * 2, Mat4.translation(0, 9, 2 - depth));
        this.vertical_bar.render(context, program_state, 12, Mat4.translation(34.5 - length, 5.5, 2 - depth));
        this.vertical_bar.render(context, program_state, 12, Mat4.translation(-(34.5 - length), 5.5, 2 - depth));
        this.vertical_bar.render(context, program_state, 12, Mat4.translation(41.5 - length, 5.5, 2 - depth));
        this.vertical_bar.render(context, program_state, 12, Mat4.translation(-(41.5 - length), 5.5, 2 - depth));
        this.seat.render(context, program_state, 8.5, Mat4.translation(0, 0, 1.5 - depth));
        this.seat.render(context, program_state, 3, Mat4.translation(length - 4.6, 0, 1.5 - depth));
        this.seat.render(context, program_state, 3, Mat4.translation(-(length - 4.6), 0, 1.5 - depth));
        this.doors.render(context, program_state, 10, 0.25, Mat4.translation(38 - length, 0, -depth)); // feel free to experiment with the parameters
        this.doors.render(context, program_state, 10, 0.25, Mat4.translation(-(38 - length), 0, -depth));

        // other side
        this.wall.render(context, program_state, length, 5, 3, -1.5, Mat4.scale(1, 1, -1).times(Mat4.translation(0, -.5, 1.5 - depth)));
        this.car_end.render(context, program_state, depth * 2, 12, 10.75, Mat4.translation(length, -.5, 0).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)));
        this.handlebars.render(context, program_state, t, Math.atan(this.acceleration/9.8), this.trainMove, 13, length * 2, Mat4.scale(1, 1, -1).times(Mat4.translation(0, 9, 2 - depth)));
        this.vertical_bar.render(context, program_state, 12, Mat4.scale(1, 1, -1).times(Mat4.translation(34.5 - length, 5.5, 2 - depth)));
        this.vertical_bar.render(context, program_state, 12, Mat4.scale(1, 1, -1).times(Mat4.translation(-(34.5 - length), 5.5, 2 - depth)));
        this.vertical_bar.render(context, program_state, 12, Mat4.scale(1, 1, -1).times(Mat4.translation(41.5 - length, 5.5, 2 - depth)));
        this.vertical_bar.render(context, program_state, 12, Mat4.scale(1, 1, -1).times(Mat4.translation(-(41.5 - length), 5.5, 2 - depth)));
        this.seat.render(context, program_state, 8.5, Mat4.scale(1, 1, -1).times(Mat4.translation(0, 0, 1.5 - depth)));
        this.seat.render(context, program_state, 3, Mat4.scale(1, 1, -1).times(Mat4.translation(length - 4.6, 0, 1.5 - depth)));
        this.seat.render(context, program_state, 3, Mat4.scale(1, 1, -1).times(Mat4.translation(-(length - 4.6), 0, 1.5 - depth)));
        this.doors.render(context, program_state, 10, 0.25, Mat4.scale(1, 1, -1).times(Mat4.translation(38 - length, 0, -depth))); // feel free to experiment with the parameters
        this.doors.render(context, program_state, 10, 0.25, Mat4.scale(1, 1, -1).times(Mat4.translation(-(38 - length), 0, -depth)));
    }
}
