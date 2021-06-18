import Canvas from "https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/mod.ts";

let width = 200, height = 200;

const canvas = Canvas.MakeCanvas(height, width);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(10, 10, height - 20, width - 20);

const canvasData = ctx.getImageData(0, 0, width, height);

let imageData: number[][] = [];

for (let y = 0; y < height; y++) {
  imageData.push([]);
  for (let x = 0; x < width; x++) {
    const idx = y * (width * 4) + x * 4;
    const r = canvasData.data[idx];
    const g = canvasData.data[idx + 1];
    const b = canvasData.data[idx + 2];
    const alpha = canvasData.data[idx + 3];
    imageData[y][x] = alpha !== 0 && (r < 255 || g < 255 || b < 255) ? 1 : 0;
  }
}

export default imageData;
