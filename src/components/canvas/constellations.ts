export type ConstellationName = "circuit" | "tree" | "wave";

export interface Constellation {
  name: ConstellationName;
  points: Array<[number, number]>;
}

export const constellations: Constellation[] = [
  {
    name: "circuit",
    points: [
      [0.18, 0.22],
      [0.34, 0.22],
      [0.34, 0.38],
      [0.52, 0.38],
      [0.52, 0.58],
      [0.72, 0.58],
      [0.72, 0.74]
    ]
  },
  {
    name: "tree",
    points: [
      [0.5, 0.18],
      [0.5, 0.36],
      [0.36, 0.52],
      [0.64, 0.52],
      [0.26, 0.7],
      [0.46, 0.72],
      [0.74, 0.7]
    ]
  },
  {
    name: "wave",
    points: [
      [0.15, 0.58],
      [0.28, 0.38],
      [0.41, 0.55],
      [0.54, 0.72],
      [0.67, 0.44],
      [0.8, 0.36],
      [0.9, 0.54]
    ]
  }
];

