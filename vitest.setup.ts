// Create and configure the canvas element
const canvas = document.createElement('canvas');
canvas.id = 'game-canvas';
canvas.width = 800;
canvas.height = 600;
canvas.getContext = () =>
  ({
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    fillRect() {},
    fillText() {},
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    scale() {},
    drawImage() {},
    beginPath() {},
    arc() {},
    fill() {},
    clearRect() {},
    setTransform() {},
  }) as unknown as CanvasRenderingContext2D;

// Attach it to the virtual DOM body
document.body.appendChild(canvas);

