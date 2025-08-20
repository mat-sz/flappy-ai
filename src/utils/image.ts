import { Size } from './rect';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

export function flipImage(
  image: HTMLImageElement,
  flipV = false,
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight);

  const ctx = canvas.getContext('2d')!;
  if (flipV) {
    ctx.translate(0, image.naturalHeight);
    ctx.scale(1, -1);
  } else {
    ctx.translate(image.naturalWidth, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  return canvas;
}

export function scaleImage(
  image: HTMLImageElement,
  scale: number,
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(
    image.naturalWidth * scale,
    image.naturalHeight * scale,
  );
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export type SpriteElement =
  | HTMLImageElement
  | HTMLCanvasElement
  | OffscreenCanvas;

export function getSize(sprite: SpriteElement): Size {
  if (sprite instanceof HTMLImageElement) {
    return { w: sprite.naturalWidth, h: sprite.naturalHeight };
  }

  return { w: sprite.width, h: sprite.height };
}
