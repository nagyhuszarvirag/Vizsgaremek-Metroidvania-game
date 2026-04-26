//alapértelmezett felhasználói beállítások

export const settings = {
  volume: 0.5,
  nyelv: localStorage.getItem("nyelv") || 1,

  controls: {
    forward: "d",
    back: "a",
    jump: "space",
    attack: "left click",
    interact: "e",
  },

  mobileMode: false,
};

export function irNyelv(ujNyelv) {
  settings.nyelv = ujNyelv;
}
