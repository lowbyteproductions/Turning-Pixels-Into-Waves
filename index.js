microcan.polute();

const lerp = (t, a, b) => t * (b - a) + a;
const mapRange = (t, a, b, c, d) => (t-a) / (b-a) * (d - c) + c;

const img = document.getElementById("gameboy");
img.addEventListener("load", () => {
  // --------------- Get image data into pixels ----------------
  const pixelCanvas = document.createElement("canvas");
  pixelCanvas.width = img.width;
  pixelCanvas.height = img.height;
  const pCtx = pixelCanvas.getContext("2d");

  pCtx.drawImage(img, 0, 0, img.width, img.height);
  const imgData = pCtx.getImageData(0, 0, img.width, img.height);
  const pixels = imgData.data;
  // --------------- Get image data into pixels ----------------

  const w = img.width;
  const h = img.height;

  const G = Array.from({length: w*h}, (_, i) => {
    const pixelIndex = i * 4;
    const r = pixels[pixelIndex + 0];
    const g = pixels[pixelIndex + 1];
    const b = pixels[pixelIndex + 2];
    return (r + b + g) / 3;
  });

  const hDivisions = 60;
  const hDivisionSize = h / hDivisions;
  const maxAmp = hDivisionSize / 2;
  let freq = 150;
  let phase = 0;

  const ctx = document.getElementById("main").getContext('2d');
  setCanvasSize("main", w, h);
  background(ctx, 255, 255, 255, 1, w, h);
  stroke(ctx, 255, 255, 255, 1);

  let t = 0;
  const draw = () => {
    background(ctx, 0, 0, 0, 1, w, h);

    phase = t/2;
    freq = mapRange(Math.sin(t/30), -1, 1, 20, 200);

    for (let hDiv = 0; hDiv < hDivisions; hDiv++) {
      const y = (hDivisionSize / 2) + hDiv * hDivisionSize;

      let prevPoint = [-1, y];
      for (let x = 0; x < w; x++) {
        const angle = mapRange(x, 0, w, 0, Math.PI * 2);
        const sinValue = Math.sin(phase + angle * freq);

        const grayIndex = Math.floor(y) * w + x;
        const grayValue = G[grayIndex];
        const amplitude = mapRange(grayValue, 0, 255, maxAmp, 0);

        const point = [x, y + sinValue * amplitude];

        line(ctx, prevPoint, point);
        prevPoint = point;
      }
    }

    t++;
    requestAnimationFrame(draw);
  };

  draw();
});
