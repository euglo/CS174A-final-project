import {defs, tiny} from './examples/common.js';
import { StoneWall, CarEnd, Ceiling, Doors, Floor, Ground, Handlebars, Pillar, Seat, SkyBox, VerticalBar, Wall, WaterTile } from './objects/index.js';
import { Movement } from './Movement.js';
import Palette from './constants/Palette.js';

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
      
        this.floor = new Floor();        
        this.ground = new Ground();
        this.stoneWall = new StoneWall();
        this.seat = new Seat();
        this.water_tile = new WaterTile();
        this.pillar = new Pillar();
        this.sky_box = new SkyBox();
        
        this.ceiling = new Ceiling();
        this.wall = new Wall();
        this.handlebars = new Handlebars();
        this.vertical_bar = new VerticalBar();
        this.doors = new Doors();
        this.car_end = new CarEnd();
      
        // palette
        this.palette_num = 0;
        this.palette = Palette[this.palette_num];

        this.train_movement = new Movement();
        this.train_start = false;
        this.train_stop = false;

        this.horizontal_look = 0;
        this.vertical_look = 5.5;
        this.dt = 0;
        this.detached = false;

        this.normal_light = false;
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Train start", ["n"], () => {
            if (!this.train_start && !this.train_stop) {
                this.train_start = true;
                this.train_stop = false;
            }
        });
        this.key_triggered_button("Train stop", ["m"], () => {
            if (!this.train_start && !this.train_stop) {
                this.train_stop = true;
                this.train_start = false;
            }
        });
        this.new_line();
        this.key_triggered_button("Look left", ["a"], () => {
            if (this.horizontal_look > -9) {
                this.horizontal_look -= 20 * this.dt;
            }
        })
        this.key_triggered_button("Look right", ["d"], () => {
            if (this.horizontal_look < 9) {
                this.horizontal_look += 20 * this.dt;
            }
        });
        this.key_triggered_button("Look up", ["w"], () => {
            if (this.vertical_look < 8) {
                this.vertical_look += 20 * this.dt;
            }
        })
        this.key_triggered_button("Look down", ["s"], () => {
            if (this.vertical_look > -3) {
                this.vertical_look -= 20 * this.dt;
            }
        });
        this.new_line();
        this.key_triggered_button("Detach", ["y"], () => {
            this.detached = true;
        });
            
        this.key_triggered_button("Reattach", ["t"], () => {
            this.detached = false;
            this.initial_camera_location = Mat4.look_at(vec3(0, 5, 10), vec3(0, 5, 0), vec3(0, 1, 0));
            this.horizontal_look = 0;
            this.vertical_look = 5.5;
        });

        this.new_line();
        this.key_triggered_button("Change train colors", ["c"], () => {
            this.palette_num = (this.palette_num + 1) % Palette.length; // loop palette colors
            this.palette = Palette[this.palette_num];
        });

        this.key_triggered_button("Add light for normal mapping", ["l"], () => {
            this.normal_light ^= 1;
        });
    }

    render_train_cars(context, program_state, angle, num_cars=3, space_btwn_cars=5) {
        const t = program_state.animation_time / 1000;

        // train dimensions
        const depth = 7;
        const length = 25;
        const height = 12;

        // train object translation factors
        const bar_depth = 2 - depth;
        const seat_depth = 1.5 - depth;
        const door_length = 38 - length;
        const inner_bar_length = 34.5 - length;
        const outer_bar_length = 41.5 - length;
        const outer_seat_length = length - 4.6;

        for(let i = 0; i < num_cars; i++) {

            // train car translation factors
            const train_car_translation = Mat4.translation(i * (length * 2 + space_btwn_cars), 0, 0);

            // Displaying custom objects
            this.floor.render(context, program_state, depth * 2, length * 2, 0, train_car_translation);
            this.ceiling.render(context, program_state, this.palette, 5, depth * 2, length * 2, height, train_car_translation);

            // opposite side
            this.wall.render(context, program_state, this.palette, length, 5, 3, -depth, train_car_translation);
            this.car_end.render(context, program_state, this.palette, depth * 2, height, 10, train_car_translation.times(Mat4.translation(-length, 0, 0)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)));
            this.handlebars.render(context, program_state, this.palette, t, angle, this.train_move, 13, length * 2, train_car_translation.times(Mat4.translation(0, 9, 2 - depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.translation(inner_bar_length, height / 2, bar_depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.translation(-inner_bar_length, height / 2, bar_depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.translation(outer_bar_length, height / 2, bar_depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.translation(-outer_bar_length, height / 2, bar_depth)));
            this.seat.render(context, program_state, this.palette, 8.5, train_car_translation.times(Mat4.translation(0, 0, seat_depth)));
            this.seat.render(context, program_state, this.palette, 3, train_car_translation.times(Mat4.translation(outer_seat_length, 0, seat_depth)));
            this.seat.render(context, program_state, this.palette, 3, train_car_translation.times(Mat4.translation(-outer_seat_length, 0, seat_depth)));
            this.doors.render(context, program_state, this.palette, 10, 0.25, train_car_translation.times(Mat4.translation(door_length, 0, -depth)));
            this.doors.render(context, program_state, this.palette, 10, 0.25, train_car_translation.times(Mat4.translation(-door_length, 0, -depth)));

            // other side
            this.wall.render(context, program_state, this.palette, length, 5, 3, depth, train_car_translation);
            this.car_end.render(context, program_state, this.palette, depth * 2, height, 10, train_car_translation.times(Mat4.translation(length, 0, 0)).times(Mat4.rotation(Math.PI / 2, 0, 1, 0)));
            this.handlebars.render(context, program_state, this.palette, t, angle, this.train_move, 13, length * 2, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(0, 9, 2 - depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(inner_bar_length, height / 2, bar_depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(-inner_bar_length, height / 2, bar_depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(outer_bar_length, height / 2, bar_depth)));
            this.vertical_bar.render(context, program_state, this.palette, height, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(-outer_bar_length, height / 2, bar_depth)));
            this.seat.render(context, program_state, this.palette, 8.5, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(0, 0, seat_depth)));
            this.seat.render(context, program_state, this.palette, 3, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(outer_seat_length, 0, seat_depth)));
            this.seat.render(context, program_state, this.palette, 3, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(-outer_seat_length, 0, seat_depth)));
            this.doors.render(context, program_state, this.palette, 10, 0.25, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(door_length, 0, -depth)));
            this.doors.render(context, program_state, this.palette, 10, 0.25, train_car_translation.times(Mat4.scale(1, 1, -1)).times(Mat4.translation(-door_length, 0, -depth)));

        }
    }

    display(context, program_state) {
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        this.dt = dt;
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!this.detached) {
            this.initial_camera_location =  Mat4.look_at(vec3(0, 6, 7), vec3(this.horizontal_look, this.vertical_look, 0), vec3(0, 1, 0));
        }
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
        }
        program_state.set_camera(this.initial_camera_location);
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        // TODO: Lighting (Requirement 2)
        const train_light_position = vec4(0, 5, 5, 1);
        const train_light = this.normal_light ? 1000 : 100;
        const sun_position = vec4(0, 100, -50, 1);
        program_state.lights = [new Light(train_light_position, color(1, 1, 1, 1), train_light),
            new Light(sun_position, color(1, 1, 1, 1), 4000)];

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 3 and 4)

        let model_transform = Mat4.identity();

        //train movement
        if(this.train_start) {
            this.train_start = this.train_movement.train_start();
        }
        if(this.train_stop) {
            this.train_stop = this.train_movement.train_stop();
        }
        const angle = Math.atan(this.train_movement.get_acceleration()/9.8);
        const { dist, unmod_dist } = this.train_movement.get_translation(dt);

        this.train_move = this.train_start || this.train_stop;
        this.pillar.render(context, program_state, Mat4.translation(dist, 1, -22));
        
        // Displaying custom objects
        this.water_tile.render(context, program_state, 120, 30, 1, Mat4.translation(0, -3.5, -64));
        this.ground.render(context, program_state, 80, 200, 1, unmod_dist, Mat4.translation(0, -1, 0));
        this.stoneWall.render(context, program_state, 2, 200, 25, unmod_dist, Mat4.translation(0, 8, 20));
        this.render_train_cars(context, program_state, angle, 2, 3);
        this.sky_box.render(context, program_state);
    }
}
