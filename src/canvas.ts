// Canvas setup and management
export let canvas: HTMLCanvasElement;

export function initializeCanvas(): void {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
