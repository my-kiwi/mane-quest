import { encodeSvg } from './svg-helpers';

export const fireball = {
  width: 20,
  height: 20,
  speed: 5,
  damage: 10,
  image: new Image(),
  position: { x: 0, y: 0 },
};

fireball.image.src = encodeSvg(
  '<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg"><path d="M340 60c-80 100-120 170-100 230 15 45 60 70 100 70s85-25 100-70c20-60-20-130-100-230" style="fill:#c0392b;stroke:none;color:#0b0b0b"/><path d="M340 110c-60 80-85 130-72 175 12 35 42 50 67 50 30 0 65-15 75-50 15-45-10-95-70-175" style="fill:#e67e22;stroke:none;color:#0b0b0b"/><path d="M335 160c-35 50-50 85-42 115 9 25 27 35 42 35 20 0 43-10 50-35 10-30-7-65-50-115" style="fill:#f39c12;stroke:none;color:#0b0b0b"/><path d="M330 210c-20 30-28 50-22 68 5 14 14 20 22 20 12 0 25-6 30-20 6-18-5-38-30-68" style="fill:#f1c40f;stroke:none;color:#0b0b0b"/></svg>'
);
