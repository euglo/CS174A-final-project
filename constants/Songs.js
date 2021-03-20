import { tiny } from '../examples/common.js';
const { Texture } = tiny;

const songs = [
  /*
    NOTE: order must be the same as the order of the <audio> tags in index.html
  */
  {
    src: '../assets/audio/spirited-away.mp3',
    display: new Texture('../assets/wall-posters/next-stop-spirit-realm.png'),
    map: new Texture('../assets/wall-posters/map-spirit-world.png')
  },
  {
    src: './assets/audio/palette.mp3',
    display: new Texture('../assets/wall-posters/next-stop-korea.png'),
    map: new Texture('../assets/wall-posters/map-korea.png')
  },
  {
    src: '../assets/audio/cowboy-in-la.mp3',
    display: new Texture('../assets/wall-posters/next-stop-la.png'),
    map: new Texture('../assets/wall-posters/map-la.png')
  },
];

export default songs;