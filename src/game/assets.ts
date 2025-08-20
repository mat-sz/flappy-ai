import { flipImage, loadImage } from '$/utils/image';

const images = {
  pipe: await loadImage('./sprites/pipe-green.png'),
  birdMidflap: await loadImage('./sprites/yellowbird-midflap.png'),
  background: await loadImage('./sprites/background-day.png'),
};

export const sprites = { ...images, pipeFlipped: flipImage(images.pipe, true) };
