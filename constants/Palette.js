import {tiny} from '../examples/common.js';

const { hex_color } = tiny;

const Palette = [
  { // blue and pink
    wall: hex_color('#ffffff'),
    ceiling: hex_color('#ffffff'),
    seat: hex_color('#da5b72'),
    seat_base: hex_color('#bab9bb'),
    door: hex_color('#a0bbb4'),
    door_frame: hex_color('#f2cf98'),
    poster: hex_color('#f2cf98'),
    bars: hex_color('#bab9bb'),
    handle_string: hex_color('#f2cf98'),
    handle_grip: hex_color('#f2cf98')
  },
  { // spirited away train colors (red and brown)
    wall: hex_color('#c38e70'),
    ceiling: hex_color('#e6b8a2'),
    seat: hex_color('#85182a'),
    seat_base: hex_color('#774936'),
    door: hex_color('#9d6b53'),
    door_frame: hex_color('#774936'),
    poster: hex_color('#ffe8d6'),
    bars: hex_color('#fdc500'),
    handle_string: hex_color('#e6b8a2'),
    handle_grip: hex_color('#fdc500')
  },
  { // blue and purple
    wall: hex_color('#ffffed'),
    ceiling: hex_color('#ffffed'),
    seat: hex_color('#2069a1'),
    seat_base: hex_color('#9a8c98'),
    door: hex_color('#baa3c2'),
    door_frame: hex_color('#4a4e69'),
    poster: hex_color('#9a8c98'),
    bars: hex_color('#c9ada7'),
    handle_string: hex_color('#9a8c98'),
    handle_grip: hex_color('#4a4e69')
  },
  { // green and brown
    wall: hex_color('#ffe8d6'),
    ceiling: hex_color('#ffe8d6'),
    seat: hex_color('#65ab61'),
    seat_base: hex_color('#b98b73'),
    door: hex_color('#b98b73'),
    door_frame: hex_color('#01300c'),
    poster: hex_color('#65ab61'),
    bars: hex_color('#cb997e'),
    handle_string: hex_color('#ffe8d6'),
    handle_grip: hex_color('#01300c')
  }
];

export default Palette;