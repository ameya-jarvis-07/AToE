export type CityRecord = {
  id: string;
  stateId: string;
  name: string;
  slug: string;
  majorCity: string;
};

export type MapTransitionPhase =
  | "idle"
  | "clearing"
  | "zooming"
  | "returning"
  | "revealing";
