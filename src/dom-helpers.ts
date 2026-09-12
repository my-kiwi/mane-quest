// aliases for improved minification
export const win = window;
export const addEventListener = win.addEventListener.bind(win);
export const removeEventListener = win.removeEventListener.bind(win);

export const doc = document;
export const querySelectorAll = doc.querySelectorAll.bind(doc);
export const querySelector = doc.querySelector.bind(doc);
export const getElementById = doc.getElementById.bind(doc);
export const createElement = doc.createElement.bind(doc);

const M = Math;
export const floor = M.floor;
export const max = M.max;
export const min = M.min;
export const abs = M.abs;
export const random = M.random;
